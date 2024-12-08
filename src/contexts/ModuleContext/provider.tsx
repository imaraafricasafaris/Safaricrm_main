import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { ModuleState } from './types';
import { CORE_MODULES, DEFAULT_MODULES } from './constants';
import { ModuleContext } from './context';

export function ModuleProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleState[]>([]);
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
    const { data: moduleData, error: dbError } = await supabase
      .from('modules')
      .select('*')
      .order('name');

    if (dbError) throw dbError;
    console.log('Loaded modules:', moduleData); // Debug log

    const activeModuleIds = [
      ...CORE_MODULES,
      ...(moduleData || [])
        .filter((m) => m.status === 'active')
        .map((m) => m.id)
    ];

    setActiveModules(Array.from(new Set(activeModuleIds)));
    
    const mappedModules = (moduleData || []).map(module => ({
      id: module.id,
      name: module.name,
      description: module.description,
      category: module.category || 'operations',
      status: module.status || 'inactive',
      icon: module.icon,
      version: module.version || '1.0.0',
      features: module.features || [],
      is_core: module.is_core || false,
      settings: module.settings || {},
      module_id: module.id
    }));

    setModules(mappedModules);
    console.log('Mapped modules:', mappedModules); // Debug log
  } catch (error) {
    console.error('Error loading modules:', error);
    setError('Failed to load module states');
    toast.error('Failed to load modules');
  } finally {
    setLoading(false);
  }
};

  const toggleModule = async (moduleId: string) => {
    // Prevent toggling core modules
    if (CORE_MODULES.includes(moduleId)) {
      toast.error('Core modules cannot be modified');
      return;
    }

    try {
      const { error: dbError } = await supabase
        .from('modules')
        .update({ 
          status: !activeModules.includes(moduleId) ? 'active' : 'inactive' 
        })
        .eq('id', moduleId);

      if (dbError) throw dbError;

      const isActivating = !activeModules.includes(moduleId);
      
      // Update modules state
      setModules(prev => {
        const moduleIndex = prev.findIndex(m => m.id === moduleId);
        return moduleIndex === -1 
          ? [...prev, { id: moduleId, status: isActivating ? 'active' : 'inactive' }]
          : prev.map(m => m.id === moduleId ? { ...m, status: isActivating ? 'active' : 'inactive' } : m);
      });

      // Update active modules
      setActiveModules(prev => 
        isActivating 
          ? [...prev, moduleId]
          : prev.filter(id => id !== moduleId)
      );

      // Handle navigation if deactivating current module
      if (!isActivating && window.location.pathname.includes(moduleId)) {
        navigate('/dashboard');
      }

      toast.success(`Module ${isActivating ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error('Failed to update module status');
      await loadModuleStates();
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
    CORE_MODULES
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}