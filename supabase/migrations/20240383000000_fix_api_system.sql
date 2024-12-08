-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS webhook_delivery_logs CASCADE;
DROP TABLE IF EXISTS api_webhooks CASCADE;
DROP TABLE IF EXISTS api_documentation CASCADE;
DROP TABLE IF EXISTS api_usage_logs CASCADE;
DROP TABLE IF EXISTS api_endpoints CASCADE;
DROP TABLE IF EXISTS api_keys CASCADE;

-- Create API keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  secret TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'revoked', 'expired')) DEFAULT 'active',
  permissions JSONB DEFAULT '[]'::jsonb,
  rate_limit INTEGER DEFAULT 1000,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create API endpoints table
CREATE TABLE api_endpoints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  method TEXT NOT NULL,
  description TEXT,
  version TEXT NOT NULL,
  auth_required BOOLEAN DEFAULT true,
  rate_limit INTEGER DEFAULT 1000,
  cache_ttl INTEGER DEFAULT 0,
  deprecated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create API usage logs table
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id),
  endpoint_id UUID REFERENCES api_endpoints(id),
  method TEXT NOT NULL,
  path TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER NOT NULL,
  request_body JSONB,
  response_body JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can view API keys"
  ON api_keys FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage API keys"
  ON api_keys FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view API endpoints"
  ON api_endpoints FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view API usage logs"
  ON api_usage_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert sample API endpoints
INSERT INTO api_endpoints (path, method, description, version) VALUES
  ('/api/v1/leads', 'GET', 'Get all leads', 'v1'),
  ('/api/v1/leads', 'POST', 'Create a new lead', 'v1'),
  ('/api/v1/leads/{id}', 'GET', 'Get lead by ID', 'v1'),
  ('/api/v1/leads/{id}', 'PUT', 'Update lead', 'v1'),
  ('/api/v1/leads/{id}', 'DELETE', 'Delete lead', 'v1'),
  ('/api/v1/staff', 'GET', 'Get all staff members', 'v1'),
  ('/api/v1/staff', 'POST', 'Create a new staff member', 'v1'),
  ('/api/v1/staff/{id}', 'GET', 'Get staff member by ID', 'v1'),
  ('/api/v1/staff/{id}', 'PUT', 'Update staff member', 'v1'),
  ('/api/v1/staff/{id}', 'DELETE', 'Delete staff member', 'v1');

-- Insert sample API key
INSERT INTO api_keys (name, key, secret, permissions) VALUES
  ('Test API Key', 'test_key_123', 'test_secret_456', '["read", "write"]'::jsonb);

-- Insert sample API usage logs
INSERT INTO api_usage_logs (
  api_key_id,
  endpoint_id,
  method,
  path,
  status_code,
  response_time,
  created_at
)
SELECT
  (SELECT id FROM api_keys LIMIT 1),
  (SELECT id FROM api_endpoints WHERE method = 'GET' AND path = '/api/v1/leads'),
  'GET',
  '/api/v1/leads',
  200,
  floor(random() * 500 + 100)::integer,
  NOW() - (i || ' minutes')::interval
FROM generate_series(1, 100) i;