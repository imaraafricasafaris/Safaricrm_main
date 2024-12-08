import React from 'react';
import { Settings2, Shield, Globe, Bell, Database, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings2 className="w-8 h-8 text-primary" />
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          API Settings
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Security
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                API Key Expiration
              </label>
              <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary">
                <option value="30">30 days</option>
                <option value="60">60 days</option>
                <option value="90">90 days</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                IP Whitelist
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Enter IP addresses (one per line)"
              />
            </div>
          </div>
        </div>

        {/* Rate Limiting */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Rate Limiting
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Default Rate Limit
              </label>
              <input
                type="number"
                min="0"
                defaultValue="1000"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Requests per minute
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Burst Rate
              </label>
              <input
                type="number"
                min="0"
                defaultValue="50"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum burst size
              </p>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Rate Limit Alerts
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified when rate limits are exceeded
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Error Notifications
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get notified about API errors
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Caching */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] p-6">
          <div className="flex items-center gap-2 mb-6">
            <Database className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Caching
            </h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Default Cache TTL
              </label>
              <input
                type="number"
                min="0"
                defaultValue="300"
                className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Time in seconds
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Enable Response Caching
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Cache successful GET requests
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary text-black rounded-[30px] hover:bg-primary/90 transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}