import React from 'react';
import { Database, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

export default function DataManagementSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Data Management
        </h2>
        
        <div className="space-y-8">
          {/* Data Export */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Export Data
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'All Data', description: 'Export complete database' },
                  { label: 'Leads Only', description: 'Export leads and related data' },
                  { label: 'Safari Data', description: 'Export safari packages and bookings' },
                ].map((option) => (
                  <button
                    key={option.label}
                    className="flex flex-col items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-colors group"
                  >
                    <Download className="w-6 h-6 text-gray-400 group-hover:text-primary-500" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.label}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {option.description}
                    </span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                Exports are anonymized by default for data protection
              </div>
            </div>
          </div>

          {/* Data Import */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Import Data
            </h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <Upload className="w-8 h-8 text-gray-400" />
                <div className="text-center">
                  <button className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-500">
                    Click to upload
                  </button>
                  <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  CSV, JSON, or Excel files up to 50MB
                </p>
              </div>
            </div>
          </div>

          {/* Data Retention */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Data Retention
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Keep Lead Data For
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="1">1 year</option>
                    <option value="2">2 years</option>
                    <option value="3">3 years</option>
                    <option value="forever">Forever</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Keep Activity Logs For
                  </label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div>
            <h3 className="text-sm font-medium text-error-600 dark:text-error-400 mb-4">
              Danger Zone
            </h3>
            <div className="space-y-4 border border-error-200 dark:border-error-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Delete All Data
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
                <button className="px-4 py-2 bg-error-600 text-white rounded-lg hover:bg-error-500 transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  Delete All Data
                </button>
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