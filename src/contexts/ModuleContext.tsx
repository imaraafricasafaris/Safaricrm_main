import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface ModuleContextType {
  modules: any[];
  activeModules: string[];
  loading: boolean;
  error: string | null;
  toggleModule: (moduleId: string) => Promise<void>;
  isModuleActive: (moduleId: string) => boolean;
  CORE_MODULES: string[];
}

// Core modules that cannot be deactivated
const CORE_MODULES = ['dashboard', 'settings', 'notifications', 'leads', 'modules'];

// Default active modules
const DEFAULT_MODULES = [
  'client-management',
  'task-management',
  'document-management',
  'invoicing',
  'itinerary-builder',
  'advanced-reporting',
  'staff-management',
  'office-management',
];

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<any[]>([]);
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

      const { data: moduleStates, error: dbError } = await supabase.from('module_states').select('*');
      if (dbError) throw dbError;

      // Combine core modules with active modules from DB
      const activeModuleIds = [
        ...CORE_MODULES,
        ...(moduleStates || [])
          .filter((m) => m.status === 'active')
          .map((m) => m.module_id),
      ];

      setActiveModules(Array.from(new Set(activeModuleIds))); // Deduplicate
      setModules(moduleStates || []);
    } catch (error) {
      console.error('Error loading modules:', error);
      setError('Failed to load module states');
      toast.error('Failed to load modules');
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (moduleId: string) => {
    if (CORE_MODULES.includes(moduleId)) {
      toast.error('Core modules cannot be deactivated');
      return;
    }

    try {
      const isActivating = !activeModules.includes(moduleId);

      const { error: dbError } = await supabase.from('module_states').upsert(
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

      // Define success message
      const successMessage = `Module ${isActivating ? 'activated' : 'deactivated'} successfully`;
      toast.success(successMessage, { duration: 3000 }); // Add semicolon here

      // Redirect to home if deactivating current module
      if (!isActivating && window.location.pathname.includes(moduleId)) {
        navigate('/dashboard');
      }

      await loadModuleStates(); // Reload modules after update
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error('Failed to update module status');
    }
  };

  const isModuleActive = (moduleId: string): boolean => {
    if (!moduleId) return true; // If no moduleId provided, consider it active
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
