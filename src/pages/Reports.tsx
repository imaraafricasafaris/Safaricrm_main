import React from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Map } from 'lucide-react';
import { useModules } from '../contexts/ModuleContext';
import toast from 'react-hot-toast';

export default function Reports() {
  const { isModuleActive } = useModules();

  React.useEffect(() => {
    if (!isModuleActive('advanced-reporting')) {
      toast.error('Advanced Reporting module is not active');
      return;
    }
  }, [isModuleActive]);

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Revenue Report */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Revenue Overview
              </h3>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div className="h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
              {/* Chart will go here */}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Revenue</span>
              <span className="font-medium text-gray-900 dark:text-white">$45,231</span>
            </div>
          </div>

          {/* Lead Conversion */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Lead Conversion
              </h3>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
              {/* Chart will go here */}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Conversion Rate</span>
              <span className="font-medium text-gray-900 dark:text-white">24%</span>
            </div>
          </div>

          {/* Safari Bookings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Safari Bookings
              </h3>
              <Map className="w-5 h-5 text-primary" />
            </div>
            <div className="h-48 bg-gray-50 dark:bg-gray-700/50 rounded-lg mb-4">
              {/* Chart will go here */}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Total Bookings</span>
              <span className="font-medium text-gray-900 dark:text-white">156</span>
            </div>
          </div>
        </div>

        {/* Export Options */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Export Reports
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Financial Report
                </span>
                <DollarSign className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Export detailed financial data and revenue analytics
              </p>
            </button>

            <button className="p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Lead Analytics
                </span>
                <Users className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Export lead conversion and pipeline data
              </p>
            </button>

            <button className="p-4 text-left bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Booking Report
                </span>
                <Map className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Export safari booking and occupancy data
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}