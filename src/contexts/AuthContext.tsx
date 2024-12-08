import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, handleSupabaseError } from '../lib/supabase';
import { UserRole } from '../lib/api/auth';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  error: string | null;
  signIn: (email: string, password: string, role?: UserRole) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to determine user role from metadata
  const getUserRole = (metadata: any): UserRole => {
    if (metadata?.role === 'super_admin') return 'super_admin';
    if (metadata?.role === 'company') return 'company';
    return metadata?.role || 'company';
  };

  useEffect(() => {
    // Check active sessions and sets the user
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('user_role');
          throw error;
        }
        
        if (session?.user) {
          setUser(session.user);
          const role = getUserRole(session.user.user_metadata);
          setUserRole(role);
          localStorage.setItem('sb-auth-token', session.access_token);
          localStorage.setItem('user_role', role);
        } else {
          setUser(null);
          setUserRole(null);
          localStorage.removeItem('sb-auth-token');
          localStorage.removeItem('user_role');
        }
        
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (error instanceof Error) {
          setError(error.message);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            setUser(session.user);
            setUserRole(getUserRole(session.user.user_metadata));
            localStorage.setItem('sb-auth-token', session.access_token);
          }
          break;
          
        case 'SIGNED_OUT':
        case 'USER_DELETED':
          setUser(null);
          setUserRole(null);
          setError(null);
          localStorage.removeItem('sb-auth-token');
          break;
          
        case 'TOKEN_REFRESHED':
          if (session) {
            localStorage.setItem('sb-auth-token', session.access_token);
          }
          break;
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, role?: UserRole) => {
    try {
      setError(null);
      setLoading(true);
      
      // Clear any existing session
      await signOut();

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          data: {
            role: role || 'company',
            last_login: new Date().toISOString(),
            initialized: true,
            company_id: role === 'company' ? crypto.randomUUID() : undefined
          }
        }
      });

      if (error) throw error;
      if (!data.user) throw new Error('No user data returned');

      // Get the actual role from metadata
      const actualRole = data.user.user_metadata?.role;
      
      // Validate super admin access
      if (role === 'super_admin' && actualRole !== 'super_admin') {
        throw new Error('Unauthorized: Super admin access required');
      }

      // Validate role access
      if (role === 'super_admin' && userRole !== 'super_admin') {
        throw new Error('Unauthorized: Super admin access required');
      }

      // Store auth state
      setUser(data.user);
      setUserRole(actualRole || 'company');
      
      if (data.session?.access_token) {
        localStorage.setItem('sb-auth-token', data.session.access_token);
        localStorage.setItem('user_role', actualRole || 'company');
      }

      toast.success('Successfully logged in!');
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role?: UserRole) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: role ? { role } : undefined
        }
      });
      
      if (error) throw error;
      toast.success('Account created! Please check your email to verify your account.');
    } catch (error) {
      handleSupabaseError(error, 'Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      setUser(null);
      setUserRole(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all auth data
      localStorage.removeItem('sb-auth-token');
      localStorage.removeItem('user_role');
      
      toast.success('Signed out successfully');
      
    } catch (error) {
      handleSupabaseError(error, 'Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      userRole,
      error,
      signIn,
      signUp,
      signOut
    }}>
      {initialized ? children : null}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}