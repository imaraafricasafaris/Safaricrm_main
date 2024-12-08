import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardBaseProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export default function StatCardBase({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
  iconClassName = 'text-primary'
}: StatCardBaseProps) {
  return (
    <div className={`rounded-xl p-4 h-full flex flex-col justify-between transition-all duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
          {title}
        </h3>
        <Icon className={`w-5 h-5 ${iconClassName}`} />
      </div>
      <div className="flex items-baseline justify-between mt-auto">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
          {value}
        </p>
        {trend && (
          <span className={`flex items-center text-sm ${
            trend.isPositive ? 'text-green-500' : 'text-red-500'
          }`}>
            <span className="inline-block mr-0.5">{trend.isPositive ? '↑' : '↓'}</span>
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>
    </div>
  );
}