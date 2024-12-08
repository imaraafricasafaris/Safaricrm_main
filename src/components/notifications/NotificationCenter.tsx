import React from 'react';
import { Bell, X, Settings, Check, AlertTriangle, Info } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { NotificationType } from '../../types/notifications';
import { format } from 'date-fns';

const notificationIcons: Record<NotificationType, React.ElementType> = {
  module: Info,
  subscription: AlertTriangle,
  system: Info,
  error: AlertTriangle
};

const notificationColors: Record<NotificationType, string> = {
  module: 'text-blue-500',
  subscription: 'text-yellow-500',
  system: 'text-gray-500',
  error: 'text-red-500'
};

export default function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification
  } = useNotifications();

  const [isOpen, setIsOpen] = React.useState(false);

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleDismiss = async (id: string) => {
    await dismissNotification(id);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-black text-xs font-medium rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-sm text-primary hover:text-primary/90"
                  >
                    Mark all as read
                  </button>
                  <Settings className="w-5 h-5 text-gray-400 cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type];
                  const colorClass = notificationColors[notification.type];
                  
                  return (
                    <div
                      key={notification.id}
                      className={`
                        p-4 border-b border-gray-200 dark:border-gray-700 last:border-0
                        ${notification.status === 'unread' ? 'bg-gray-50 dark:bg-gray-700/50' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className={`w-5 h-5 flex-shrink-0 ${colorClass}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.title}
                            </p>
                            <div className="flex items-center gap-2">
                              {notification.status === 'unread' && (
                                <button
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDismiss(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          {notification.action_url && (
                            <a
                              href={notification.action_url}
                              className="inline-block mt-2 text-sm text-primary hover:text-primary/90"
                            >
                              View Details
                            </a>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {format(new Date(notification.created_at), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}