import React from 'react';
import { Calendar, Settings } from 'lucide-react';
import Toggle from '../ui/Toggle';
import { Module } from '../../contexts/ModuleContext/types';
import { CORE_MODULES } from '../../contexts/ModuleContext/constants';
import { formatModuleName } from '../../utils/format';

interface ModuleListItemProps {
  module: Module;
  isActive: boolean;
  onToggle?: () => Promise<void>;
}

export default function ModuleListItem({ module, isActive, onToggle }: ModuleListItemProps) {
  const isCore = CORE_MODULES.includes(module.id);
  const lastAccessed = new Date().toLocaleDateString(); // Replace with actual last accessed date

  return (
    <div className={`
      p-4 bg-white dark:bg-gray-800 rounded-lg border-2 transition-all duration-200
      ${isActive
        ? 'border-primary/20 dark:border-primary/10'
        : 'border-gray-200 dark:border-gray-700'
      }
    `}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {module.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {module.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                Last accessed: {lastAccessed}
              </div>
              <Toggle
                enabled={isActive}
                onChange={onToggle}
                disabled={isCore}
                size="sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              module.category === 'core'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
            }`}>
              {module.category}
            </span>
            {isActive && (
              <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Running
              </span>
            )}
            {module.setupRequired && !isActive && (
              <span className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                <Settings className="w-3 h-3" />
                Setup Required
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}