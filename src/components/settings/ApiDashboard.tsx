import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal } from 'lucide-react';

export default function ApiDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Dashboard
          </h2>
        </div>
        <button
          onClick={() => navigate('/api-dashboard')}
          className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          Open API Dashboard
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400">
          The API Dashboard provides a comprehensive interface for managing your API keys, monitoring usage, and accessing documentation. Click the button above to access the full dashboard.
        </p>
      </div>
    </div>
  );
}