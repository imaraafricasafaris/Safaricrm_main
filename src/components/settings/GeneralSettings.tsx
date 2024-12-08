import React from 'react';
import { Globe, Clock, DollarSign } from 'lucide-react';

export default function GeneralSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          General Settings
        </h2>

        <div className="space-y-6">
          {/* Time Zone Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Time & Date
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Time Zone
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                  <option value="Africa/Cairo">Eastern European Time (EET)</option>
                  <option value="Africa/Lagos">West Africa Time (WAT)</option>
                  <option value="Africa/Johannesburg">South African Standard Time (SAST)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Date Format
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Language & Region
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  System Language
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="sw">Swahili</option>
                  <option value="ar">Arabic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Region
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="EA">East Africa</option>
                  <option value="SA">Southern Africa</option>
                  <option value="WA">West Africa</option>
                  <option value="NA">North Africa</option>
                </select>
              </div>
            </div>
          </div>

          {/* Currency Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Currency & Numbers
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Default Currency
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="KES">KES - Kenyan Shilling</option>
                  <option value="TZS">TZS - Tanzanian Shilling</option>
                  <option value="UGX">UGX - Ugandan Shilling</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Number Format
                </label>
                <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
                  <option value="1,234.56">1,234.56</option>
                  <option value="1.234,56">1.234,56</option>
                  <option value="1 234.56">1 234.56</option>
                </select>
              </div>
            </div>
          </div>

          {/* System Preferences */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              System Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Auto-save Changes
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Automatically save changes as you make them
                  </p>
                </div>
                <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    Show Tooltips
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display helpful tooltips throughout the system
                  </p>
                </div>
                <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-primary-600 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  <span className="translate-x-5 inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
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