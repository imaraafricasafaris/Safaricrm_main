-- Drop existing module_states table
DROP TABLE IF EXISTS module_states CASCADE;

-- Create modules table
CREATE TABLE modules (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('core', 'crm', 'operations', 'finance', 'reporting', 'automation')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  settings JSONB DEFAULT '{}'::jsonb,
  version TEXT NOT NULL DEFAULT '1.0.0',
  is_core BOOLEAN DEFAULT false,
  dependencies JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  setup_required BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view modules"
  ON modules FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can modify modules"
  ON modules FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert initial modules
INSERT INTO modules (id, name, description, category, status, is_core, settings) VALUES
  -- Core Modules
  ('dashboard', 'Dashboard', 'Main system dashboard and analytics', 'core', 'active', true, 
   jsonb_build_object('features', array['Overview analytics', 'Quick actions', 'Recent activity'])),
  ('settings', 'Settings', 'System configuration and preferences', 'core', 'active', true,
   jsonb_build_object('features', array['User preferences', 'System settings', 'Customization'])),
  ('notifications', 'Notifications', 'System notifications and alerts', 'core', 'active', true,
   jsonb_build_object('features', array['Real-time alerts', 'Email notifications', 'Custom preferences'])),
  ('leads', 'Lead Management', 'Track and manage potential clients', 'core', 'active', true,
   jsonb_build_object('features', array['Lead tracking', 'Pipeline management', 'Follow-up automation'])),
  ('modules', 'System Modules', 'Manage system modules and features', 'core', 'active', true,
   jsonb_build_object('features', array['Module activation', 'Feature management', 'Module analytics'])),
  
  -- CRM Modules
  ('client-management', 'Client Management', 'Manage client relationships', 'crm', 'active', false,
   jsonb_build_object('features', array['Client profiles', 'Booking history', 'Communication logs'])),
  ('task-management', 'Task Management', 'Assign and track team tasks', 'operations', 'active', false,
   jsonb_build_object('features', array['Task assignment', 'Due date tracking', 'Progress monitoring'])),
  ('document-management', 'Document Management', 'Store and manage documents', 'operations', 'active', false,
   jsonb_build_object('features', array['Document storage', 'Version control', 'Access management'])),
  ('advanced-reporting', 'Advanced Reporting', 'Generate detailed reports', 'reporting', 'active', false,
   jsonb_build_object('features', array['Custom reports', 'Data visualization', 'Export options'])),
  ('staff-management', 'Staff Management', 'Manage staff members', 'operations', 'active', false,
   jsonb_build_object('features', array['Staff profiles', 'Role management', 'Performance tracking'])),
  ('office-management', 'Branch Management', 'Manage multiple locations', 'operations', 'active', false,
   jsonb_build_object('features', array['Location management', 'Staff assignment', 'Resource allocation']))
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  settings = EXCLUDED.settings,
  is_core = EXCLUDED.is_core,
  status = CASE
    WHEN modules.is_core THEN 'active'
    ELSE EXCLUDED.status
  END;

-- Create function to prevent core module deactivation
CREATE OR REPLACE FUNCTION prevent_core_module_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_core AND NEW.status = 'inactive' THEN
    RAISE EXCEPTION 'Cannot deactivate core module';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER enforce_core_modules
  BEFORE UPDATE ON modules
  FOR EACH ROW
  EXECUTE FUNCTION prevent_core_module_deactivation();