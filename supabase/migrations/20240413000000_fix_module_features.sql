-- Convert features from JSONB to TEXT[]
ALTER TABLE modules 
  ALTER COLUMN features TYPE TEXT[] USING features::TEXT[];

-- Update existing modules with proper feature arrays
UPDATE modules SET features = ARRAY[
  'Overview analytics',
  'Quick actions',
  'Recent activity'
] WHERE id = 'dashboard';

UPDATE modules SET features = ARRAY[
  'User preferences',
  'System settings',
  'Customization'
] WHERE id = 'settings';

UPDATE modules SET features = ARRAY[
  'Real-time alerts',
  'Email notifications',
  'Custom preferences'
] WHERE id = 'notifications';

UPDATE modules SET features = ARRAY[
  'Lead tracking',
  'Pipeline management',
  'Follow-up automation'
] WHERE id = 'leads';

UPDATE modules SET features = ARRAY[
  'Client profiles',
  'Booking history',
  'Communication logs'
] WHERE id = 'client-management';

UPDATE modules SET features = ARRAY[
  'Task assignment',
  'Due date tracking',
  'Progress monitoring'
] WHERE id = 'task-management';

UPDATE modules SET features = ARRAY[
  'Document storage',
  'Version control',
  'Access management'
] WHERE id = 'document-management';

UPDATE modules SET features = ARRAY[
  'Custom reports',
  'Data visualization',
  'Export options'
] WHERE id = 'advanced-reporting';