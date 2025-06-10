-- Academic AI Platform Complete Database Schema
-- Version: 1.0
-- Description: Comprehensive schema for multi-role academic platform with AI integration

-- =====================================================
-- CORE USER MANAGEMENT
-- =====================================================

-- Users table - Core authentication and profile
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE, -- Clerk authentication ID
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- For local auth fallback
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    display_name VARCHAR(200),
    phone VARCHAR(20),
    phone_verified BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    role VARCHAR(50) NOT NULL CHECK (role IN ('superadmin', 'admin', 'faculty', 'student', 'staff')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    last_login_at TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    preferred_language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(20) DEFAULT 'dark',
    notification_preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    updated_by UUID REFERENCES users(id)
);

-- User sessions for tracking active sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info JSONB,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions mapping
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(resource, action)
);

-- Role to permission mapping
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(50) NOT NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, permission_id)
);

-- User activity logs for audit trail
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_activity_user_id (user_id),
    INDEX idx_user_activity_created_at (created_at)
);

-- =====================================================
-- ACADEMIC STRUCTURE
-- =====================================================

-- Institutions (for multi-tenant support)
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    type VARCHAR(50) CHECK (type IN ('university', 'college', 'school', 'institute')),
    logo_url TEXT,
    website VARCHAR(255),
    email_domain VARCHAR(255),
    address JSONB,
    phone VARCHAR(20),
    accreditation_info JSONB,
    settings JSONB DEFAULT '{}',
    features_enabled JSONB DEFAULT '{}',
    subscription_tier VARCHAR(50) DEFAULT 'basic',
    api_limits JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    head_user_id UUID REFERENCES users(id),
    parent_department_id UUID REFERENCES departments(id),
    budget_allocation DECIMAL(12, 2),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    location JSONB,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

-- Academic years/semesters
CREATE TABLE academic_periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('year', 'semester', 'quarter', 'trimester', 'term')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE,
    registration_end DATE,
    add_drop_deadline DATE,
    withdrawal_deadline DATE,
    is_current BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id),
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    level VARCHAR(50) CHECK (level IN ('undergraduate', 'graduate', 'doctoral', 'certificate')),
    prerequisites JSONB DEFAULT '[]',
    corequisites JSONB DEFAULT '[]',
    learning_objectives JSONB DEFAULT '[]',
    syllabus_template TEXT,
    max_enrollment INTEGER,
    min_enrollment INTEGER,
    delivery_mode VARCHAR(50) CHECK (delivery_mode IN ('in-person', 'online', 'hybrid', 'asynchronous')),
    grading_scheme JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(institution_id, code)
);

-- Course sections (actual classes)
CREATE TABLE course_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_period_id UUID NOT NULL REFERENCES academic_periods(id),
    section_number VARCHAR(20) NOT NULL,
    faculty_id UUID NOT NULL REFERENCES users(id),
    assistant_faculty_ids UUID[] DEFAULT '{}',
    schedule JSONB NOT NULL, -- Days, times, duration
    location JSONB, -- Building, room, online URL
    capacity INTEGER NOT NULL,
    enrolled_count INTEGER DEFAULT 0,
    waitlist_capacity INTEGER DEFAULT 0,
    waitlist_count INTEGER DEFAULT 0,
    delivery_mode VARCHAR(50),
    syllabus_url TEXT,
    materials JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, academic_period_id, section_number)
);

-- Student enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    course_section_id UUID NOT NULL REFERENCES course_sections(id),
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrollment_status VARCHAR(50) DEFAULT 'enrolled' CHECK (enrollment_status IN ('enrolled', 'waitlisted', 'dropped', 'withdrawn', 'completed', 'incomplete')),
    grade VARCHAR(10),
    grade_points DECIMAL(3, 2),
    attendance_percentage DECIMAL(5, 2),
    participation_score DECIMAL(5, 2),
    mid_term_grade VARCHAR(10),
    final_grade VARCHAR(10),
    credits_earned DECIMAL(3, 1),
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_section_id)
);

-- =====================================================
-- AI TOOLS & FEATURES
-- =====================================================

-- AI tools registry
CREATE TABLE ai_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    description TEXT,
    icon VARCHAR(50),
    roles_allowed VARCHAR[] DEFAULT '{}',
    is_premium BOOLEAN DEFAULT FALSE,
    base_cost_per_use DECIMAL(10, 4) DEFAULT 0,
    average_tokens INTEGER,
    model_preferences JSONB DEFAULT '{}',
    input_schema JSONB NOT NULL,
    output_schema JSONB,
    examples JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    usage_limits JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI tool usage tracking
CREATE TABLE ai_tool_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tool_id UUID NOT NULL REFERENCES ai_tools(id),
    session_id UUID,
    input_tokens INTEGER,
    output_tokens INTEGER,
    total_tokens INTEGER,
    model_used VARCHAR(100),
    cost DECIMAL(10, 6),
    execution_time_ms INTEGER,
    status VARCHAR(50) DEFAULT 'success',
    error_message TEXT,
    input_data JSONB,
    output_data JSONB,
    feedback_rating INTEGER CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ai_usage_user_id (user_id),
    INDEX idx_ai_usage_created_at (created_at)
);

-- AI cost tracking and budgets
CREATE TABLE ai_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('system', 'institution', 'department', 'user')),
    entity_id UUID NOT NULL,
    daily_limit DECIMAL(10, 2) DEFAULT 5.00,
    monthly_limit DECIMAL(10, 2) DEFAULT 150.00,
    current_daily_usage DECIMAL(10, 2) DEFAULT 0,
    current_monthly_usage DECIMAL(10, 2) DEFAULT 0,
    last_reset_daily DATE,
    last_reset_monthly DATE,
    alerts_enabled BOOLEAN DEFAULT TRUE,
    alert_thresholds JSONB DEFAULT '{"daily": 0.8, "monthly": 0.8}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_type, entity_id)
);

-- AI generated content storage
CREATE TABLE ai_generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    tool_id UUID NOT NULL REFERENCES ai_tools(id),
    usage_id UUID REFERENCES ai_tool_usage(id),
    title VARCHAR(255),
    content_type VARCHAR(50),
    content TEXT,
    metadata JSONB DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    tags VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ai_content_user_id (user_id),
    INDEX idx_ai_content_created_at (created_at)
);

-- =====================================================
-- ASSIGNMENTS & ASSESSMENTS
-- =====================================================

-- Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('homework', 'quiz', 'exam', 'project', 'paper', 'presentation', 'lab', 'discussion')),
    instructions TEXT,
    attachments JSONB DEFAULT '[]',
    total_points DECIMAL(6, 2) NOT NULL,
    weight_percentage DECIMAL(5, 2),
    due_date TIMESTAMP NOT NULL,
    available_from TIMESTAMP,
    late_submission_allowed BOOLEAN DEFAULT TRUE,
    late_penalty JSONB DEFAULT '{}',
    submission_types VARCHAR[] DEFAULT '{"file", "text"}',
    max_attempts INTEGER DEFAULT 1,
    time_limit_minutes INTEGER,
    rubric_id UUID,
    peer_review_enabled BOOLEAN DEFAULT FALSE,
    peer_review_settings JSONB DEFAULT '{}',
    group_assignment BOOLEAN DEFAULT FALSE,
    group_settings JSONB DEFAULT '{}',
    ai_tools_allowed BOOLEAN DEFAULT TRUE,
    ai_usage_disclosure_required BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rubrics for grading
CREATE TABLE rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    is_template BOOLEAN DEFAULT FALSE,
    criteria JSONB NOT NULL, -- Array of criteria with levels and points
    total_points DECIMAL(6, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Student submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id),
    group_id UUID,
    attempt_number INTEGER DEFAULT 1,
    submission_type VARCHAR(50) NOT NULL,
    content TEXT,
    file_attachments JSONB DEFAULT '[]',
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_late BOOLEAN DEFAULT FALSE,
    late_days INTEGER DEFAULT 0,
    ai_tools_used JSONB DEFAULT '[]',
    ai_disclosure TEXT,
    status VARCHAR(50) DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'grading', 'graded', 'returned')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id, attempt_number)
);

-- Grades and feedback
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    grader_id UUID NOT NULL REFERENCES users(id),
    points_earned DECIMAL(6, 2) NOT NULL,
    percentage DECIMAL(5, 2),
    letter_grade VARCHAR(10),
    rubric_scores JSONB DEFAULT '{}',
    feedback TEXT,
    private_notes TEXT,
    is_final BOOLEAN DEFAULT FALSE,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNICATION SYSTEM
-- =====================================================

-- Messages between users
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_id UUID NOT NULL REFERENCES users(id),
    recipient_id UUID REFERENCES users(id),
    recipient_group_id UUID,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    attachments JSONB DEFAULT '[]',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_starred BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(50),
    thread_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_messages_sender (sender_id),
    INDEX idx_messages_recipient (recipient_id),
    INDEX idx_messages_created_at (created_at)
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    audience_type VARCHAR(50) NOT NULL CHECK (audience_type IN ('all', 'institution', 'department', 'course', 'role')),
    audience_id UUID,
    audience_roles VARCHAR[] DEFAULT '{}',
    priority VARCHAR(20) DEFAULT 'normal',
    publish_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expire_at TIMESTAMP,
    attachments JSONB DEFAULT '[]',
    acknowledgment_required BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    action_url TEXT,
    action_data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_email_sent BOOLEAN DEFAULT FALSE,
    is_sms_sent BOOLEAN DEFAULT FALSE,
    is_push_sent BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal',
    expires_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_notifications_user_id (user_id),
    INDEX idx_notifications_created_at (created_at)
);

-- Parent/Guardian access
CREATE TABLE parent_guardian_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id),
    parent_email VARCHAR(255) NOT NULL,
    parent_name VARCHAR(200) NOT NULL,
    relationship VARCHAR(50),
    access_token VARCHAR(255) UNIQUE,
    access_level VARCHAR(50) DEFAULT 'view_only',
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    last_access_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, parent_email)
);

-- =====================================================
-- ANALYTICS & REPORTING
-- =====================================================

-- Performance metrics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metric_type VARCHAR(100) NOT NULL,
    period_type VARCHAR(20) CHECK (period_type IN ('daily', 'weekly', 'monthly', 'semester', 'yearly')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    value DECIMAL(12, 4) NOT NULL,
    previous_value DECIMAL(12, 4),
    change_percentage DECIMAL(6, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_metrics_entity (entity_type, entity_id),
    INDEX idx_metrics_period (period_start, period_end)
);

-- System health monitoring
CREATE TABLE system_health_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_name VARCHAR(100) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('healthy', 'degraded', 'down')),
    response_time_ms INTEGER,
    error_rate DECIMAL(5, 2),
    cpu_usage DECIMAL(5, 2),
    memory_usage DECIMAL(5, 2),
    active_connections INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_health_created_at (created_at)
);

-- Custom reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES users(id),
    report_type VARCHAR(50) NOT NULL,
    query_definition JSONB NOT NULL,
    visualization_config JSONB DEFAULT '{}',
    schedule JSONB DEFAULT '{}',
    recipients UUID[] DEFAULT '{}',
    is_public BOOLEAN DEFAULT FALSE,
    last_run_at TIMESTAMP,
    next_run_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- RESOURCE MANAGEMENT
-- =====================================================

-- Physical resources (rooms, equipment)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('room', 'equipment', 'vehicle', 'facility', 'software')),
    category VARCHAR(100),
    description TEXT,
    capacity INTEGER,
    location JSONB,
    features JSONB DEFAULT '[]',
    availability_schedule JSONB DEFAULT '{}',
    booking_rules JSONB DEFAULT '{}',
    maintenance_schedule JSONB DEFAULT '{}',
    images JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'available',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Resource bookings
CREATE TABLE resource_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id UUID NOT NULL REFERENCES resources(id),
    booked_by UUID NOT NULL REFERENCES users(id),
    booked_for UUID REFERENCES users(id),
    purpose VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    attendees INTEGER,
    recurring_pattern JSONB DEFAULT '{}',
    approval_status VARCHAR(50) DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    cancellation_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Digital learning resources
CREATE TABLE learning_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) CHECK (type IN ('document', 'video', 'audio', 'interactive', 'link', 'ebook')),
    subject_area VARCHAR(100),
    grade_level VARCHAR[] DEFAULT '{}',
    url TEXT,
    file_path TEXT,
    file_size BIGINT,
    duration_seconds INTEGER,
    author VARCHAR(255),
    publisher VARCHAR(255),
    isbn VARCHAR(20),
    tags VARCHAR[] DEFAULT '{}',
    usage_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2),
    rating_count INTEGER DEFAULT 0,
    license_type VARCHAR(100),
    access_restrictions JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- WORKFLOW AUTOMATION
-- =====================================================

-- Workflow templates
CREATE TABLE workflow_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    trigger_type VARCHAR(50) CHECK (trigger_type IN ('manual', 'scheduled', 'event', 'webhook')),
    trigger_config JSONB NOT NULL,
    steps JSONB NOT NULL, -- Array of workflow steps
    variables JSONB DEFAULT '{}',
    permissions_required VARCHAR[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflow instances
CREATE TABLE workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES workflow_templates(id),
    triggered_by UUID REFERENCES users(id),
    trigger_data JSONB DEFAULT '{}',
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('running', 'paused', 'completed', 'failed', 'cancelled')),
    variables JSONB DEFAULT '{}',
    execution_log JSONB DEFAULT '[]',
    error_message TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task management
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(100),
    due_date TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'cancelled')),
    completion_percentage INTEGER DEFAULT 0,
    estimated_hours DECIMAL(5, 2),
    actual_hours DECIMAL(5, 2),
    parent_task_id UUID REFERENCES tasks(id),
    workflow_instance_id UUID REFERENCES workflow_instances(id),
    attachments JSONB DEFAULT '[]',
    comments_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

-- =====================================================
-- ATTENDANCE & SCHEDULING
-- =====================================================

-- Class schedules
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_id UUID REFERENCES resources(id),
    online_meeting_url TEXT,
    is_recurring BOOLEAN DEFAULT TRUE,
    exceptions JSONB DEFAULT '[]', -- Date-specific changes
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance records
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_section_id UUID NOT NULL REFERENCES course_sections(id),
    student_id UUID NOT NULL REFERENCES users(id),
    class_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late', 'excused', 'remote')),
    check_in_time TIMESTAMP,
    check_out_time TIMESTAMP,
    duration_minutes INTEGER,
    notes TEXT,
    excused_by UUID REFERENCES users(id),
    excused_reason TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_section_id, student_id, class_date)
);

-- =====================================================
-- GOOGLE WORKSPACE INTEGRATION
-- =====================================================

-- Google workspace connections
CREATE TABLE google_workspace_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    google_email VARCHAR(255) NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    scopes TEXT[] DEFAULT '{}',
    drive_enabled BOOLEAN DEFAULT FALSE,
    calendar_enabled BOOLEAN DEFAULT FALSE,
    gmail_enabled BOOLEAN DEFAULT FALSE,
    classroom_enabled BOOLEAN DEFAULT FALSE,
    last_sync_at TIMESTAMP,
    sync_status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, google_email)
);

-- Google drive files
CREATE TABLE google_drive_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    google_file_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    file_size BIGINT,
    parent_folder_id VARCHAR(255),
    web_view_link TEXT,
    download_link TEXT,
    thumbnail_link TEXT,
    shared_with JSONB DEFAULT '[]',
    permissions JSONB DEFAULT '{}',
    course_section_id UUID REFERENCES course_sections(id),
    assignment_id UUID REFERENCES assignments(id),
    last_modified_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, google_file_id)
);

-- =====================================================
-- SECURITY & COMPLIANCE
-- =====================================================

-- Audit logs (FERPA compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    resource_data JSONB DEFAULT '{}',
    changes JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id UUID,
    compliance_flags VARCHAR[] DEFAULT '{}',
    risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_user_id (user_id),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_created_at (created_at)
);

-- Data access logs
CREATE TABLE data_access_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    accessed_user_id UUID REFERENCES users(id),
    data_type VARCHAR(100) NOT NULL,
    access_reason TEXT,
    fields_accessed VARCHAR[] DEFAULT '{}',
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_data_access_user (user_id),
    INDEX idx_data_access_target (accessed_user_id),
    INDEX idx_data_access_created (created_at)
);

-- Security incidents
CREATE TABLE security_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    affected_users UUID[] DEFAULT '{}',
    affected_resources JSONB DEFAULT '{}',
    detection_method VARCHAR(100),
    response_actions JSONB DEFAULT '[]',
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'contained', 'resolved', 'closed')),
    reported_by UUID REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- =====================================================
-- FUTURE EXTENSIBILITY
-- =====================================================

-- Feature flags
CREATE TABLE feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_enabled BOOLEAN DEFAULT FALSE,
    rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage BETWEEN 0 AND 100),
    enabled_for_roles VARCHAR[] DEFAULT '{}',
    enabled_for_users UUID[] DEFAULT '{}',
    enabled_for_institutions UUID[] DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plugin system
CREATE TABLE plugins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(200) NOT NULL,
    version VARCHAR(20) NOT NULL,
    description TEXT,
    author VARCHAR(200),
    website VARCHAR(255),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT FALSE,
    permissions_required VARCHAR[] DEFAULT '{}',
    configuration_schema JSONB DEFAULT '{}',
    configuration JSONB DEFAULT '{}',
    endpoints JSONB DEFAULT '{}',
    hooks JSONB DEFAULT '{}',
    dependencies JSONB DEFAULT '{}',
    installed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Custom fields for extensibility
CREATE TABLE custom_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    field_type VARCHAR(50) NOT NULL,
    display_name VARCHAR(200) NOT NULL,
    description TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    default_value TEXT,
    validation_rules JSONB DEFAULT '{}',
    options JSONB DEFAULT '{}',
    position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(entity_type, field_name)
);

-- Custom field values
CREATE TABLE custom_field_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    custom_field_id UUID NOT NULL REFERENCES custom_fields(id),
    entity_id UUID NOT NULL,
    value TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(custom_field_id, entity_id)
);

-- System configuration
CREATE TABLE system_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key VARCHAR(255) NOT NULL UNIQUE,
    value TEXT NOT NULL,
    value_type VARCHAR(50) DEFAULT 'string',
    category VARCHAR(100),
    description TEXT,
    is_sensitive BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    validation_rules JSONB DEFAULT '{}',
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_institution ON users((metadata->>'institution_id'));

-- Course and enrollment indexes
CREATE INDEX idx_courses_dept ON courses(department_id);
CREATE INDEX idx_sections_course ON course_sections(course_id);
CREATE INDEX idx_sections_faculty ON course_sections(faculty_id);
CREATE INDEX idx_sections_period ON course_sections(academic_period_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_section ON enrollments(course_section_id);
CREATE INDEX idx_enrollments_status ON enrollments(enrollment_status);

-- AI usage indexes
CREATE INDEX idx_ai_usage_tool ON ai_tool_usage(tool_id);
CREATE INDEX idx_ai_usage_cost ON ai_tool_usage(cost);
CREATE INDEX idx_ai_budgets_entity ON ai_budgets(entity_type, entity_id);

-- Assignment and grade indexes
CREATE INDEX idx_assignments_section ON assignments(course_section_id);
CREATE INDEX idx_assignments_due ON assignments(due_date);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_grades_submission ON grades(submission_id);

-- Communication indexes
CREATE INDEX idx_announcements_audience ON announcements(audience_type, audience_id);
CREATE INDEX idx_announcements_publish ON announcements(publish_at);

-- Performance and analytics indexes
CREATE INDEX idx_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_health_service ON system_health_logs(service_name);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at
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
        EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END $$;

-- =====================================================
-- INITIAL SEED DATA
-- =====================================================

-- Insert default permissions
INSERT INTO permissions (resource, action, description) VALUES
-- System permissions
('system', 'manage', 'Full system administration'),
('system', 'view_analytics', 'View system-wide analytics'),
('system', 'manage_users', 'Manage all users'),
('system', 'manage_security', 'Manage security settings'),
-- User permissions
('users', 'create', 'Create new users'),
('users', 'read', 'View user profiles'),
('users', 'update', 'Update user information'),
('users', 'delete', 'Delete users'),
('users', 'manage_roles', 'Assign user roles'),
-- Course permissions
('courses', 'create', 'Create courses'),
('courses', 'read', 'View courses'),
('courses', 'update', 'Update course information'),
('courses', 'delete', 'Delete courses'),
('courses', 'manage_sections', 'Manage course sections'),
-- Assignment permissions
('assignments', 'create', 'Create assignments'),
('assignments', 'read', 'View assignments'),
('assignments', 'update', 'Update assignments'),
('assignments', 'delete', 'Delete assignments'),
('assignments', 'grade', 'Grade assignments'),
-- AI tools permissions
('ai_tools', 'use', 'Use AI tools'),
('ai_tools', 'manage', 'Manage AI tools'),
('ai_tools', 'view_usage', 'View AI usage statistics'),
-- Analytics permissions
('analytics', 'view_own', 'View own analytics'),
('analytics', 'view_department', 'View department analytics'),
('analytics', 'view_institution', 'View institution analytics');

-- Insert default AI tools
INSERT INTO ai_tools (name, display_name, category, subcategory, description, roles_allowed, input_schema) VALUES
-- Student tools
('ai_tutor', 'AI Tutor', 'learning', 'tutoring', '24/7 homework help with step-by-step explanations', '{student}', '{"question": "string"}'),
('study_guide_generator', 'Study Guide Generator', 'learning', 'study', 'Create personalized study materials from course content', '{student}', '{"topic": "string", "course_id": "uuid"}'),
('practice_test_creator', 'Practice Test Creator', 'learning', 'assessment', 'Generate self-assessment quizzes and practice exams', '{student}', '{"subject": "string", "difficulty": "string"}'),
('concept_explainer', 'Concept Explainer', 'learning', 'tutoring', 'Break down complex topics into simple terms', '{student}', '{"concept": "string"}'),
('math_solver', 'Math Problem Solver', 'learning', 'math', 'Step-by-step mathematical problem solving', '{student}', '{"problem": "string"}'),
('writing_coach', 'Writing Coach', 'writing', 'coaching', 'Essay structure, grammar, and style improvement', '{student}', '{"text": "string", "type": "string"}'),
('research_assistant', 'Research Assistant', 'writing', 'research', 'Source finding, citation help, and fact-checking', '{student}', '{"topic": "string"}'),
-- Faculty tools
('lesson_plan_generator', 'Lesson Plan Generator', 'teaching', 'planning', 'Create standards-aligned lesson plans', '{faculty}', '{"subject": "string", "grade_level": "string", "duration": "integer"}'),
('assessment_designer', 'Assessment Designer', 'teaching', 'assessment', 'Create quizzes and tests with rubrics', '{faculty}', '{"topic": "string", "question_count": "integer"}'),
('rubric_generator', 'Rubric Generator', 'teaching', 'assessment', 'Design comprehensive grading rubrics', '{faculty}', '{"assignment_type": "string", "criteria": "array"}'),
('feedback_assistant', 'Feedback Assistant', 'teaching', 'grading', 'Generate personalized student feedback', '{faculty}', '{"submission": "string", "rubric": "object"}'),
('differentiation_planner', 'Differentiation Planner', 'teaching', 'planning', 'Create multi-tiered instruction strategies', '{faculty}', '{"lesson": "string", "student_needs": "array"}'),
-- Staff tools
('document_generator', 'Document Generator', 'administrative', 'documents', 'Create official letters and reports', '{staff,admin}', '{"template": "string", "data": "object"}'),
('scheduling_coordinator', 'Scheduling Coordinator', 'administrative', 'scheduling', 'Manage meetings and calendars', '{staff,admin}', '{"event_type": "string", "participants": "array"}'),
('report_compiler', 'Report Compiler', 'administrative', 'reporting', 'Automated data collection and formatting', '{staff,admin}', '{"report_type": "string", "date_range": "object"}');

-- Insert default feature flags
INSERT INTO feature_flags (name, description, is_enabled) VALUES
('ai_tools_enabled', 'Enable AI tools across the platform', true),
('google_workspace_integration', 'Enable Google Workspace integration', true),
('parent_portal', 'Enable parent/guardian access portal', true),
('mobile_app', 'Enable mobile application features', false),
('advanced_analytics', 'Enable advanced analytics dashboards', true),
('workflow_automation', 'Enable workflow automation engine', true),
('peer_review', 'Enable peer review for assignments', false),
('gamification', 'Enable gamification features', false);

-- Insert default system configuration
INSERT INTO system_config (key, value, category, description) VALUES
('ai_daily_budget', '5.00', 'ai', 'Daily AI usage budget in USD'),
('ai_monthly_budget', '150.00', 'ai', 'Monthly AI usage budget in USD'),
('session_timeout', '3600', 'security', 'Session timeout in seconds'),
('password_min_length', '8', 'security', 'Minimum password length'),
('max_login_attempts', '5', 'security', 'Maximum failed login attempts before lockout'),
('file_upload_max_size', '52428800', 'system', 'Maximum file upload size in bytes (50MB)'),
('email_from_address', 'noreply@academic-ai.edu', 'email', 'System email from address'),
('timezone', 'America/New_York', 'system', 'Default system timezone'),
('academic_year_start', '08-01', 'academic', 'Academic year start date (MM-DD)'),
('grade_scale', '{"A": 90, "B": 80, "C": 70, "D": 60, "F": 0}', 'academic', 'Default grading scale');

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE users IS 'Core user table for authentication and profiles';
COMMENT ON TABLE ai_tools IS 'Registry of all AI tools available in the platform';
COMMENT ON TABLE ai_tool_usage IS 'Tracks usage of AI tools for cost monitoring and analytics';
COMMENT ON TABLE courses IS 'Course catalog with descriptions and requirements';
COMMENT ON TABLE enrollments IS 'Student enrollment in course sections';
COMMENT ON TABLE assignments IS 'Assignments, quizzes, and assessments';
COMMENT ON TABLE audit_logs IS 'FERPA-compliant audit trail of all data access';
COMMENT ON TABLE feature_flags IS 'Feature toggles for gradual rollout and A/B testing';

-- End of schema