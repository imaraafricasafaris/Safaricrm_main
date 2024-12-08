import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Role, Permission, RoleAssignment } from '../types/roles';
import toast from 'react-hot-toast';

interface RoleContextType {
  roles: Role[];
  userRoles: RoleAssignment[];
  loading: boolean;
  error: string | null;
  assignRole: (userId: string, roleId: string, moduleId: string) => Promise<void>;
  revokeRole: (assignmentId: string) => Promise<void>;
  hasPermission: (moduleId: string, action: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [userRoles, setUserRoles] = useState<RoleAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*');

      if (rolesError) throw rolesError;

      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('role_assignments')
        .select('*')
        .eq('user_id', supabase.auth.user()?.id);

      if (assignmentsError) throw assignmentsError;

      setRoles(rolesData);
      setUserRoles(assignmentsData);
    } catch (error) {
      console.error('Error loading roles:', error);
      setError('Failed to load roles');
      toast.error('Failed to load role information');
    } finally {
      setLoading(false);
    }
  };

  const assignRole = async (userId: string, roleId: string, moduleId: string) => {
    try {
      const { error } = await supabase
        .from('role_assignments')
        .insert([{ user_id: userId, role_id: roleId, module_id: moduleId }]);

      if (error) throw error;
      await loadRoles();
      toast.success('Role assigned successfully');
    } catch (error) {
      console.error('Error assigning role:', error);
      toast.error('Failed to assign role');
      throw error;
    }
  };

  const revokeRole = async (assignmentId: string) => {
    try {
      const { error } = await supabase
        .from('role_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
      await loadRoles();
      toast.success('Role revoked successfully');
    } catch (error) {
      console.error('Error revoking role:', error);
      toast.error('Failed to revoke role');
      throw error;
    }
  };

  const hasPermission = (moduleId: string, action: string): boolean => {
    const userRole = userRoles.find(r => r.module_id === moduleId);
    if (!userRole) return false;

    const role = roles.find(r => r.id === userRole.role_id);
    if (!role) return false;

    return role.permissions.includes('*') || role.permissions.includes(action);
  };

  return (
    <RoleContext.Provider value={{
      roles,
      userRoles,
      loading,
      error,
      assignRole,
      revokeRole,
      hasPermission
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}