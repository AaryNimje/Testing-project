"""
Academic AI Platform - Main Flask Application
Compact LLM for Enterprise API Integration & Data Access
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['GEMINI_API_KEY'] = os.getenv('GEMINI_API_KEY')

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
            "database": "pending",
            "mcp_server": "pending"
        }
    })

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

if __name__ == '__main__':
    app.run(
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true',
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5000))
    )