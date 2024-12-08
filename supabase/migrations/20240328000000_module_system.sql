-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subscription_plan TEXT CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_core BOOLEAN DEFAULT false,
  version TEXT NOT NULL,
  dependencies TEXT[],
  required_plan TEXT CHECK (required_plan IN ('free', 'basic', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create module_states table to track activation status per company
CREATE TABLE module_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending_setup')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, module_id)
);

-- Create module_logs table for tracking changes
CREATE TABLE module_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert core modules
INSERT INTO modules (name, slug, description, is_core, version, required_plan) VALUES
  ('Dashboard', 'dashboard', 'Main system dashboard and analytics', true, '1.0.0', 'free'),
  ('Settings', 'settings', 'System configuration and preferences', true, '1.0.0', 'free'),
  ('Reports', 'reports', 'System-wide reporting and analytics', true, '1.0.0', 'free'),
  ('Notifications', 'notifications', 'System notifications and alerts', true, '1.0.0', 'free');

-- Insert optional modules
INSERT INTO modules (name, slug, description, is_core, version, required_plan) VALUES
  ('Lead Management', 'leads', 'Track and manage sales leads', false, '1.0.0', 'basic'),
  ('Client Management', 'clients', 'Manage client relationships', false, '1.0.0', 'basic'),
  ('Itinerary Builder', 'itineraries', 'Create and manage safari itineraries', false, '1.0.0', 'basic'),
  ('Task Management', 'tasks', 'Assign and track team tasks', false, '1.0.0', 'basic'),
  ('Document Management', 'documents', 'Store and manage documents', false, '1.0.0', 'premium'),
  ('Email Automation', 'email', 'Automated email campaigns', false, '1.0.0', 'premium'),
  ('Advanced Analytics', 'analytics', 'Advanced reporting and insights', false, '1.0.0', 'premium'),
  ('API Integration', 'api', 'External API integrations', false, '1.0.0', 'enterprise');

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_module_states_updated_at
  BEFORE UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to log module changes
CREATE OR REPLACE FUNCTION log_module_change()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO module_logs (company_id, module_id, action, details, performed_by)
  VALUES (
    NEW.company_id,
    NEW.module_id,
    CASE
      WHEN TG_OP = 'INSERT' THEN 'activated'
      WHEN TG_OP = 'DELETE' THEN 'deactivated'
      WHEN TG_OP = 'UPDATE' THEN 'updated'
    END,
    jsonb_build_object(
      'old_status', CASE WHEN TG_OP = 'UPDATE' THEN OLD.status ELSE null END,
      'new_status', CASE WHEN TG_OP = 'DELETE' THEN null ELSE NEW.status END,
      'settings', NEW.settings
    ),
    auth.uid()
  );
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- Create trigger for logging module changes
CREATE TRIGGER log_module_changes
  AFTER INSERT OR UPDATE OR DELETE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION log_module_change();

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Companies are viewable by authenticated users"
  ON companies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Modules are viewable by authenticated users"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module states are viewable by company members"
  ON module_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = module_states.company_id
      AND auth.uid() IN (
        SELECT user_id FROM profiles
        WHERE company_id = c.id
      )
    )
  );

CREATE POLICY "Module logs are viewable by company members"
  ON module_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = module_logs.company_id
      AND auth.uid() IN (
        SELECT user_id FROM profiles
        WHERE company_id = c.id
      )
    )
  );