-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create staff_activity_logs table
CREATE TABLE IF NOT EXISTS staff_activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID REFERENCES staff(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create staff_invites table
CREATE TABLE IF NOT EXISTS staff_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'manager', 'agent', 'driver', 'guide')),
  invited_by UUID REFERENCES staff(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE staff_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_invites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Staff can view their own activity logs"
  ON staff_activity_logs FOR SELECT
  USING (staff_id IN (
    SELECT id FROM staff WHERE email = auth.email()
  ));

CREATE POLICY "Staff can view invites they created"
  ON staff_invites FOR SELECT
  USING (invited_by IN (
    SELECT id FROM staff WHERE email = auth.email()
  ));

-- Create function to log staff activities
CREATE OR REPLACE FUNCTION log_staff_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO staff_activity_logs (staff_id, action, details)
  VALUES (
    NEW.id,
    TG_OP,
    jsonb_build_object(
      'old_data', to_jsonb(OLD),
      'new_data', to_jsonb(NEW)
    )
  );
  RETURN NEW;
END;
$$ language plpgsql;

-- Create trigger for logging staff activities
CREATE TRIGGER log_staff_changes
  AFTER INSERT OR UPDATE OR DELETE ON staff
  FOR EACH ROW
  EXECUTE FUNCTION log_staff_activity();

-- Add staff module to module_states if not exists
INSERT INTO module_states (module_id, status)
VALUES ('staff-management', 'active')
ON CONFLICT (module_id) DO UPDATE 
SET status = 'active';