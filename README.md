# 🎓 Academic AI Platform

> **Compact LLM for Enterprise API Integration & Data Access** - A sophisticated AI-powered workflow automation platform designed specifically for educational institutions, enabling seamless interaction with Google Workspace and academic systems through natural language interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![Next.js 14+](https://img.shields.io/badge/next.js-14+-000000.svg)](https://nextjs.org/)
[![LangChain](https://img.shields.io/badge/langchain-0.1+-green.svg)](https://langchain.com/)

---

## 🌟 **Project Overview**

The Academic AI Platform is a comprehensive AI-powered educational workflow automation platform designed for educational institutions. It provides 50+ specialized tools for educators, students, and administrators through an intelligent agent system that understands natural language queries and routes them to appropriate AI-powered tools.

### **🎯 Key Features**

- **🤖 Intelligent Agent System**: AI-powered tool selection with graceful fallbacks
- **🔧 50+ Academic Tools**: Khanmigo-inspired tools for teaching, learning, and administration
- **🏫 Role-Based Access**: Super Admin, Admin, Faculty, Student, and Staff roles
- **💡 Natural Language Interface**: Query any tool using plain English
- **🔗 Google Workspace Integration**: Seamless connection to Gmail, Calendar, Sheets, Drive
- **💰 Cost-Optimized**: Stays within $5 budget using intelligent rule-based + AI hybrid approach
- **🐍 Python Backend**: Flask REST API with JWT authentication
- **⚡ Real-Time Processing**: Fast response times with smart caching

---

## 🚀 **Getting Started**

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/academic-ai-platform.git
cd academic-ai-platform
```

### **2. Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Environment setup
cp .env.example .env
# Edit .env with your API keys and database URL

# Database setup (with PostgreSQL)
python test_connection.py  # Test database connection
python apply_schema.py     # Apply database schema

# Run backend
python app.py
```

### **3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

### **4. Environment Variables**
```bash
# Backend (.env)
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:pass@localhost/academic_ai
SECRET_KEY=your_secret_key
MCP_SERVER_URL=http://localhost:5000/mcp

# Cost controls
DAILY_REQUEST_LIMIT=200
MONTHLY_BUDGET_LIMIT=4.50
```

---

## 👥 **User Roles & Tools**

### **🔱 Super Admin**
- **System Management**: User roles, platform config, security
- **Full Access**: All tools across all roles
- **Analytics**: Cost monitoring, usage tracking, audit logs

### **👨‍💼 Admin**
- **User Management**: Create/manage users and roles
- **System Overview**: Monitor platform usage and performance
- **Academic Analytics**: Institution-wide reports and insights

### **👩‍🏫 Faculty (25+ Tools)**

#### **📚 Planning & Preparation**
- **Lesson Plan Generator**: Standards-aligned lesson plans
- **Quiz & Test Generator**: Assessments with answer keys
- **Rubric Generator**: Custom grading rubrics
- **Assignment Creator**: Engaging assignments and projects

#### **🎪 Engagement & Differentiation**
- **Lesson Hook Generator**: Attention-grabbing lesson openings
- **Make It Relevant Tool**: Connect content to student interests
- **Text Leveler**: Adjust reading complexity
- **Student Grouping Suggester**: Optimal group formations

#### **📊 Assessment & Feedback**
- **Grade Management**: Track student performance
- **Feedback Generator**: Personalized student feedback
- **Progress Reports**: Academic progress summaries
- **Class Snapshot**: Weekly overview of student work

### **🎒 Student (15+ Tools)**

#### **📖 Learning & Tutoring**
- **AI Tutor**: 24/7 homework assistance
- **Math Problem Solver**: Step-by-step solutions
- **Writing Coach**: Essay and creative writing help
- **Study Guide Generator**: Personalized study materials

#### **🎭 Interactive Learning**
- **Debate Partner**: Practice argumentation skills
- **Historical Figure Chat**: Conversations with historical personalities
- **Science Lab Assistant**: Virtual experiment guidance

### **👨‍💼 Staff**
- **Document Management**: Organize institutional documents
- **Report Generator**: Administrative reports and analytics
- **Resource Booking**: Schedule facilities and equipment
- **Compliance Tools**: Policy management and audit trails

---

## 🔄 **Authentication & Authorization**

The platform uses JWT-based authentication with role-based access control:

1. **User Authentication**: Login with email/password or SSO
2. **JWT Tokens**: Secure, short-lived tokens with role claims
3. **Role-Based Dashboards**: Different interfaces for each role
4. **Permission Checks**: API endpoints verify user permissions

---

## 🌐 **Deployment on Render**

This application is configured for easy deployment on Render:

1. **Fork this Repository**: Create your own copy on GitHub
2. **Create a Render Account**: Sign up at [render.com](https://render.com)
3. **Add Your Project**: Connect your GitHub repository
4. **Deploy Blueprint**: Use the render.yaml configuration
5. **Set Environment Variables**: Add API keys and secrets
6. **Deploy**: Let Render handle the rest!

---

## 📂 **Project Structure**

```
academic-ai-platform/
├── backend/               # Flask REST API
│   ├── app.py             # Main application file
│   ├── auth_routes.py     # Authentication endpoints
│   ├── models.py          # SQLAlchemy models
│   └── requirements.txt   # Python dependencies
│
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js App Router
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   └── lib/           # Utilities and API client
│   └── package.json       # Node dependencies
│
└── render.yaml            # Render deployment config
```

---

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 **Acknowledgements**

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [LangChain](https://langchain.com/)
- [shadcn/ui](https://ui.shadcn.com/)