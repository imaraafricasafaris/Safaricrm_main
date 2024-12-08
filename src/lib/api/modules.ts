import { supabase } from '../supabase';
import type { Module, ModuleState } from '../../types/modules';

export async function getModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('name');
    
  if (error) throw error;
  return data as Module[];
}

export async function getModuleStates(companyId: string) {
  const { data, error } = await supabase
    .from('module_states')
    .select(`
      *,
      module:modules(*)
    `)
    .eq('company_id', companyId);
    
  if (error) throw error;
  return data as ModuleState[];
}

export async function toggleModule(companyId: string, moduleId: string, active: boolean) {
  const { data, error } = await supabase
    .from('module_states')
    .upsert({
      company_id: companyId,
      module_id: moduleId,
      status: active ? 'active' : 'inactive',
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (error) throw error;
  return data as ModuleState;
}

export async function getModuleLogs(companyId: string, moduleId?: string) {
  let query = supabase
    .from('module_logs')
    .select(`
      *,
      module:modules(*),
      user:auth.users(email)
    `)
    .eq('company_id', companyId)
    .order('created_at', { ascending: false });

  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateModuleSettings(
  companyId: string,
  moduleId: string,
  settings: Record<string, any>
) {
  const { data, error } = await supabase
    .from('module_states')
    .update({ 
      settings,
      updated_at: new Date().toISOString()
    })
    .eq('company_id', companyId)
    .eq('module_id', moduleId)
    .select()
    .single();
    
  if (error) throw error;
  return data as ModuleState;
}