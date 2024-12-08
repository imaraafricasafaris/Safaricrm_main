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

-- Create leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT CHECK (status IN ('pending', 'in_progress', 'completed')),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  related_to_type TEXT CHECK (related_to_type IN ('lead', 'client')),
  related_to_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "All authenticated users can view leads"
  ON leads FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can insert leads"
  ON leads FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update leads assigned to them"
  ON leads FOR UPDATE
  USING (auth.uid() = assigned_to OR 
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE user_id = auth.uid() 
           AND role IN ('admin', 'manager')
         ));

-- Tasks policies
CREATE POLICY "All authenticated users can view tasks"
  ON tasks FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "All authenticated users can insert tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update their assigned tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = assigned_to OR 
         EXISTS (
           SELECT 1 FROM profiles 
           WHERE user_id = auth.uid() 
           AND role IN ('admin', 'manager')
         ));

-- Create functions
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role)
  VALUES (new.id, 'agent');
  RETURN new;
END;
$$ language plpgsql security definer;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();