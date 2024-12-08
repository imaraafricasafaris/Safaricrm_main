-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if it exists
DROP TABLE IF EXISTS module_states;

-- Create module_states table
CREATE TABLE module_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE module_states ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view module states"
  ON module_states FOR SELECT
  USING (true);

CREATE POLICY "Anyone can modify module states"
  ON module_states FOR ALL
  USING (true);

-- Insert initial module states
INSERT INTO module_states (module_id, status, settings) VALUES
  -- Core Modules (Always Active)
  ('dashboard', 'active', jsonb_build_object(
    'name', 'Dashboard',
    'description', 'Main system dashboard and analytics',
    'category', 'core',
    'features', array['Overview analytics', 'Quick actions', 'Recent activity']
  )),
  ('settings', 'active', jsonb_build_object(
    'name', 'Settings',
    'description', 'System configuration and preferences',
    'category', 'core',
    'features', array['User preferences', 'System settings', 'Customization']
  )),
  ('notifications', 'active', jsonb_build_object(
    'name', 'Notifications',
    'description', 'System notifications and alerts',
    'category', 'core',
    'features', array['Real-time alerts', 'Email notifications', 'Custom preferences']
  )),
  ('leads', 'active', jsonb_build_object(
    'name', 'Lead Management',
    'description', 'Track and manage potential clients',
    'category', 'core',
    'features', array['Lead tracking', 'Pipeline management', 'Follow-up automation']
  )),
  ('modules', 'active', jsonb_build_object(
    'name', 'System Modules',
    'description', 'Manage system modules and features',
    'category', 'core',
    'features', array['Module activation', 'Feature management', 'Module analytics']
  )),
  
  -- Default Active Modules
  ('client-management', 'active', jsonb_build_object(
    'name', 'Client Management',
    'description', 'Manage client relationships and bookings',
    'category', 'crm',
    'features', array['Client profiles', 'Booking history', 'Communication logs']
  )),
  ('task-management', 'active', jsonb_build_object(
    'name', 'Task Management',
    'description', 'Assign and track team tasks',
    'category', 'operations',
    'features', array['Task assignment', 'Due date tracking', 'Progress monitoring']
  )),
  ('document-management', 'active', jsonb_build_object(
    'name', 'Document Management',
    'description', 'Store and manage documents',
    'category', 'operations',
    'features', array['Document storage', 'Version control', 'Access management']
  )),
  ('advanced-reporting', 'active', jsonb_build_object(
    'name', 'Advanced Reporting',
    'description', 'Generate detailed reports and analytics',
    'category', 'reporting',
    'features', array['Custom reports', 'Data visualization', 'Export options']
  )),
  ('staff-management', 'active', jsonb_build_object(
    'name', 'Staff Management',
    'description', 'Manage staff members and permissions',
    'category', 'operations',
    'features', array['Staff profiles', 'Role management', 'Performance tracking']
  )),
  ('office-management', 'active', jsonb_build_object(
    'name', 'Branch Management',
    'description', 'Manage multiple office locations',
    'category', 'operations',
    'features', array['Location management', 'Staff assignment', 'Resource allocation']
  ));

-- Grant necessary permissions
GRANT ALL ON TABLE module_states TO authenticated;
GRANT ALL ON TABLE module_states TO anon;