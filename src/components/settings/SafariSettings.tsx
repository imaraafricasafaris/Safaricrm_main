import React from 'react';
import { Compass, Clock, Users, Car } from 'lucide-react';

export default function SafariSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Safari Settings
        </h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Safari Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              defaultValue={7}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Group Size
            </label>
            <input
              type="number"
              min="1"
              defaultValue={15}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Booking Notice Period (Days)
            </label>
            <input
              type="number"
              min="0"
              defaultValue={30}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Currency
            </label>
            <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="KES">KES - Kenyan Shilling</option>
              <option value="TZS">TZS - Tanzanian Shilling</option>
              <option value="ZAR">ZAR - South African Rand</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Automatic Notifications
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Send booking confirmations</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Send payment reminders</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Send pre-safari briefings</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Send post-safari feedback requests</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}