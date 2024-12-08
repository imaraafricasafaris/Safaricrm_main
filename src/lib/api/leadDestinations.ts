import { supabase } from '../supabase';
import { LeadDestination } from '../../types/leads';

export async function getLeadDestinations() {
  const { data, error } = await supabase
    .from('lead_destinations')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadDestination[];
}

export async function createLeadDestination(destination: Omit<LeadDestination, 'id'>) {
  const { data, error } = await supabase
    .from('lead_destinations')
    .insert(destination)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadDestination;
}

export async function updateLeadDestination(id: string, updates: Partial<LeadDestination>) {
  const { data, error } = await supabase
    .from('lead_destinations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadDestination;
}