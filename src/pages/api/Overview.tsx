import React, { useState, useEffect } from 'react';
import { Activity, Plus, Search, Globe, Key, RefreshCw, MoreHorizontal } from 'lucide-react';
import { getApiMetrics } from '../../lib/api/apiSystem';
import ApiMetricsCard from '../../components/api/ApiMetricsCard';
import ApiTrafficChart from '../../components/api/ApiTrafficChart';
import StatusCodeChart from '../../components/api/StatusCodeChart';
import toast from 'react-hot-toast';

export default function Overview() {
  const [metrics, setMetrics] = useState<ApiMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      setIsLoading(true);
      const data = await getApiMetrics(
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        new Date().toISOString()
      );
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
      toast.error('Failed to load API metrics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ApiMetricsCard
          title="Total Requests"
          value={metrics?.total_requests.toLocaleString() || '0'}
          icon={Activity}
          trend={{ value: 12, isPositive: true }}
        />
        <ApiMetricsCard
          title="Average Response"
          value={`${metrics?.average_response_time.toFixed(2) || '0'}ms`}
          icon={Activity}
          trend={{ value: 5, isPositive: true }}
        />
        <ApiMetricsCard
          title="Error Rate"
          value={`${metrics?.error_rate.toFixed(2) || '0'}%`}
          icon={Activity}
          trend={{ value: 2, isPositive: false }}
        />
        <ApiMetricsCard
          title="Requests/Min"
          value={metrics?.requests_per_minute.toFixed(2) || '0'}
          icon={Activity}
          trend={{ value: 8, isPositive: true }}
        />
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 md:columns-2 gap-6 [&>*]:mb-6 [&>*]:break-inside-avoid">
        {/* Traffic Chart */}
        <ApiTrafficChart data={metrics?.top_endpoints || []} />

        {/* New Channel */}
        <div className="bg-[#1A1B2E] p-6 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <h3 className="text-lg font-medium text-white mb-4">New Channel</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="https://maps.google.com/maps/api/js?key=234554"
              className="w-full px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
            <div className="flex gap-2">
              <select className="flex-1 px-4 py-2 bg-gray-800/50 text-white border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary text-sm">
                <option>Select Application</option>
                <option>Google Maps</option>
                <option>Stripe</option>
                <option>PayPal</option>
              </select>
              <button className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 text-sm">
                Install
              </button>
            </div>
          </div>
        </div>

        {/* Status Code Distribution */}
        <StatusCodeChart data={metrics?.status_codes || {}} />

        {/* Your APIs */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your APIs</h3>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search APIs..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary text-sm"
              />
            </div>
          </div>
          <div className="space-y-4">
            {metrics?.top_endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {endpoint.path}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {endpoint.count.toLocaleString()} requests
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-4 bg-green-500 rounded-full" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">Active</span>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}