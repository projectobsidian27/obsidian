-- Obsidian Platform - Complete Database Schema
-- Run this on your Render PostgreSQL database

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  auth0_user_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth0 ON users(auth0_user_id);

-- ============================================================================
-- CRM CONNECTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS crm_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  crm_type VARCHAR(50) NOT NULL, -- hubspot, salesforce, etc
  access_token_encrypted TEXT NOT NULL,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMP,
  hub_id VARCHAR(255),
  connected_at TIMESTAMP DEFAULT NOW(),
  last_sync_at TIMESTAMP,
  metadata JSONB DEFAULT '{}',
  UNIQUE(user_id, crm_type)
);

CREATE INDEX IF NOT EXISTS idx_crm_user ON crm_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_crm_type ON crm_connections(crm_type);

-- ============================================================================
-- QUALIFICATION DATA TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS qualification_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  company_name VARCHAR(255),
  company_size VARCHAR(50),
  industry VARCHAR(100),
  role VARCHAR(100),
  crm_preference VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_qual_email ON qualification_data(email);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- zombie_deal, deal_milestone, pipeline_health, system, action_required
  level VARCHAR(20) NOT NULL, -- info, warning, critical, success
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500),
  action_label VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  dismissed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_level ON notifications(level);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, is_dismissed) WHERE is_read = FALSE AND is_dismissed = FALSE;

-- ============================================================================
-- ANNOUNCEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- maintenance, feature, update, alert, sales
  level VARCHAR(20) NOT NULL, -- info, warning, critical
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, start_date, end_date);

-- ============================================================================
-- ANNOUNCEMENT DISMISSALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS announcement_dismissals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- ============================================================================
-- NOTIFICATION PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  enable_zombie_alerts BOOLEAN DEFAULT TRUE,
  enable_deal_milestones BOOLEAN DEFAULT TRUE,
  enable_pipeline_health BOOLEAN DEFAULT TRUE,
  enable_system_alerts BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- SESSIONS TABLE (for NextAuth.js)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);

-- ============================================================================
-- VERIFICATION TOKENS TABLE (for NextAuth.js magic links)
-- ============================================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- ============================================================================
-- INITIAL DATA - Insert test admin user
-- ============================================================================
INSERT INTO users (email, auth0_user_id, metadata)
VALUES (
  'admin@obsidian.app',
  'admin_initial',
  '{"role": "super_admin", "is_internal": true}'::jsonb
) ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this after migration to verify:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;
