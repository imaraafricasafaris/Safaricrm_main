import React, { useState, useEffect } from 'react';
import { Key, Plus, Activity, Webhook, Book, Terminal, Settings2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Editor } from '@monaco-editor/react';
import SwaggerUI from 'swagger-ui-react';
import ReactJson from 'react-json-view';
import { getApiKeys, getApiMetrics, getApiEndpoints } from '../../lib/api/apiSystem';
import { ApiKey, ApiMetrics, ApiEndpoint } from '../../types/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

export default function ApiDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [keysData, metricsData, endpointsData] = await Promise.all([
        getApiKeys(),
        getApiMetrics(
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          new Date().toISOString()
        ),
        getApiEndpoints()
      ]);

      setApiKeys(keysData);
      setMetrics(metricsData);
      setEndpoints(endpointsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load API dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Activity },
    { id: 'keys', name: 'API Keys', icon: Key },
    { id: 'endpoints', name: 'Endpoints', icon: Terminal },
    { id: 'webhooks', name: 'Webhooks', icon: Webhook },
    { id: 'docs', name: 'Documentation', icon: Book },
    { id: 'settings', name: 'Settings', icon: Settings2 }
  ];

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
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          API Dashboard
        </h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Generate API Key
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <tab.icon className={`
                w-5 h-5 mr-2
                ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}
              `} />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Requests
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.total_requests.toLocaleString()}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Average Response Time
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.average_response_time.toFixed(2)}ms
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Error Rate
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.error_rate.toFixed(2)}%
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Requests/Minute
                </h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-white">
                  {metrics.requests_per_minute.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Usage Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                API Usage
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.top_endpoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="path" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#6366F1"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Endpoints */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Top Endpoints
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3">Endpoint</th>
                      <th className="px-6 py-3">Requests</th>
                      <th className="px-6 py-3">Avg. Response Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {metrics.top_endpoints.map((endpoint) => (
                      <tr key={endpoint.path}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {endpoint.path}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {endpoint.count.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {endpoint.average_time.toFixed(2)}ms
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keys' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Key</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {apiKeys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {key.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">
                        {key.key.slice(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          key.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {key.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(key.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={() => {/* Handle revoke */}}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'endpoints' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3">Path</th>
                    <th className="px-6 py-3">Method</th>
                    <th className="px-6 py-3">Version</th>
                    <th className="px-6 py-3">Auth Required</th>
                    <th className="px-6 py-3">Rate Limit</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {endpoints.map((endpoint) => (
                    <tr key={endpoint.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-white">
                        {endpoint.path}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {endpoint.version}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {endpoint.auth_required ? 'Yes' : 'No'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {endpoint.rate_limit}/min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          endpoint.deprecated
                            ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        }`}>
                          {endpoint.deprecated ? 'Deprecated' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}