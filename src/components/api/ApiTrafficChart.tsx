import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ApiTrafficChartProps {
  data: Array<{
    path: string;
    count: number;
  }>;
}

export default function ApiTrafficChart({ data }: ApiTrafficChartProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-[30px] shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">API Traffic</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="path" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#6366F1" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}