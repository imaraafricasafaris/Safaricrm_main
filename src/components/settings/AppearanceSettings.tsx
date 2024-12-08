import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export default function AppearanceSettings() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="w-5 h-5 text-gray-400" />
              ) : (
                <Sun className="w-5 h-5 text-gray-400" />
              )}
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Theme
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Toggle between light and dark mode
            </p>
          </div>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
          </button>
        </div>
      </div>
    </div>
  );
}