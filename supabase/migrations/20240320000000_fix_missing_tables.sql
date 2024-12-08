-- Drop existing tables if they exist
DROP TABLE IF EXISTS lead_activities CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS lead_sources CASCADE;
DROP TABLE IF EXISTS lead_destinations CASCADE;
DROP TABLE IF EXISTS lead_trip_types CASCADE;

-- Lead Sources
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

-- Lead Destinations
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

-- Lead Trip Types
CREATE TABLE lead_trip_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN (
    'safaribookings', 'facebook', 'google', 'manual', 'import',
    'referral', 'linkedin', 'email', 'viator', 'instagram', 'website'
  )),
  source_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  
  -- Contact Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  country TEXT NOT NULL,
  
  -- Trip Details
  destinations TEXT[] NOT NULL,
  trip_type TEXT[] NOT NULL,
  duration INTEGER NOT NULL,
  arrival_date DATE,
  adults INTEGER NOT NULL,
  children INTEGER NOT NULL DEFAULT 0,
  budget DECIMAL,
  message TEXT,
  
  -- Marketing
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Internal
  assigned_to UUID REFERENCES auth.users(id),
  notes TEXT[],
  tags TEXT[],
  
  -- Follow-ups
  last_contact TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  follow_up_notes TEXT
);

-- Lead Activity Log
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

-- Initial Data
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

-- Initial Destinations Data
INSERT INTO lead_destinations (name, country, region) VALUES
  ('Serengeti National Park', 'Tanzania', 'East Africa'),
  ('Masai Mara', 'Kenya', 'East Africa'),
  ('Kruger National Park', 'South Africa', 'Southern Africa'),
  ('Ngorongoro Crater', 'Tanzania', 'East Africa'),
  ('Okavango Delta', 'Botswana', 'Southern Africa'),
  ('Victoria Falls', 'Zimbabwe', 'Southern Africa'),
  ('Chobe National Park', 'Botswana', 'Southern Africa'),
  ('Amboseli National Park', 'Kenya', 'East Africa');

-- Initial Trip Types Data
INSERT INTO lead_trip_types (name, description) VALUES
  ('Wildlife Safari', 'Classic game drives to observe African wildlife in their natural habitat'),
  ('Photography Tour', 'Specialized safari focused on capturing the perfect wildlife and landscape shots'),
  ('Luxury Safari', 'High-end accommodations and exclusive experiences for the discerning traveler'),
  ('Family Safari', 'Kid-friendly activities and accommodations perfect for the whole family'),
  ('Adventure Safari', 'Combining game drives with activities like hiking and camping'),
  ('Cultural Tour', 'Immersive experiences with local communities and traditional cultures'),
  ('Honeymoon Safari', 'Romantic getaways combining luxury, privacy, and unforgettable experiences');

-- RLS Policies
ALTER TABLE lead_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_trip_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Lead Sources Policies
CREATE POLICY "Lead sources are viewable by authenticated users"
  ON lead_sources FOR SELECT
  USING (auth.role() = 'authenticated');

-- Lead Destinations Policies
CREATE POLICY "Lead destinations are viewable by authenticated users"
  ON lead_destinations FOR SELECT
  USING (auth.role() = 'authenticated');

-- Lead Trip Types Policies
CREATE POLICY "Lead trip types are viewable by authenticated users"
  ON lead_trip_types FOR SELECT
  USING (auth.role() = 'authenticated');

-- Leads Policies
CREATE POLICY "Users can view leads assigned to them or if they're admin/manager"
  ON leads FOR SELECT
  USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

CREATE POLICY "Users can insert leads if authenticated"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update leads assigned to them or if they're admin/manager"
  ON leads FOR UPDATE
  USING (
    assigned_to = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE user_id = auth.uid() 
      AND role IN ('admin', 'manager')
    )
  );

-- Lead Activities Policies
CREATE POLICY "Users can view activities for leads they have access to"
  ON lead_activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = lead_activities.lead_id
      AND (
        leads.assigned_to = auth.uid() OR
        EXISTS (
          SELECT 1 FROM profiles
          WHERE user_id = auth.uid()
          AND role IN ('admin', 'manager')
        )
      )
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION log_lead_activity()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log status changes
    IF NEW.status <> OLD.status THEN
      INSERT INTO lead_activities (lead_id, user_id, type, description, metadata)
      VALUES (
        NEW.id,
        auth.uid(),
        'status_change',
        format('Status changed from %s to %s', OLD.status, NEW.status),
        jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
      );
    END IF;
    
    -- Log assignment changes
    IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
      INSERT INTO lead_activities (lead_id, user_id, type, description, metadata)
      VALUES (
        NEW.id,
        auth.uid(),
        'note_added',
        'Lead assignment changed',
        jsonb_build_object('old_assigned_to', OLD.assigned_to, 'new_assigned_to', NEW.assigned_to)
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER on_lead_update
  AFTER UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_activity();