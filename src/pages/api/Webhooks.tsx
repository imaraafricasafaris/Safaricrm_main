import React, { useState } from 'react';
import { Webhook, Plus, Search, Globe, Key, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface WebhookFormData {
  name: string;
  url: string;
  events: string[];
  secret: string;
}

export default function Webhooks() {
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm<WebhookFormData>();

  const onSubmit = async (data: WebhookFormData) => {
    try {
      // TODO: Implement webhook creation
      console.log('Creating webhook:', data);
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Error creating webhook:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Webhook className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Webhooks
          </h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-[30px] hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Webhook
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Create Webhook
          </h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Webhook Name
                </label>
                <input
                  {...register('name', { required: true })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter webhook name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Endpoint URL
                </label>
                <input
                  {...register('url', { required: true })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://your-domain.com/webhook"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Events
              </label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  'lead.created',
                  'lead.updated',
                  'lead.deleted',
                  'safari.booked',
                  'payment.received',
                  'document.signed'
                ].map((event) => (
                  <label key={event} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('events')}
                      value={event}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                      {event}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Secret Key
              </label>
              <div className="flex gap-2">
                <input
                  {...register('secret', { required: true })}
                  type="password"
                  className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter webhook secret"
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Webhook
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Webhooks List */}
      <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Active Webhooks
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search webhooks..."
                className="pl-9 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((webhook) => (
              <div
                key={webhook}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Lead Notifications
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      https://example.com/webhook
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-gray-400" />
                    <code className="text-sm font-mono text-gray-600 dark:text-gray-300">
                      ••••••••
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      3 retries
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Deliveries */}
      <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
            Recent Deliveries
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((delivery) => (
              <div
                key={delivery}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      lead.created
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    2 minutes ago
                  </span>
                </div>
                <pre className="mt-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto text-sm">
                  <code className="text-gray-800 dark:text-gray-200">
                    {JSON.stringify({ id: 'lead_123', status: 'success' }, null, 2)}
                  </code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}