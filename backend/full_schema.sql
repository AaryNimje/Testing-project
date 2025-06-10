-- =====================================================
-- Academic AI Platform - Complete Database Schema v2.0
-- =====================================================
-- Native authentication, AI prompt templating, Google Workspace integration,
-- and LangChain conversation history support

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "vector";

-- =====================================================
-- ENUMS AND TYPES
-- =====================================================

CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'faculty', 'student', 'staff');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended', 'pending_verification');
CREATE TYPE auth_provider AS ENUM ('local', 'google', 'microsoft', 'github');
CREATE TYPE tool_category AS ENUM ('learning', 'teaching', 'assessment', 'administrative', 'communication', 'analytics');
CREATE TYPE conversation_role AS ENUM ('system', 'user', 'assistant', 'function', 'tool');
CREATE TYPE memory_type AS ENUM ('conversation_buffer', 'summary', 'knowledge_graph', 'entity', 'vectorstore');
CREATE TYPE google_service AS ENUM ('drive', 'sheets', 'docs', 'slides', 'calendar', 'gmail', 'meet', 'forms', 'classroom');
CREATE TYPE prompt_category AS ENUM ('system', 'tool', 'user', 'agent', 'workflow', 'evaluation');

-- =====================================================
-- NATIVE AUTHENTICATION SYSTEM
-- =====================================================

-- Core users table with native auth
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For local auth
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(200),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'student',
    status user_status DEFAULT 'pending_verification',
    
    -- Authentication fields
    auth_provider auth_provider DEFAULT 'local',
    oauth_provider_id VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret VARCHAR(255),
    
    -- Session management
    last_login_at TIMESTAMP,
    last_activity_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    
    -- Preferences
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(20) DEFAULT 'dark',
    notification_preferences JSONB DEFAULT '{}',
    
    -- Metadata
    institution_id UUID,
    department_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth connections for multiple providers
CREATE TABLE oauth_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider auth_provider NOT NULL,
    provider_user_id VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    profile_data JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, provider_user_id)
);

-- Active sessions tracking
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    revoked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- AI PROMPT TEMPLATING SYSTEM
-- =====================================================

-- Prompt templates library
CREATE TABLE prompt_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    category prompt_category NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    template_content TEXT NOT NULL,
    variables JSONB DEFAULT '[]', -- Array of {name, type, description, required, default}
    metadata JSONB DEFAULT '{}',
    
    -- Versioning
    version INTEGER DEFAULT 1,
    parent_id UUID REFERENCES prompt_templates(id),
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Access control
    visibility VARCHAR(20) DEFAULT 'private' CHECK (visibility IN ('private', 'institution', 'public')),
    created_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Usage tracking
    usage_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent-specific prompts
CREATE TABLE agent_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(100) NOT NULL UNIQUE,
    system_prompt TEXT NOT NULL,
    instruction_prompt TEXT,
    context_prompt TEXT,
    output_format_prompt TEXT,
    
    -- Model preferences
    preferred_model VARCHAR(50),
    temperature DECIMAL(3,2) DEFAULT 0.7,
    max_tokens INTEGER DEFAULT 2048,
    top_p DECIMAL(3,2) DEFAULT 0.9,
    
    -- Behavior settings
    personality_traits JSONB DEFAULT '{}',
    knowledge_domains TEXT[],
    response_style VARCHAR(50),
    
    -- Chain of thought settings
    use_chain_of_thought BOOLEAN DEFAULT TRUE,
    reasoning_steps_prompt TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User custom prompts
CREATE TABLE user_prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    prompt_content TEXT NOT NULL,
    based_on_template UUID REFERENCES prompt_templates(id),
    
    -- Organization
    folder VARCHAR(100),
    tags TEXT[],
    is_favorite BOOLEAN DEFAULT FALSE,
    
    -- Sharing
    is_shared BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    shared_with_roles user_role[],
    
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompt execution history
CREATE TABLE prompt_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    prompt_template_id UUID REFERENCES prompt_templates(id),
    user_prompt_id UUID REFERENCES user_prompts(id),
    
    -- Execution details
    final_prompt TEXT NOT NULL,
    variables_used JSONB DEFAULT '{}',
    model_used VARCHAR(50),
    
    -- Results
    response TEXT,
    tokens_used INTEGER,
    execution_time_ms INTEGER,
    cost DECIMAL(10,6),
    
    -- Feedback
    user_rating INTEGER CHECK (user_rating BETWEEN 1 AND 5),
    user_feedback TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- LANGCHAIN CONVERSATION HISTORY
-- =====================================================

-- Conversations (chat sessions)
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    
    -- Context
    context_type VARCHAR(50), -- 'general', 'course', 'assignment', etc.
    context_id UUID,
    
    -- Memory configuration
    memory_type memory_type DEFAULT 'conversation_buffer',
    memory_config JSONB DEFAULT '{}',
    
    -- State
    is_active BOOLEAN DEFAULT TRUE,
    last_message_at TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    
    -- Metadata
    tags TEXT[],
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversation messages (LangChain compatible)
CREATE TABLE conversation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role conversation_role NOT NULL,
    content TEXT NOT NULL,
    
    -- LangChain specific fields
    additional_kwargs JSONB DEFAULT '{}',
    example BOOLEAN DEFAULT FALSE,
    
    -- For function/tool messages
    name VARCHAR(100),
    function_call JSONB,
    tool_call_id VARCHAR(100),
    
    -- Token tracking
    tokens INTEGER,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ordering
    sequence_number INTEGER NOT NULL
);

-- Conversation summaries (for summary memory)
CREATE TABLE conversation_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    summary TEXT NOT NULL,
    message_range_start INTEGER NOT NULL,
    message_range_end INTEGER NOT NULL,
    tokens_summarized INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Entity memories (for entity memory)
CREATE TABLE entity_memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    entity_name VARCHAR(200) NOT NULL,
    entity_type VARCHAR(50),
    memories TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(conversation_id, entity_name)
);

-- Vector embeddings for semantic search
CREATE TABLE conversation_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_id UUID REFERENCES conversation_messages(id) ON DELETE CASCADE,
    content_chunk TEXT NOT NULL,
    embedding vector(1536), -- OpenAI embeddings dimension
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Memory checkpoints for conversation replay
CREATE TABLE memory_checkpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    checkpoint_name VARCHAR(200),
    memory_state JSONB NOT NULL,
    message_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- GOOGLE WORKSPACE INTEGRATION
-- =====================================================

-- Google service connections per user
CREATE TABLE google_workspace_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service google_service NOT NULL,
    
    -- OAuth tokens
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    
    -- Service-specific IDs
    google_user_id VARCHAR(255),
    google_email VARCHAR(255),
    
    -- Permissions
    scopes TEXT[],
    
    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50),
    error_message TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, service)
);

-- Google Drive integration
CREATE TABLE google_drive_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    google_file_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- File metadata
    name VARCHAR(500) NOT NULL,
    mime_type VARCHAR(200),
    size_bytes BIGINT,
    
    -- Location
    parent_folder_id VARCHAR(255),
    path TEXT,
    
    -- URLs
    web_view_link TEXT,
    web_content_link TEXT,
    thumbnail_link TEXT,
    
    -- Permissions
    owner_email VARCHAR(255),
    shared_with JSONB DEFAULT '[]',
    permissions JSONB DEFAULT '{}',
    
    -- Academic context
    course_id UUID,
    assignment_id UUID,
    
    -- Sync status
    last_modified TIMESTAMP,
    last_synced TIMESTAMP,
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Sheets integration
CREATE TABLE google_sheets_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    spreadsheet_id VARCHAR(255) NOT NULL,
    sheet_name VARCHAR(255) NOT NULL,
    
    -- Data cache
    data_snapshot JSONB,
    formulas JSONB DEFAULT '{}',
    formatting JSONB DEFAULT '{}',
    
    -- Range tracking
    last_edited_range VARCHAR(50),
    
    -- Academic use
    purpose VARCHAR(100), -- 'gradebook', 'attendance', 'analytics', etc.
    linked_course_id UUID,
    
    -- Sync
    last_synced TIMESTAMP,
    auto_sync_enabled BOOLEAN DEFAULT FALSE,
    sync_frequency_minutes INTEGER DEFAULT 60,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, spreadsheet_id, sheet_name)
);

-- Google Calendar integration
CREATE TABLE google_calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255) UNIQUE NOT NULL,
    calendar_id VARCHAR(255) NOT NULL,
    
    -- Event details
    title VARCHAR(500) NOT NULL,
    description TEXT,
    location TEXT,
    
    -- Time
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    all_day BOOLEAN DEFAULT FALSE,
    timezone VARCHAR(50),
    
    -- Recurrence
    recurrence_rule TEXT,
    recurring_event_id VARCHAR(255),
    
    -- Attendees
    organizer_email VARCHAR(255),
    attendees JSONB DEFAULT '[]',
    
    -- Academic context
    event_type VARCHAR(50), -- 'class', 'meeting', 'office_hours', 'exam', etc.
    course_id UUID,
    
    -- Meeting info
    meet_link TEXT,
    
    -- Status
    status VARCHAR(50),
    
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Docs integration
CREATE TABLE google_docs_content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    document_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Document info
    title VARCHAR(500) NOT NULL,
    
    -- Content cache
    content_text TEXT,
    content_html TEXT,
    outline JSONB DEFAULT '{}',
    
    -- Collaboration
    last_editor_email VARCHAR(255),
    revision_id VARCHAR(100),
    comments JSONB DEFAULT '[]',
    suggestions JSONB DEFAULT '[]',
    
    -- Academic use
    document_type VARCHAR(50), -- 'syllabus', 'lesson_plan', 'assignment', etc.
    course_id UUID,
    
    -- AI enhancement tracking
    ai_suggestions_applied JSONB DEFAULT '[]',
    
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Slides integration
CREATE TABLE google_slides_presentations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    presentation_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Presentation info
    title VARCHAR(500) NOT NULL,
    slide_count INTEGER,
    
    -- Slides data
    slides JSONB DEFAULT '[]', -- Array of slide metadata
    
    -- Templates
    template_used VARCHAR(100),
    theme JSONB DEFAULT '{}',
    
    -- Academic use
    presentation_type VARCHAR(50), -- 'lecture', 'student_project', etc.
    course_id UUID,
    lesson_id UUID,
    
    -- AI features used
    ai_generated_slides JSONB DEFAULT '[]',
    
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Forms integration
CREATE TABLE google_forms_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    form_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Form metadata
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Questions
    questions JSONB NOT NULL DEFAULT '[]',
    
    -- Responses
    response_count INTEGER DEFAULT 0,
    responses_spreadsheet_id VARCHAR(255),
    
    -- Academic use
    form_type VARCHAR(50), -- 'quiz', 'survey', 'feedback', etc.
    course_id UUID,
    assignment_id UUID,
    
    -- Settings
    accepting_responses BOOLEAN DEFAULT TRUE,
    require_sign_in BOOLEAN DEFAULT TRUE,
    collect_email BOOLEAN DEFAULT TRUE,
    
    last_synced TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gmail integration
CREATE TABLE gmail_contexts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Email templates
    templates JSONB DEFAULT '[]',
    
    -- Labels for academic organization
    academic_labels JSONB DEFAULT '{}',
    
    -- Auto-responses
    auto_response_rules JSONB DEFAULT '[]',
    
    -- Draft management
    draft_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Google Classroom integration
CREATE TABLE google_classroom_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    classroom_course_id VARCHAR(255) UNIQUE NOT NULL,
    
    -- Course info
    name VARCHAR(255) NOT NULL,
    section VARCHAR(100),
    description TEXT,
    room VARCHAR(100),
    
    -- Enrollment
    enrollment_code VARCHAR(20),
    course_state VARCHAR(50),
    
    -- Links
    alternate_link TEXT,
    
    -- Local mapping
    local_course_id UUID,
    
    -- Sync status
    last_synced TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ACADEMIC STRUCTURE (ENHANCED)
-- =====================================================

-- Institutions
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('university', 'college', 'school', 'institute')),
    
    -- Details
    logo_url TEXT,
    website VARCHAR(255),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    
    -- Contact
    email_domain VARCHAR(255),
    main_phone VARCHAR(20),
    address JSONB DEFAULT '{}',
    
    -- Settings
    timezone VARCHAR(50) DEFAULT 'UTC',
    academic_year_start VARCHAR(5), -- MM-DD format
    grading_scale JSONB DEFAULT '{}',
    
    -- Features
    features_enabled JSONB DEFAULT '{}',
    google_workspace_domain VARCHAR(255),
    
    -- Subscription
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    subscription_expires_at TIMESTAMP,
    
    -- AI settings
    ai_budget_daily DECIMAL(10,2) DEFAULT 5.00,
    ai_budget_monthly DECIMAL(10,2) DEFAULT 150.00,
    
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    
    -- Leadership
    head_user_id UUID REFERENCES users(id),
    assistant_head_ids UUID[],
    
    -- Hierarchy
    parent_department_id UUID REFERENCES departments(id),
    
    -- Resources
    budget_allocation DECIMAL(12, 2),
    
    -- Contact
    email VARCHAR(255),
    phone VARCHAR(20),
    office_location JSONB DEFAULT '{}',
    office_hours JSONB DEFAULT '{}',
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(institution_id, code)
);

-- Academic periods
CREATE TABLE academic_periods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('year', 'semester', 'quarter', 'trimester', 'term', 'summer')),
    
    -- Dates
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Important dates
    registration_start DATE,
    registration_end DATE,
    add_drop_deadline DATE,
    withdrawal_deadline DATE,
    grade_submission_deadline DATE,
    
    -- Breaks
    breaks JSONB DEFAULT '[]', -- Array of {name, start_date, end_date}
    
    is_current BOOLEAN DEFAULT FALSE,
    is_registration_open BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id),
    
    -- Basic info
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Academic details
    credits INTEGER NOT NULL,
    contact_hours INTEGER,
    level VARCHAR(50) CHECK (level IN ('undergraduate', 'graduate', 'doctoral', 'certificate', 'non-credit')),
    
    -- Prerequisites
    prerequisites JSONB DEFAULT '[]',
    corequisites JSONB DEFAULT '[]',
    
    -- Learning
    learning_objectives JSONB DEFAULT '[]',
    competencies JSONB DEFAULT '[]',
    
    -- Resources
    textbooks JSONB DEFAULT '[]',
    materials JSONB DEFAULT '[]',
    
    -- Templates
    syllabus_template_id UUID,
    
    -- Settings
    max_enrollment INTEGER,
    min_enrollment INTEGER,
    waitlist_enabled BOOLEAN DEFAULT TRUE,
    
    -- AI features
    ai_tools_enabled BOOLEAN DEFAULT TRUE,
    ai_tool_whitelist UUID[],
    
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(institution_id, code)
);

-- Course sections
CREATE TABLE course_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_period_id UUID NOT NULL REFERENCES academic_periods(id),
    section_number VARCHAR(20) NOT NULL,
    
    -- Instructor
    primary_instructor_id UUID NOT NULL REFERENCES users(id),
    co_instructors UUID[] DEFAULT '{}',
    teaching_assistants UUID[] DEFAULT '{}',
    
    -- Schedule
    schedule JSONB NOT NULL, -- Array of {day, start_time, end_time, room}
    
    -- Location
    delivery_mode VARCHAR(50) CHECK (delivery_mode IN ('in-person', 'online', 'hybrid', 'hyflex')),
    room_id UUID,
    online_meeting_url TEXT,
    
    -- Enrollment
    capacity INTEGER NOT NULL,
    enrolled_count INTEGER DEFAULT 0,
    waitlist_capacity INTEGER DEFAULT 10,
    waitlist_count INTEGER DEFAULT 0,
    
    -- Course materials
    syllabus_url TEXT,
    google_classroom_id VARCHAR(255),
    
    -- Settings
    settings JSONB DEFAULT '{}',
    
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(course_id, academic_period_id, section_number)
);

-- Student enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES users(id),
    course_section_id UUID NOT NULL REFERENCES course_sections(id),
    
    -- Status
    enrollment_status VARCHAR(50) DEFAULT 'enrolled' 
        CHECK (enrollment_status IN ('enrolled', 'waitlisted', 'dropped', 'withdrawn', 'completed', 'incomplete', 'auditing')),
    
    -- Dates
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_changed_at TIMESTAMP,
    
    -- Grading
    grading_basis VARCHAR(50) DEFAULT 'letter' CHECK (grading_basis IN ('letter', 'pass/fail', 'audit')),
    midterm_grade VARCHAR(10),
    final_grade VARCHAR(10),
    grade_points DECIMAL(3, 2),
    credits_earned DECIMAL(3, 1),
    
    -- Performance
    attendance_rate DECIMAL(5, 2),
    participation_score DECIMAL(5, 2),
    
    -- Notes
    instructor_notes TEXT,
    advisor_notes TEXT,
    
    -- Accommodations
    accommodations JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(student_id, course_section_id)
);

-- =====================================================
-- AI TOOLS & AGENTS (ENHANCED)
-- =====================================================

-- AI tools registry
CREATE TABLE ai_tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    category tool_category NOT NULL,
    
    -- Access
    allowed_roles user_role[] NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Implementation
    implementation_type VARCHAR(50) DEFAULT 'langchain', -- 'langchain', 'custom', 'external_api'
    endpoint_url TEXT,
    
    -- Configuration
    default_model VARCHAR(50),
    model_settings JSONB DEFAULT '{}',
    
    -- Prompts
    system_prompt_template_id UUID REFERENCES prompt_templates(id),
    user_prompt_template_id UUID REFERENCES prompt_templates(id),
    
    -- Cost
    estimated_tokens_per_use INTEGER,
    cost_per_use DECIMAL(10,6),
    daily_limit_per_user INTEGER,
    
    -- Metadata
    tags TEXT[],
    documentation_url TEXT,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI agents (complex multi-tool workflows)
CREATE TABLE ai_agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    
    -- Configuration
    agent_type VARCHAR(50) DEFAULT 'conversational', -- 'conversational', 'task', 'autonomous'
    
    -- Tools
    available_tools UUID[] NOT NULL, -- References to ai_tools
    tool_selection_strategy VARCHAR(50) DEFAULT 'auto', -- 'auto', 'manual', 'chain'
    
    -- Prompts
    system_prompt_id UUID REFERENCES agent_prompts(id),
    
    -- Memory
    memory_type memory_type DEFAULT 'conversation_buffer',
    memory_config JSONB DEFAULT '{}',
    
    -- Behavior
    max_iterations INTEGER DEFAULT 10,
    early_stopping BOOLEAN DEFAULT TRUE,
    
    -- Access
    allowed_roles user_role[] NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tool/Agent usage tracking
CREATE TABLE ai_usage_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- What was used
    tool_id UUID REFERENCES ai_tools(id),
    agent_id UUID REFERENCES ai_agents(id),
    
    -- Execution details
    conversation_id UUID REFERENCES conversations(id),
    input_data JSONB NOT NULL,
    output_data JSONB,
    
    -- Performance
    execution_time_ms INTEGER,
    total_tokens INTEGER,
    prompt_tokens INTEGER,
    completion_tokens INTEGER,
    
    -- Cost
    model_used VARCHAR(50),
    cost DECIMAL(10,6),
    
    -- Status
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    
    -- Chain tracking (for multi-step processes)
    parent_execution_id UUID REFERENCES ai_usage_logs(id),
    execution_order INTEGER,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI cost tracking
CREATE TABLE ai_budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('user', 'department', 'institution')),
    entity_id UUID NOT NULL,
    
    -- Limits
    daily_limit DECIMAL(10,2) DEFAULT 5.00,
    monthly_limit DECIMAL(10,2) DEFAULT 150.00,
    
    -- Current usage
    daily_usage DECIMAL(10,2) DEFAULT 0.00,
    monthly_usage DECIMAL(10,2) DEFAULT 0.00,
    
    -- Reset tracking
    daily_reset_at DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_reset_at DATE NOT NULL DEFAULT DATE_TRUNC('month', CURRENT_DATE)::DATE,
    
    -- Alerts
    alert_at_percentage INTEGER DEFAULT 80,
    alerts_sent JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(entity_type, entity_id)
);

-- =====================================================
-- ASSIGNMENTS & ASSESSMENTS
-- =====================================================

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    
    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    -- Type and category
    type VARCHAR(50) CHECK (type IN ('homework', 'quiz', 'exam', 'project', 'paper', 'presentation', 'lab', 'discussion', 'participation')),
    category VARCHAR(100),
    
    -- Files
    attachment_urls TEXT[],
    resource_links JSONB DEFAULT '[]',
    
    -- Grading
    points_possible DECIMAL(8,2) NOT NULL,
    grading_type VARCHAR(50) DEFAULT 'points', -- 'points', 'percentage', 'letter', 'pass/fail'
    weight DECIMAL(5,2), -- Percentage of final grade
    
    -- Rubric
    rubric_id UUID,
    
    -- Dates
    available_from TIMESTAMP,
    due_date TIMESTAMP NOT NULL,
    lock_at TIMESTAMP,
    
    -- Submission settings
    submission_types TEXT[] DEFAULT '{online_text,online_upload}',
    allowed_file_extensions TEXT[],
    max_file_size_mb INTEGER DEFAULT 50,
    attempt_limit INTEGER DEFAULT 1,
    
    -- Late policy
    accept_late BOOLEAN DEFAULT TRUE,
    late_penalty_percent DECIMAL(5,2) DEFAULT 10,
    late_penalty_interval VARCHAR(20) DEFAULT 'day', -- 'hour', 'day'
    
    -- Group work
    is_group_assignment BOOLEAN DEFAULT FALSE,
    group_category_id UUID,
    
    -- AI policy
    ai_tools_allowed BOOLEAN DEFAULT TRUE,
    ai_citation_required BOOLEAN DEFAULT TRUE,
    turnitin_enabled BOOLEAN DEFAULT FALSE,
    
    -- Google integration
    google_classroom_assignment_id VARCHAR(255),
    
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rubrics
CREATE TABLE rubrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Ownership
    created_by UUID NOT NULL REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    
    -- Sharing
    is_template BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    
    -- Structure
    criteria JSONB NOT NULL, -- Array of criteria with levels
    points_possible DECIMAL(8,2),
    
    -- Usage
    usage_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id),
    
    -- Group submission
    group_id UUID,
    submitted_for_group BOOLEAN DEFAULT FALSE,
    
    -- Attempt tracking
    attempt_number INTEGER DEFAULT 1,
    
    -- Content
    submission_type VARCHAR(50) NOT NULL,
    text_content TEXT,
    file_urls TEXT[],
    url_submission TEXT,
    
    -- Google Drive integration
    google_drive_file_ids TEXT[],
    
    -- Timestamps
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_late BOOLEAN DEFAULT FALSE,
    seconds_late INTEGER DEFAULT 0,
    
    -- AI usage disclosure
    ai_tools_used TEXT[],
    ai_usage_description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'grading', 'graded', 'returned')),
    
    -- Turnitin
    turnitin_score DECIMAL(5,2),
    turnitin_report_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(assignment_id, student_id, attempt_number)
);

-- Grades
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    grader_id UUID NOT NULL REFERENCES users(id),
    
    -- Score
    points_earned DECIMAL(8,2),
    percentage DECIMAL(5,2),
    letter_grade VARCHAR(10),
    
    -- Rubric scoring
    rubric_id UUID REFERENCES rubrics(id),
    rubric_scores JSONB DEFAULT '{}',
    
    -- Feedback
    overall_feedback TEXT,
    inline_feedback JSONB DEFAULT '{}', -- Feedback on specific parts
    audio_feedback_url TEXT,
    
    -- Status
    is_final BOOLEAN DEFAULT FALSE,
    grade_posted_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNICATION & COLLABORATION
-- =====================================================

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Participants
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_ids UUID[] NOT NULL,
    
    -- Content
    subject VARCHAR(255),
    body TEXT NOT NULL,
    
    -- Attachments
    attachment_urls TEXT[],
    
    -- Threading
    thread_id UUID,
    reply_to_id UUID REFERENCES messages(id),
    
    -- Status
    is_announcement BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Read tracking
    read_by JSONB DEFAULT '{}', -- {user_id: timestamp}
    
    -- Context
    context_type VARCHAR(50), -- 'course', 'assignment', etc.
    context_id UUID,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES users(id),
    
    -- Content
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Target audience
    audience_type VARCHAR(50) NOT NULL CHECK (audience_type IN ('all', 'institution', 'department', 'course', 'role')),
    audience_id UUID,
    audience_roles user_role[],
    
    -- Display settings
    priority VARCHAR(20) DEFAULT 'normal',
    is_pinned BOOLEAN DEFAULT FALSE,
    show_until TIMESTAMP,
    
    -- Acknowledgment
    requires_acknowledgment BOOLEAN DEFAULT FALSE,
    acknowledged_by JSONB DEFAULT '{}', -- {user_id: timestamp}
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discussion forums
CREATE TABLE discussion_forums (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    
    -- Basic info
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Settings
    is_announcement_only BOOLEAN DEFAULT FALSE,
    require_initial_post BOOLEAN DEFAULT FALSE,
    allow_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Grading
    is_graded BOOLEAN DEFAULT FALSE,
    points_possible DECIMAL(8,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discussion posts
CREATE TABLE discussion_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    forum_id UUID NOT NULL REFERENCES discussion_forums(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    
    -- Threading
    parent_post_id UUID REFERENCES discussion_posts(id),
    thread_id UUID,
    
    -- Content
    title VARCHAR(255),
    content TEXT NOT NULL,
    
    -- Anonymous posting
    is_anonymous BOOLEAN DEFAULT FALSE,
    
    -- Reactions
    likes INTEGER DEFAULT 0,
    liked_by UUID[] DEFAULT '{}',
    
    -- AI enhancement
    ai_suggested_responses JSONB DEFAULT '[]',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Learning analytics events
CREATE TABLE learning_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Event details
    event_type VARCHAR(100) NOT NULL,
    event_category VARCHAR(50),
    
    -- Context
    course_id UUID,
    assignment_id UUID,
    resource_id UUID,
    
    -- Data
    event_data JSONB DEFAULT '{}',
    
    -- Time tracking
    duration_seconds INTEGER,
    
    -- Device/platform
    platform VARCHAR(50),
    device_type VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Entity
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    
    -- Metric
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12,4) NOT NULL,
    
    -- Time period
    period_type VARCHAR(20) NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'semester')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Comparison
    previous_value DECIMAL(12,4),
    target_value DECIMAL(12,4),
    
    -- Metadata
    breakdown JSONB DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(entity_type, entity_id, metric_name, period_type, period_start)
);

-- Custom reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Ownership
    created_by UUID NOT NULL REFERENCES users(id),
    institution_id UUID REFERENCES institutions(id),
    
    -- Configuration
    report_type VARCHAR(50) NOT NULL,
    data_source VARCHAR(100) NOT NULL,
    filters JSONB DEFAULT '{}',
    columns JSONB DEFAULT '[]',
    
    -- Visualization
    chart_type VARCHAR(50),
    chart_config JSONB DEFAULT '{}',
    
    -- Scheduling
    is_scheduled BOOLEAN DEFAULT FALSE,
    schedule_config JSONB DEFAULT '{}',
    recipients UUID[] DEFAULT '{}',
    
    -- Sharing
    is_public BOOLEAN DEFAULT FALSE,
    shared_with_roles user_role[],
    
    -- Execution
    last_run_at TIMESTAMP,
    last_run_by UUID REFERENCES users(id),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- WORKFLOW AUTOMATION
-- =====================================================

-- Workflow templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    
    -- Trigger
    trigger_type VARCHAR(50) NOT NULL CHECK (trigger_type IN ('manual', 'scheduled', 'event', 'webhook')),
    trigger_config JSONB NOT NULL,
    
    -- Steps
    workflow_definition JSONB NOT NULL, -- Workflow steps in JSON format
    
    -- Variables
    input_variables JSONB DEFAULT '[]',
    
    -- Access
    allowed_roles user_role[] DEFAULT '{}',
    requires_approval BOOLEAN DEFAULT FALSE,
    
    -- Usage
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID NOT NULL REFERENCES workflow_templates(id),
    triggered_by UUID REFERENCES users(id),
    
    -- Input
    input_data JSONB DEFAULT '{}',
    
    -- Execution
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('pending', 'running', 'paused', 'completed', 'failed', 'cancelled')),
    current_step INTEGER DEFAULT 0,
    
    -- State
    workflow_state JSONB DEFAULT '{}',
    step_results JSONB DEFAULT '[]',
    
    -- Error handling
    error_message TEXT,
    error_step INTEGER,
    
    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RESOURCE MANAGEMENT
-- =====================================================

-- Physical resources
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    
    -- Basic info
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('room', 'equipment', 'vehicle', 'software_license')),
    
    -- Details
    description TEXT,
    capacity INTEGER,
    features JSONB DEFAULT '[]',
    
    -- Location
    building VARCHAR(100),
    floor VARCHAR(20),
    room_number VARCHAR(50),
    
    -- Availability
    available_hours JSONB DEFAULT '{}',
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_roles user_role[] DEFAULT '{}',
    
    -- Maintenance
    maintenance_schedule JSONB DEFAULT '{}',
    
    status VARCHAR(50) DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource bookings
CREATE TABLE resource_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id),
    booked_by UUID NOT NULL REFERENCES users(id),
    
    -- Booking details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Time
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    
    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    recurrence_end DATE,
    
    -- Participants
    attendee_count INTEGER,
    attendee_ids UUID[] DEFAULT '{}',
    
    -- Approval
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    
    -- Context
    course_section_id UUID REFERENCES course_sections(id),
    event_type VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ATTENDANCE TRACKING
-- =====================================================

-- Attendance records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id),
    student_id UUID NOT NULL REFERENCES users(id),
    class_date DATE NOT NULL,
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused', 'remote')),
    
    -- Time tracking
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    minutes_late INTEGER DEFAULT 0,
    
    -- Location
    check_in_method VARCHAR(50), -- 'manual', 'qr_code', 'geolocation', 'zoom'
    location_verified BOOLEAN DEFAULT FALSE,
    
    -- Notes
    instructor_notes TEXT,
    excuse_reason TEXT,
    excuse_documentation_url TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(course_section_id, student_id, class_date)
);

-- =====================================================
-- SECURITY & COMPLIANCE
-- =====================================================

-- Audit logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    -- Action
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    
    -- Details
    changes JSONB DEFAULT '{}',
    
    -- Request info
    ip_address INET,
    user_agent TEXT,
    
    -- Compliance
    compliance_tags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data privacy consents
CREATE TABLE privacy_consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    
    -- Consent details
    consent_type VARCHAR(100) NOT NULL,
    consent_version VARCHAR(20) NOT NULL,
    
    -- Status
    consented BOOLEAN NOT NULL,
    
    -- Metadata
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, consent_type)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_institution ON users(institution_id);
CREATE INDEX idx_users_status ON users(status);

-- Authentication indexes
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);

-- Conversation indexes
CREATE INDEX idx_conversations_user ON conversations(user_id);
CREATE INDEX idx_messages_conversation ON conversation_messages(conversation_id);
CREATE INDEX idx_messages_sequence ON conversation_messages(conversation_id, sequence_number);
CREATE INDEX idx_embeddings_conversation ON conversation_embeddings(conversation_id);

-- Google Workspace indexes
CREATE INDEX idx_google_connections_user ON google_workspace_connections(user_id);
CREATE INDEX idx_google_drive_user ON google_drive_files(user_id);
CREATE INDEX idx_google_drive_file ON google_drive_files(google_file_id);
CREATE INDEX idx_google_calendar_user ON google_calendar_events(user_id);
CREATE INDEX idx_google_calendar_event ON google_calendar_events(google_event_id);

-- Academic indexes
CREATE INDEX idx_courses_dept ON courses(department_id);
CREATE INDEX idx_sections_course ON course_sections(course_id);
CREATE INDEX idx_sections_period ON course_sections(academic_period_id);
CREATE INDEX idx_sections_instructor ON course_sections(primary_instructor_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(course_section_id);

-- AI usage indexes
CREATE INDEX idx_ai_usage_user ON ai_usage_logs(user_id);
CREATE INDEX idx_ai_usage_created ON ai_usage_logs(created_at);
CREATE INDEX idx_ai_usage_conversation ON ai_usage_logs(conversation_id);
CREATE INDEX idx_ai_budgets_entity ON ai_budgets(entity_type, entity_id);

-- Assignment indexes
CREATE INDEX idx_assignments_section ON assignments(course_section_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_grades_submission ON grades(submission_id);

-- Communication indexes
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_announcements_audience ON announcements(audience_type, audience_id);

-- Analytics indexes
CREATE INDEX idx_analytics_events_user ON learning_analytics_events(user_id);
CREATE INDEX idx_analytics_events_created ON learning_analytics_events(created_at);
CREATE INDEX idx_metrics_entity ON performance_metrics(entity_type, entity_id);
CREATE INDEX idx_metrics_period ON performance_metrics(period_start, period_end);

-- Audit indexes
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS update_%I_updated_at ON %I', t, t);
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- Enrollment count trigger
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.enrollment_status = 'enrolled' THEN
        UPDATE course_sections 
        SET enrolled_count = enrolled_count + 1 
        WHERE id = NEW.course_section_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.enrollment_status = 'enrolled' AND NEW.enrollment_status != 'enrolled' THEN
        UPDATE course_sections 
        SET enrolled_count = enrolled_count - 1 
        WHERE id = NEW.course_section_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.enrollment_status != 'enrolled' AND NEW.enrollment_status = 'enrolled' THEN
        UPDATE course_sections 
        SET enrolled_count = enrolled_count + 1 
        WHERE id = NEW.course_section_id;
    ELSIF TG_OP = 'DELETE' AND OLD.enrollment_status = 'enrolled' THEN
        UPDATE course_sections 
        SET enrolled_count = enrolled_count - 1 
        WHERE id = OLD.course_section_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_enrollment_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON enrollments
FOR EACH ROW EXECUTE FUNCTION update_enrollment_count();

-- AI budget tracking trigger
CREATE OR REPLACE FUNCTION track_ai_budget()
RETURNS TRIGGER AS $$
DECLARE
    current_daily_usage DECIMAL(10,2);
    current_monthly_usage DECIMAL(10,2);
    budget_record ai_budgets%ROWTYPE;
BEGIN
    -- Get or create budget record for user
    SELECT * INTO budget_record 
    FROM ai_budgets 
    WHERE entity_type = 'user' AND entity_id = NEW.user_id;
    
    IF NOT FOUND THEN
        INSERT INTO ai_budgets (entity_type, entity_id)
        VALUES ('user', NEW.user_id)
        RETURNING * INTO budget_record;
    END IF;
    
    -- Check if we need to reset daily/monthly usage
    IF budget_record.daily_reset_at < CURRENT_DATE THEN
        UPDATE ai_budgets 
        SET daily_usage = 0, daily_reset_at = CURRENT_DATE
        WHERE id = budget_record.id;
        budget_record.daily_usage := 0;
    END IF;
    
    IF budget_record.monthly_reset_at < DATE_TRUNC('month', CURRENT_DATE)::DATE THEN
        UPDATE ai_budgets 
        SET monthly_usage = 0, monthly_reset_at = DATE_TRUNC('month', CURRENT_DATE)::DATE
        WHERE id = budget_record.id;
        budget_record.monthly_usage := 0;
    END IF;
    
    -- Update usage
    UPDATE ai_budgets 
    SET daily_usage = daily_usage + NEW.cost,
        monthly_usage = monthly_usage + NEW.cost
    WHERE id = budget_record.id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER track_ai_budget_trigger
AFTER INSERT ON ai_usage_logs
FOR EACH ROW 
WHEN (NEW.cost IS NOT NULL AND NEW.cost > 0)
EXECUTE FUNCTION track_ai_budget();

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Default institution
INSERT INTO institutions (id, name, short_name, type, email_domain, timezone, ai_budget_daily, ai_budget_monthly)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid,
    'Academic AI Demo University',
    'AADU',
    'university',
    'aadu.edu',
    'America/New_York',
    5.00,
    150.00
);

-- System prompt templates
INSERT INTO prompt_templates (name, category, template_content, variables, visibility)
VALUES 
(
    'lesson_plan_system',
    'system',
    'You are an expert educational curriculum designer. Create comprehensive, engaging lesson plans that align with learning objectives and standards. Include differentiation strategies and assessment methods.',
    '[]'::jsonb,
    'public'
),
(
    'ai_tutor_system',
    'system',
    'You are a patient, encouraging tutor. Help students understand concepts through clear explanations, examples, and guided practice. Never give direct answers; instead, lead students to discover solutions themselves.',
    '[]'::jsonb,
    'public'
),
(
    'grading_feedback_system',
    'system',
    'You are a constructive and supportive instructor providing feedback on student work. Focus on strengths, areas for improvement, and specific suggestions. Be encouraging while maintaining academic standards.',
    '[]'::jsonb,
    'public'
);

-- Default AI tools
INSERT INTO ai_tools (name, display_name, description, category, allowed_roles)
VALUES
-- Student tools
('ai_tutor', 'AI Tutor', '24/7 personalized tutoring assistance', 'learning', ARRAY['student']::user_role[]),
('study_guide_generator', 'Study Guide Generator', 'Create custom study materials', 'learning', ARRAY['student']::user_role[]),
('essay_assistant', 'Essay Writing Assistant', 'Help with essay structure and improvement', 'learning', ARRAY['student']::user_role[]),
('math_solver', 'Math Problem Solver', 'Step-by-step math problem solutions', 'learning', ARRAY['student']::user_role[]),

-- Faculty tools
('lesson_planner', 'Lesson Plan Generator', 'Create standards-aligned lesson plans', 'teaching', ARRAY['faculty']::user_role[]),
('quiz_creator', 'Quiz & Test Creator', 'Generate assessments with answer keys', 'assessment', ARRAY['faculty']::user_role[]),
('rubric_builder', 'Rubric Builder', 'Design detailed grading rubrics', 'assessment', ARRAY['faculty']::user_role[]),
('feedback_generator', 'Feedback Assistant', 'Generate personalized student feedback', 'assessment', ARRAY['faculty']::user_role[]),

-- Administrative tools
('report_generator', 'Report Generator', 'Create administrative reports', 'administrative', ARRAY['admin', 'staff']::user_role[]),
('email_composer', 'Email Composer', 'Draft professional communications', 'communication', ARRAY['admin', 'staff', 'faculty']::user_role[]),
('schedule_optimizer', 'Schedule Optimizer', 'Optimize class and resource scheduling', 'administrative', ARRAY['admin']::user_role[]),
('data_analyzer', 'Data Analyzer', 'Analyze institutional data and trends', 'analytics', ARRAY['admin', 'superadmin']::user_role[]);

-- Default agent prompts
INSERT INTO agent_prompts (agent_name, system_prompt, preferred_model, temperature)
VALUES
(
    'academic_assistant',
    'You are an intelligent academic assistant for an educational institution. Help users with their academic queries, provide guidance, and use available tools when appropriate. Always maintain a professional, supportive tone.',
    'gpt-4',
    0.7
),
(
    'admin_assistant',
    'You are an administrative assistant for educational institution management. Help with scheduling, reporting, data analysis, and institutional operations. Be precise and efficiency-focused.',
    'gpt-4',
    0.3
);

-- COMMENTS FOR DOCUMENTATION
COMMENT ON TABLE users IS 'Core user table with native authentication support';
COMMENT ON TABLE prompt_templates IS 'Library of reusable prompt templates for AI interactions';
COMMENT ON TABLE conversations IS 'LangChain-compatible conversation storage';
COMMENT ON TABLE google_workspace_connections IS 'OAuth connections for Google Workspace services';
COMMENT ON TABLE ai_agents IS 'Complex AI agents that can use multiple tools';
COMMENT ON TABLE ai_usage_logs IS 'Comprehensive tracking of all AI tool and agent usage';
COMMENT ON TABLE workflow_templates IS 'Automation templates for common academic workflows';

-- Grant necessary permissions (adjust based on your database users)
-- GRANT USAGE ON SCHEMA public TO web_user;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO web_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO web_user;