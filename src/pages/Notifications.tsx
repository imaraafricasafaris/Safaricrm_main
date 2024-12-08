import React from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useModules } from '../contexts/ModuleContext';
import toast from 'react-hot-toast';

export default function Notifications() {
  const { isModuleActive } = useModules();

  React.useEffect(() => {
    if (!isModuleActive('notifications')) {
      toast.error('Notifications module is not active');
      return;
    }
  }, [isModuleActive]);

  const notifications = [
    {
      id: 1,
      title: 'New Lead Assigned',
      message: 'A new lead has been assigned to you',
      time: '2 minutes ago',
      unread: true,
      type: 'lead'
    },
    {
      id: 2, 
      title: 'Task Due Soon',
      message: 'Follow up with Safari Package inquiry',
      time: '1 hour ago',
      unread: true,
      type: 'task'
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment received for booking #1234',
      time: '2 hours ago',
      unread: false,
      type: 'payment'
    }
  ];

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Notifications
            </h1>
          </div>
          <button className="text-sm text-primary hover:text-primary/90">
            Mark all as read
          </button>
        </div>

        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4
                ${notification.unread 
                  ? 'border-primary' 
                  : 'border-gray-200 dark:border-gray-700'}
              `}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {notification.message}
                  </p>
                  <span className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                    {notification.time}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <Check className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}