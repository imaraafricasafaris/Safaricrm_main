import React, { useState } from 'react';
import { Check, Settings, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Toggle from '../ui/Toggle';
import { ModuleState } from '../../contexts/ModuleContext/types';
import { CORE_MODULES } from '../../contexts/ModuleContext/constants';
import { formatModuleName } from '../../utils/format';

interface ModuleCardProps {
  module: ModuleState;
  isActive: boolean;
  currentPlan: string;
  onToggle?: () => Promise<void>;
}

export default function ModuleCard({ module, isActive, currentPlan, onToggle }: ModuleCardProps) {
  const navigate = useNavigate();
  const isCore = CORE_MODULES.includes(module.id);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const handleToggle = async () => {
    if (!onToggle) return;
    setIsLoading(true);
    
    try {
      if (isCore) {
        throw new Error('Core modules cannot be deactivated');
      }
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`
        p-6 rounded-lg border-2 transition-all duration-200 h-full
        ${isActive
          ? 'border-primary/20 dark:border-primary/10 bg-primary/5 dark:bg-primary/5'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
        }
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {module.name}
          {isCore && (
            <span className="ml-2 text-xs text-yellow-600 dark:text-yellow-400">
              Core Module
            </span>
          )}
        </h3>
        <div className="flex items-center gap-2">
          {isActive && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAnalytics(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50"
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
          <Toggle
            enabled={isActive}
            onChange={handleToggle}
            disabled={isCore || isLoading}
            size="sm"
          />
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 min-h-[40px]">
        {module.description}
      </p>

      {Array.isArray(module.features) && module.features.length > 0 && (
        <div className="space-y-3">
          {module.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${
                isActive
                  ? 'bg-primary'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`} />
              {feature}
            </div>
          ))}
        </div>
      )}

      {isCore && (
        <div className="mt-6 flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
          <span className="w-2 h-2 bg-yellow-500 rounded-full" />
          Core module - cannot be disabled
        </div>
      )}

      {module.setupRequired && !isActive && (
        <div className="mt-4 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
          <span className="w-2 h-2 bg-blue-500 rounded-full" />
          Setup required after activation
        </div>
      )}
    </div>
  );
}