import React, { useState } from 'react';
import { X, AlertTriangle, Calendar, Key } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { ApiKey } from '../../types/api';
import toast from 'react-hot-toast';

interface ApiKeyModalProps {
  apiKey?: ApiKey | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  expiresAt?: string;
  rateLimit: number;
  permissions: string[];
}

const PERMISSIONS = [
  { id: 'leads:read', label: 'Read Leads' },
  { id: 'leads:write', label: 'Write Leads' },
  { id: 'leads:delete', label: 'Delete Leads' },
  { id: 'staff:read', label: 'Read Staff' },
  { id: 'staff:write', label: 'Write Staff' },
  { id: 'staff:delete', label: 'Delete Staff' },
  { id: 'offices:read', label: 'Read Offices' },
  { id: 'offices:write', label: 'Write Offices' },
  { id: 'offices:delete', label: 'Delete Offices' }
];

export default function ApiKeyModal({ apiKey, onClose, onSuccess }: ApiKeyModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: apiKey?.name || '',
      rateLimit: apiKey?.rate_limit || 1000,
      permissions: []
    }
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      // TODO: Implement API key creation/update
      toast.success(apiKey ? 'API key updated' : 'API key created');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving API key:', error);
      toast.error('Failed to save API key');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-[30px] w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {apiKey ? 'Edit API Key' : 'Create API Key'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Key Name
            </label>
            <input
              {...register('name', { required: 'Key name is required' })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter a name for this API key"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Expiration Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                {...register('expiresAt')}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rate Limit (requests per minute)
            </label>
            <input
              type="number"
              {...register('rateLimit', { 
                required: 'Rate limit is required',
                min: { value: 1, message: 'Rate limit must be at least 1' }
              })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            {errors.rateLimit && (
              <p className="mt-1 text-sm text-red-500">{errors.rateLimit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Permissions
            </label>
            <div className="grid grid-cols-3 gap-4">
              {PERMISSIONS.map((permission) => (
                <label
                  key={permission.id}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    {...register('permissions')}
                    value={permission.id}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {permission.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  {apiKey ? 'Update Key' : 'Generate Key'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}