import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export default function StatCard({ title, value, icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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
}