"""
Academic AI Platform - Main Flask Application
Compact LLM for Enterprise API Integration & Data Access
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from auth_routes import auth_bp, init_jwt
from models import Base, engine

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000", "https://your-render-domain.onrender.com"])

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY')

# Initialize JWT
jwt = init_jwt(app)

# Register blueprints
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "message": "🎓 Academic AI Platform is running!",
        "version": "1.0.0",
        "status": "healthy"
    })

@app.route('/api/health')
def health_check():
    """Detailed health check"""
    return jsonify({
        "status": "healthy",
        "services": {
            "flask": "running",
            "gemini_api": "configured" if app.config['GEMINI_API_KEY'] else "not_configured",
            "database": "connected" if check_database_connection() else "disconnected",
            "mcp_server": "pending"
        }
    })

def check_database_connection():
    """Check if database connection is working"""
    try:
        # Try to connect to the database
        engine.connect()
        return True
    except Exception:
        return False

@app.route('/api/chat', methods=['POST'])
def chat():
    """Main chat endpoint for AI interactions"""
    try:
        data = request.json
        user_input = data.get('message', '')
        
        if not user_input:
            return jsonify({"error": "No message provided"}), 400
        
        # TODO: Implement AI agent routing
        response = {
            "message": f"I received your message: '{user_input}'. AI agents are coming soon!",
            "agent_used": "placeholder",
            "status": "development"
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/dashboard/stats', methods=['GET'])
def dashboard_stats():
    """Get dashboard statistics for the frontend"""
    # This would typically be fetched from your database
    return jsonify({
        "userCount": 1247,
        "newToday": 23,
        "systemUptime": 99.8,
        "dailyCost": 0.12,
        "dailyCap": 0.16,
        "apiHealth": 98.7,
        "recentActivity": [
            {"user": "Dr. Johnson", "action": "Created quiz", "timestamp": "2025-06-09T10:30:00Z"},
            {"user": "Alex Chen", "action": "Completed assignment", "timestamp": "2025-06-09T09:45:00Z"},
            {"user": "Maria Rodriguez", "action": "Generated report", "timestamp": "2025-06-09T08:15:00Z"}
        ]
    })

# Create tables if they don't exist
@app.before_first_request
def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == '__main__':
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true',
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000))
    )