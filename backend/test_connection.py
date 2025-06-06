import os
import psycopg2
from dotenv import load_dotenv

# Load environment
load_dotenv()

def test_neon():
    """Simple Neon connection test"""
    try:
        # Get connection string
        db_url = os.getenv('DATABASE_URL')
        print(f"🔗 Testing connection to Neon...")
        
        # Connect
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        # Test query
        cursor.execute("SELECT version();")
        version = cursor.fetchone()[0]
        print(f"✅ Connected! PostgreSQL: {version}")
        
        # Test table creation
        cursor.execute("""
            CREATE TABLE test_academic_ai (
                id SERIAL PRIMARY KEY,
                name TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        print("✅ Table creation works")
        
        # Test insert
        cursor.execute(
            "INSERT INTO test_academic_ai (name) VALUES (%s)",
            ("Academic AI Platform",)
        )
        print("✅ Data insert works")
        
        # Test select
        cursor.execute("SELECT * FROM test_academic_ai")
        result = cursor.fetchone()
        print(f"✅ Data select works: {result}")
        
        # Cleanup
        cursor.execute("DROP TABLE test_academic_ai")
        conn.commit()
        cursor.close()
        conn.close()
        
        print("🎉 Neon database is ready!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Neon Database Connection")
    print("=" * 40)
    test_neon()