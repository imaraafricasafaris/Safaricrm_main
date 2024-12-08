import React from 'react';
import { Zap, Plus, Play, Pause, Settings, AlertTriangle } from 'lucide-react';

const workflows = [
  {
    id: 1,
    name: 'Lead Follow-up',
    description: 'Automatically send follow-up emails to new leads',
    trigger: 'New Lead Created',
    status: 'active'
  },
  {
    id: 2,
    name: 'Payment Reminder',
    description: 'Send payment reminders before due dates',
    trigger: 'Payment Due',
    status: 'active'
  },
  {
    id: 3,
    name: 'Safari Feedback',
    description: 'Request feedback after safari completion',
    trigger: 'Safari Completed',
    status: 'inactive'
  }
];

export default function WorkflowAutomationSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Workflow Automation
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
            <Plus className="w-4 h-4" />
            Create Workflow
          </button>
        </div>

        <div className="space-y-6">
          {/* Active Workflows */}
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary-500" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {workflow.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-1 text-gray-400 hover:text-primary-500">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-primary-500">
                      {workflow.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {workflow.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Trigger: {workflow.trigger}
                  </span>
                  <span className={`
                    px-2 py-0.5 text-xs font-medium rounded-full
                    ${workflow.status === 'active'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }
                  `}>
                    {workflow.status.charAt(0).toUpperCase() + workflow.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Workflow Templates */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Workflow Templates
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  name: 'Lead Nurturing',
                  description: 'Automated lead follow-up sequence',
                  icon: Zap
                },
                {
                  name: 'Safari Reminders',
                  description: 'Pre-safari preparation reminders',
                  icon: Zap
                },
                {
                  name: 'Payment Processing',
                  description: 'Automated payment handling',
                  icon: Zap
                }
              ].map((template) => (
                <button
                  key={template.name}
                  className="p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group"
                >
                  <template.icon className="w-6 h-6 text-gray-400 group-hover:text-primary-500 mb-2" />
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    {template.name}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Usage Limits */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Automation Usage
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  You have used 75% of your monthly automation quota. Upgrade your plan for unlimited automations.
                </p>
                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div className="h-full w-3/4 bg-primary-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}