import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Map, Mail, Phone, Calendar, Users, MessageSquare, Globe } from 'lucide-react';
import { Lead, LeadDestination, LeadTripType } from '../../types/leads';
import { getLeadDestinations, getLeadTripTypes, createLead } from '../../lib/api/leads';

interface FormInputs {
  name: string;
  email: string;
  phone?: string;
  country: string;
  destinations: string[];
  trip_type: string[];
  duration: number;
  arrival_date?: string;
  adults: number;
  children: number;
  message?: string;
  marketing_consent: boolean;
}

interface LeadFormProps {
  onSuccess?: (lead: Lead) => void;
  onCancel?: () => void;
}

export default function LeadForm({ onSuccess, onCancel }: LeadFormProps) {
  const [destinations, setDestinations] = useState<LeadDestination[]>([]);
  const [tripTypes, setTripTypes] = useState<LeadTripType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>({
    defaultValues: {
      destinations: [],
      trip_type: [],
      adults: 1,
      children: 0,
      duration: 1,
      marketing_consent: false
    }
  });

  const watchDestinations = watch('destinations', []);

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

  const onSubmit = async (data: FormInputs) => {
    try {
      setIsLoading(true);
      
      // Get selected destination names
      const selectedDestinations = destinations
        .filter(dest => data.destinations.includes(dest.id))
        .map(dest => dest.name);

      // Get selected trip type names
      const selectedTripTypes = tripTypes
        .filter(type => data.trip_type.includes(type.id))
        .map(type => type.name);
      
      // Ensure arrays are properly formatted
      const formattedData = {
        ...data,
        arrival_date: data.arrival_date || null,
        destinations: selectedDestinations,
        trip_type: selectedTripTypes.length > 0 ? selectedTripTypes : [],
        source: 'manual',
        status: 'new',
        marketing_consent: !!data.marketing_consent
      };

      const lead = await createLead(formattedData as Lead);
      onSuccess?.(lead);
    } catch (error) {
      console.error('Error creating lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Contact Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              {...register('name', { 
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              Email *
            </label>
            <input
              type="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              Phone
            </label>
            <input
              type="tel"
              {...register('phone', {
                pattern: {
                  value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                  message: 'Invalid phone number'
                }
              })}
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="+1 (234) 567-8900"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-400" />
              Country *
            </label>
            <input
              type="text"
              {...register('country', { required: 'Country is required' })}
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter your country"
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.country.message}</p>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Map className="w-5 h-5 text-primary" />
            Trip Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose Destinations *
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {destinations.map((dest) => {
                const isSelected = Array.isArray(watchDestinations) && watchDestinations.includes(dest.id);
                return (
                  <label
                    key={dest.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/10 dark:bg-primary/5'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={dest.id}
                      {...register('destinations', { required: 'Please select at least one destination' })}
                      className="sr-only"
                    />
                    <span className={`text-sm ${
                      isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {dest.name}
                    </span>
                  </label>
                );
              })}
            </div>
            {errors.destinations && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.destinations.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Choose Trip Type *
            </label>
            <div className="mt-2 space-y-2">
              {tripTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    value={type.id}
                    {...register('trip_type', { required: 'Please select a trip type' })}
                    className="sr-only"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{type.name}</p>
                    {type.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {errors.trip_type && (
              <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.trip_type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Duration (days) *
              </label>
              <input
                type="number"
                min="1"
                {...register('duration', {
                  required: 'Duration is required',
                  min: { value: 1, message: 'Duration must be at least 1 day' }
                })}
                className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                Arrival Date
              </label>
              <input
                type="date"
                {...register('arrival_date', {
                  validate: value => !value || new Date(value) >= new Date().setHours(0, 0, 0, 0) || 'Date must be today or later'
                })}
                className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.arrival_date && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.arrival_date.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Adults *
              </label>
              <input
                type="number"
                min="1"
                {...register('adults', {
                  required: 'Number of adults is required',
                  min: { value: 1, message: 'At least 1 adult is required' }
                })}
                className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
              {errors.adults && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.adults.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                Children
              </label>
              <input
                type="number"
                min="0"
                {...register('children')}
                className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Budget (USD)
          </label>
          <input
            type="number"
            min="0"
            step="100"
            {...register('budget')}
            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            placeholder="Enter your budget in USD"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-gray-400" />
            Message
          </label>
          <textarea
            rows={4}
            {...register('message')}
            className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            placeholder="Tell us about your dream safari experience..."
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              {...register('marketing_consent')}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
            />
          </div>
          <div className="ml-3 select-none">
            <label className="text-sm text-gray-600 dark:text-gray-400">
              I hereby give permission to receive travel proposals and relevant news
              regarding my holiday.
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="relative px-6 py-3 rounded-lg text-sm font-medium text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors group"
        >
          <span className={`inline-flex items-center gap-2 transition-opacity ${isLoading || isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
            Create Lead
            <Map className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </span>
          {(isLoading || isSubmitting) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </button>
      </div>
    </form>
  );
}