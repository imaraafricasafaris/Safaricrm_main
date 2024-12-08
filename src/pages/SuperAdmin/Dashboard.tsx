import React from 'react';
import { Building2, Users, Key, BarChart3 } from 'lucide-react';

// Stats card component
const StatCard = ({ title, value, icon: Icon, trend }: { 
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
}) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex items-baseline justify-between">
      <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
      {trend && (
        <span className={`flex items-center text-sm ${
          trend.isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
        </span>
      )}
    </div>
  </div>
);

export default function SuperAdminDashboard() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Companies"
            value="24"
            icon={Building2}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value="156"
            icon={Users}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="API Keys"
            value="48"
            icon={Key}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Monthly Revenue"
            value="$45,231"
            icon={BarChart3}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Companies */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Companies
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        Safari Tours Ltd
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Premium Plan • 24 users
                      </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* API Usage */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                API Usage
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        /api/v1/leads
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        12.5k requests • 99.9% success
                      </p>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      45ms avg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}