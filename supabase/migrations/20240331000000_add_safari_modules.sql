-- Insert new safari-specific modules
INSERT INTO module_states (module_id, status) VALUES
  ('safari-packages', 'inactive'),
  ('vehicle-fleet', 'inactive'),
  ('guide-management', 'inactive'),
  ('accommodation', 'inactive'),
  ('activities', 'inactive')
ON CONFLICT (module_id) DO UPDATE SET status = EXCLUDED.status;