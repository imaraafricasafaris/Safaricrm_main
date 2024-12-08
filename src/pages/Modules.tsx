import React from 'react';
import { Grid } from 'lucide-react';
import ModuleOverview from '../components/modules/ModuleOverview';

export default function Modules() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Grid className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            System Modules
          </h1>
        </div>

        <ModuleOverview />
      </div>
    </div>
  );
}