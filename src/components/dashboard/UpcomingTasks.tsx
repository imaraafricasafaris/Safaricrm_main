import React from 'react';
import { Calendar, CheckCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  date: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Follow up with Serengeti Safari inquiry',
    date: '2024-03-20',
    completed: false,
    priority: 'high',
  },
  {
    id: '2',
    title: 'Prepare Masai Mara itinerary',
    date: '2024-03-21',
    completed: false,
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Client meeting - Safari package review',
    date: '2024-03-22',
    completed: false,
    priority: 'high',
  },
];

const priorityStyles = {
  low: 'border-gray-200 dark:border-gray-700',
  medium: 'border-yellow-400',
  high: 'border-red-400',
};

export default function UpcomingTasks() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Tasks</h2>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {mockTasks.map((task) => (
          <div
            key={task.id}
            className={`p-6 border-l-4 ${priorityStyles[task.priority]} hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}
          >
            <div className="flex items-start gap-4">
              <button className="mt-1 text-gray-400 hover:text-primary transition-colors">
                <CheckCircle className="w-5 h-5" />
              </button>
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Due {task.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}