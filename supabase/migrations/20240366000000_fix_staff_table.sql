-- Drop existing table if it exists
DROP TABLE IF EXISTS staff;

-- Create staff table
CREATE TABLE staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'agent', 'driver', 'guide')),
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'pending')) DEFAULT 'pending',
  permissions JSONB DEFAULT '{}'::jsonb,
  company_id UUID,
  phone TEXT,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Staff members can view all staff"
  ON staff FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Staff members can insert staff"
  ON staff FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Staff members can update staff"
  ON staff FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_staff_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_staff_updated_at
  BEFORE UPDATE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION update_staff_timestamp();

-- Insert sample data
INSERT INTO staff (email, full_name, role, status) VALUES
  ('admin@example.com', 'System Admin', 'admin', 'active'),
  ('manager@example.com', 'Safari Manager', 'manager', 'active'),
  ('guide@example.com', 'Safari Guide', 'guide', 'active')
ON CONFLICT (email) DO NOTHING;