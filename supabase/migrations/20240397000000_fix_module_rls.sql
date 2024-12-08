-- Drop existing RLS policies
DROP POLICY IF EXISTS "Module states are viewable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are insertable by authenticated users" ON module_states;
DROP POLICY IF EXISTS "Module states are updatable by authenticated users" ON module_states;

-- Create new RLS policies with proper authentication checks
CREATE POLICY "Module states are viewable by authenticated users"
  ON module_states FOR SELECT
  USING (
    auth.role() IS NOT NULL
  );

CREATE POLICY "Module states are insertable by authenticated users"
  ON module_states FOR INSERT
  WITH CHECK (
    auth.role() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'authenticated'
    )
  );

CREATE POLICY "Module states are updatable by authenticated users"
  ON module_states FOR UPDATE
  USING (
    auth.role() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'authenticated'
    )
  );

-- Create policy for delete operations
CREATE POLICY "Module states are deletable by authenticated users"
  ON module_states FOR DELETE
  USING (
    auth.role() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'authenticated'
    )
  );

-- Ensure core modules cannot be deactivated
CREATE OR REPLACE FUNCTION prevent_core_module_deactivation()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.module_id IN ('dashboard', 'settings', 'notifications', 'leads') 
     AND NEW.status = 'inactive' THEN
    RAISE EXCEPTION 'Cannot deactivate core module';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_core_modules
  BEFORE UPDATE ON module_states
  FOR EACH ROW
  EXECUTE FUNCTION prevent_core_module_deactivation();