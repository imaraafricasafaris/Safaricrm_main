import React, { useState } from 'react';
import { Palette, Upload, Eye, Sliders, Layout } from 'lucide-react';

export default function BrandSettings() {
  const [primaryColor, setPrimaryColor] = useState('#6366F1');
  const [secondaryColor, setSecondaryColor] = useState('#EC4899');
  const [accentColor, setAccentColor] = useState('#14B8A6');
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Brand Settings
        </h2>

        <div className="space-y-6">
          {/* Logo Settings */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Company Logo
            </h3>
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0 h-24 w-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <Upload className="w-8 h-8 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col gap-2">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors inline-flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Logo
                  </button>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recommended size: 512x512px. Max file size: 2MB.
                    Supported formats: PNG, SVG
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Color Scheme */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Color Scheme
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Layout */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dashboard Layout
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <label className="relative flex flex-col items-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input type="radio" name="layout" className="sr-only" defaultChecked />
                  <Layout className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Default</span>
                  <span className="absolute inset-0 rounded-lg ring-2 ring-primary-500 ring-opacity-0 peer-checked:ring-opacity-100" />
                </label>
                <label className="relative flex flex-col items-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input type="radio" name="layout" className="sr-only" />
                  <Layout className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Compact</span>
                </label>
                <label className="relative flex flex-col items-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
                  <input type="radio" name="layout" className="sr-only" />
                  <Layout className="w-6 h-6 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Comfortable</span>
                </label>
              </div>
            </div>
          </div>

          {/* Widget Visibility */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Dashboard Widgets
            </h3>
            <div className="space-y-2">
              {[
                'Revenue Overview',
                'Recent Leads',
                'Upcoming Safaris',
                'Task List',
                'Weather Forecast',
                'Vehicle Status',
                'Guide Availability',
                'Recent Activities'
              ].map((widget) => (
                <label key={widget} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {widget}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Theme Customization */}
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