import { supabase } from '../supabase';
import { LeadTripType } from '../../types/leads';

export async function getLeadTripTypes() {
  const { data, error } = await supabase
    .from('lead_trip_types')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadTripType[];
}

export async function createLeadTripType(tripType: Omit<LeadTripType, 'id'>) {
  const { data, error } = await supabase
    .from('lead_trip_types')
    .insert(tripType)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadTripType;
}

export async function updateLeadTripType(id: string, updates: Partial<LeadTripType>) {
  const { data, error } = await supabase
    .from('lead_trip_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadTripType;
}