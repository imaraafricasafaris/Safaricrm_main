-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS safari_packages CASCADE;
DROP TABLE IF EXISTS itineraries CASCADE;
DROP TABLE IF EXISTS itinerary_days CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS email_templates CASCADE;
DROP TABLE IF EXISTS automated_workflows CASCADE;
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
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  timezone TEXT,
  preferences JSONB DEFAULT '{}'::jsonb,
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
  settings JSONB DEFAULT '{}'::jsonb,
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
  highlights TEXT[],
  best_time_to_visit TEXT[],
  activities TEXT[],
  wildlife TEXT[],
  accommodation_types TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create lead trip types table
CREATE TABLE lead_trip_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  min_duration INTEGER,
  max_duration INTEGER,
  recommended_destinations UUID[],
  included_activities TEXT[],
  target_audience TEXT[],
  price_range JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_recommended_destinations 
    CHECK (recommended_destinations <@ (SELECT ARRAY_AGG(id) FROM lead_destinations))
);

-- Create leads table with expanded fields
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN (
    'safaribookings', 'facebook', 'google', 'manual', 'import',
    'referral', 'linkedin', 'email', 'viator', 'instagram', 'website'
  )),
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  preferred_contact_method TEXT CHECK (preferred_contact_method IN ('email', 'phone', 'whatsapp')),
  country TEXT NOT NULL,
  city TEXT,
  timezone TEXT,
  
  -- Trip Details
  destinations TEXT[] NOT NULL DEFAULT '{}',
  trip_type TEXT[] NOT NULL DEFAULT '{}',
  duration INTEGER NOT NULL DEFAULT 1,
  arrival_date DATE,
  departure_date DATE,
  flexibility TEXT CHECK (flexibility IN ('fixed', 'flexible', 'very_flexible')),
  adults INTEGER NOT NULL DEFAULT 1 CHECK (adults >= 1),
  children INTEGER NOT NULL DEFAULT 0 CHECK (children >= 0),
  child_ages INTEGER[],
  budget DECIMAL,
  budget_currency TEXT DEFAULT 'USD',
  budget_flexibility TEXT CHECK (budget_flexibility IN ('fixed', 'flexible', 'very_flexible')),
  accommodation_preference TEXT CHECK (accommodation_preference IN ('luxury', 'comfort', 'mid_range', 'budget')),
  special_requirements TEXT,
  dietary_requirements TEXT[],
  
  -- Marketing & Source
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  newsletter_subscription BOOLEAN DEFAULT false,
  referral_source TEXT,
  referral_details TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Internal
  assigned_to UUID REFERENCES auth.users(id),
  lead_owner UUID REFERENCES auth.users(id),
  lead_score INTEGER CHECK (lead_score BETWEEN 0 AND 100),
  lead_temperature TEXT CHECK (lead_temperature IN ('hot', 'warm', 'cold')),
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
  lifecycle_stage TEXT CHECK (lifecycle_stage IN (
    'subscriber', 'lead', 'marketing_qualified_lead',
    'sales_qualified_lead', 'opportunity', 'customer',
    'evangelist', 'other'
  )),
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}'::jsonb,
  
  -- Follow-ups
  last_contact TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  follow_up_notes TEXT,
  follow_up_type TEXT CHECK (follow_up_type IN ('call', 'email', 'meeting', 'task')),
  follow_up_priority TEXT CHECK (follow_up_priority IN ('high', 'medium', 'low')),
  
  -- Proposal & Booking
  proposal_sent_date TIMESTAMPTZ,
  proposal_value DECIMAL,
  proposal_status TEXT CHECK (proposal_status IN ('draft', 'sent', 'viewed', 'accepted', 'rejected')),
  booking_status TEXT CHECK (booking_status IN ('not_booked', 'tentative', 'confirmed', 'completed', 'cancelled')),
  payment_status TEXT CHECK (payment_status IN ('not_paid', 'partial', 'full', 'refunded')),
  
  -- System
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
    'document_added', 'follow_up_scheduled', 'proposal_sent',
    'payment_received', 'booking_status_changed'
  )),
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create safari packages table
CREATE TABLE safari_packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  destinations UUID[] REFERENCES lead_destinations(id),
  price_from DECIMAL NOT NULL,
  price_to DECIMAL,
  currency TEXT DEFAULT 'USD',
  included_activities TEXT[],
  accommodation_level TEXT CHECK (accommodation_level IN ('budget', 'mid_range', 'luxury', 'ultra_luxury')),
  max_participants INTEGER,
  highlights TEXT[],
  itinerary JSONB,
  inclusions TEXT[],
  exclusions TEXT[],
  terms_conditions TEXT,
  is_private BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create itineraries table
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  package_id UUID REFERENCES safari_packages(id),
  name TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  status TEXT CHECK (status IN ('draft', 'sent', 'accepted', 'rejected')),
  total_price DECIMAL,
  currency TEXT DEFAULT 'USD',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create itinerary days table
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  location TEXT NOT NULL,
  accommodation TEXT,
  activities TEXT[],
  meals_included TEXT[] CHECK (meals_included <@ ARRAY['breakfast', 'lunch', 'dinner']),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('proposal', 'invoice', 'contract', 'itinerary', 'other')),
  url TEXT NOT NULL,
  version INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'signed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'USD',
  payment_date TIMESTAMPTZ NOT NULL,
  payment_method TEXT CHECK (payment_method IN ('credit_card', 'bank_transfer', 'paypal', 'other')),
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  reference_number TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create email templates table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT CHECK (type IN ('inquiry', 'follow_up', 'proposal', 'confirmation', 'reminder', 'thank_you')),
  variables JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create automated workflows table
CREATE TABLE automated_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_event TEXT CHECK (trigger_event IN (
    'lead_created', 'status_changed', 'document_sent',
    'payment_received', 'follow_up_due'
  )),
  conditions JSONB,
  actions JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_trip_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE safari_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_workflows ENABLE ROW LEVEL SECURITY;

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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, email)
  VALUES (new.id, 'agent', new.email);
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language plpgsql;

-- Create updated_at triggers for all tables
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_safari_packages_updated_at
  BEFORE UPDATE ON safari_packages
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add more triggers for other tables as needed