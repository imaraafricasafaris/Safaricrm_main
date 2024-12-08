-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create integrations table
CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL CHECK (type IN ('payment', 'email', 'calendar', 'storage', 'analytics')),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'error', 'pending')),
  credentials JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb,
  modules TEXT[] NOT NULL,
  required_permissions TEXT[] NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_sync TIMESTAMPTZ,
  error_message TEXT
);

-- Create integration_logs table
CREATE TABLE integration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  integration_id UUID REFERENCES integrations(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'error')),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE integration_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Integrations are viewable by authenticated users"
  ON integrations FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Integration logs are viewable by authenticated users"
  ON integration_logs FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert initial integrations
INSERT INTO integrations (type, name, provider, description, status, modules, required_permissions) VALUES
  ('payment', 'Stripe', 'stripe', 'Process credit card payments', 'inactive', 
   ARRAY['finance', 'invoicing'], ARRAY['manage_payments']),
  ('payment', 'PayPal', 'paypal', 'Process PayPal payments', 'inactive',
   ARRAY['finance', 'invoicing'], ARRAY['manage_payments']),
  ('email', 'SendGrid', 'sendgrid', 'Send transactional emails', 'inactive',
   ARRAY['notifications', 'marketing'], ARRAY['manage_emails']),
  ('email', 'Mailchimp', 'mailchimp', 'Email marketing automation', 'inactive',
   ARRAY['marketing', 'notifications'], ARRAY['manage_marketing']),
  ('calendar', 'Google Calendar', 'google', 'Calendar integration', 'inactive',
   ARRAY['scheduling', 'bookings'], ARRAY['manage_calendar']),
  ('calendar', 'Outlook Calendar', 'microsoft', 'Calendar integration', 'inactive',
   ARRAY['scheduling', 'bookings'], ARRAY['manage_calendar']),
  ('storage', 'AWS S3', 'aws', 'Cloud file storage', 'inactive',
   ARRAY['documents', 'media'], ARRAY['manage_storage']),
  ('analytics', 'Google Analytics', 'google', 'Website analytics', 'inactive',
   ARRAY['reporting', 'marketing'], ARRAY['view_analytics']);