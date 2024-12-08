-- Drop existing RLS policies
DROP POLICY IF EXISTS "Module states are viewable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are insertable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are updatable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are deletable by authenticated users" ON module_states;

-- Create new RLS policies with proper authentication checks
CREATE POLICY "Module states are viewable by authenticated users"
  ON module_states FOR SELECT
  USING (
    auth.role() IS NOT NULL
  );

CREATE POLICY "Module states are insertable by authenticated users"
  ON module_states FOR INSERT
  WITH CHECK (
    auth.role() IS NOT NULL
  );

CREATE POLICY "Module states are updatable by authenticated users"
  ON module_states FOR UPDATE
  USING (
    auth.role() IS NOT NULL
  );

CREATE POLICY "Module states are deletable by authenticated users"
  ON module_states FOR DELETE
  USING (
    auth.role() IS NOT NULL
  );

-- Ensure core modules cannot be deactivated
CREATE OR REPLACE FUNCTION prevent_core_module_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.module_id IN ('dashboard', 'settings', 'notifications', 'leads', 'modules') 
     AND NEW.status = 'inactive' THEN
    RAISE EXCEPTION 'Cannot deactivate core module';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_core_modules ON module_states;
CREATE TRIGGER enforce_core_modules
  BEFORE UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION prevent_core_module_deactivation();

-- Insert or update core modules to ensure they're active
INSERT INTO module_states (module_id, status) VALUES
  ('dashboard', 'active'),
  ('settings', 'active'),
  ('notifications', 'active'),
  ('leads', 'active'),
  ('modules', 'active')
ON CONFLICT (module_id) DO UPDATE 
SET status = 'active'
WHERE module_states.module_id IN ('dashboard', 'settings', 'notifications', 'leads', 'modules');