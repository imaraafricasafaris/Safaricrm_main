-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create super_admins table
CREATE TABLE super_admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  phone TEXT,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending_approval')) DEFAULT 'pending_approval',
  permissions JSONB DEFAULT '{}'::jsonb,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create super_admin_activity_logs table
CREATE TABLE super_admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES super_admins(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create super_admin_invites table
CREATE TABLE super_admin_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES super_admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE super_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_invites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Super admins can view their own profile"
  ON super_admins FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can update their own profile"
  ON super_admins FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins can view activity logs"
  ON super_admin_activity_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM super_admins
    WHERE super_admins.user_id = auth.uid()
  ));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_super_admins_updated_at
  BEFORE UPDATE ON super_admins
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log super admin activities
CREATE OR REPLACE FUNCTION log_super_admin_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO super_admin_activity_logs (admin_id, action, details)
  VALUES (
    NEW.id,
    TG_OP,
    jsonb_build_object(
      'table', TG_TABLE_NAME,
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for logging activities
CREATE TRIGGER log_super_admin_changes
  AFTER INSERT OR UPDATE OR DELETE ON super_admins
  FOR EACH ROW
  EXECUTE FUNCTION log_super_admin_activity();