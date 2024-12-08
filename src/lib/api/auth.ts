import { supabase } from '../supabase';
import { z } from 'zod';

// Schema for user roles
export const UserRole = z.enum(['super_admin', 'admin', 'company', 'user']);
export type UserRole = z.infer<typeof UserRole>;

// Schema for user data
const UserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: UserRole,
  name: z.string().optional()
});

export async function signIn(email: string, password: string, role?: UserRole) {
  try {
    // Clear any existing session first
    await supabase.auth.signOut();
    localStorage.removeItem('sb-auth-token');
    localStorage.removeItem('user_role');

    // Sign in user
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
    
    // Store auth data
    if (data.session?.access_token) {
      localStorage.setItem('sb-auth-token', data.session.access_token);
      localStorage.setItem('user_role', role || 'company');
    }
    
    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(userData: z.infer<typeof UserSchema>) {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        role: userData.role,
        full_name: userData.full_name,
        company_id: userData.company_id
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function updateUserRole(userId: string, role: UserRole) {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: { role }
  });

  if (error) throw error;
  return data;
}

export async function getUserRole(userId: string): Promise<UserRole | null> {
  const { data: { user }, error } = await supabase.auth.admin.getUserById(userId);
  
  if (error) throw error;
  return user?.user_metadata?.role || null;
}