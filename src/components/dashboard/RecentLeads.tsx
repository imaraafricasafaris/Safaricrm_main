import React from 'react';
import { UserPlus, MoreVertical } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  company: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal';
  date: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    company: 'Adventure Tours Inc',
    status: 'new',
    date: '2024-03-15',
  },
  {
    id: '2',
    name: 'Michael Chen',
    company: 'Global Expeditions',
    status: 'contacted',
    date: '2024-03-14',
  },
  {
    id: '3',
    name: 'Emma Davis',
    company: 'Wildlife Safaris Ltd',
    status: 'qualified',
    date: '2024-03-13',
  },
];

const statusStyles = {
  new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  contacted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  qualified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  proposal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
};

export default function RecentLeads() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Leads</h2>
          </div>
          <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {mockLeads.map((lead) => (
          <div key={lead.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">{lead.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lead.company}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[lead.status]}`}>
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}