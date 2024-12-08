import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { ModuleContextType, Module, ModuleState } from './types';
import { CORE_MODULES, DEFAULT_MODULES } from './constants';

    dependencies: []
  },
  {
    id: 'leads',
    name: 'Lead Management',
    description: 'Track and manage potential clients',
    category: 'crm',
    status: 'active',
    features: ['Lead tracking', 'Pipeline management', 'Follow-up automation'],
    dependencies: []
  },
  {
    id: 'client-management',
    name: 'Client Management',
    description: 'Manage client relationships and bookings',
    category: 'crm',
    status: 'active',
    features: ['Client profiles', 'Booking history', 'Communication logs'],
    dependencies: ['leads']
  },
  {
    id: 'task-management',
    name: 'Task Management',
    description: 'Assign and track team tasks',
    category: 'operations',
    status: 'active',
    features: ['Task assignment', 'Due date tracking', 'Progress monitoring'],
    dependencies: []
  },
  {
    id: 'document-management',
    name: 'Document Management',
    description: 'Store and manage documents',
    category: 'operations',
    status: 'active',
    features: ['Document storage', 'Version control', 'Access management'],
    dependencies: []
  },
  {
    id: 'advanced-reporting',
    name: 'Advanced Reporting',
    description: 'Generate detailed reports and analytics',
    category: 'reporting',
    status: 'active',
    features: ['Custom reports', 'Data visualization', 'Export options'],
    dependencies: []
  },
  {
    id: 'staff-management',
    name: 'Staff Management',
    description: 'Manage staff members and permissions',
    category: 'operations',
    status: 'active',
    features: ['Staff profiles', 'Role management', 'Performance tracking'],
    dependencies: []
  },
  {
    id: 'office-management',
    name: 'Branch Management',
    description: 'Manage multiple office locations',
    category: 'operations',
    status: 'active',
    features: ['Location management', 'Staff assignment', 'Resource allocation'],
    dependencies: []
  },
  {
    id: 'api',
    name: 'API System',
    description: 'Manage API keys and monitor usage',
    category: 'core',
    status: 'active',
    features: ['API key management', 'Usage monitoring', 'Documentation'],
    dependencies: []
  },
export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [activeModules, setActiveModules] = useState<string[]>([...CORE_MODULES, ...DEFAULT_MODULES]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadModuleStates();
  }, []);

  const loadModuleStates = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: moduleStates, error: dbError } = await supabase
        .from('module_states')
        .select('*')
        .order('module_id');

      if (dbError) throw dbError;
      console.log('Loaded module states:', moduleStates);

      const activeModuleIds = [
        ...CORE_MODULES,
        ...(moduleStates || [])
          .filter((m) => m.status === 'active')
          .map((m) => m.module_id),
      ];

      setActiveModules(Array.from(new Set(activeModuleIds)));
      
      const mappedModules = (moduleStates || []).map(state => ({
        id: state.module_id,
        name: state.settings?.name || getModuleName(state.module_id),
        description: state.settings?.description || getModuleDescription(state.module_id),
        category: state.settings?.category || getModuleCategory(state.module_id),
        status: state.status,
        features: state.settings?.features || getModuleFeatures(state.module_id),
        setupRequired: false,
        dependencies: []
      }));

      setModules(mappedModules);
    } catch (error) {
      console.error('Error loading modules:', error);
      setError('Failed to load module states');
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const formatModuleName = (moduleId: string): string => {
    return moduleId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getModuleDescription = (moduleId: string): string => {
    const descriptions: Record<string, string> = {
      dashboard: 'Main system dashboard and analytics',
      settings: 'System configuration and preferences',
      notifications: 'System notifications and alerts',
      leads: 'Lead management and tracking',
      'client-management': 'Manage client relationships and bookings',
      'task-management': 'Assign and track team tasks',
      'document-management': 'Store and manage documents',
      invoicing: 'Create and manage invoices',
      'itinerary-builder': 'Build custom safari itineraries',
      'advanced-reporting': 'Generate detailed reports and analytics',
      'staff-management': 'Manage staff members and permissions',
      'office-management': 'Manage multiple office locations',
      'safari-packages': 'Create and manage safari packages',
      'vehicle-fleet': 'Manage safari vehicles',
      'guide-management': 'Manage safari guides',
      accommodation: 'Manage accommodation options',
      activities: 'Manage safari activities',
      'email-automation': 'Automate email communications',
      calendar: 'Manage bookings and schedules'
    };
    return descriptions[moduleId] || 'Module description';
  };

  const getModuleFeatures = (moduleId: string): string[] => {
    const features: Record<string, string[]> = {
      dashboard: ['Overview analytics', 'Quick actions', 'Recent activity'],
      leads: ['Lead tracking', 'Pipeline management', 'Follow-up automation'],
      'client-management': ['Client profiles', 'Booking history', 'Communication logs'],
      'task-management': ['Task assignment', 'Due date tracking', 'Progress monitoring'],
      'document-management': ['Document storage', 'Version control', 'Access management']
    };
    return features[moduleId] || [];
  };

  const getModuleCategory = (moduleId: string): ModuleCategory => {
    if (CORE_MODULES.includes(moduleId)) return 'core';
    const categories: Record<string, ModuleCategory> = {
      'client-management': 'crm',
      'task-management': 'operations',
      'document-management': 'operations',
      'advanced-reporting': 'reporting',
      'email-automation': 'automation'
    };
    return categories[moduleId] || 'operations';
  };

  const toggleModule = async (moduleId: string) => {
    if (CORE_MODULES.includes(moduleId)) {
      toast.error('Core modules cannot be deactivated');
      return;
    }

    try {
      const isActivating = !activeModules.includes(moduleId);

      const { error: dbError } = await supabase
        .from('module_states')
        .upsert(
          {
            module_id: moduleId,
            status: isActivating ? 'active' : 'inactive',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'module_id' }
        );

      if (dbError) throw dbError;

      setActiveModules((prev) =>
        isActivating ? [...prev, moduleId] : prev.filter((id) => id !== moduleId)
      );

      if (!isActivating && window.location.pathname.includes(moduleId)) {
        navigate('/dashboard');
      }

      await loadModuleStates();
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error('Failed to update module status');
    }
  };

  const isModuleActive = (moduleId: string): boolean => {
    if (!moduleId) return true;
    return CORE_MODULES.includes(moduleId) || activeModules.includes(moduleId);
  };

  const value = {
    modules,
    activeModules,
    loading,
    error,
    toggleModule,
    isModuleActive,
    CORE_MODULES,
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModules must be used within a ModuleProvider');
  }
  return context;
}