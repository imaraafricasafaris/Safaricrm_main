import { supabase } from '../supabase';

export interface ModuleAuditLog {
  id: string;
  module_id: string;
  user_id: string;
  action: 'activate' | 'deactivate' | 'configure' | 'access';
  details: Record<string, any>;
  created_at: string;
}

export async function logModuleAction(
  moduleId: string,
  action: ModuleAuditLog['action'],
  details: Record<string, any> = {}
) {
  const { error } = await supabase
    .from('module_logs')
    .insert([{
      module_id: moduleId,
      action,
      details,
      user_id: supabase.auth.user()?.id
    }]);

  if (error) throw error;
}

export async function getModuleLogs(
  moduleId?: string,
  filters?: {
    startDate?: string;
    endDate?: string;
    userId?: string;
    action?: ModuleAuditLog['action'];
  }
) {
  let query = supabase
    .from('module_logs')
    .select(`
      *,
      user:auth.users (
        email,
        user_metadata
      )
    `)
    .order('created_at', { ascending: false });

  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  if (filters?.startDate) {
    query = query.gte('created_at', filters.startDate);
  }

  if (filters?.endDate) {
    query = query.lte('created_at', filters.endDate);
  }

  if (filters?.userId) {
    query = query.eq('user_id', filters.userId);
  }

  if (filters?.action) {
    query = query.eq('action', filters.action);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function exportModuleLogs(format: 'csv' | 'json') {
  const { data, error } = await supabase
    .from('module_logs')
    .select(`
      *,
      user:auth.users (
        email,
        user_metadata
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  if (format === 'csv') {
    // Convert to CSV format
    const headers = ['Date', 'Module', 'User', 'Action', 'Details'];
    const rows = data.map(log => [
      new Date(log.created_at).toLocaleString(),
      log.module_id,
      log.user.email,
      log.action,
      JSON.stringify(log.details)
    ]);

    return [headers, ...rows]
      .map(row => row.join(','))
      .join('\n');
  }

  return JSON.stringify(data, null, 2);
}