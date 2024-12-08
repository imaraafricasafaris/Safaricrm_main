-- Drop existing leads table if it exists
DROP TABLE IF EXISTS leads CASCADE;

-- Create leads table with expanded fields
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Basic Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  company TEXT,
  
  -- Lead Status & Source
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  source TEXT NOT NULL CHECK (source IN ('website', 'referral', 'social', 'email', 'manual', 'import')),
  lead_score INTEGER CHECK (lead_score BETWEEN 0 AND 100),
  lead_temperature TEXT CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Trip Details
  destinations TEXT[] NOT NULL DEFAULT '{}',
  trip_type TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 1,
  arrival_date DATE,
  departure_date DATE,
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  child_ages INTEGER[],
  budget DECIMAL,
  budget_currency TEXT DEFAULT 'USD',
  budget_flexibility TEXT CHECK (budget_flexibility IN ('fixed', 'flexible', 'very_flexible')),
  accommodation_preference TEXT CHECK (accommodation_preference IN ('luxury', 'comfort', 'mid_range', 'budget')),
  special_requirements TEXT,
  dietary_requirements TEXT[],
  
  -- Marketing & Communication
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
  newsletter_subscription BOOLEAN DEFAULT false,
  referral_source TEXT,
  referral_details TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Internal Notes & Follow-up
  notes TEXT,
  last_contact TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  follow_up_notes TEXT,
  follow_up_type TEXT CHECK (follow_up_type IN ('call', 'email', 'meeting', 'task')),
  follow_up_priority TEXT CHECK (follow_up_priority IN ('high', 'medium', 'low')),
  
  -- System Fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Authenticated users can view leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update assigned leads"
  ON leads FOR UPDATE
  USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_leads_timestamp
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_leads_updated_at();