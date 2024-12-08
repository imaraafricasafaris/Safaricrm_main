import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

// Validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create Supabase client with robust configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sb-session',
    storage: {
      getItem: (key) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('Error accessing localStorage:', error);
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('user_role');
          return null;
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting localStorage:', error);
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing from localStorage:', error);
        }
      }
    }
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'safari-crm'
    }
  }
});


// Handle Supabase errors with proper error messages
export const handleSupabaseError = (error: any, customMessage?: string) => {
  console.error('Supabase error:', error);

  try {
    // Handle auth session errors
    if (error.name === 'AuthSessionMissingError' || error.name === 'AuthApiError') {
      localStorage.removeItem('sb-auth-token');
      toast.error('Session expired. Please sign in again.');
      return;
    }
    
    let errorMessage = customMessage || 'An error occurred. Please try again.';
    
    // Handle specific error cases
    if (error.message?.includes('JWT')) {
      toast.error('Your session has expired. Please sign in again.');
      supabase.auth.signOut();
      return;
    }

    if (error.message?.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
    }

    if (error.message?.includes('not found')) {
      errorMessage = 'Resource not found. Please try again.';
    }

    // Show error message
    toast.error(errorMessage);
  } catch (e) {
    console.error('Error handling Supabase error:', e);
    toast.error('An unexpected error occurred');
  }
};

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('module_states').select('count').single();
    if (error) {
      console.error('Supabase connection error:', error);
      toast.error('Database connection error. Please check your credentials.');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Supabase connection error:', error);
    toast.error('Failed to connect to database. Please try again later.');
    return false;
  }
};