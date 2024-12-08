import React from 'react';
import { Mail, Plus, Edit2, Trash2 } from 'lucide-react';

const templates = [
  { id: 1, name: 'Welcome Email', subject: 'Welcome to Our Safari Tours!' },
  { id: 2, name: 'Booking Confirmation', subject: 'Your Safari Booking Confirmation' },
  { id: 3, name: 'Pre-Safari Briefing', subject: 'Important Information for Your Upcoming Safari' },
  { id: 4, name: 'Post-Safari Feedback', subject: 'How Was Your Safari Experience?' },
];

export default function EmailTemplateSettings() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Email Templates
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors">
            <Plus className="w-4 h-4" />
            Add Template
          </button>
        </div>

        <div className="space-y-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {template.subject}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-500 hover:text-error-500 dark:text-gray-400 dark:hover:text-error-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}