-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('module', 'subscription', 'system', 'error')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT NOT NULL CHECK (status IN ('unread', 'read', 'archived')) DEFAULT 'unread',
  metadata JSONB DEFAULT '{}'::jsonb,
  error_code TEXT,
  action_url TEXT,
  delivery_methods TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ
);

-- Create notification_preferences table
CREATE TABLE notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  module_notifications BOOLEAN DEFAULT true,
  subscription_alerts BOOLEAN DEFAULT true,
  system_notifications BOOLEAN DEFAULT true,
  error_alerts BOOLEAN DEFAULT true,
  delivery_methods TEXT[] DEFAULT ARRAY['in-app', 'email']::TEXT[],
  quiet_hours JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create notification_logs table
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_id UUID REFERENCES notifications(id) ON DELETE CASCADE,
  delivery_method TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage their notification preferences"
  ON notification_preferences FOR ALL
  USING (user_id = auth.uid());

-- Create function to clean up old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS void AS $$
BEGIN
  DELETE FROM notifications
  WHERE status = 'read'
  AND created_at < NOW() - INTERVAL '30 days';
  
  DELETE FROM notifications
  WHERE status = 'archived'
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;