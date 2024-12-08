import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { Dependency } from '../../types/dependencies';

interface DependencyListProps {
  dependencies: Dependency[];
  onSelect: (dependency: Dependency) => void;
}

export default function DependencyList({ dependencies, onSelect }: DependencyListProps) {
  const priorityColors = {
    P0: 'text-red-500 bg-red-100 dark:bg-red-900/20',
    P1: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
    P2: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20',
    P3: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20'
  };

  return (
    <div className="space-y-4">
      {dependencies.map((dep) => (
        <div
          key={dep.id}
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  {dep.target_module}
                </h3>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[dep.priority]}`}>
                  {dep.priority}
                </span>
                {dep.type === 'required' && (
                  <span className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-400">
                    <AlertTriangle className="w-3 h-3" />
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {dep.description}
              </p>
            </div>
            <button
              onClick={() => onSelect(dep)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {dep.api_endpoints && dep.api_endpoints.length > 0 && (
            <div className="mt-3">
              <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                API Dependencies
              </h4>
              <div className="flex flex-wrap gap-2">
                {dep.api_endpoints.map((endpoint) => (
                  <span
                    key={endpoint}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                  >
                    {endpoint}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span>Impact Level: {dep.failure_impact}/5</span>
            <span>Recovery Time: ~{dep.mttr_estimate}min</span>
          </div>
        </div>
      ))}
    </div>
  );
}