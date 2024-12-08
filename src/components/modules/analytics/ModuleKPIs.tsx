import React from 'react';
import { UserPlus, DollarSign, Users, Clock } from 'lucide-react';

interface ModuleKPIs {
  [key: string]: {
    metrics: Array<{
      name: string;
      value: string | number;
      trend?: number;
      icon: React.ElementType;
    }>;
  };
}

const MODULE_KPIS: ModuleKPIs = {
  'leads': {
    metrics: [
      { name: 'New Leads', value: 145, trend: 12, icon: UserPlus },
      { name: 'Conversion Rate', value: '24%', trend: -2, icon: Users },
      { name: 'Avg Response Time', value: '2.5h', trend: -15, icon: Clock },
      { name: 'Pipeline Value', value: '$45,231', trend: 8, icon: DollarSign }
    ]
  },
  'finance': {
    metrics: [
      { name: 'Revenue', value: '$125,430', trend: 15, icon: DollarSign },
      { name: 'Transactions', value: 234, trend: 5, icon: Activity },
      { name: 'Avg Deal Size', value: '$5,360', trend: 3, icon: DollarSign },
      { name: 'Outstanding', value: '$12,450', trend: -8, icon: Clock }
    ]
  }
  // Add more module-specific KPIs as needed
};

interface ModuleKPIsProps {
  moduleId: string;
}

export default function ModuleKPIs({ moduleId }: ModuleKPIsProps) {
  const kpis = MODULE_KPIS[moduleId]?.metrics;

  if (!kpis) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Key Performance Indicators
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {kpi.name}
                </h4>
              </div>
              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
                {kpi.trend !== undefined && (
                  <span className={`flex items-center text-sm ${
                    kpi.trend >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}