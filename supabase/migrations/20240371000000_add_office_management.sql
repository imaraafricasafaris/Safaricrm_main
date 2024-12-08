-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create offices table
CREATE TABLE offices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID NOT NULL,
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
ALTER TABLE offices
ADD CONSTRAINT fk_company_offices 
FOREIGN KEY (company_id) 
REFERENCES companies(id) 
ON DELETE CASCADE;

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
CREATE POLICY "Users can view offices they belong to"
  ON offices FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM staff_offices so
      WHERE so.office_id = offices.id
      AND so.staff_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage offices"
  ON offices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff s
      WHERE s.id = auth.uid()
      AND s.role = 'admin'
    )
  );

CREATE POLICY "Users can view their office assignments"
  ON staff_offices FOR SELECT
  USING (staff_id = auth.uid());

CREATE POLICY "Admins can manage office assignments"
  ON staff_offices FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM staff s
      WHERE s.id = auth.uid()
      AND s.role = 'admin'
    )
  );

-- Create functions for automatic timestamp updates
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
INSERT INTO offices (company_id, name, country, city, timezone, currency)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Head Office', 'Kenya', 'Nairobi', 'Africa/Nairobi', 'KES'),
  ('00000000-0000-0000-0000-000000000000', 'Mombasa Branch', 'Kenya', 'Mombasa', 'Africa/Nairobi', 'KES'),
  ('00000000-0000-0000-0000-000000000000', 'Tanzania Office', 'Tanzania', 'Arusha', 'Africa/Dar_es_Salaam', 'TZS');