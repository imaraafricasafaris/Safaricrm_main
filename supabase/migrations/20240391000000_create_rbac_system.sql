-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  permissions JSONB DEFAULT '[]'::jsonb,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create role_assignments table
CREATE TABLE role_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  module_id TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id, module_id)
);

-- Create role_activity_logs table
CREATE TABLE role_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_activity_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Roles are viewable by authenticated users"
  ON roles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Role assignments are viewable by authenticated users"
  ON role_assignments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Role activity logs are viewable by admins"
  ON role_activity_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      WHERE ra.user_id = auth.uid()
      AND ra.role_id IN (
        SELECT id FROM roles
        WHERE permissions ? 'view_logs'
      )
    )
  );

-- Insert default roles
INSERT INTO roles (name, description, permissions, is_system) VALUES
  ('Super Admin', 'Full system access', '["*"]'::jsonb, true),
  ('Admin', 'Company-wide administration', '["manage_modules", "manage_users", "manage_roles"]'::jsonb, true),
  ('Manager', 'Department management', '["view_modules", "manage_staff"]'::jsonb, true),
  ('Agent', 'Basic system access', '["view_assigned_modules"]'::jsonb, true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_roles_timestamp
  BEFORE UPDATE ON roles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_role_assignments_timestamp
  BEFORE UPDATE ON role_assignments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log role changes
CREATE OR REPLACE FUNCTION log_role_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO role_activity_logs (user_id, action, details)
  VALUES (
    auth.uid(),
    TG_OP,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'id', NEW.id,
      'changes', jsonb_build_object(
        'old', to_jsonb(OLD),
        'new', to_jsonb(NEW)
      )
    )
  );
  RETURN NEW;
END;
$$ language plpgsql;