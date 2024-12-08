import React, { useState, useEffect } from 'react';
import { Puzzle, Search, Filter } from 'lucide-react';
import { Integration, IntegrationType } from '../../types/integrations';
import { supabase } from '../../lib/supabase';
import IntegrationCard from './IntegrationCard';
import toast from 'react-hot-toast';

export default function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<IntegrationType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('name');

      if (error) throw error;
      setIntegrations(data);
    } catch (error) {
      console.error('Error loading integrations:', error);
      toast.error('Failed to load integrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (integration: Integration) => {
    try {
      const newStatus = integration.status === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('integrations')
        .update({ status: newStatus })
        .eq('id', integration.id);

      if (error) throw error;

      setIntegrations(prev =>
        prev.map(i => i.id === integration.id ? { ...i, status: newStatus } : i)
      );

      toast.success(`${integration.name} ${newStatus === 'active' ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error toggling integration:', error);
      toast.error('Failed to update integration status');
    }
  };

  const handleConfigure = (integration: Integration) => {
    // TODO: Implement configuration modal
    toast.error('Configuration interface coming soon');
  };

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = !searchQuery || 
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || integration.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Puzzle className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            External Tools Integration
          </h2>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search integrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value as IntegrationType | 'all')}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary"
        >
          <option value="all">All Categories</option>
          <option value="payment">Payment Processing</option>
          <option value="email">Email Services</option>
          <option value="calendar">Calendar Systems</option>
          <option value="storage">Storage Solutions</option>
          <option value="analytics">Analytics Tools</option>
        </select>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onConfigure={handleConfigure}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}