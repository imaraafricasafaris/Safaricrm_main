-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('proposal', 'invoice', 'contract', 'itinerary', 'other')),
  url TEXT NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  status TEXT CHECK (status IN ('draft', 'sent', 'viewed', 'signed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
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

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view payments"
  ON payments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert payments"
  ON payments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_documents_timestamp
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_timestamp
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();