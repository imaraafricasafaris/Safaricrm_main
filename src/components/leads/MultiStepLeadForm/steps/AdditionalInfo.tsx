import React from 'react';
import { useForm } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { Lead } from '../../../../types/leads';

interface AdditionalInfoProps {
  data: Partial<Lead>;
  onSubmit: (data: Partial<Lead>) => void;
}

export default function AdditionalInfo({ data, onSubmit }: AdditionalInfoProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      message: data.message || '',
      marketing_consent: data.marketing_consent || false
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Additional Notes
        </label>
        <div className="relative">
          <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <textarea
            {...register('message')}
            rows={4}
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary resize-none"
            placeholder="Any special requirements or additional information..."
          />
        </div>
      </div>

      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            {...register('marketing_consent')}
            className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary"
          />
        </div>
        <div className="ml-3">
          <label className="text-sm text-gray-600 dark:text-gray-400">
            I agree to receive marketing communications about relevant safari packages and updates
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  );
}