import React from 'react';
import { Layout } from 'lucide-react';

export default function DashboardLayout() {
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Dashboard Layout
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <LayoutOption label="Default" defaultChecked />
          <LayoutOption label="Compact" />
          <LayoutOption label="Comfortable" />
        </div>
      </div>
    </div>
  );
}

interface LayoutOptionProps {
  label: string;
  defaultChecked?: boolean;
}

function LayoutOption({ label, defaultChecked }: LayoutOptionProps) {
  return (
    <label className="relative flex flex-col items-center gap-2 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
      <input type="radio" name="layout" className="sr-only" defaultChecked={defaultChecked} />
      <Layout className="w-6 h-6 text-gray-400" />
      <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
      <span className="absolute inset-0 rounded-lg ring-2 ring-primary-500 ring-opacity-0 peer-checked:ring-opacity-100" />
    </label>
  );
}