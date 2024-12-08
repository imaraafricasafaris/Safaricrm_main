-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create module_logs table
CREATE TABLE module_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL CHECK (action IN ('activate', 'deactivate', 'configure', 'access')),
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create module_access_logs table for tracking access attempts
CREATE TABLE module_access_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  success BOOLEAN NOT NULL,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE module_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_access_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Module logs are viewable by authenticated users"
  ON module_logs FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module access logs are viewable by authenticated users"
  ON module_access_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create function to log module actions
CREATE OR REPLACE FUNCTION log_module_action()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO module_logs (
    module_id,
    user_id,
    action,
    details,
    ip_address,
    user_agent
  ) VALUES (
    NEW.module_id,
    auth.uid(),
    CASE
      WHEN NEW.status = 'active' AND OLD.status = 'inactive' THEN 'activate'
      WHEN NEW.status = 'inactive' AND OLD.status = 'active' THEN 'deactivate'
      ELSE 'configure'
    END,
    jsonb_build_object(
      'old_status', OLD.status,
      'new_status', NEW.status,
      'old_settings', OLD.settings,
      'new_settings', NEW.settings
    ),
    current_setting('request.headers')::json->>'x-real-ip',
    current_setting('request.headers')::json->>'user-agent'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for logging module changes
CREATE TRIGGER log_module_changes
  AFTER UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION log_module_action();

-- Create function to log access attempts
CREATE OR REPLACE FUNCTION log_module_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO module_access_logs (
    module_id,
    user_id,
    success,
    error_message,
    ip_address,
    user_agent
  ) VALUES (
    NEW.module_id,
    auth.uid(),
    NEW.status = 'active',
    CASE WHEN NEW.status != 'active' THEN 'Access denied: Module not active' ELSE NULL END,
    current_setting('request.headers')::json->>'x-real-ip',
    current_setting('request.headers')::json->>'user-agent'
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for logging access attempts
CREATE TRIGGER log_module_access_attempts
  AFTER INSERT OR UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION log_module_access();