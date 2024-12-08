-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist
DROP TABLE IF EXISTS office_metrics CASCADE;
DROP TABLE IF EXISTS staff_offices CASCADE;
DROP TABLE IF EXISTS offices CASCADE;

-- Create offices table
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID,
  name VARCHAR(255) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address TEXT,
  timezone VARCHAR(100),
  currency VARCHAR(10),
  status TEXT CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff_offices table
CREATE TABLE staff_offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL,
  office_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (staff_id, office_id)
);

-- Create office_metrics table
CREATE TABLE office_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  office_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  value NUMERIC NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add foreign key constraints
ALTER TABLE staff_offices
ADD CONSTRAINT fk_staff 
FOREIGN KEY (staff_id) 
REFERENCES staff(id) 
ON DELETE CASCADE;

ALTER TABLE staff_offices
ADD CONSTRAINT fk_office 
FOREIGN KEY (office_id) 
REFERENCES offices(id) 
ON DELETE CASCADE;

ALTER TABLE office_metrics
ADD CONSTRAINT fk_office_metrics 
FOREIGN KEY (office_id) 
REFERENCES offices(id) 
ON DELETE CASCADE;

-- Enable Row Level Security
ALTER TABLE offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_offices ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Authenticated users can view offices"
  ON offices FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert offices"
  ON offices FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update offices"
  ON offices FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete offices"
  ON offices FOR DELETE
  USING (auth.role() = 'authenticated');

-- Create policies for staff_offices
CREATE POLICY "Authenticated users can view staff_offices"
  ON staff_offices FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage staff_offices"
  ON staff_offices FOR ALL
  USING (auth.role() = 'authenticated');

-- Create policies for office_metrics
CREATE POLICY "Authenticated users can view office_metrics"
  ON office_metrics FOR SELECT
  USING (auth.role() = 'authenticated');

-- Create function for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

-- Create triggers
CREATE TRIGGER update_offices_timestamp
  BEFORE UPDATE ON offices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_offices_timestamp
  BEFORE UPDATE ON staff_offices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO offices (name, country, city, timezone, currency)
VALUES 
  ('Head Office', 'Kenya', 'Nairobi', 'Africa/Nairobi', 'KES'),
  ('Mombasa Branch', 'Kenya', 'Mombasa', 'Africa/Nairobi', 'KES'),
  ('Tanzania Office', 'Tanzania', 'Arusha', 'Africa/Dar_es_Salaam', 'TZS');