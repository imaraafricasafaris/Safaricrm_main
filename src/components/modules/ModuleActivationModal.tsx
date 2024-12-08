import React from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Module } from '../../types/modules';

interface ModuleActivationModalProps {
  module: Module;
  isActive: boolean;
  onActivate: () => Promise<void>;
  onClose: () => void;
}

export default function ModuleActivationModal({
  module,
  isActive,
  onActivate,
  onClose
}: ModuleActivationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleActivate = async () => {
    try {
      setIsLoading(true);
      
      // Add loading toast
      const loadingToast = toast.loading(
        `${isActive ? 'Deactivating' : 'Activating'} ${module.name}...`
      );

      await onActivate();
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      onClose();
    } catch (error) {
      console.error('Error activating module:', error);
      toast.error('Failed to update module status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isActive ? 'Deactivate' : 'Activate'} {module.name}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {!isActive && module.setupRequired && (
              <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium">Setup Required</p>
                  <p>This module requires additional setup after activation.</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500 dark:text-gray-400">
              {isActive ? (
                <p>Are you sure you want to deactivate this module? Any saved data will be preserved but inaccessible until reactivation.</p>
              ) : (
                <p>Activating this module will add its features to your system. You can deactivate it at any time.</p>
              )}
            </div>

            {module.features && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Features included:
                </h4>
                <ul className="space-y-1">
                  {module.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {module.dependencies && (
              <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Required Modules:
                </h4>
                <ul className="space-y-1">
                  {module.dependencies.map((dep, index) => (
                    <li key={index} className="text-sm text-gray-500 dark:text-gray-400">
                      • {dep}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleActivate}
              disabled={isLoading}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg
                ${isActive
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-primary text-black hover:bg-primary/90'
                }
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  {isActive ? 'Deactivating...' : 'Activating...'}
                </>
              ) : (
                <>{isActive ? 'Deactivate Module' : 'Activate Module'}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}