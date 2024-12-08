import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F43F5E'];

interface StatusCodeChartProps {
  data: Record<string, number>;
}

export default function StatusCodeChart({ data }: StatusCodeChartProps) {
  const chartData = Object.entries(data).map(([code, count]) => ({
    name: code,
    value: count
  }));

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Status Codes</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}