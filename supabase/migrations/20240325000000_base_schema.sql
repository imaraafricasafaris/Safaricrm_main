-- Drop existing tables if they exist
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS lead_sources CASCADE;
DROP TABLE IF EXISTS lead_destinations CASCADE;
DROP TABLE IF EXISTS lead_trip_types CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('admin', 'manager', 'agent')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead sources table
CREATE TABLE lead_sources (
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

-- Create lead destinations table
CREATE TABLE lead_destinations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead trip types table
CREATE TABLE lead_trip_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN (
    'safaribookings', 'facebook', 'google', 'manual', 'import',
    'referral', 'linkedin', 'email', 'viator', 'instagram', 'website'
  )),
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead activities table
CREATE TABLE lead_activities (
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_trip_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Public read access to lead sources"
  ON lead_sources FOR SELECT
  USING (true);

CREATE POLICY "Public read access to lead destinations"
  ON lead_destinations FOR SELECT
  USING (true);

CREATE POLICY "Public read access to lead trip types"
  ON lead_trip_types FOR SELECT
  USING (true);

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

CREATE POLICY "Users can view lead activities"
  ON lead_activities FOR SELECT
  USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO lead_sources (name, type) VALUES
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
  ('Website', 'website');

INSERT INTO lead_destinations (name, country, region) VALUES
  ('Serengeti National Park', 'Tanzania', 'East Africa'),
  ('Masai Mara', 'Kenya', 'East Africa'),
  ('Kruger National Park', 'South Africa', 'Southern Africa'),
  ('Ngorongoro Crater', 'Tanzania', 'East Africa'),
  ('Okavango Delta', 'Botswana', 'Southern Africa'),
  ('Victoria Falls', 'Zimbabwe', 'Southern Africa'),
  ('Chobe National Park', 'Botswana', 'Southern Africa'),
  ('Amboseli National Park', 'Kenya', 'East Africa');

INSERT INTO lead_trip_types (name, description) VALUES
  ('Wildlife Safari', 'Classic game drives to observe African wildlife'),
  ('Photography Tour', 'Specialized safari focused on wildlife photography'),
  ('Luxury Safari', 'High-end accommodations and exclusive experiences'),
  ('Family Safari', 'Kid-friendly activities and accommodations'),
  ('Adventure Safari', 'Combining game drives with hiking and camping'),
  ('Cultural Tour', 'Immersive experiences with local communities'),
  ('Honeymoon Safari', 'Romantic getaways with luxury and privacy');