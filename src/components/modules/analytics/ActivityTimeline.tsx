import React from 'react';
import { Clock, Users, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ActivityTimelineProps {
  activity: {
    lastAccessed: string;
    activeUsers: number;
    totalSessions: number;
    avgDuration: string;
  };
}

export default function ActivityTimeline({ activity }: ActivityTimelineProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
        Activity Timeline
      </h3>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Last Accessed
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(activity.lastAccessed), { addSuffix: true })}
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(activity.lastAccessed).toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Active Users
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.activeUsers} users online
              </p>
            </div>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {activity.totalSessions} total sessions
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Average Session
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activity.avgDuration} duration
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}