import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PerformanceChartProps {
  performance: {
    successRate: number;
    errorRate: number;
    avgResponseTime: number;
    uptime: number;
  };
}

const COLORS = ['#9EFF00', '#FF4444'];

export default function PerformanceChart({ performance }: PerformanceChartProps) {
  const data = [
    { name: 'Success', value: performance.successRate },
    { name: 'Error', value: performance.errorRate }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Performance Metrics
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {performance.avgResponseTime}ms
          </p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {performance.uptime}%
          </p>
        </div>
      </div>
    </div>
  );
}