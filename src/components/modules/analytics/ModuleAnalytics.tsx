import React, { useState, useEffect } from 'react';
import { Calendar, Users, Activity, Clock, Download } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import UsageMetricsCard from './UsageMetricsCard';
import PerformanceChart from './PerformanceChart';
import ActivityTimeline from './ActivityTimeline';
import ModuleKPIs from './ModuleKPIs';

interface ModuleAnalyticsProps {
  moduleId: string;
  moduleName: string;
}

export default function ModuleAnalytics({ moduleId, moduleName }: ModuleAnalyticsProps) {
  const [dateRange, setDateRange] = useState('30d');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, [moduleId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to fetch analytics
      // For now using mock data
      const mockData = generateMockData();
      setMetrics(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockData = () => ({
    usage: {
      total: 1234,
      trend: 15,
      uniqueUsers: 45,
      peakTime: '2:00 PM',
      dailyData: Array.from({ length: 30 }, (_, i) => ({
        date: format(new Date().setDate(new Date().getDate() - i), 'MMM dd'),
        value: Math.floor(Math.random() * 100) + 20
      })).reverse()
    },
    performance: {
      successRate: 98.5,
      errorRate: 1.5,
      avgResponseTime: 245,
      uptime: 99.99
    },
    activity: {
      lastAccessed: new Date().toISOString(),
      activeUsers: 12,
      totalSessions: 89,
      avgDuration: '25m'
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {moduleName} Analytics
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <UsageMetricsCard
          title="Total Usage"
          value={metrics.usage.total}
          trend={metrics.usage.trend}
          icon={Activity}
        />
        <UsageMetricsCard
          title="Unique Users"
          value={metrics.usage.uniqueUsers}
          icon={Users}
        />
        <UsageMetricsCard
          title="Success Rate"
          value={`${metrics.performance.successRate}%`}
          trend={2.5}
          icon={Activity}
        />
        <UsageMetricsCard
          title="Avg Response Time"
          value={`${metrics.performance.avgResponseTime}ms`}
          trend={-10}
          icon={Clock}
        />
      </div>

      {/* Usage Trend Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Usage Trend
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.usage.dailyData}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9EFF00" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#9EFF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
              <XAxis
                dataKey="date"
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <YAxis
                tick={{ fill: 'currentColor' }}
                className="text-gray-600 dark:text-gray-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9EFF00"
                fillOpacity={1}
                fill="url(#colorUsage)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Metrics & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart performance={metrics.performance} />
        <ActivityTimeline activity={metrics.activity} />
      </div>

      {/* Module-specific KPIs */}
      <ModuleKPIs moduleId={moduleId} />
    </div>
  );
}