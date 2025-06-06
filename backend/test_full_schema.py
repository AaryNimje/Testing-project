# test_full_schema.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()

def test_full_schema():
    """Test the complete Academic AI Platform schema"""
    try:
        engine = create_engine(os.getenv('DATABASE_URL'))
        
        print("🧪 Testing Complete Academic AI Platform Schema")
        print("=" * 60)
        
        with engine.connect() as conn:
            # 1. Check tables created
            tables_result = conn.execute(text("""
                SELECT tablename FROM pg_tables 
                WHERE schemaname='public' 
                ORDER BY tablename
            """)).fetchall()
            
            tables = [table[0] for table in tables_result]
            print(f"📊 Tables created: {len(tables)}")
            for table in tables:
                print(f"   ✅ {table}")
            
            # 2. Check AI tools
            tools_result = conn.execute(text("SELECT COUNT(*) FROM ai_tools")).fetchone()
            print(f"\n🤖 AI Tools available: {tools_result[0]}")
            
            # 3. Check system config
            config_result = conn.execute(text("SELECT COUNT(*) FROM system_config")).fetchone()
            print(f"⚙️  System configurations: {config_result[0]}")
            
            # 4. Test creating a test user
            print(f"\n👤 Testing user creation...")
            conn.execute(text("""
                INSERT INTO users (id, clerk_user_id, email, first_name, last_name, role)
                VALUES ('user_test_complete', 'clerk_test_complete', 'test@ganpatuniversity.ac.in', 'Complete', 'Test', 'faculty')
                ON CONFLICT (id) DO NOTHING
            """))
            
            # 5. Test tool execution log
            print(f"🔧 Testing tool execution...")
            conn.execute(text("""
                INSERT INTO tool_executions (
                    user_id, tool_id, input_data, execution_status, selection_method
                ) VALUES (
                    'user_test_complete',
                    (SELECT id FROM ai_tools LIMIT 1),
                    '{"test": "data"}',
                    'completed',
                    'rule_based'
                )
            """))
            
            # 6. Test usage analytics
            print(f"📈 Testing analytics...")
            conn.execute(text("""
                INSERT INTO usage_analytics (
                    user_id, action_type, resource_type
                ) VALUES (
                    'user_test_complete',
                    'tool_execution',
                    'ai_tool'
                )
            """))
            
            # 7. Verify data
            execution_count = conn.execute(text("SELECT COUNT(*) FROM tool_executions")).fetchone()[0]
            analytics_count = conn.execute(text("SELECT COUNT(*) FROM usage_analytics")).fetchone()[0]
            
            print(f"\n📊 Test Results:")
            print(f"   Tool Executions: {execution_count}")
            print(f"   Analytics Records: {analytics_count}")
            
            # 8. Clean up test data
            print(f"\n🧹 Cleaning up test data...")
            conn.execute(text("DELETE FROM tool_executions WHERE user_id = 'user_test_complete'"))
            conn.execute(text("DELETE FROM usage_analytics WHERE user_id = 'user_test_complete'"))
            conn.execute(text("DELETE FROM users WHERE id = 'user_test_complete'"))
            
            conn.commit()
            
            print(f"✅ All tests passed!")
            print(f"🎉 Academic AI Platform database is ready!")
            
            return True
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_full_schema()