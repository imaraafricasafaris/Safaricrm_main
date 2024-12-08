import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import SettingsTabs from '../components/settings/SettingsTabs';
import { useModules } from '../contexts/ModuleContext';
import toast from 'react-hot-toast';

export default function Settings() {
  const { isModuleActive } = useModules();

  React.useEffect(() => {
    if (!isModuleActive('settings')) {
      toast.error('Settings module is not active');
      return;
    }
  }, [isModuleActive]);

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <SettingsIcon className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Settings
          </h1>
        </div>

        <SettingsTabs />
      </div>
    </main>
  );
}