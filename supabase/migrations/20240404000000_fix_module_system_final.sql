-- Drop existing RLS policies
DROP POLICY IF EXISTS "Anyone can view module states" ON module_states;
DROP POLICY IF EXISTS "Anyone can modify module states" ON module_states;

-- Create new simplified RLS policies
CREATE POLICY "Public module access"
  ON module_states FOR ALL
  USING (true)
  WITH CHECK (true);

-- Refresh module data with complete settings
TRUNCATE TABLE module_states;

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
  
  -- CRM Modules
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
  )),
  
  -- Optional Modules (Initially Inactive)
  ('safari-packages', 'inactive', jsonb_build_object(
    'name', 'Safari Packages',
    'description', 'Create and manage safari packages',
    'category', 'operations',
    'features', array['Package builder', 'Pricing management', 'Availability calendar']
  )),
  ('vehicle-fleet', 'inactive', jsonb_build_object(
    'name', 'Vehicle Fleet',
    'description', 'Manage safari vehicles and maintenance',
    'category', 'operations',
    'features', array['Vehicle tracking', 'Maintenance scheduling', 'Driver assignment']
  )),
  ('guide-management', 'inactive', jsonb_build_object(
    'name', 'Guide Management',
    'description', 'Manage safari guides and assignments',
    'category', 'operations',
    'features', array['Guide profiles', 'Schedule management', 'Certification tracking']
  )),
  ('accommodation', 'inactive', jsonb_build_object(
    'name', 'Accommodation',
    'description', 'Manage lodges and accommodations',
    'category', 'operations',
    'features', array['Property management', 'Room inventory', 'Booking calendar']
  )),
  ('activities', 'inactive', jsonb_build_object(
    'name', 'Activities',
    'description', 'Manage safari activities and excursions',
    'category', 'operations',
    'features', array['Activity catalog', 'Scheduling', 'Guide assignment']
  ));

-- Grant necessary permissions
GRANT ALL ON TABLE module_states TO authenticated;
GRANT ALL ON TABLE module_states TO anon;