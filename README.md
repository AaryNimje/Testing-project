# 🎓 Academic AI Platform

> **Compact LLM for Enterprise API Integration & Data Access** - A sophisticated AI-powered workflow automation platform designed specifically for educational institutions, enabling seamless interaction with Google Workspace and academic systems through natural language interfaces.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![React 18+](https://img.shields.io/badge/react-18+-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/vite-5.0+-646cff.svg)](https://vitejs.dev/)
[![LangChain](https://img.shields.io/badge/langchain-0.1+-green.svg)](https://langchain.com/)

---

## 🌟 **Project Overview**

The Academic AI Platform is a **4-week internship project** that bridges AI language models with academic and administrative data systems. Built with a modern tech stack, it provides **50+ specialized tools** for educators, students, and administrators through an intelligent agent system that understands natural language queries and routes them to appropriate AI-powered tools.

### **🎯 Key Features**

- **🤖 Intelligent Agent System**: AI-powered tool selection with graceful fallbacks
- **🔧 50+ Academic Tools**: Khanmigo-inspired tools for teaching, learning, and administration
- **🏫 Role-Based Access**: Super Admin, Admin, Faculty, Student, and Staff roles
- **💡 Natural Language Interface**: Query any tool using plain English
- **🔗 Google Workspace Integration**: Seamless connection to Gmail, Calendar, Sheets, Drive
- **💰 Cost-Optimized**: Stays within $5 budget using intelligent rule-based + AI hybrid approach
- **🐍 Python MCP Servers**: Custom Model Context Protocol implementation
- **⚡ Real-Time Processing**: Fast response times with smart caching

---

## 🏗️ **Architecture Overview**

```mermaid
graph TB
    A[User Interface<br/>Vite + React] --> B[Flask Backend<br/>API Gateway]
    B --> C[Agent Manager<br/>Intelligent Routing]
    C --> D[Tool Selector<br/>AI + Rule-Based]
    D --> E[MCP Server Manager<br/>Python Servers]
    E --> F[Specialized Tools<br/>50+ Academic Tools]
    F --> G[External Services<br/>Google Workspace + AI]
    
    style A fill:#e1f5fe
    style C fill:#f3e5f5
    style E fill:#e8f5e8
    style G fill:#fff3e0
```

### **🔄 Request Flow**

1. **User Query** → Natural language input (e.g., "Create a quiz about photosynthesis for 7th grade")
2. **Authentication** → Role-based access validation
3. **Intelligent Routing** → AI agent selects appropriate tool
4. **Tool Execution** → Python MCP server processes request
5. **Result Formatting** → Structured response returned to user

---

## 🛠️ **Technology Stack**

### **Frontend**
- **⚡ Vite + React 18**: Modern, fast development experience
- **🎨 Tailwind CSS**: Utility-first styling
- **🔐 JWT Authentication**: Secure token-based auth
- **📱 Responsive Design**: Works on all devices

### **Backend**
- **🐍 Python 3.8+ / Flask**: Robust API framework
- **🧠 LangChain**: AI agent orchestration
- **🤖 Google Gemini API**: Natural language processing
- **🔗 MCP Protocol**: Custom Python implementation
- **🗃️ PostgreSQL**: Reliable data storage

### **AI & Integration**
- **🎓 Khanmigo-Inspired Tools**: 50+ educational AI tools
- **☁️ Google Workspace APIs**: Gmail, Calendar, Drive, Sheets
- **💬 Intelligent Tool Selection**: Hybrid AI + rule-based routing
- **💰 Budget-Conscious**: Cost optimization within $5 limit

---

## 📁 **Project Structure**

```
academic-ai-platform/
├── 🎨 frontend/                 # Vite + React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/            # Authentication components
│   │   │   ├── dashboards/      # Role-specific dashboards
│   │   │   ├── tools/           # 50+ tool interfaces
│   │   │   │   ├── planning/    # Lesson plans, quizzes, rubrics
│   │   │   │   ├── engagement/  # Hooks, relevance, activities
│   │   │   │   ├── assessment/  # Grades, feedback, progress
│   │   │   │   ├── student/     # Tutoring, math, writing
│   │   │   │   ├── communication/ # Emails, newsletters
│   │   │   │   └── administrative/ # Reports, analytics
│   │   │   └── common/          # Shared UI components
│   │   ├── pages/               # Application pages
│   │   ├── services/            # API communication
│   │   └── hooks/               # Custom React hooks
│   └── package.json
│
├── 🐍 backend/                  # Python Flask API
│   ├── app/
│   │   ├── agents/              # AI agent system
│   │   │   ├── agent_manager.py    # Main orchestrator
│   │   │   ├── tool_selector.py    # Intelligent tool selection
│   │   │   ├── planning/           # Planning & preparation agents
│   │   │   ├── engagement/         # Engagement & differentiation
│   │   │   ├── assessment/         # Assessment & feedback
│   │   │   ├── student/            # Student learning tools
│   │   │   ├── communication/      # Communication tools
│   │   │   ├── administrative/     # Administrative tools
│   │   │   └── system/             # System management
│   │   ├── mcp/                 # Model Context Protocol
│   │   │   ├── protocol/           # MCP implementation
│   │   │   ├── servers/            # Python MCP servers
│   │   │   ├── tools/              # Tool definitions
│   │   │   └── client.py           # MCP client
│   │   ├── api/                 # REST API endpoints
│   │   ├── auth/                # Authentication & authorization
│   │   ├── services/            # Business logic
│   │   └── models/              # Database models
│   └── requirements.txt
│
├── 🗃️ database/                # Database schemas
├── 📚 docs/                    # Documentation
├── 🐳 docker-compose.yml       # Container orchestration
└── 📄 README.md               # This file
```

---

## 🚀 **Quick Start**

### **Prerequisites**
- Python 3.8+
- Node.js 16+
- PostgreSQL 12+
- Google Cloud Account (for Workspace APIs)
- Gemini API Key

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

# Database setup
python -m flask db init
python -m flask db migrate
python -m flask db upgrade

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

## 🤖 **Intelligent Tool Selection**

### **Hybrid Approach: Rule-Based + AI**

```python
# Example: Faculty creates a quiz
User Query: "Create a quiz about photosynthesis for 7th grade"

# 1. Rule-Based Matching (FREE)
Keywords: ["create", "quiz", "photosynthesis", "7th grade"]
Match: quiz_generator (95% confidence)
Cost: $0.00

# 2. Tool Execution
MCP Server: Planning Server
Tool: Quiz Generator
Result: 10-question quiz with answer key
```

```python
# Example: Complex engagement request
User Query: "I need something engaging for my students about the Revolutionary War"

# 1. Rule-Based: Low confidence (30%)
# 2. AI Selection: Triggered for complex query
AI Analysis: lesson_hook_generator + make_it_relevant
Confidence: 87%
Cost: ~$0.02

# 3. Tool Execution
Result: Engaging Revolutionary War content connected to modern issues
```

### **Cost Optimization**
- **80%+ queries**: Handled FREE with rule-based matching
- **20% complex queries**: AI-powered selection (~$0.01-0.03 each)
- **Daily budget**: $0.16 ($5 ÷ 30 days)
- **Smart caching**: Avoid duplicate API calls

---

## 🔧 **API Documentation**

### **Authentication**
```bash
POST /api/auth/login
{
  "email": "faculty@university.edu",
  "password": "password"
}

Response: {
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "faculty@university.edu", 
    "role": "faculty"
  }
}
```

### **Tool Execution**
```bash
POST /api/agents/execute
Authorization: Bearer jwt_token
{
  "query": "Create a quiz about photosynthesis for 7th grade",
  "context": {
    "subject": "biology",
    "grade_level": "7"
  }
}

Response: {
  "tool_used": "quiz_generator",
  "confidence": 0.95,
  "result": {
    "quiz_title": "Photosynthesis Quiz - Grade 7",
    "questions": [...],
    "answer_key": [...]
  },
  "execution_time": "23s",
  "cost_estimate": "$0.00"
}
```

### **Available Tools**
```bash
GET /api/tools?role=faculty

Response: {
  "tools": [
    {
      "name": "lesson_plan_generator",
      "category": "planning",
      "description": "Generate comprehensive lesson plans",
      "estimated_time": "30-60s",
      "cost_tier": "medium"
    }
  ]
}
```

---

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend
python -m pytest tests/ -v
python -m pytest tests/test_tool_selection.py::test_rule_based_matching
```

### **Frontend Tests**
```bash
cd frontend
npm test
npm run test:coverage
```

### **Integration Tests**
```bash
# Test complete user flow
npm run test:e2e
```

---

## 🚀 **Deployment**

### **Development**
```bash
# Start all services
docker-compose up -d

# Access application
Frontend: http://localhost:3000
Backend API: http://localhost:5000
Database: localhost:5432
```

### **Production (Render)**
```yaml
# render.yaml
services:
  - type: web
    name: academic-ai-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: gunicorn app:app
    
  - type: web
    name: academic-ai-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    
  - type: pserv
    name: academic-ai-db
    env: postgresql
```

---

## 📊 **Project Metrics**

### **Development Timeline** (4 Weeks)
- **Week 1**: Foundation & Infrastructure (Auth, basic UI, MCP protocol)
- **Week 2**: Core Tools & Agent System (Planning, student, assessment tools)
- **Week 3**: Advanced Features (Engagement tools, communication, admin)
- **Week 4**: Polish & Documentation (Testing, deployment, research paper)

### **Tool Statistics**
- **🎓 Faculty Tools**: 25+ (Planning, engagement, assessment, communication)
- **📚 Student Tools**: 15+ (Tutoring, learning, analytics, creative)
- **👨‍💼 Administrative**: 10+ (Reports, HR, compliance, resource management)
- **⚙️ System Tools**: 8+ (User management, security, monitoring)

### **Cost Efficiency**
- **Total Budget**: $5.00 for entire project
- **Rule-Based Success Rate**: 80%+ (FREE)
- **Average AI Query Cost**: $0.01-0.03
- **Daily Cost Target**: $0.16

---

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-tool`)
3. Follow coding standards (Black formatter, ESLint)
4. Write tests for new functionality
5. Submit pull request with detailed description

### **Adding New Tools**
```python
# 1. Define tool in registry
"new_tool": {
    "name": "new_tool",
    "category": "planning",
    "description": "Tool description",
    "keywords": ["keyword1", "keyword2"],
    "user_roles": ["faculty"],
    "server": "planning"
}

# 2. Implement MCP tool
async def new_tool_function(args: dict) -> dict:
    # Tool implementation
    return {"result": "tool output"}

# 3. Register in MCP server
server.register_tool("new_tool", new_tool_function, schema)

# 4. Add frontend component
const NewTool = () => {
    // React component
}
```

---

## 📚 **Documentation**

- **📖 [API Documentation](docs/API.md)**: Complete API reference
- **🏗️ [Architecture Guide](docs/ARCHITECTURE.md)**: System design details
- **🔧 [Setup Guide](docs/SETUP.md)**: Detailed installation instructions
- **🎓 [User Guide](docs/USER_GUIDE.md)**: Tool usage examples
- **🧪 [Testing Guide](docs/TESTING.md)**: Testing strategies and examples

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Khan Academy**: Inspiration from Khanmigo's educational AI tools
- **Anthropic**: Model Context Protocol specification
- **Google**: Workspace APIs and Gemini AI integration
- **Educational Community**: Feedback and use case insights

---

## 📞 **Support & Contact**

### **Project Team**
- **Mentors**: Hiten M Sadani, Manan Thakkar, Dr. Rakesh Vanzara
- **Institution**: U V Patel College of Engineering, Ganpat University
- **Duration**: 4-week internship project

### **Getting Help**
- **🐛 Issues**: [GitHub Issues](https://github.com/your-username/academic-ai-platform/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/your-username/academic-ai-platform/discussions)
- **📧 Email**: [academic-ai-platform@university.edu](mailto:academic-ai-platform@university.edu)

---

<div align="center">

**⭐ If this project helps you, please give it a star! ⭐**

Made with ❤️ for educators, students, and academic institutions worldwide.

[🚀 **Get Started**](#-quick-start) | [📚 **Documentation**](docs/) | [🤝 **Contributing**](#-contributing)

</div>