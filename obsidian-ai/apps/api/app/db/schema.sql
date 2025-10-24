-- Obsidian Database Schema
-- Single-tenant architecture with derived metrics only (no raw CRM data)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth0_user_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_users_auth0_id ON users(auth0_user_id);
CREATE INDEX idx_users_email ON users(email);

-- CRM Connections table (stores encrypted tokens)
CREATE TABLE IF NOT EXISTS crm_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crm_type VARCHAR(50) NOT NULL, -- 'hubspot', 'salesforce', 'dynamics'
    access_token_encrypted TEXT NOT NULL,
    refresh_token_encrypted TEXT,
    token_expires_at TIMESTAMP,
    tenant_id VARCHAR(255),
    connected_at TIMESTAMP DEFAULT NOW(),
    last_sync_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT unique_user_crm UNIQUE(user_id, crm_type)
);

CREATE INDEX idx_crm_connections_user ON crm_connections(user_id);
CREATE INDEX idx_crm_connections_active ON crm_connections(is_active) WHERE is_active = true;

-- Scans table (derived metrics only)
CREATE TABLE IF NOT EXISTS scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crm_connection_id UUID REFERENCES crm_connections(id) ON DELETE CASCADE,
    pipeline_health DECIMAL(5,2),
    revenue_at_risk DECIMAL(15,2),
    zombie_deals INTEGER DEFAULT 0,
    integrity_score DECIMAL(5,2),
    confidence_index DECIMAL(3,2),
    total_deals_analyzed INTEGER DEFAULT 0,
    signals JSONB DEFAULT '{}'::jsonb, -- Stores signal calculations
    revival_forecast JSONB DEFAULT '{}'::jsonb, -- Stores forecast data
    scan_metadata JSONB DEFAULT '{}'::jsonb,
    status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    error_message TEXT,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_scans_user ON scans(user_id);
CREATE INDEX idx_scans_status ON scans(status);
CREATE INDEX idx_scans_created ON scans(created_at DESC);

-- Enforcement Logs table
CREATE TABLE IF NOT EXISTS enforcement_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    crm_connection_id UUID REFERENCES crm_connections(id) ON DELETE CASCADE,
    tasks_generated INTEGER DEFAULT 0,
    tasks_created INTEGER DEFAULT 0,
    tasks_failed INTEGER DEFAULT 0,
    tasks_completed INTEGER DEFAULT 0,
    task_details JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_enforcement_logs_scan ON enforcement_logs(scan_id);
CREATE INDEX idx_enforcement_logs_user ON enforcement_logs(user_id);
CREATE INDEX idx_enforcement_logs_created ON enforcement_logs(created_at DESC);

-- Shared Reports table (for shareable links)
CREATE TABLE IF NOT EXISTS shared_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    share_token VARCHAR(255) UNIQUE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP NOT NULL,
    view_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_shared_reports_token ON shared_reports(share_token);
CREATE INDEX idx_shared_reports_active ON shared_reports(is_active) WHERE is_active = true;

-- Tracking Pixels table (for ROI measurement)
CREATE TABLE IF NOT EXISTS tracking_pixels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
    pixel_id VARCHAR(255) UNIQUE NOT NULL,
    deal_id VARCHAR(255), -- From CRM
    fire_count INTEGER DEFAULT 0,
    first_fired_at TIMESTAMP,
    last_fired_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX idx_tracking_pixels_pixel_id ON tracking_pixels(pixel_id);
CREATE INDEX idx_tracking_pixels_user ON tracking_pixels(user_id);
CREATE INDEX idx_tracking_pixels_scan ON tracking_pixels(scan_id);

-- Audit Log table (for security and compliance)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    ip_address INET,
    user_agent TEXT,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- Comments for documentation
COMMENT ON TABLE users IS 'User accounts authenticated via Auth0';
COMMENT ON TABLE crm_connections IS 'CRM OAuth connections with encrypted tokens (never stores raw CRM data)';
COMMENT ON TABLE scans IS 'Vanguard scan results with derived metrics only';
COMMENT ON TABLE enforcement_logs IS 'Task enforcement audit trail';
COMMENT ON TABLE shared_reports IS 'Shareable diagnostic report links';
COMMENT ON TABLE tracking_pixels IS 'ROI tracking pixels for measuring deal outcomes';
COMMENT ON TABLE audit_logs IS 'Security and compliance audit trail';

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO obsidian_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO obsidian_app;
