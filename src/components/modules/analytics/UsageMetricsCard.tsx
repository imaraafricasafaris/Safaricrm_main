import React from 'react';
import { LucideIcon } from 'lucide-react';

interface UsageMetricsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  icon: LucideIcon;
}

export default function UsageMetricsCard({
  title,
  value,
  trend,
  icon: Icon
}: UsageMetricsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {title}
        </h3>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend !== undefined && (
          <span className={`flex items-center text-sm ${
            trend >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  );
}