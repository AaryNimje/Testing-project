#!/usr/bin/env python3
"""
Academic AI Platform - Neon DB Schema Application
Optimized for Neon Database with connection pooling, error handling, and verification
"""

import os
import sys
import time
from dotenv import load_dotenv
from sqlalchemy import create_engine, text, event
from sqlalchemy.engine import Engine
from urllib.parse import urlparse
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class NeonSchemaManager:
    """Neon Database Schema Manager with optimized connection handling"""
    
    def __init__(self):
        self.database_url = os.getenv('DATABASE_URL')
        self.engine = None
        self.schema_file = 'full_schema.sql'
        
        if not self.database_url:
            raise ValueError("DATABASE_URL environment variable not found!")
        
        # Validate Neon URL format
        parsed = urlparse(self.database_url)
        if 'neon.tech' not in parsed.hostname and 'neondb.com' not in parsed.hostname:
            logger.warning("This appears to be a non-Neon database URL")
    
    def create_optimized_engine(self):
        """Create SQLAlchemy engine optimized for Neon"""
        engine_kwargs = {
            'pool_size': 5,
            'max_overflow': 10,
            'pool_timeout': 30,
            'pool_recycle': 3600,  # 1 hour
            'pool_pre_ping': True,  # Verify connections before use
            'connect_args': {
                'connect_timeout': 30,
                'application_name': 'academic_ai_platform'
            }
        }
        
        # Add SSL for Neon (required)
        if 'neon.tech' in self.database_url or 'neondb.com' in self.database_url:
            engine_kwargs['connect_args']['sslmode'] = 'require'
        
        self.engine = create_engine(self.database_url, **engine_kwargs)
        
        # Add event listener for connection optimization
        @event.listens_for(self.engine, "connect")
        def set_postgres_pragma(dbapi_connection, connection_record):
            try:
                with dbapi_connection.cursor() as cursor:
                    # Optimize for Neon - use simpler settings
                    cursor.execute("SET statement_timeout = '300s'")
                    cursor.execute("SET lock_timeout = '60s'")
            except Exception as e:
                logger.warning(f"Could not set connection optimizations: {e}")
        
        return self.engine
    
    def test_connection(self):
        """Test database connection with detailed feedback"""
        try:
            logger.info("🔍 Testing database connection...")
            
            with self.engine.connect() as conn:
                # Test basic connectivity
                result = conn.execute(text("SELECT version(), current_database(), current_user"))
                version_info = result.fetchone()
                
                logger.info(f"✅ Connected to: {version_info[1]}")
                logger.info(f"📊 PostgreSQL Version: {version_info[0].split(',')[0]}")
                logger.info(f"👤 Connected as: {version_info[2]}")
                
                # Test Neon-specific features
                neon_result = conn.execute(text("""
                    SELECT 
                        CASE WHEN current_setting('cluster_name', true) IS NOT NULL 
                        THEN 'Neon Database' 
                        ELSE 'Standard PostgreSQL' 
                        END as database_type
                """))
                db_type = neon_result.fetchone()[0]
                logger.info(f"🚀 Database Type: {db_type}")
                
                return True
                
        except Exception as e:
            logger.error(f"❌ Connection failed: {e}")
            return False
    
    def check_schema_file(self):
        """Verify schema file exists and is readable"""
        if not os.path.exists(self.schema_file):
            logger.error(f"❌ Schema file not found: {self.schema_file}")
            return False
        
        try:
            with open(self.schema_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
            if len(content.strip()) == 0:
                logger.error("❌ Schema file is empty")
                return False
            
            # Quick validation for common issues
            dollar_count = content.count('$')
            if dollar_count % 2 != 0:
                logger.warning(f"⚠️  Unmatched dollar quotes detected ({dollar_count} total)")
                logger.warning("   This might cause parsing issues")
            
            logger.info(f"📄 Schema file loaded: {len(content)} characters")
            logger.info(f"🔍 Dollar quotes found: {dollar_count}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error reading schema file: {e}")
            return False
    
    def clean_existing_schema(self):
        """Drop all existing tables, types, and objects for fresh start"""
        try:
            with self.engine.connect() as conn:
                # Get list of existing tables
                tables_result = conn.execute(text("""
                    SELECT tablename FROM pg_tables 
                    WHERE schemaname = 'public' 
                    ORDER BY tablename
                """))
                
                existing_tables = [row[0] for row in tables_result.fetchall()]
                
                if existing_tables:
                    logger.info(f"🗑️  Found {len(existing_tables)} existing tables - will clean them")
                    for table in existing_tables:
                        logger.info(f"   - {table}")
                    
                    # Drop the entire public schema and recreate it
                    logger.info("🧹 Dropping existing schema...")
                    conn.execute(text("DROP SCHEMA public CASCADE"))
                    conn.execute(text("CREATE SCHEMA public"))
                    
                    # Grant permissions back - use current user
                    current_user_result = conn.execute(text("SELECT current_user")).fetchone()
                    current_user = current_user_result[0]
                    
                    conn.execute(text(f"GRANT ALL ON SCHEMA public TO {current_user}"))
                    conn.execute(text("GRANT ALL ON SCHEMA public TO public"))
                    
                    conn.commit()
                    logger.info("✅ Schema cleaned successfully!")
                else:
                    logger.info("📋 No existing tables found - schema is clean")
                    
                return existing_tables
                
        except Exception as e:
            # If permission error, try alternative approach
            logger.warning(f"⚠️  Could not drop schema, trying table-by-table cleanup: {e}")
            return self.cleanup_tables_individually(conn)
    
    def cleanup_tables_individually(self, conn):
        """Fallback: Drop tables one by one if schema drop fails"""
        try:
            # Get all tables
            tables_result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public' 
                ORDER BY tablename
            """))
            
            tables = [row[0] for row in tables_result.fetchall()]
            
            # Drop all tables with CASCADE
            for table in tables:
                try:
                    conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                    logger.info(f"   ✅ Dropped table: {table}")
                except Exception as e:
                    logger.warning(f"   ⚠️  Could not drop table {table}: {e}")
            
            # Drop all custom types
            types_result = conn.execute(text("""
                SELECT typname FROM pg_type 
                WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
                AND typtype = 'e'
            """))
            
            types = [row[0] for row in types_result.fetchall()]
            
            for type_name in types:
                try:
                    conn.execute(text(f"DROP TYPE IF EXISTS {type_name} CASCADE"))
                    logger.info(f"   ✅ Dropped type: {type_name}")
                except Exception as e:
                    logger.warning(f"   ⚠️  Could not drop type {type_name}: {e}")
            
            conn.commit()
            logger.info("✅ Individual cleanup completed!")
            return tables
            
        except Exception as e:
            logger.error(f"❌ Individual cleanup failed: {e}")
            return []
    
    def apply_schema(self):
        """Apply the schema with proper error handling and transaction management"""
        try:
            logger.info("🚀 Starting schema application...")
            
            # Read schema file
            with open(self.schema_file, 'r', encoding='utf-8') as f:
                schema_sql = f.read()
            
            logger.info(f"📝 Loaded schema file ({len(schema_sql)} characters)")
            
            # Apply entire schema as one block (simpler and more reliable)
            with self.engine.connect() as conn:
                trans = conn.begin()
                try:
                    # Execute the entire schema as one statement
                    conn.execute(text(schema_sql))
                    trans.commit()
                    logger.info("✅ Schema applied successfully!")
                    return True
                    
                except Exception as e:
                    trans.rollback()
                    logger.error(f"❌ Schema application failed: {e}")
                    
                    # Try to give more helpful error info
                    error_str = str(e)
                    if "unterminated dollar-quoted string" in error_str:
                        logger.error("💡 This appears to be a dollar-quoted string parsing issue.")
                        logger.error("   The schema file may have formatting problems.")
                    
                    return False
                    
        except Exception as e:
            logger.error(f"❌ Fatal error during schema application: {e}")
            return False
    
    def split_sql_statements(self, sql_content):
        """Split SQL content into individual statements, handling dollar-quoted strings"""
        lines = sql_content.split('\n')
        cleaned_lines = []
        
        # Remove SQL comments
        for line in lines:
            if '--' in line:
                line = line[:line.index('--')]
            cleaned_lines.append(line)
        
        full_sql = '\n'.join(cleaned_lines)
        
        # Smart splitting that handles dollar-quoted strings
        statements = []
        current_statement = []
        in_dollar_quote = False
        dollar_tag = None
        
        # Split by lines and track dollar quotes
        for line in full_sql.split('\n'):
            line = line.strip()
            if not line:
                continue
                
            current_statement.append(line)
            
            # Check for dollar quote start/end
            if '$' in line:
                if not in_dollar_quote:
                    # Starting dollar quote
                    in_dollar_quote = True
                    # Extract tag if present (e.g., $tag$)
                    parts = line.split('$')
                    if len(parts) >= 2:
                        dollar_tag = '$'
                elif in_dollar_quote and line.endswith('$'):
                    # Ending dollar quote
                    in_dollar_quote = False
                    dollar_tag = None
            
            # Check for statement end (semicolon outside dollar quotes)
            if line.endswith(';') and not in_dollar_quote:
                # Complete statement
                statement = '\n'.join(current_statement)
                if statement.strip():
                    statements.append(statement)
                current_statement = []
        
        # Add any remaining statement
        if current_statement:
            statement = '\n'.join(current_statement)
            if statement.strip():
                statements.append(statement)
        
        return statements
    
    def verify_schema(self):
        """Comprehensive schema verification"""
        try:
            logger.info("🔍 Verifying schema application...")
            
            with self.engine.connect() as conn:
                # 1. Check tables created
                tables_result = conn.execute(text("""
                    SELECT tablename FROM pg_tables 
                    WHERE schemaname = 'public' 
                    ORDER BY tablename
                """))
                
                tables = [row[0] for row in tables_result.fetchall()]
                logger.info(f"📊 Tables created: {len(tables)}")
                
                expected_tables = [
                    'users', 'ai_tools', 'tool_executions', 'usage_analytics',
                    'system_config', 'audit_logs', 'conversations', 'prompt_templates'
                ]
                
                missing_tables = set(expected_tables) - set(tables)
                if missing_tables:
                    logger.warning(f"⚠️  Missing expected tables: {missing_tables}")
                
                # 2. Check indexes
                indexes_result = conn.execute(text("""
                    SELECT indexname FROM pg_indexes 
                    WHERE schemaname = 'public' 
                    AND indexname NOT LIKE '%_pkey'
                """))
                
                indexes = [row[0] for row in indexes_result.fetchall()]
                logger.info(f"🔍 Indexes created: {len(indexes)}")
                
                # 3. Check data integrity
                try:
                    # Check if we have any AI tools
                    tools_count = conn.execute(text("SELECT COUNT(*) FROM ai_tools")).fetchone()[0]
                    logger.info(f"🤖 AI Tools: {tools_count}")
                    
                    # Check system config
                    config_count = conn.execute(text("SELECT COUNT(*) FROM system_config")).fetchone()[0]
                    logger.info(f"⚙️  System configurations: {config_count}")
                    
                except Exception as e:
                    logger.warning(f"⚠️  Could not verify data: {e}")
                
                # 4. Test basic CRUD operations
                test_user_id = f"test_user_{int(time.time())}"
                try:
                    # Insert test user
                    conn.execute(text("""
                        INSERT INTO users (id, email, first_name, last_name, role)
                        VALUES (:id, :email, 'Test', 'User', 'student')
                    """), {
                        'id': test_user_id,
                        'email': f"test_{int(time.time())}@test.com"
                    })
                    
                    # Verify user exists
                    user_check = conn.execute(text("""
                        SELECT id FROM users WHERE id = :id
                    """), {'id': test_user_id}).fetchone()
                    
                    if user_check:
                        logger.info("✅ CRUD operations working")
                        # Clean up test user
                        conn.execute(text("DELETE FROM users WHERE id = :id"), {'id': test_user_id})
                        conn.commit()
                    else:
                        logger.warning("⚠️  CRUD test failed")
                        
                except Exception as e:
                    logger.warning(f"⚠️  CRUD test failed: {e}")
                
                logger.info("✅ Schema verification completed!")
                return True
                
        except Exception as e:
            logger.error(f"❌ Schema verification failed: {e}")
            return False
    
    def run_full_setup(self):
        """Run the complete schema setup process"""
        try:
            logger.info("🎓 Academic AI Platform - Neon DB Schema Setup")
            logger.info("=" * 60)
            
            # Step 1: Create optimized engine
            logger.info("Step 1: Creating database engine...")
            self.create_optimized_engine()
            
            # Step 2: Test connection
            logger.info("Step 2: Testing database connection...")
            if not self.test_connection():
                return False
            
            # Step 3: Check schema file
            logger.info("Step 3: Checking schema file...")
            if not self.check_schema_file():
                return False
            
            # Step 4: Clean existing schema
            logger.info("Step 4: Cleaning existing schema...")
            self.clean_existing_schema()
            
            # Step 5: Apply schema
            logger.info("Step 5: Applying schema...")
            if not self.apply_schema():
                return False
            
            # Step 6: Verify schema
            logger.info("Step 6: Verifying schema...")
            if not self.verify_schema():
                return False
            
            logger.info("\n🎉 Database setup completed successfully!")
            logger.info("Your Academic AI Platform is ready to use with Neon DB!")
            
            return True
            
        except Exception as e:
            logger.error(f"❌ Setup failed: {e}")
            return False
        finally:
            if self.engine:
                self.engine.dispose()

def main():
    """Main entry point"""
    try:
        manager = NeonSchemaManager()
        success = manager.run_full_setup()
        
        if success:
            logger.info("\n🚀 Next steps:")
            logger.info("1. Run your Flask app: python app.py")
            logger.info("2. Test the API endpoints")
            logger.info("3. Set up your frontend connection")
            sys.exit(0)
        else:
            logger.error("\n❌ Setup failed. Please check the logs above.")
            sys.exit(1)
            
    except KeyboardInterrupt:
        logger.info("\n⏹️  Setup cancelled by user")
        sys.exit(1)
    except Exception as e:
        logger.error(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()