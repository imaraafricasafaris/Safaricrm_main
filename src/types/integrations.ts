export type IntegrationType = 'payment' | 'email' | 'calendar' | 'storage' | 'analytics';
export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'pending';

export interface Integration {
  id: string;
  type: IntegrationType;
  name: string;
  provider: string;
  description: string;
  status: IntegrationStatus;
  credentials: Record<string, string>;
  settings: Record<string, any>;
  modules: string[];
  required_permissions: string[];
  created_at: string;
  updated_at: string;
  last_sync?: string;
  error_message?: string;
}