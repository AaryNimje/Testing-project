# create_fixed_schema.py
import os

def create_fixed_schema():
    """Create the corrected schema file"""
    
    schema_content = '''-- Academic AI Platform Database Schema
-- Comprehensive schema for LLM-powered educational workflow automation

-- Enable UUID extension for better ID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS AND TYPES
-- ============================================================================

-- User roles enumeration
CREATE TYPE user_role AS ENUM (
    'super_admin',
    'admin', 
    'faculty',
    'student',
    'staff'
);

-- User status enumeration
CREATE TYPE user_status AS ENUM (
    'active',
    'inactive',
    'suspended',
    'pending_verification'
);

-- Tool categories
CREATE TYPE tool_category AS ENUM (
    'planning',
    'engagement', 
    'assessment',
    'student_support',
    'communication',
    'administrative',
    'system_management'
);

-- ============================================================================
-- CORE USER MANAGEMENT (CLERK INTEGRATION)
-- ============================================================================

-- Main users table (Clerk Integration)
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    clerk_user_id TEXT NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    profile_picture_url TEXT,
    
    -- Academic-specific fields
    role user_role NOT NULL DEFAULT 'student',
    status user_status NOT NULL DEFAULT 'active',
    phone VARCHAR(20),
    department VARCHAR(100),
    employee_id VARCHAR(50),
    student_id VARCHAR(50),
    google_workspace_email VARCHAR(255),
    academic_preferences JSONB DEFAULT '{}',
    
    -- Clerk sync metadata
    clerk_synced_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- User permissions for granular access control
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_key VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    granted_by TEXT REFERENCES users(id),
    granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, permission_key, resource_type, resource_id)
);

-- ============================================================================
-- AI AGENT SYSTEM & TOOLS
-- ============================================================================

-- Available AI tools registry
CREATE TABLE ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category tool_category NOT NULL,
    keywords TEXT[],
    allowed_roles user_role[] NOT NULL,
    mcp_server VARCHAR(100) NOT NULL,
    function_name VARCHAR(100) NOT NULL,
    input_schema JSONB NOT NULL,
    output_schema JSONB,
    estimated_execution_time INTEGER,
    cost_tier VARCHAR(20) DEFAULT 'low',
    usage_limit_per_day INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Tool execution history
CREATE TABLE tool_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    tool_id UUID NOT NULL REFERENCES ai_tools(id),
    input_data JSONB NOT NULL,
    output_data JSONB,
    execution_status VARCHAR(20) DEFAULT 'pending',
    error_message TEXT,
    execution_time_ms INTEGER,
    cost_estimate DECIMAL(10,4) DEFAULT 0.0000,
    ai_model_used VARCHAR(50),
    confidence_score DECIMAL(3,2),
    selection_method VARCHAR(20),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Agent configurations for custom workflows
CREATE TABLE agent_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    created_by TEXT NOT NULL REFERENCES users(id),
    tool_chain UUID[] NOT NULL,
    prompt_template TEXT,
    context_settings JSONB DEFAULT '{}',
    access_permissions JSONB DEFAULT '{}',
    is_public BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- GOOGLE WORKSPACE INTEGRATION
-- ============================================================================

-- Google API connection status
CREATE TABLE google_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL REFERENCES users(id),
    service_type VARCHAR(50) NOT NULL,
    access_token_hash VARCHAR(255),
    refresh_token_hash VARCHAR(255),
    token_expires_at TIMESTAMP WITH TIME ZONE,
    scopes TEXT[],
    connection_status VARCHAR(20) DEFAULT 'active',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, service_type)
);

-- ============================================================================
-- ANALYTICS & REPORTING
-- ============================================================================

-- System usage analytics
CREATE TABLE usage_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Daily usage summaries for cost tracking
CREATE TABLE daily_usage_summary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usage_date DATE NOT NULL,
    user_id TEXT REFERENCES users(id),
    tool_executions INTEGER DEFAULT 0,
    ai_api_calls INTEGER DEFAULT 0,
    estimated_cost DECIMAL(10,4) DEFAULT 0.0000,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(usage_date, user_id)
);

-- ============================================================================
-- SYSTEM CONFIGURATION & SETTINGS
-- ============================================================================

-- System-wide configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key VARCHAR(100) NOT NULL UNIQUE,
    config_value JSONB NOT NULL,
    description TEXT,
    is_sensitive BOOLEAN DEFAULT false,
    updated_by TEXT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- API quota and rate limiting
CREATE TABLE api_quotas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id),
    api_service VARCHAR(50) NOT NULL,
    quota_type VARCHAR(30) NOT NULL,
    quota_limit INTEGER NOT NULL,
    quota_used INTEGER DEFAULT 0,
    reset_date DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, api_service, quota_type)
);

-- ============================================================================
-- AUDIT LOGGING & COMPLIANCE
-- ============================================================================

-- Comprehensive audit trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    additional_info JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ============================================================================

-- User management indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_clerk_user_id ON users(clerk_user_id);

-- AI tools and execution indexes
CREATE INDEX idx_ai_tools_category ON ai_tools(category);
CREATE INDEX idx_ai_tools_keywords ON ai_tools USING GIN(keywords);
CREATE INDEX idx_tool_executions_user_id ON tool_executions(user_id);
CREATE INDEX idx_tool_executions_tool_id ON tool_executions(tool_id);
CREATE INDEX idx_tool_executions_created_at ON tool_executions(created_at);

-- Analytics indexes
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_timestamp ON usage_analytics(timestamp);
CREATE INDEX idx_daily_usage_summary_date ON daily_usage_summary(usage_date);

-- Audit and compliance indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);'''

    # Write the schema file
    with open('full_schema.sql', 'w', encoding='utf-8') as f:
        f.write(schema_content)
    
    print("✅ Fixed schema file created successfully!")
    print(f"📁 File: full_schema.sql")
    print(f"📊 Size: {len(schema_content)} characters")

if __name__ == "__main__":
    create_fixed_schema()