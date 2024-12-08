import React from 'react';

export default function ThemeCustomization() {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Theme Customization
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Font Family
          </label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="inter">Inter</option>
            <option value="roboto">Roboto</option>
            <option value="opensans">Open Sans</option>
            <option value="poppins">Poppins</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
            Border Radius
          </label>
          <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500">
            <option value="none">None</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
      </div>
    </div>
  );
}