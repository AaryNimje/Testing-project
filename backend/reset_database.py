# reset_database.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def reset_database():
    """Clean slate - drop all tables and start fresh"""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        
        print("🧹 Resetting database...")
        
        with engine.connect() as conn:
            # Drop all tables in correct order
            tables_to_drop = [
                'conversations', 'users', 'institutions',
                # Add any other tables that might exist
            ]
            
            for table in tables_to_drop:
                try:
                    conn.execute(text(f"DROP TABLE IF EXISTS {table} CASCADE"))
                    print(f"   ✅ Dropped {table}")
                except:
                    print(f"   ⚠️  {table} didn't exist")
            
            conn.commit()
        
        print("✅ Database reset complete!")
        return True
        
    except Exception as e:
        print(f"❌ Reset failed: {e}")
        return False

if __name__ == "__main__":
    reset_database()