-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create modules table
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT CHECK (category IN ('core', 'crm', 'operations', 'finance', 'reporting', 'automation')),
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'inactive',
  icon TEXT,
  version TEXT NOT NULL DEFAULT '1.0.0',
  is_core BOOLEAN DEFAULT false,
  dependencies JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  setup_required BOOLEAN DEFAULT false,
  subscription_required TEXT CHECK (subscription_required IN ('free', 'basic', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create module_states table to track per-company module activation
CREATE TABLE module_states (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create module_logs table for audit trail
CREATE TABLE module_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Modules are viewable by authenticated users"
  ON modules FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module states are viewable by authenticated users"
  ON module_states FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module states are updatable by authenticated users"
  ON module_states FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Module logs are viewable by authenticated users"
  ON module_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert core modules
INSERT INTO modules (name, description, category, status, is_core, icon, features) VALUES
  ('Dashboard', 'Main system dashboard and analytics', 'core', 'active', true, 'LayoutDashboard', 
   '["Overview analytics", "Quick actions", "Recent activity"]'::jsonb),
  ('Settings', 'System configuration and preferences', 'core', 'active', true, 'Settings2',
   '["User preferences", "System settings", "Customization"]'::jsonb),
  ('Notifications', 'System notifications and alerts', 'core', 'active', true, 'Bell',
   '["Real-time alerts", "Email notifications", "Custom preferences"]'::jsonb),
  ('Leads', 'Lead management system', 'core', 'active', true, 'UserPlus',
   '["Lead tracking", "Pipeline management", "Follow-up automation"]'::jsonb);

-- Insert default module states for core modules
INSERT INTO module_states (module_id, status) VALUES
  ('dashboard', 'active'),
  ('settings', 'active'),
  ('notifications', 'active'),
  ('leads', 'active'),
  ('client-management', 'active'),
  ('task-management', 'active'),
  ('document-management', 'active'),
  ('invoicing', 'active'),
  ('itinerary-builder', 'active'),
  ('advanced-reporting', 'active'),
  ('staff-management', 'active'),
  ('office-management', 'active')
ON CONFLICT (module_id) DO UPDATE 
SET status = CASE
  WHEN module_states.module_id IN ('dashboard', 'settings', 'notifications', 'leads') THEN 'active'
  ELSE EXCLUDED.status
END;