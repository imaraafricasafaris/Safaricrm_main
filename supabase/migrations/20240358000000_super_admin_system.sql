-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create companies table
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subscription_plan TEXT CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
  status TEXT CHECK (status IN ('active', 'suspended', 'cancelled')) DEFAULT 'active',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create subscription_plans table
CREATE TABLE subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL NOT NULL,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')),
  features JSONB NOT NULL,
  module_limits JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create company_subscriptions table
CREATE TABLE company_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  status TEXT CHECK (status IN ('active', 'cancelled', 'expired')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  auto_renew BOOLEAN DEFAULT true,
  payment_method JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key TEXT NOT NULL UNIQUE,
  status TEXT CHECK (status IN ('active', 'revoked')) DEFAULT 'active',
  permissions JSONB DEFAULT '[]'::jsonb,
  last_used TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_usage_logs table
CREATE TABLE api_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INTEGER NOT NULL,
  response_time INTEGER, -- in milliseconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create system_health_logs table
CREATE TABLE system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('error', 'warning', 'info')),
  component TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create super_admin_settings table
CREATE TABLE super_admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE super_admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Companies are viewable by super admins"
  ON companies FOR SELECT
  USING (auth.jwt() ->> 'role' = 'super_admin');

CREATE POLICY "Subscription plans are viewable by authenticated users"
  ON subscription_plans FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Company subscriptions are viewable by company members and super admins"
  ON company_subscriptions FOR SELECT
  USING (
    auth.jwt() ->> 'role' = 'super_admin' OR
    EXISTS (
      SELECT 1 FROM companies c
      WHERE c.id = company_subscriptions.company_id
      AND auth.uid() IN (
        SELECT user_id FROM profiles
        WHERE company_id = c.id
      )
    )
  );

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price, billing_period, features, module_limits) VALUES
  ('Basic', 'Essential features for small safari companies', 49.99, 'monthly',
   '{"max_users": 5, "storage": "10GB", "email_support": true}'::jsonb,
   '{"max_active_modules": 5}'::jsonb),
  ('Premium', 'Advanced features for growing companies', 99.99, 'monthly',
   '{"max_users": 15, "storage": "50GB", "priority_support": true}'::jsonb,
   '{"max_active_modules": 10}'::jsonb),
  ('Enterprise', 'Full feature set for large operations', 199.99, 'monthly',
   '{"max_users": -1, "storage": "unlimited", "dedicated_support": true}'::jsonb,
   '{"max_active_modules": -1}'::jsonb);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_subscriptions_updated_at
  BEFORE UPDATE ON company_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at
  BEFORE UPDATE ON api_keys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();