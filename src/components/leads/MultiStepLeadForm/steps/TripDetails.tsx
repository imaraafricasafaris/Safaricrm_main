import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { Lead, LeadDestination, LeadTripType } from '../../../../types/leads';
import { getLeadDestinations, getLeadTripTypes } from '../../../../lib/api/leads';

interface TripDetailsProps {
  data: Partial<Lead>;
  onSubmit: (data: Partial<Lead>) => void;
}

export default function TripDetails({ data, onSubmit }: TripDetailsProps) {
  const [destinations, setDestinations] = useState<LeadDestination[]>([]);
  const [tripTypes, setTripTypes] = useState<LeadTripType[]>([]);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      destinations: data.destinations || [],
      trip_type: data.trip_type || [],
      duration: data.duration || 1,
      arrival_date: data.arrival_date || '',
      adults: data.adults || 1,
      children: data.children || 0,
      budget: data.budget || undefined
    }
  });

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [destinationsData, tripTypesData] = await Promise.all([
          getLeadDestinations(),
          getLeadTripTypes()
        ]);
        setDestinations(destinationsData);
        setTripTypes(tripTypesData);
      } catch (error) {
        console.error('Error loading form data:', error);
      }
    };

    loadFormData();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Destinations *
        </label>
        <div className="grid grid-cols-2 gap-3">
          {destinations.map((dest) => (
            <label
              key={dest.id}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                value={dest.name}
                {...register('destinations', { required: 'Select at least one destination' })}
                className="sr-only"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {dest.name}
              </span>
            </label>
          ))}
        </div>
        {errors.destinations && (
          <p className="mt-1 text-sm text-red-500">{errors.destinations.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Trip Type *
        </label>
        <div className="space-y-2">
          {tripTypes.map((type) => (
            <label
              key={type.id}
              className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary cursor-pointer transition-colors"
            >
              <input
                type="radio"
                value={type.name}
                {...register('trip_type', { required: 'Select a trip type' })}
                className="sr-only"
              />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {type.name}
                </p>
                {type.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {type.description}
                  </p>
                )}
              </div>
            </label>
          ))}
        </div>
        {errors.trip_type && (
          <p className="mt-1 text-sm text-red-500">{errors.trip_type.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duration (days) *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="1"
              {...register('duration', {
                required: 'Duration is required',
                min: { value: 1, message: 'Duration must be at least 1 day' }
              })}
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.duration && (
            <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Arrival Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              {...register('arrival_date')}
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Adults *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="1"
              {...register('adults', {
                required: 'Number of adults is required',
                min: { value: 1, message: 'At least 1 adult is required' }
              })}
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
          {errors.adults && (
            <p className="mt-1 text-sm text-red-500">{errors.adults.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Children
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="number"
              min="0"
              {...register('children')}
              className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Budget (USD)
        </label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="number"
            min="0"
            step="100"
            {...register('budget')}
            className="pl-10 w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="Enter budget in USD"
          />
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