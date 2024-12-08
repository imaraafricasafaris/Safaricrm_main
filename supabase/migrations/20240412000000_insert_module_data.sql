-- Insert initial module data
INSERT INTO modules (id, name, description, category, status, is_core, features, version) VALUES
  ('dashboard', 'Dashboard', 'Main system dashboard and analytics', 'core', 'active', true, 
   '["Overview analytics", "Quick actions", "Recent activity"]', '1.0.0'),
  ('settings', 'Settings', 'System configuration and preferences', 'core', 'active', true,
   '["User preferences", "System settings", "Customization"]', '1.0.0'),
  ('notifications', 'Notifications', 'System notifications and alerts', 'core', 'active', true,
   '["Real-time alerts", "Email notifications", "Custom preferences"]', '1.0.0'),
  ('leads', 'Lead Management', 'Track and manage potential clients', 'core', 'active', true,
   '["Lead tracking", "Pipeline management", "Follow-up automation"]', '1.0.0'),
  ('client-management', 'Client Management', 'Manage client relationships', 'crm', 'active', false,
   '["Client profiles", "Booking history", "Communication logs"]', '1.0.0'),
  ('task-management', 'Task Management', 'Assign and track team tasks', 'operations', 'active', false,
   '["Task assignment", "Due date tracking", "Progress monitoring"]', '1.0.0'),
  ('document-management', 'Document Management', 'Store and manage documents', 'operations', 'active', false,
   '["Document storage", "Version control", "Access management"]', '1.0.0'),
  ('advanced-reporting', 'Advanced Reporting', 'Generate detailed reports', 'reporting', 'active', false,
   '["Custom reports", "Data visualization", "Export options"]', '1.0.0')
ON CONFLICT (id) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  features = EXCLUDED.features,
  version = EXCLUDED.version,
  status = CASE
    WHEN modules.is_core THEN 'active'
    ELSE EXCLUDED.status
  END;