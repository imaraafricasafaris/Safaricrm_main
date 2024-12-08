-- Drop existing table if it exists
DROP TABLE IF EXISTS module_states;

-- Create a simplified module_states table
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

-- Create policies
CREATE POLICY "Module states are viewable by authenticated users"
  ON module_states FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module states are insertable by authenticated users"
  ON module_states FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Module states are updatable by authenticated users"
  ON module_states FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Insert initial active modules
INSERT INTO module_states (module_id, status) VALUES
  ('dashboard', 'active'),
  ('lead-management', 'active'),
  ('clients', 'active'),
  ('documents', 'active'),
  ('settings', 'active')
ON CONFLICT (module_id) DO UPDATE SET status = EXCLUDED.status;