import { supabase } from '../supabase';
import { Office, StaffOffice, OfficeMetrics } from '../../types/office';

export async function getOffices() {
  try {
    const { data, error } = await supabase
      .from('offices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching offices:', err);
    throw err;
  }
}

export async function getOffice(id: string) {
  const { data, error } = await supabase
    .from('offices')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Office;
}

export async function createOffice(office: Omit<Office, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const { data, error } = await supabase
      .from('offices')
      .insert([office])
      .select()
      .single();

    if (error) throw error;
    return data as Office;
  } catch (err) {
    console.error('Error creating office:', err);
    throw err;
  }
}

export async function updateOffice(id: string, updates: Partial<Office>) {
  const { data, error } = await supabase
    .from('offices')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Office;
}

export async function deleteOffice(id: string) {
  const { error } = await supabase
    .from('offices')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function assignStaffToOffice(staffOffice: Omit<StaffOffice, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('staff_offices')
    .insert(staffOffice)
    .select()
    .single();

  if (error) throw error;
  return data as StaffOffice;
}

export async function getOfficeStaff(officeId: string) {
  const { data, error } = await supabase
    .from('staff_offices')
    .select(`
      *,
      staff:staff_id (*)
    `)
    .eq('office_id', officeId);

  if (error) throw error;
  return data;
}

export async function getOfficeMetrics(officeId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('office_metrics')
    .select('*')
    .eq('office_id', officeId)
    .gte('period_start', startDate)
    .lte('period_end', endDate);

  if (error) throw error;
  return data as OfficeMetrics[];
}