import React from 'react';
import { Map } from 'lucide-react';
import StatCardBase from './StatCardBase';

export default function ActiveSafarisCard() {
  return (
    <StatCardBase
      title="Active Safaris"
      value="18"
      icon={Map}
      trend={{ value: 5, isPositive: true }}
      className="bg-amber-50 dark:bg-amber-900/20"
      iconClassName="text-amber-500"
    />
  );
}