import React from 'react';
import { FileText } from 'lucide-react';

export default function Invoices() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Invoices
          </h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-6">
            <p className="text-gray-500 dark:text-gray-400">Invoice management implementation coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}