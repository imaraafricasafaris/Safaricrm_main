import React from 'react';
import { Clock, Mail, Check } from 'lucide-react';

const followUps = [
  {
    id: '1',
    type: 'email',
    subject: 'Safari Package Follow-up',
    scheduledFor: '2024-03-20 10:00 AM',
    status: 'pending',
  },
  {
    id: '2',
    type: 'email',
    subject: 'Booking Confirmation',
    scheduledFor: '2024-03-21 2:00 PM',
    status: 'pending',
  },
  {
    id: '3',
    type: 'email',
    subject: 'Thank You Note',
    scheduledFor: '2024-03-19 3:00 PM',
    status: 'sent',
  },
];

export default function AutomatedFollowUps() {
  return (
    <div className="space-y-2">
      {followUps.map((followUp) => (
        <div
          key={followUp.id}
          className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {followUp.subject}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                {followUp.scheduledFor}
              </div>
            </div>
          </div>
          {followUp.status === 'sent' ? (
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Check className="w-3 h-3" />
              Sent
            </span>
          ) : (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Scheduled
            </span>
          )}
        </div>
      ))}
    </div>
  );
}