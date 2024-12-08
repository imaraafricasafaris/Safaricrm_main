import React from 'react';
import { DollarSign } from 'lucide-react';
import StatCardBase from './StatCardBase';

export default function RevenueCard() {
  return (
    <StatCardBase
      title="Revenue"
      value="$45,231"
      icon={DollarSign}
      trend={{ value: 8, isPositive: true }}
      className="bg-green-50 dark:bg-green-900/20"
      iconClassName="text-green-500"
    />
  );
}