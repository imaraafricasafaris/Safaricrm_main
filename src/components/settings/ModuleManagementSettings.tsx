import React, { useState } from 'react';
import { Grid, AlertTriangle } from 'lucide-react';
import { useModules } from '../../contexts/ModuleContext';
import Toggle from '../ui/Toggle';
import toast from 'react-hot-toast';

const modules = [
  {
    id: 'leads',
    name: 'Lead Management',
    description: 'Track and manage potential clients through the sales pipeline',
    priority: 'high'
  },
  {
    id: 'client-management',
    name: 'Client Management',
    description: 'Manage client relationships and bookings',
    priority: 'high'
  },
  {
    id: 'task-management',
    name: 'Task Management',
    description: 'Assign and track tasks across the team',
    priority: 'high'
  },
  {
    id: 'document-management',
    name: 'Document Management',
    description: 'Store and manage client documents and contracts',
    priority: 'medium'
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Generate and manage invoices and payments',
    priority: 'high'
  },
  {
    id: 'itinerary-builder',
    name: 'Itinerary Builder',
    description: 'Create and customize safari packages',
    priority: 'medium'
  },
  {
    id: 'advanced-reporting',
    name: 'Advanced Reporting',
    description: 'Generate detailed reports and analytics',
    priority: 'medium'
  },
  {
    id: 'staff-management',
    name: 'Staff Management',
    description: 'Manage staff members and permissions',
    priority: 'medium'
  },
  {
    id: 'office-management',
    name: 'Branch Management',
    description: 'Manage multiple office locations',
    priority: 'medium'
  }
];

export default function ModuleManagementSettings() {
  const { activeModules, toggleModule, isModuleActive, CORE_MODULES } = useModules();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleModuleToggle = async (moduleId: string) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      await toggleModule(moduleId);
    } catch (error) {
      console.error('Error toggling module:', error);
      toast.error('Failed to update module status');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Module Management
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Enable or disable system modules based on your needs
          </p>
        </div>
        <Grid className="w-5 h-5 text-gray-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((module) => (
          <div
            key={module.id}
            className={`
              p-4 rounded-lg border transition-all duration-200
              ${isModuleActive(module.id)
                ? 'border-primary/20 bg-primary/5 dark:border-primary/10 dark:bg-primary/5'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }
            `}
          >
            <Toggle
              enabled={isModuleActive(module.id)}
              onChange={() => handleModuleToggle(module.id)}
              label={module.name}
              description={module.description}
              size="sm"
              disabled={CORE_MODULES.includes(module.id)}
            />
            {CORE_MODULES.includes(module.id) && (
              <div className="mt-2 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                <AlertTriangle className="w-3 h-3" />
                Core module - cannot be disabled
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
              Module Dependencies
            </h4>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Some modules may require other modules to be active. Deactivating a module will also deactivate dependent modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}