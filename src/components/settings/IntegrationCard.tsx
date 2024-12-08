import React from 'react';
import { Settings2, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { Integration } from '../../types/integrations';
import Toggle from '../ui/Toggle';

interface IntegrationCardProps {
  integration: Integration;
  onConfigure: (integration: Integration) => void;
  onToggle: (integration: Integration) => Promise<void>;
}

export default function IntegrationCard({
  integration,
  onConfigure,
  onToggle
}: IntegrationCardProps) {
  const statusIcons = {
    active: CheckCircle2,
    inactive: XCircle,
    error: AlertTriangle,
    pending: Settings2
  };

  const statusColors = {
    active: 'text-green-500',
    inactive: 'text-gray-400',
    error: 'text-red-500',
    pending: 'text-yellow-500'
  };

  const StatusIcon = statusIcons[integration.status];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <img
              src={`/icons/${integration.provider}.svg`}
              alt={integration.provider}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src = '/icons/default.svg';
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {integration.name}
            </h3>
            <div className="flex items-center gap-2">
              <StatusIcon className={`w-4 h-4 ${statusColors[integration.status]}`} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {integration.status.charAt(0).toUpperCase() + integration.status.slice(1)}
              </span>
            </div>
          </div>
        </div>
        <Toggle
          enabled={integration.status === 'active'}
          onChange={() => onToggle(integration)}
          size="sm"
        />
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {integration.description}
      </p>

      <div className="space-y-3">
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available in Modules
          </h4>
          <div className="flex flex-wrap gap-2">
            {integration.modules.map((module) => (
              <span
                key={module}
                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg"
              >
                {module}
              </span>
            ))}
          </div>
        </div>

        {integration.last_sync && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last synced: {new Date(integration.last_sync).toLocaleString()}
          </div>
        )}

        {integration.error_message && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {integration.error_message}
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => onConfigure(integration)}
          className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm"
        >
          Configure Integration
        </button>
      </div>
    </div>
  );
}