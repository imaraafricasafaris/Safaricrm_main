import React, { useState, useEffect } from 'react';
import { 
  MoreHorizontal, Star, Mail, Phone, MapPin, Calendar, DollarSign, 
  Building2, Clock, CheckCircle2, XCircle, AlertCircle, FileText, 
  Tag, Users, MessageSquare, Globe 
} from 'lucide-react';
import { Lead } from '../../types/leads';
import LeadActionsMenu from './LeadActionsMenu';
import toast from 'react-hot-toast';

interface LeadListProps {
  leads: Lead[];
  onLeadClick: (lead: Lead) => void;
  viewMode: 'list' | 'grid';
}

const statusColors = {
  new: 'bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/50 dark:text-blue-200',
  contacted: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20 dark:bg-yellow-900/50 dark:text-yellow-200',
  qualified: 'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/50 dark:text-green-200',
  proposal: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-900/50 dark:text-purple-200',
  won: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-900/50 dark:text-emerald-200',
  lost: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/50 dark:text-red-200',
};

const statusIcons = {
  new: AlertCircle,
  contacted: Clock,
  qualified: Star,
  proposal: FileText,
  won: CheckCircle2,
  lost: XCircle,
};

export default function LeadList({ leads, onLeadClick, viewMode }: LeadListProps) {
  const [activeMenu, setActiveMenu] = useState<{ id: string; position: { top: number; left: number } } | null>(null);

  const handleActionClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveMenu({
      id: lead.id,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);
  const handleDelete = async (lead: Lead) => {
    // TODO: Implement delete functionality
    toast.error('Delete functionality not implemented yet');
  };

  const handleArchive = async (lead: Lead) => {
    // TODO: Implement archive functionality
    toast.error('Archive functionality not implemented yet');
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            onClick={() => onLeadClick(lead)} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center">
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                    {lead.name[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {lead.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {lead.company || 'No company'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[lead.status]}`}>
                {React.createElement(statusIcons[lead.status], { className: 'w-3 h-3' })}
                {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                {lead.email}
              </div>
              {lead.phone && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  {lead.phone}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                {lead.country}
              </div>
              {lead.budget && (
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
                  {lead.budget.toLocaleString()}
                </div>
              )}
            </div>
            <button
              onClick={(e) => handleActionClick(e, lead)}
              className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {activeMenu?.id === lead.id && (
              <LeadActionsMenu
                lead={lead}
                onClose={() => setActiveMenu(null)}
                onDelete={() => handleDelete(lead)}
                onArchive={() => handleArchive(lead)}
                position={activeMenu.position}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full">
        <thead className="bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
          <tr className="border-b border-gray-200 dark:border-gray-700 text-left">
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Lead
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Trip Details
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Budget
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Last Contact
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-0">
          {leads.map((lead) => (
            <tr
              key={lead.id}
              className="cursor-pointer my-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700"
              onClick={() => onLeadClick(lead)}
            >
              <td className="px-6 py-4 first:rounded-l-[16px]">
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                      {lead.name[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {lead.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <a
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://facebook.com/search/people/?q=${encodeURIComponent(lead.name)}`, '_blank');
                        }}
                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        title="Find on Facebook"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://instagram.com/${lead.name.toLowerCase().replace(/\s+/g, '')}`, '_blank');
                        }}
                        className="text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                        title="Find on Instagram"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                        </svg>
                      </a>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(lead.name)}`, '_blank');
                        }}
                        className="text-gray-400 hover:text-blue-700 dark:hover:text-blue-500 transition-colors"
                        title="Find on LinkedIn"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 truncate">
                    <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                    {lead.email}
                  </div>
                  {lead.phone && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 truncate">
                      <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                      {lead.phone}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 truncate">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    {lead.country}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {lead.destinations.join(', ')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-2" />
                    {lead.duration} days
                    {lead.arrival_date && ` • ${new Date(lead.arrival_date).toLocaleDateString()}`}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Tag className="w-4 h-4 mr-2 flex-shrink-0" />
                    {lead.trip_type.join(', ')}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset ${statusColors[lead.status]}`}>
                  {React.createElement(statusIcons[lead.status], { className: 'w-3 h-3' })}
                  {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                  <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                  {lead.budget ? lead.budget.toLocaleString() : 'Not specified'}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {lead.last_contact ? new Date(lead.last_contact).toLocaleDateString() : 'Never'}
                </div>
              </td>
              <td className="px-6 py-4 text-right last:rounded-r-[16px]">
                <button
                  onClick={(e) => handleActionClick(e, lead)}
                  className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <MoreHorizontal className="w-5 h-5" />
                </button>
                {activeMenu?.id === lead.id && (
                  <LeadActionsMenu
                    lead={lead}
                    onClose={() => setActiveMenu(null)}
                    onDelete={() => handleDelete(lead)}
                    onArchive={() => handleArchive(lead)}
                    position={activeMenu.position}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ); 
}