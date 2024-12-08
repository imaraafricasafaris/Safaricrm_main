-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  response_time INTEGER NOT NULL, -- in milliseconds
  request_body JSONB,
  response_body JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create API documentation table
CREATE TABLE api_documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint_id UUID REFERENCES api_endpoints(id),
  version TEXT NOT NULL,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create API webhooks table
CREATE TABLE api_webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  retry_count INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create webhook delivery logs table
CREATE TABLE webhook_delivery_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  webhook_id UUID REFERENCES api_webhooks(id),
  event TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  attempt_count INTEGER DEFAULT 0,
  successful BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_documentation ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_delivery_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Super admins can manage API keys"
  ON api_keys FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

CREATE POLICY "Super admins can manage API endpoints"
  ON api_endpoints FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

CREATE POLICY "API usage logs are viewable by super admins"
  ON api_usage_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.role = 'super_admin'
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION generate_api_key() RETURNS TEXT AS $$
DECLARE
  key TEXT;
BEGIN
  key := encode(gen_random_bytes(32), 'base64');
  RETURN regexp_replace(key, '[^a-zA-Z0-9]', '', 'g');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION log_api_call()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO api_usage_logs (
    api_key_id,
    endpoint_id,
    method,
    path,
    status_code,
    response_time,
    request_body,
    response_body,
    ip_address,
    user_agent
  ) VALUES (
    NEW.api_key_id,
    NEW.endpoint_id,
    NEW.method,
    NEW.path,
    NEW.status_code,
    NEW.response_time,
    NEW.request_body,
    NEW.response_body,
    NEW.ip_address,
    NEW.user_agent
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER log_api_usage
  AFTER INSERT ON api_usage_logs
  FOR EACH ROW
  EXECUTE FUNCTION log_api_call();

-- Insert initial API endpoints
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
  ('/api/v1/staff/{id}', 'DELETE', 'Delete staff member', 'v1'),
  ('/api/v1/offices', 'GET', 'Get all offices', 'v1'),
  ('/api/v1/offices', 'POST', 'Create a new office', 'v1'),
  ('/api/v1/offices/{id}', 'GET', 'Get office by ID', 'v1'),
  ('/api/v1/offices/{id}', 'PUT', 'Update office', 'v1'),
  ('/api/v1/offices/{id}', 'DELETE', 'Delete office', 'v1');