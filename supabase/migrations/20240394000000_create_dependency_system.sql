-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create module_dependencies table
CREATE TABLE module_dependencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_module TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  target_module TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('required', 'optional', 'recommended')),
  priority TEXT NOT NULL CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
  description TEXT,
  api_endpoints TEXT[],
  shared_resources TEXT[],
  failure_impact INTEGER CHECK (failure_impact BETWEEN 1 AND 5),
  mttr_estimate INTEGER, -- in minutes
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_module, target_module)
);

-- Create dependency_validation_logs table
CREATE TABLE dependency_validation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT REFERENCES module_states(module_id) ON DELETE CASCADE,
  validation_type TEXT NOT NULL,
  is_valid BOOLEAN NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE module_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependency_validation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Dependencies are viewable by authenticated users"
  ON module_dependencies FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Validation logs are viewable by authenticated users"
  ON dependency_validation_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_dependency_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for updating timestamps
CREATE TRIGGER update_dependencies_timestamp
  BEFORE UPDATE ON module_dependencies
  FOR EACH ROW
  EXECUTE FUNCTION update_dependency_timestamp();

-- Create function to validate dependencies
CREATE OR REPLACE FUNCTION validate_module_dependencies(module_id TEXT)
RETURNS JSONB AS $$
DECLARE
  missing_deps TEXT[];
  circular_deps TEXT[][];
  critical_deps UUID[];
BEGIN
  -- Check for missing dependencies
  SELECT ARRAY_AGG(target_module)
  INTO missing_deps
  FROM module_dependencies md
  WHERE md.source_module = module_id
  AND NOT EXISTS (
    SELECT 1 FROM module_states ms
    WHERE ms.module_id = md.target_module
    AND ms.status = 'active'
  );

  -- Check for circular dependencies
  WITH RECURSIVE dependency_chain AS (
    SELECT source_module, target_module, ARRAY[source_module] as chain
    FROM module_dependencies
    WHERE source_module = module_id
    UNION ALL
    SELECT md.source_module, md.target_module, dc.chain || md.source_module
    FROM module_dependencies md
    JOIN dependency_chain dc ON md.source_module = dc.target_module
    WHERE NOT md.source_module = ANY(dc.chain)
  )
  SELECT ARRAY_AGG(DISTINCT chain)
  INTO circular_deps
  FROM dependency_chain
  WHERE source_module = ANY(chain[2:]);

  -- Get critical dependencies
  SELECT ARRAY_AGG(id)
  INTO critical_deps
  FROM module_dependencies
  WHERE source_module = module_id
  AND priority IN ('P0', 'P1')
  AND type = 'required';

  RETURN jsonb_build_object(
    'missing_dependencies', missing_deps,
    'circular_dependencies', circular_deps,
    'critical_dependencies', critical_deps
  );
END;
$$ LANGUAGE plpgsql;