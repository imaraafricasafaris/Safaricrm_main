import React from 'react';
import { Check, Mail, Phone, Globe, Calendar, Users, DollarSign, MessageSquare } from 'lucide-react';
import { Lead } from '../../../../types/leads';

interface ReviewSubmitProps {
  data: Partial<Lead>;
  onFinalSubmit: () => Promise<void>;
  isSubmitting: boolean;
}

export default function ReviewSubmit({ data, onFinalSubmit, isSubmitting }: ReviewSubmitProps) {
  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string | number | null }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-sm text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Contact Information
          </h3>
          <div className="space-y-3">
            <InfoItem icon={Mail} label="Email" value={data.email} />
            <InfoItem icon={Phone} label="Phone" value={data.phone} />
            <InfoItem icon={Globe} label="Country" value={data.country} />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Trip Details
          </h3>
          <div className="space-y-3">
            <InfoItem
              icon={Globe}
              label="Destinations"
              value={data.destinations?.join(', ')}
            />
            <InfoItem
              icon={Calendar}
              label="Duration"
              value={`${data.duration} days`}
            />
            <InfoItem
              icon={Calendar}
              label="Arrival Date"
              value={data.arrival_date}
            />
            <InfoItem
              icon={Users}
              label="Group Size"
              value={`${data.adults} adults${data.children ? `, ${data.children} children` : ''}`}
            />
            <InfoItem
              icon={DollarSign}
              label="Budget"
              value={data.budget ? `$${data.budget.toLocaleString()}` : undefined}
            />
          </div>
        </div>
      </div>

      {data.message && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Additional Notes
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {data.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {data.marketing_consent && (
        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
          <Check className="w-5 h-5" />
          <span>Opted in to marketing communications</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={onFinalSubmit}
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating Lead...
            </>
          ) : (
            <>
              Create Lead
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}