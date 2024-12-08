import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import Toggle from '../ui/Toggle';

const emailNotifications = [
  { id: 'new_lead', label: 'New lead notifications', description: 'Get notified when new leads are created' },
  { id: 'booking_confirm', label: 'Booking confirmations', description: 'Receive booking confirmation alerts' },
  { id: 'payment', label: 'Payment notifications', description: 'Get alerts for payments and invoices' },
  { id: 'task', label: 'Task assignments', description: 'Be notified when tasks are assigned to you' }
];

const pushNotifications = [
  { id: 'safari_departure', label: 'Safari departure reminders', description: 'Get reminders before safari departures' },
  { id: 'vehicle_maintenance', label: 'Vehicle maintenance alerts', description: 'Be notified of vehicle maintenance needs' },
  { id: 'guide_availability', label: 'Guide availability updates', description: 'Track changes in guide schedules' },
  { id: 'weather_alert', label: 'Weather alerts', description: 'Receive important weather updates' }
];

export default function NotificationSettings() {
  const [emailSettings, setEmailSettings] = useState(
    emailNotifications.reduce((acc, notif) => ({ ...acc, [notif.id]: true }), {})
  );
  
  const [pushSettings, setPushSettings] = useState(
    pushNotifications.reduce((acc, notif) => ({ ...acc, [notif.id]: true }), {})
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
          Notification Preferences
        </h2>
        
        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Email Notifications
            </h3>
            <div className="space-y-4">
              {emailNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-200
                    ${emailSettings[notification.id]
                      ? 'border-primary-200 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }
                  `}
                >
                  <Toggle
                    enabled={emailSettings[notification.id]}
                    onChange={(enabled) => setEmailSettings(prev => ({ ...prev, [notification.id]: enabled }))}
                    label={notification.label}
                    description={notification.description}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Push Notifications
            </h3>
            <div className="space-y-4">
              {pushNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 rounded-lg border transition-all duration-200
                    ${pushSettings[notification.id]
                      ? 'border-primary-200 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    }
                  `}
                >
                  <Toggle
                    enabled={pushSettings[notification.id]}
                    onChange={(enabled) => setPushSettings(prev => ({ ...prev, [notification.id]: enabled }))}
                    label={notification.label}
                    description={notification.description}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notification Schedule */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Notification Schedule
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  defaultValue="18:00"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Save Changes */}
          <div className="flex justify-end pt-4">
            <button className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}