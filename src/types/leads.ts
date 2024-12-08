export interface LeadSource {
  id: string;
  name: string;
  type: 'safaribookings' | 'facebook' | 'google' | 'manual' | 'import' | 'referral' | 'linkedin' | 'email' | 'viator' | 'instagram' | 'website';
  active: boolean;
}

export interface LeadDestination {
  id: string;
  name: string;
  country: string;
  region: string;
  description?: string;
  image_url?: string;
}

export interface LeadTripType {
  id: string;
  name: string;
  description?: string;
}

export interface Lead {
  id: string;
  source: LeadSource['type'];
  source_id?: string;
  created_at: string;
  updated_at: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  
  // Contact Information
  name: string;
  email: string;
  phone?: string;
  country: string;
  
  // Trip Details
  destinations: string[];
  trip_type: string[];
  duration: number;
  arrival_date?: string;
  adults: number;
  children: number;
  budget?: number;
  message?: string;
  
  // Marketing
  marketing_consent: boolean;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  
  // Internal
  assigned_to?: string;
  notes?: string[];
  tags?: string[];
  
  // Follow-ups
  last_contact?: string;
  next_follow_up?: string;
  follow_up_notes?: string;
}