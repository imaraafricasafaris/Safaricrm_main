-- Drop existing RLS policies
DROP POLICY IF EXISTS "Module states are viewable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are insertable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are updatable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are deletable by authenticated users" ON module_states;

-- Create new RLS policies with simplified authentication checks
CREATE POLICY "Module states are viewable by authenticated users"
  ON module_states FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Module states are insertable by authenticated users"
  ON module_states FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Module states are updatable by authenticated users"
  ON module_states FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Module states are deletable by authenticated users"
  ON module_states FOR DELETE
  TO authenticated
  USING (true);

-- Refresh module data
TRUNCATE TABLE module_states;

-- Insert core and default modules
INSERT INTO module_states (module_id, status, settings) VALUES
  -- Core Modules (Always Active)
  ('dashboard', 'active', '{"default_view": "grid"}'::jsonb),
  ('settings', 'active', '{}'::jsonb),
  ('notifications', 'active', '{}'::jsonb),
  ('leads', 'active', '{}'::jsonb),
  ('modules', 'active', '{}'::jsonb),
  
  -- Default Active Modules
  ('client-management', 'active', '{}'::jsonb),
  ('task-management', 'active', '{}'::jsonb),
  ('document-management', 'active', '{}'::jsonb),
  ('invoicing', 'active', '{}'::jsonb),
  ('itinerary-builder', 'active', '{}'::jsonb),
  ('advanced-reporting', 'active', '{}'::jsonb),
  ('staff-management', 'active', '{}'::jsonb),
  ('office-management', 'active', '{}'::jsonb),
  
  -- Optional Modules (Initially Inactive)
  ('safari-packages', 'inactive', '{}'::jsonb),
  ('vehicle-fleet', 'inactive', '{}'::jsonb),
  ('guide-management', 'inactive', '{}'::jsonb),
  ('accommodation', 'inactive', '{}'::jsonb),
  ('activities', 'inactive', '{}'::jsonb),
  ('email-automation', 'inactive', '{}'::jsonb),
  ('calendar', 'inactive', '{}'::jsonb);

-- Grant necessary permissions
GRANT ALL ON TABLE module_states TO authenticated;
GRANT USAGE ON SEQUENCE module_states_id_seq TO authenticated;