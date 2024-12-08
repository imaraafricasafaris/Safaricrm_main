import React from 'react';
import { Users } from 'lucide-react';
import StatCardBase from './StatCardBase';

export default function TotalLeadsCard() {
  return (
    <StatCardBase
      title="Total Leads"
      value="234"
      icon={Users}
      trend={{ value: 12, isPositive: true }}
      className="bg-blue-50 dark:bg-blue-900/20"
      iconClassName="text-blue-500"
    />
  );
}