export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'agent';
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  assigned_to: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  assigned_to: string;
  related_to?: {
    type: 'lead' | 'client';
    id: string;
  };
  created_at: string;
  updated_at: string;
}