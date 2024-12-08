export interface Module {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'locked';
  icon: string;
  path: string;
  version: string;
  lastUpdated: string;
  features: string[];
  dependencies?: string[];
  setupRequired?: boolean;
  subscription?: {
    plan: 'free' | 'basic' | 'premium' | 'enterprise';
    price: number;
    billingPeriod: 'monthly' | 'yearly';
  };
}

export interface ModuleContextType {
  modules: Module[];
  activeModules: string[];
  loading: boolean;
  error: string | null;
  toggleModule: (moduleId: string) => Promise<void>;
  isModuleActive: (moduleId: string) => boolean;
  getModuleByPath: (path: string) => Module | undefined;
}