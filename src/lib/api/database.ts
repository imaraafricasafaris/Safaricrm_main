import { supabase } from '../supabase';

const REQUIRED_TABLES = [
  'auth.users',
  'profiles',
  'leads',
  'lead_sources',
  'lead_destinations',
  'lead_trip_types',
  'lead_activities',
  'documents',
  'payments'
];

export async function checkDatabaseConnection() {
  try {
    // Test basic connection first
    const isConnected = await supabase.auth.getSession();
    if (!isConnected) throw new Error('Failed to connect to Supabase');

    // Check each required table
    const tableChecks = await Promise.all(
      REQUIRED_TABLES.map(async (tableName) => {
        try {
          const { error } = await supabase
            .from(tableName.replace('auth.', ''))
            .select('count')
            .limit(1);

          return {
            table: tableName,
            exists: !error
          };
        } catch (err) {
          return {
            table: tableName,
            exists: false
          };
        }
      })
    );

    return {
      connected: true,
      tables: tableChecks,
      error: null
    };
  } catch (error) {
    console.error('Database connection error:', error);
    return {
      connected: false,
      tables: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

export async function testTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('count')
      .limit(1);
    
    return !error;
  } catch (err) {
    return false;
  }
}

export async function initializeDatabase() {
  const connection = await checkDatabaseConnection();
  
  if (!connection.connected) {
    throw new Error('Failed to connect to database');
  }
  
  const missingTables = connection.tables.filter(t => !t.exists);
  
  if (missingTables.length > 0) {
    console.warn('Missing tables:', missingTables.map(t => t.table).join(', '));
  }
  
  return connection;
}

export async function getDatabaseStats() {
  try {
    const stats = await Promise.all([
      supabase.from('leads').select('count'),
      supabase.from('profiles').select('count'),
      supabase.from('documents').select('count')
    ]);

    return {
      leads: stats[0].count || 0,
      profiles: stats[1].count || 0,
      documents: stats[2].count || 0
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return null;
  }
}