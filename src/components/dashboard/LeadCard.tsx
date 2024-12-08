import React from 'react';
import { MoreVertical, Star, Linkedin, Mail } from 'lucide-react';

interface LeadCardProps {
  lead: {
    id: string;
    name: string;
    title: string;
    company: string;
    avatar: string;
    source: 'linkedin' | 'email' | 'referral';
    rating: number;
    budget: number;
    status: 'hot' | 'warm' | 'cold';
  };
  onOpenDetails: (id: string) => void;
}

const sourceColors = {
  linkedin: 'bg-blue-500 text-white',
  email: 'bg-purple-500 text-white',
  referral: 'bg-green-500 text-white',
};

const sourceIcons = {
  linkedin: Linkedin,
  email: Mail,
  referral: Star,
};

export default function LeadCard({ lead, onOpenDetails }: LeadCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={lead.avatar}
            alt={lead.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-50 dark:border-gray-700"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {lead.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {lead.title}
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenDetails(lead.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600"
        >
          <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 transform -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {lead.company}
      </div>
      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 flex items-end justify-between">
        <div>
          <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Source</span>
          {lead.source && (
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${sourceColors[lead.source]}`}>
              {React.createElement(sourceIcons[lead.source], { className: 'w-3 h-3' })}
              {lead.source.charAt(0).toUpperCase() + lead.source.slice(1)}
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">${lead.budget.toLocaleString()}</span>
          <div className="flex items-center gap-[2px]">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${
                  i < lead.rating 
                    ? 'bg-primary'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}