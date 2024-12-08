import React from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, User, Globe } from 'lucide-react';
import { Lead } from '../../../../types/leads';

interface ContactInfoProps {
  data: Partial<Lead>;
  onSubmit: (data: Partial<Lead>) => void;
}

export default function ContactInfo({ data, onSubmit }: ContactInfoProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      country: data.country || ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('name', { required: 'Name is required' })}
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter full name"
          />
        </div>
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter email address"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('phone')}
            type="tel"
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Country *
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            {...register('country', { required: 'Country is required' })}
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter country"
          />
        </div>
        {errors.country && (
          <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
        )}
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