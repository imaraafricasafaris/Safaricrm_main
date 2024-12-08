import { SupabaseClient } from '@supabase/supabase-js';

export async function initializeDatabase(supabase: SupabaseClient) {
  const tables = [
    'profiles',
    'leads',
    'clients',
    'itineraries',
    'invoices',
    'tasks',
    'notifications',
    'activities',
    'documents',
    'safari_packages',
    'destinations',
    'accommodations',
    'activities',
    'payments',
    'email_templates',
    'automated_workflows'
  ];

  const tableChecks = await Promise.all(
    tables.map(async (table) => {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      return {
        table,
        exists: count !== null
      };
    })
  );

  const missingTables = tableChecks.filter(t => !t.exists);
  if (missingTables.length > 0) {
    console.warn('Missing tables:', missingTables.map(t => t.table).join(', '));
  }

  return tableChecks;
}