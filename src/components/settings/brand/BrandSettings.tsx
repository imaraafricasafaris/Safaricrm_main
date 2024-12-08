import React, { useState } from 'react';
import LogoUpload from './LogoUpload';
import ColorScheme from './ColorScheme';
import DashboardLayout from './DashboardLayout';
import WidgetVisibility from './WidgetVisibility';
import ThemeCustomization from './ThemeCustomization';

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
          <LogoUpload />
          
          <ColorScheme
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            onPrimaryChange={setPrimaryColor}
            onSecondaryChange={setSecondaryColor}
            onAccentChange={setAccentColor}
          />
          
          <DashboardLayout />
          <WidgetVisibility />
          <ThemeCustomization />

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