import React, { useState, useEffect } from 'react';
import { Terminal, Plus, Search } from 'lucide-react';
import { getApiEndpoints } from '../../lib/api/apiSystem';
import { ApiEndpoint } from '../../types/api';
import { Editor } from '@monaco-editor/react';
import toast from 'react-hot-toast';

export default function Endpoints() {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEndpoints();
  }, []);

  const loadEndpoints = async () => {
    try {
      setIsLoading(true);
      const data = await getApiEndpoints();
      setEndpoints(data);
    } catch (error) {
      console.error('Error loading endpoints:', error);
      toast.error('Failed to load API endpoints');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEndpoints = endpoints.filter(endpoint =>
    endpoint.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            API Endpoints
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[30px] focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-[30px] hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Add Endpoint
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Endpoints List */}
        <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Available Endpoints
            </h3>
            <div className="space-y-4">
              {filteredEndpoints.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => setSelectedEndpoint(endpoint)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                    selectedEndpoint?.id === endpoint.id
                      ? 'bg-primary/10 dark:bg-primary/5'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        endpoint.method === 'GET'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : endpoint.method === 'POST'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : endpoint.method === 'PUT'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm font-mono text-gray-900 dark:text-white">
                        {endpoint.path}
                      </code>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {endpoint.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      v{endpoint.version}
                    </span>
                    {endpoint.deprecated && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                        Deprecated
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Endpoint Details */}
        {selectedEndpoint && (
          <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Endpoint Details
              </h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Request Example
                  </h4>
                  <div className="h-48 rounded-lg overflow-hidden">
                    <Editor
                      defaultLanguage="json"
                      defaultValue={JSON.stringify({
                        url: `https://api.example.com${selectedEndpoint.path}`,
                        method: selectedEndpoint.method,
                        headers: {
                          'Authorization': 'Bearer YOUR_API_KEY',
                          'Content-Type': 'application/json'
                        }
                      }, null, 2)}
                      theme={document.documentElement.classList.contains('dark') ? 'vs-dark' : 'light'}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Authentication
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEndpoint.auth_required ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Rate Limit
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEndpoint.rate_limit} requests/minute
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cache TTL
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEndpoint.cache_ttl} seconds
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Version
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedEndpoint.version}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}