import React from 'react';
import { TrendingUp } from 'lucide-react';
import StatCardBase from './StatCardBase';

export default function ConversionRateCard() {
  return (
    <StatCardBase
      title="Conversion Rate"
      value="24%"
      icon={TrendingUp}
      trend={{ value: 2, isPositive: false }}
      className="bg-purple-50 dark:bg-purple-900/20"
      iconClassName="text-purple-500"
    />
  );
}