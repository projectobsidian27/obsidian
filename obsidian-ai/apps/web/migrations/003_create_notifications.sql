-- Notifications table for in-platform alerts
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- zombie_deal, deal_milestone, pipeline_health, system, action_required
  level VARCHAR(20) NOT NULL, -- info, warning, critical, success
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- Additional context (deal_id, deal_name, etc.)
  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,
  action_url VARCHAR(500), -- Optional link to related resource
  action_label VARCHAR(100), -- Optional action button text (e.g., "Review Deal")
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  dismissed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_level ON notifications(level);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, is_dismissed) WHERE is_read = FALSE AND is_dismissed = FALSE;

-- System-wide announcements (not tied to specific user)
CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- maintenance, feature, update, alert
  level VARCHAR(20) NOT NULL, -- info, warning, critical
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Track which users have dismissed announcements
CREATE TABLE IF NOT EXISTS announcement_dismissals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  dismissed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(announcement_id, user_id)
);

-- Notification preferences per user
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  enable_zombie_alerts BOOLEAN DEFAULT TRUE,
  enable_deal_milestones BOOLEAN DEFAULT TRUE,
  enable_pipeline_health BOOLEAN DEFAULT TRUE,
  enable_system_alerts BOOLEAN DEFAULT TRUE,
  quiet_hours_start TIME, -- Optional quiet hours
  quiet_hours_end TIME,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
