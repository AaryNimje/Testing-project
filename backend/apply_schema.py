# apply_schema_fixed.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def apply_schema_properly():
    """Apply schema with proper handling of multi-line statements"""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        
        print("🚀 Applying Academic AI Platform schema (Fixed Version)...")
        
        # Read the SQL file
        with open('full_schema.sql', 'r', encoding='utf-8') as file:
            schema_sql = file.read()
        
        print("📄 Schema file loaded successfully")
        
        # Execute the entire schema as one block
        with engine.connect() as conn:
            try:
                # Execute the entire schema
                conn.execute(text(schema_sql))
                conn.commit()
                print("✅ Schema executed successfully!")
                
                # Now add the initial data separately
                print("📊 Adding initial system configuration...")
                
                # System config
                conn.execute(text("""
                    INSERT INTO system_config (config_key, config_value, description) VALUES
                    ('max_daily_requests_per_user', '200', 'Maximum API requests per user per day'),
                    ('monthly_budget_limit', '4.50', 'Monthly budget limit in USD'),
                    ('default_ai_model', '"gemini-pro"', 'Default AI model for tool selection'),
                    ('enable_audit_logging', 'true', 'Enable comprehensive audit logging'),
                    ('session_timeout_hours', '24', 'User session timeout in hours')
                    ON CONFLICT (config_key) DO NOTHING
                """))
                
                print("🤖 Adding initial AI tools...")
                
                # AI Tools
                conn.execute(text("""
                    INSERT INTO ai_tools (name, display_name, description, category, keywords, allowed_roles, mcp_server, function_name, input_schema) VALUES
                    ('lesson_plan_generator', 'Lesson Plan Generator', 'Generate comprehensive lesson plans', 'planning', ARRAY['lesson', 'plan', 'teaching'], ARRAY['faculty']::user_role[], 'planning_server', 'generate_lesson_plan', '{"type": "object", "properties": {"subject": {"type": "string"}}}'),
                    ('quiz_generator', 'Quiz & Test Generator', 'Create assessments with questions', 'assessment', ARRAY['quiz', 'test', 'assessment'], ARRAY['faculty']::user_role[], 'assessment_server', 'generate_quiz', '{"type": "object", "properties": {"topic": {"type": "string"}}}'),
                    ('ai_tutor', 'AI Tutor', '24/7 homework assistance', 'student_support', ARRAY['tutor', 'homework', 'help'], ARRAY['student']::user_role[], 'student_server', 'provide_tutoring', '{"type": "object", "properties": {"question": {"type": "string"}}}'),
                    ('grade_tracker', 'Grade Management', 'Track student performance', 'assessment', ARRAY['grades', 'tracking', 'performance'], ARRAY['faculty', 'admin']::user_role[], 'assessment_server', 'track_grades', '{"type": "object", "properties": {"course_id": {"type": "string"}}}')
                    ON CONFLICT (name) DO NOTHING
                """))
                
                conn.commit()
                
                print("✅ Initial data added successfully!")
                return True
                
            except Exception as e:
                print(f"❌ Error executing schema: {e}")
                conn.rollback()
                return False
        
    except Exception as e:
        print(f"❌ Schema application failed: {e}")
        return False

def verify_schema():
    """Verify the schema was applied correctly"""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        
        with engine.connect() as conn:
            # Check tables
            tables_result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname='public' 
                ORDER BY tablename
            """)).fetchall()
            
            tables = [table[0] for table in tables_result]
            print(f"\n📊 Tables created: {len(tables)}")
            for table in tables:
                print(f"   ✅ {table}")
            
            # Check data
            tools_count = conn.execute(text("SELECT COUNT(*) FROM ai_tools")).fetchone()[0]
            config_count = conn.execute(text("SELECT COUNT(*) FROM system_config")).fetchone()[0]
            
            print(f"\n🤖 AI Tools: {tools_count}")
            print(f"⚙️  System Config: {config_count}")
            
            if tools_count >= 4 and config_count >= 5:
                print("✅ Schema verification passed!")
                return True
            else:
                print("⚠️  Some initial data missing")
                return False
                
    except Exception as e:
        print(f"❌ Verification failed: {e}")
        return False

if __name__ == "__main__":
    print("🎓 Academic AI Platform - Fixed Schema Application")
    print("=" * 60)
    
    if apply_schema_properly():
        if verify_schema():
            print("\n🎉 Database is ready for the Academic AI Platform!")
        else:
            print("\n🔧 Schema applied but verification failed")
    else:
        print("\n❌ Schema application failed")