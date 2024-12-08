import { z } from 'zod';

export const ModuleStatus = z.enum(['active', 'inactive']);
export type ModuleStatus = z.infer<typeof ModuleStatus>;

export const ModuleCategory = z.enum([
  'core',
  'crm',
  'operations',
  'finance',
  'reporting',
  'automation'
]);
export type ModuleCategory = z.infer<typeof ModuleCategory>;

export interface Module {
  id: string;
  name: string;
  description: string;
  category: ModuleCategory;
  status: ModuleStatus;
  settings: Record<string, any>;
  features: string[];
  is_core: boolean;
  version?: string;
  dependencies?: string[];
  setup_required?: boolean;
  icon?: string;
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    price: number;
    billingPeriod: 'monthly' | 'yearly';
    icon?: string;
    version?: string;
    dependencies?: string[];
    setupRequired?: boolean;
  };
}

export interface ModuleState extends Module {
  module_id: string;
}

export interface ModuleContextType {
  modules: Module[];
  activeModules: string[];
  loading: boolean;
  error: string | null;
  toggleModule: (moduleId: string) => Promise<void>;
  isModuleActive: (moduleId: string) => boolean;
  CORE_MODULES: string[];
}