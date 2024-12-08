import React from 'react';
import { X, Phone, Mail, MapPin, Calendar, FileText, DollarSign } from 'lucide-react';

interface LeadDetailsProps {
  lead: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
    email: string;
    phone: string;
    location: string;
    budget: number;
    status: string;
    notes: string;
    lastContact: string;
    documents: Array<{ name: string; url: string }>;
  };
  onClose: () => void;
}

export default function LeadDetails({ lead, onClose }: LeadDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={lead.avatar}
              alt={lead.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {lead.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {lead.title} at {lead.company}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{lead.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{lead.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">
                ${lead.budget.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Documents
            </h3>
            <div className="space-y-2">
              {lead.documents.map((doc) => (
                <a
                  key={doc.name}
                  href={doc.url}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {doc.name}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Notes
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {lead.notes}
            </p>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Last contacted: {lead.lastContact}
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              lead.status === 'hot' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
              lead.status === 'warm' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
              'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
            }`}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)} Lead
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}