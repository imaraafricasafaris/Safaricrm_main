import React, { useState } from 'react';
import { X, Mail, User, Phone, Shield, AlertTriangle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Staff } from '../../types/staff';
import { useStaff } from '../../contexts/StaffContext';
import toast from 'react-hot-toast';

interface AddStaffModalProps {
  onClose: () => void;
}

export default function AddStaffModal({ onClose }: AddStaffModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addStaff } = useStaff();
  const { register, handleSubmit, formState: { errors } } = useForm<Partial<Staff>>();

  const onSubmit = async (data: Partial<Staff>) => {
    try {
      setIsSubmitting(true);
      await addStaff({
        ...data,
        status: 'pending',
        permissions: {
          leads: data.role === 'admin' || data.role === 'manager',
          safaris: true,
          vehicles: data.role === 'driver' || data.role === 'admin',
          reports: data.role === 'admin' || data.role === 'manager',
          settings: data.role === 'admin'
        }
      });
      toast.success('Staff member added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding staff member:', error);
      toast.error('Failed to add staff member');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Add Staff Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                {...register('full_name', { required: 'Full name is required' })}
                className="pl-10 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter full name"
              />
            </div>
            {errors.full_name && (
              <p className="mt-1 text-sm text-error-500">{errors.full_name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="pl-10 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter email address"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                {...register('role', { required: 'Role is required' })}
                className="pl-10 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="agent">Agent</option>
                <option value="driver">Driver</option>
                <option value="guide">Guide</option>
              </select>
            </div>
            {errors.role && (
              <p className="mt-1 text-sm text-error-500">{errors.role.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                {...register('phone')}
                className="pl-10 w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  Important Note
                </p>
                <p className="mt-1 text-sm text-primary-700 dark:text-primary-300">
                  An invitation email will be sent to the staff member to set up their account.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
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
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Staff Member'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}