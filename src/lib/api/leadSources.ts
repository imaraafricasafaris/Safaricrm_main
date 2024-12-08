import { supabase } from '../supabase';
import { LeadSource } from '../../types/leads';

export async function getLeadSources() {
  const { data, error } = await supabase
    .from('lead_sources')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as LeadSource[];
}

export async function createLeadSource(source: Omit<LeadSource, 'id'>) {
  const { data, error } = await supabase
    .from('lead_sources')
    .insert(source)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadSource;
}

export async function updateLeadSource(id: string, updates: Partial<LeadSource>) {
  const { data, error } = await supabase
    .from('lead_sources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data as LeadSource;
}