# models.py
import os
import uuid
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Boolean, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.orm import declarative_base, sessionmaker, relationship  # Updated import
from sqlalchemy.dialects.postgresql import UUID, JSONB
from dotenv import load_dotenv

# Load environment
load_dotenv()

# SQLAlchemy setup
Base = declarative_base()  # This is the correct 2.0 way
engine = create_engine(os.getenv('DATABASE_URL'))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base model
class BaseModel(Base):
    __abstract__ = True
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Core models for Academic AI Platform
class Institution(BaseModel):
    __tablename__ = 'institutions'
    
    name = Column(String(255), nullable=False)
    domain = Column(String(255), unique=True, nullable=False)
    settings = Column(JSONB, default={})
    is_active = Column(Boolean, default=True)
    
    # Relationships
    users = relationship("User", back_populates="institution")

class User(BaseModel):
    __tablename__ = 'users'
    
    # Basic info
    email = Column(String(255), unique=True, nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False, default='student')  # admin, faculty, staff, student
    
    # Relationships
    institution_id = Column(UUID(as_uuid=True), ForeignKey('institutions.id'))
    institution = relationship("Institution", back_populates="users")
    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")
    
    # Status
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

class Conversation(BaseModel):
    __tablename__ = 'conversations'
    
    user_id = Column(UUID(as_uuid=True), ForeignKey('users.id'), nullable=False)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text)
    agent_used = Column(String(100))
    
    # Relationships
    user = relationship("User", back_populates="conversations")

# Database functions
def create_tables():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created")

def get_db_session():
    """Get database session"""
    return SessionLocal()

def test_models():
    """Test the models with correct cleanup order"""
    try:
        # Create tables
        create_tables()
        
        # Get session
        db = get_db_session()
        
        # Create test institution
        institution = Institution(
            name="Ganpat University",
            domain="ganpatuniversity.ac.in"
        )
        db.add(institution)
        db.commit()
        print(f"✅ Institution created: {institution.name}")
        
        # Create test user
        user = User(
            email="test@ganpatuniversity.ac.in",
            first_name="Test",
            last_name="User",
            role="faculty",
            institution_id=institution.id
        )
        db.add(user)
        db.commit()
        print(f"✅ User created: {user.full_name}")
        
        # Create test conversation
        conversation = Conversation(
            user_id=user.id,
            user_message="Hello, test message",
            ai_response="Hello! This is a test response"
        )
        db.add(conversation)
        db.commit()
        print(f"✅ Conversation created")
        
        # Test queries
        total_users = db.query(User).count()
        total_institutions = db.query(Institution).count()
        total_conversations = db.query(Conversation).count()
        
        print(f"📊 Database stats:")
        print(f"   Users: {total_users}")
        print(f"   Institutions: {total_institutions}")
        print(f"   Conversations: {total_conversations}")
        
        # FIXED: Cleanup in correct order (child records first)
        print("🧹 Cleaning up test data...")
        
        # 1. Delete conversations first (no dependencies)
        db.delete(conversation)
        print("   ✅ Conversation deleted")
        
        # 2. Delete user second (depends on institution)
        db.delete(user)
        print("   ✅ User deleted")
        
        # 3. Delete institution last (was referenced by user)
        db.delete(institution)
        print("   ✅ Institution deleted")
        
        db.commit()
        db.close()
        
        print("🧹 Test data cleaned up successfully")
        print("🎉 Models test successful!")
        return True
        
    except Exception as e:
        print(f"❌ Models test failed: {e}")
        if 'db' in locals():
            db.rollback()
            db.close()
        return False

if __name__ == "__main__":
    print("🧪 Testing Database Models (Fixed Version)")
    print("=" * 50)
    test_models()