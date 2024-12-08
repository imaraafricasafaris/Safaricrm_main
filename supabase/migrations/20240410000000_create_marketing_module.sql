-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create email_campaigns table
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('draft', 'scheduled', 'sent', 'error')),
  scheduled_date TIMESTAMPTZ,
  sent_date TIMESTAMPTZ,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  open_rate DECIMAL,
  click_rate DECIMAL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create social_posts table
CREATE TABLE social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform TEXT CHECK (platform IN ('facebook', 'instagram', 'linkedin', 'twitter')),
  content TEXT NOT NULL,
  media_urls TEXT[],
  status TEXT CHECK (status IN ('draft', 'scheduled', 'published', 'error')),
  scheduled_date TIMESTAMPTZ,
  published_date TIMESTAMPTZ,
  engagement_stats JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_workflows table
CREATE TABLE lead_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  trigger_type TEXT CHECK (trigger_type IN ('new_lead', 'status_change', 'tag_added', 'custom')),
  trigger_conditions JSONB NOT NULL,
  steps JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create marketing_providers table
CREATE TABLE marketing_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'social', 'sms')),
  credentials JSONB NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb,
  status TEXT CHECK (status IN ('active', 'inactive', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_providers ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Authenticated users can manage email campaigns"
  ON email_campaigns FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage social posts"
  ON social_posts FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage lead workflows"
  ON lead_workflows FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage marketing providers"
  ON marketing_providers FOR ALL
  USING (auth.role() = 'authenticated');

-- Add marketing-automation module to module_states
INSERT INTO module_states (module_id, status, settings) VALUES
  ('marketing-automation', 'inactive', jsonb_build_object(
    'name', 'Marketing Automation',
    'description', 'Automate marketing campaigns and lead nurturing',
    'category', 'marketing',
    'features', array[
      'Email campaigns',
      'Social media scheduling',
      'Lead nurturing workflows',
      'Marketing analytics'
    ]
  ))
ON CONFLICT (module_id) DO UPDATE 
SET settings = EXCLUDED.settings;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_email_campaigns_timestamp
  BEFORE UPDATE ON email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_posts_timestamp
  BEFORE UPDATE ON social_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_workflows_timestamp
  BEFORE UPDATE ON lead_workflows
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_marketing_providers_timestamp
  BEFORE UPDATE ON marketing_providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();