import React from 'react';
import { Upload } from 'lucide-react';

export default function LogoUpload() {
  return (
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
  );
}