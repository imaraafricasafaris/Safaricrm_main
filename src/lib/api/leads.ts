import { supabase } from '../supabase';
import { Lead } from '../../types/leads';

export async function getLeads(filters?: {
  search?: string;
  status?: string;
  dateRange?: string;
  assignedTo?: string;
}): Promise<Lead[]> {
  let query = supabase
    .from('leads')
    .select('*');

  if (filters?.search) {
    query = query.or(`
      name.ilike.%${filters.search}%,
      email.ilike.%${filters.search}%
    `);
  }

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.assignedTo) {
    query = query.eq('assigned_to', filters.assignedTo);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function getLeadSources() {
  const { data, error } = await supabase
    .from('lead_sources')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadSource[];
}

export async function getLeadDestinations() {
  const { data, error } = await supabase
    .from('lead_destinations')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadDestination[];
}

export async function getLeadTripTypes() {
  const { data, error } = await supabase
    .from('lead_trip_types')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadTripType[];
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) {
  // Convert destination and trip type names to arrays
  const formattedLead = {
    ...lead,
    destinations: Array.isArray(lead.destinations) ? lead.destinations : [],
    trip_type: Array.isArray(lead.trip_type) ? lead.trip_type : []
  };

  const { data, error } = await supabase
    .from('leads')
    .insert(formattedLead)
    .select()
    .single();
    
  if (error) throw error;
  return data as Lead;
}

export async function updateLead(id: string, updates: Partial<Lead>) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as Lead;
}

export async function getLeadActivities(leadId: string) {
  const { data, error } = await supabase
    .from('lead_activities')
    .select(`
      *,
      user:auth.users (
        email,
        user_metadata
      )
    `)
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

// SafariBookings API Integration
export async function syncSafariBookingsLeads(apiKey: string) {
  // TODO: Implement SafariBookings API integration
  // This will fetch new quote requests and sync them to our leads table
  throw new Error('Not implemented');
}

// Import Leads from File
export async function importLeadsFromCSV(file: File) {
  // TODO: Implement CSV import
  // This will parse the CSV file and create new leads
  throw new Error('Not implemented');
}

// Export Leads
export async function exportLeads(format: 'csv' | 'xlsx') {
  // TODO: Implement lead export
  // This will generate a file with all leads data
  throw new Error('Not implemented');
}