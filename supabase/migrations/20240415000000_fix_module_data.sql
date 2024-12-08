-- Refresh module data with complete information
TRUNCATE TABLE modules;

INSERT INTO modules (id, name, description, category, status, is_core, features, version) VALUES
  ('dashboard', 'Dashboard', 'Main system dashboard and analytics', 'core', 'active', true, 
   ARRAY['Overview analytics', 'Quick actions', 'Recent activity'], '1.0.0'),
  ('settings', 'Settings', 'System configuration and preferences', 'core', 'active', true,
   ARRAY['User preferences', 'System settings', 'Customization'], '1.0.0'),
  ('notifications', 'Notifications', 'System notifications and alerts', 'core', 'active', true,
   ARRAY['Real-time alerts', 'Email notifications', 'Custom preferences'], '1.0.0'),
  ('leads', 'Lead Management', 'Track and manage potential clients', 'core', 'active', true,
   ARRAY['Lead tracking', 'Pipeline management', 'Follow-up automation'], '1.0.0'),
  ('client-management', 'Client Management', 'Manage client relationships', 'crm', 'active', false,
   ARRAY['Client profiles', 'Booking history', 'Communication logs'], '1.0.0'),
  ('task-management', 'Task Management', 'Assign and track team tasks', 'operations', 'active', false,
   ARRAY['Task assignment', 'Due date tracking', 'Progress monitoring'], '1.0.0'),
  ('document-management', 'Document Management', 'Store and manage documents', 'operations', 'active', false,
   ARRAY['Document storage', 'Version control', 'Access management'], '1.0.0'),
  ('advanced-reporting', 'Advanced Reporting', 'Generate detailed reports', 'reporting', 'active', false,
   ARRAY['Custom reports', 'Data visualization', 'Export options'], '1.0.0');