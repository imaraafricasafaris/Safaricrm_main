import { supabase } from '../supabase';
import { Staff } from '../../types/staff';

export async function getStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Staff[];
}

export async function addStaffMember(staffData: Partial<Staff>) {
  const { data, error } = await supabase
    .from('staff')
    .insert([staffData])
    .select()
    .single();

  if (error) throw error;
  return data as Staff;
}

export async function updateStaffMember(id: string, updates: Partial<Staff>) {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Staff;
}

export async function deleteStaffMember(id: string) {
  const { error } = await supabase
    .from('staff')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function inviteStaffMember(email: string, role: Staff['role']) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { role }
  });

  if (error) throw error;
  return data;
}

export async function getStaffActivityLogs(staffId: string) {
  const { data, error } = await supabase
    .from('staff_activity_logs')
    .select('*')
    .eq('staff_id', staffId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}