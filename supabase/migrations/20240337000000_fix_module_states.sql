-- Drop existing table if it exists
DROP TABLE IF EXISTS module_states;

-- Create module_states table with proper constraints
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

-- Insert initial module states
INSERT INTO module_states (module_id, status) VALUES
  -- Core modules (always active)
  ('dashboard', 'active'),
  ('settings', 'active'),
  ('notifications', 'active'),
  
  -- Default active modules
  ('lead-management', 'active'),
  ('task-management', 'active'),
  ('document-management', 'active'),
  ('invoicing', 'active'),
  ('itinerary-builder', 'active'),
  
  -- Optional modules (initially inactive)
  ('safari-packages', 'inactive'),
  ('vehicle-fleet', 'inactive'),
  ('guide-management', 'inactive'),
  ('accommodation', 'inactive'),
  ('activities', 'inactive'),
  ('email-automation', 'inactive'),
  ('advanced-reporting', 'inactive'),
  ('calendar', 'inactive')
ON CONFLICT (module_id) DO UPDATE 
SET status = EXCLUDED.status;