export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'agent';
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  profile_id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  preferences: {
    accommodation_type?: string[];
    dietary_requirements?: string[];
    special_interests?: string[];
    budget_range?: {
      min: number;
      max: number;
      currency: string;
    };
  };
  tags: string[];
  status: 'active' | 'inactive' | 'archived';
  segment: 'standard' | 'premium' | 'vip';
  total_spend: number;
  last_interaction: string;
  notes: string[];
  created_at: string;
  updated_at: string;
}

export interface SafariPackage {
  id: string;
  name: string;
  description: string;
  destinations: string[];
  duration: number;
  included_activities: string[];
  accommodation_level: 'budget' | 'standard' | 'luxury' | 'ultra_luxury';
  pricing: {
    base_price: number;
    currency: string;
    seasonal_rates: {
      start_date: string;
      end_date: string;
      rate_multiplier: number;
    }[];
  };
  max_participants: number;
  min_participants: number;
  available_dates: {
    start_date: string;
    end_date: string;
    availability: number;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  client_id: string;
  package_id?: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'sent' | 'confirmed' | 'completed' | 'cancelled';
  total_cost: number;
  currency: string;
  participants: {
    adults: number;
    children: number;
    child_ages?: number[];
  };
  special_requirements?: string[];
  days: {
    day: number;
    date: string;
    location: string;
    activities: string[];
    accommodation: string;
    meals_included: ('breakfast' | 'lunch' | 'dinner')[];
    notes?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  assigned_to: string;
  related_to: {
    type: 'lead' | 'client' | 'itinerary';
    id: string;
  };
  title: string;
  description?: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  reminder?: {
    type: 'email' | 'notification';
    time: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  related_to: {
    type: 'lead' | 'client' | 'itinerary' | 'invoice';
    id: string;
  };
  name: string;
  type: 'proposal' | 'contract' | 'invoice' | 'itinerary' | 'other';
  file_url: string;
  version: number;
  status: 'draft' | 'final' | 'archived';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  invoice_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: 'credit_card' | 'bank_transfer' | 'cash' | 'other';
  payment_date: string;
  reference_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'follow_up' | 'confirmation' | 'reminder' | 'invoice' | 'custom';
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AutomatedWorkflow {
  id: string;
  name: string;
  trigger: {
    event: 'lead_created' | 'status_changed' | 'payment_received' | 'date_approaching';
    conditions: Record<string, any>;
  };
  actions: {
    type: 'send_email' | 'create_task' | 'update_status' | 'send_notification';
    params: Record<string, any>;
  }[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}