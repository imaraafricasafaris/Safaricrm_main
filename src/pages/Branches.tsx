import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Search, MapPin, Globe, DollarSign, Users, BarChart3 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import TimezoneSelect from 'react-timezone-select';
import Select, { SingleValue } from 'react-select';
import { getOffices, createOffice, updateOffice, deleteOffice } from '../lib/api/offices';
import { Office, OfficeFormData } from '../types/office';
import toast from 'react-hot-toast';

interface TimezoneOption {
  value: string;
  label: string;
  offset: number;
  abbrev: string;
  altName: string;
}

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'KES', label: 'KES - Kenyan Shilling' },
  { value: 'TZS', label: 'TZS - Tanzanian Shilling' },
  { value: 'UGX', label: 'UGX - Ugandan Shilling' },
  { value: 'RWF', label: 'RWF - Rwandan Franc' },
  { value: 'ZAR', label: 'ZAR - South African Rand' }
];

export default function Branches() {
  const [offices, setOffices] = useState<Office[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState<TimezoneOption | null>(null);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<OfficeFormData>();

  useEffect(() => {
    loadOffices();
  }, []);

  const loadOffices = async () => {
    try {
      const data = await getOffices();
      setOffices(data);
    } catch (error) {
      console.error('Error loading offices:', error);
      toast.error('Failed to load branches');
      setOffices([]);
    }
  };

  const onSubmit = async (data: OfficeFormData) => {
    try {
      setIsLoading(true);
      if (selectedOffice) {
        if (!data.timezone) {
          data.timezone = 'UTC';
        }
        await updateOffice(selectedOffice.id, data);
        toast.success('Branch updated successfully');
      } else {
        if (!data.timezone) {
          data.timezone = 'UTC';
        }
        await createOffice({
          ...data,
          company_id: '00000000-0000-0000-0000-000000000000', // Replace with actual company ID
          status: 'active',
          settings: {}
        });
        toast.success('Branch created successfully');
      }
      loadOffices();
      setShowForm(false);
      reset();
    } catch (error) {
      console.error('Error saving branch:', error);
      toast.error('Failed to save branch');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return;

    try {
      await deleteOffice(id);
      toast.success('Branch deleted successfully');
      loadOffices();
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast.error('Failed to delete branch');
    }
  };

  const filteredOffices = offices.filter(office => 
    office.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    office.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <GitBranch className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Branch Management
            </h1>
          </div>
          <button
            onClick={() => {
              setSelectedOffice(null);
              setShowForm(true);
              reset();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Branch
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Branch Form */}
        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              {selectedOffice ? 'Edit Branch' : 'Add New Branch'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Branch Name
                  </label>
                  <input
                    {...register('name', { required: 'Branch name is required' })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter branch name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    {...register('country', { required: 'Country is required' })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter country"
                  />
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">{errors.country.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    {...register('city', { required: 'City is required' })}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter city"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    {...register('address')}
                    className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
                    placeholder="Enter address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timezone
                  </label>
                  <TimezoneSelect
                    value={selectedTimezone}
                    onChange={(tz: SingleValue<TimezoneOption>) => {
                      if (tz) {
                        setSelectedTimezone(tz);
                        setValue('timezone', tz.value);
                      }
                    }}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Currency
                  </label>
                  <Select
                    options={currencies}
                    value={currencies.find(c => c.value === selectedOffice?.currency) || currencies[0]}
                    onChange={(option) => {
                      if (option) {
                        setValue('currency', option.value);
                      }
                    }}
                    className="text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : selectedOffice ? 'Update Branch' : 'Create Branch'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Branch Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffices.map((office) => (
            <div
              key={office.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {office.name}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedOffice(office);
                      setShowForm(true);
                      reset(office);
                    }}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(office.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {office.city}, {office.country}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  {office.timezone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  {office.currency}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <Users className="w-4 h-4 text-primary" />
                    Staff
                  </div>
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">12</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Revenue
                  </div>
                  <span className="text-2xl font-semibold text-gray-900 dark:text-white">$45k</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  office.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {office.status.charAt(0).toUpperCase() + office.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}