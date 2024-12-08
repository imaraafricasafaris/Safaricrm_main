import React, { useState } from 'react';
import { GripHorizontal } from 'lucide-react';
import Toggle from '../../ui/Toggle';

const widgets = [
  { id: 'revenue', name: 'Revenue Overview', description: 'Show revenue statistics and trends' },
  { id: 'leads', name: 'Recent Leads', description: 'Display latest lead activity' },
  { id: 'safaris', name: 'Upcoming Safaris', description: 'Show scheduled safari trips' },
  { id: 'tasks', name: 'Task List', description: 'View and manage pending tasks' },
  { id: 'weather', name: 'Weather Forecast', description: 'Display weather conditions for safari locations' },
  { id: 'vehicles', name: 'Vehicle Status', description: 'Monitor vehicle fleet status' },
  { id: 'guides', name: 'Guide Availability', description: 'Track guide schedules and availability' },
  { id: 'activities', name: 'Recent Activities', description: 'Show latest system activities' },
  { id: 'bookings', name: 'Recent Bookings', description: 'Display latest safari bookings' },
  { id: 'payments', name: 'Payment Overview', description: 'Track payment status and history' },
  { id: 'calendar', name: 'Calendar Events', description: 'View upcoming events and schedules' },
  { id: 'analytics', name: 'Analytics Summary', description: 'Show key performance metrics' }
];

export default function WidgetVisibility() {
  const [visibleWidgets, setVisibleWidgets] = useState(
    widgets.reduce((acc, widget) => ({ ...acc, [widget.id]: true }), {})
  );

  const toggleWidget = (widgetId: string) => {
    setVisibleWidgets(prev => ({
      ...prev,
      [widgetId]: !prev[widgetId]
    }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Dashboard Widgets
        </h3>
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Drag to reorder
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {widgets.map((widget) => (
          <div
            key={widget.id}
            className={`
              p-4 rounded-lg border transition-all duration-200
              ${visibleWidgets[widget.id]
                ? 'border-primary-200 dark:border-primary-900/50 bg-primary-50/50 dark:bg-primary-900/10'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
              }
            `}
          >
            <Toggle
              enabled={visibleWidgets[widget.id]}
              onChange={() => toggleWidget(widget.id)}
              label={widget.name}
              description={widget.description}
              size="sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}