import React, { useState } from 'react';
import { Search, Filter, Grid, List, AlertTriangle } from 'lucide-react';
import { useModules } from '../../contexts/ModuleContext';
import { Module, ModuleCategory } from '../../contexts/ModuleContext/types';
import ModuleActivationModal from './ModuleActivationModal';
import ModuleCard from './ModuleCard';
import ModuleListItem from './ModuleListItem';
import { MODULE_CATEGORIES, SUBSCRIPTION_PLANS } from '../../contexts/ModuleContext/constants';
import toast from 'react-hot-toast';

export default function ModuleOverview() {
  const { modules, activeModules, isModuleActive, toggleModule, loading, error } = useModules();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ModuleCategory | 'all'>('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // TODO: Get this from user's subscription context
  const currentPlan = 'basic';

  const handleModuleToggle = async (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    setSelectedModule(module);
  };

  const handleActivate = async () => {
    try {
      if (!selectedModule) return;
      
      await toggleModule(selectedModule.id);
      const action = isModuleActive(selectedModule.id) ? 'deactivated' : 'activated';
      toast.success(`Module ${action} successfully`);
      setSelectedModule(null);
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error('Failed to update module status');
    }
  };

  const filteredModules = modules.filter(module => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || 
      module.name.toLowerCase().includes(searchLower) ||
      module.description.toLowerCase().includes(searchLower);

    const matchesCategory = selectedCategory === 'all' || module.category === selectedCategory;
    const matchesStatus = showInactive || isModuleActive(module.id);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-200 rounded-lg">
        Error loading modules: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search modules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as ModuleCategory | 'all')}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Categories</option>
            {Object.entries(MODULE_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary text-black'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-primary text-black'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Show Inactive Toggle */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Show inactive modules
          </span>
        </div>
        <button
          onClick={() => setShowInactive(!showInactive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showInactive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showInactive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Module Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              isActive={isModuleActive(module.id)}
              currentPlan={currentPlan}
              onToggle={() => handleModuleToggle(module.id)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredModules.map((module) => (
            <ModuleListItem
              key={module.id}
              module={module}
              isActive={isModuleActive(module.id)}
              onToggle={() => handleModuleToggle(module.id)}
            />
          ))}
        </div>
      )}
      
      {/* Activation Modal */}
      {selectedModule && (
        <ModuleActivationModal
          module={selectedModule}
          isActive={isModuleActive(selectedModule.id)}
          onActivate={handleActivate}
          onClose={() => setSelectedModule(null)}
        />
      )}
    </div>
  );
}