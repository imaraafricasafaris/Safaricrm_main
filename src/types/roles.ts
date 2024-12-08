export type UserRole = 'super_admin' | 'admin' | 'manager' | 'agent' | 'guide' | 'driver';

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: string;
  actions: ('view' | 'create' | 'edit' | 'delete')[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
  created_at: string;
  updated_at: string;
}

export interface RoleAssignment {
  id: string;
  user_id: string;
  role_id: string;
  module_id: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}