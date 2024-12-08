-- Drop existing tables if they exist
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS lead_sources CASCADE;
DROP TABLE IF EXISTS lead_destinations CASCADE;
DROP TABLE IF EXISTS lead_trip_types CASCADE;

-- Create lead_sources table
CREATE TABLE IF NOT EXISTS lead_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'safaribookings', 'facebook', 'google', 'manual', 'import', 
    'referral', 'linkedin', 'email', 'viator', 'instagram', 'website'
  )),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_destinations table
CREATE TABLE IF NOT EXISTS lead_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead_trip_types table
CREATE TABLE IF NOT EXISTS lead_trip_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN (
    'safaribookings', 'facebook', 'google', 'manual', 'import',
    'referral', 'linkedin', 'email', 'viator', 'instagram', 'website'
  )),
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  destinations TEXT[] NOT NULL DEFAULT '{}',
  trip_type TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 1,
  arrival_date DATE,
  adults INTEGER NOT NULL DEFAULT 1,
  children INTEGER NOT NULL DEFAULT 0,
  budget DECIMAL,
  message TEXT,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT[] DEFAULT '{}'
);

-- Create lead_activities table
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN (
    'status_change', 'note_added', 'email_sent', 'call_made', 
    'document_added', 'follow_up_scheduled', 'proposal_sent'
  )),
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial data if lead_sources is empty
INSERT INTO lead_sources (name, type)
SELECT name, type
FROM (VALUES
  ('SafariBookings', 'safaribookings'),
  ('Facebook Ads', 'facebook'),
  ('Google Ads', 'google'),
  ('Manual Entry', 'manual'),
  ('File Import', 'import'),
  ('Referral', 'referral'),
  ('LinkedIn', 'linkedin'),
  ('Email', 'email'),
  ('Viator', 'viator'),
  ('Instagram', 'instagram'),
  ('Website', 'website')
) AS source_data(name, type)
WHERE NOT EXISTS (SELECT 1 FROM lead_sources);

-- Enable RLS
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_trip_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Public read access to lead_sources" ON lead_sources;
DROP POLICY IF EXISTS "Public read access to lead_destinations" ON lead_destinations;
DROP POLICY IF EXISTS "Public read access to lead_trip_types" ON lead_trip_types;
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON leads;
DROP POLICY IF EXISTS "Users can view their assigned leads" ON leads;
DROP POLICY IF EXISTS "Users can view lead activities" ON lead_activities;

-- Create RLS policies
CREATE POLICY "Public read access to lead_sources"
  ON lead_sources FOR SELECT
  USING (true);

CREATE POLICY "Public read access to lead_destinations"
  ON lead_destinations FOR SELECT
  USING (true);

CREATE POLICY "Public read access to lead_trip_types"
  ON lead_trip_types FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert leads"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view their assigned leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view lead activities"
  ON lead_activities FOR SELECT
  USING (auth.role() = 'authenticated');