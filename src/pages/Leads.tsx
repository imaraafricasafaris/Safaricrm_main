import React, { useState, useEffect, useRef } from 'react';
import {
  UserPlus, Upload, Download, Plus, Search, Filter, CheckSquare, Settings2, Grid, List, 
  ChevronRight, Zap, ChevronDown, Mail, Phone, MapPin, Calendar, DollarSign,
  AlertTriangle
} from 'lucide-react';
import { Lead } from '../types/leads';
import MultiStepLeadForm from '../components/leads/MultiStepLeadForm';
import { getLeads, importLeadsFromCSV, unsubscribeFromLeads } from '../lib/api/leads';
import { exportLeadsToCSV, downloadCSV } from '../lib/api/importExport';
import LeadList from '../components/leads/LeadList';
import FileUploadModal from '../components/leads/FileUploadModal';
import LeadForm from '../components/leads/LeadForm';
import LeadSidebar from '../components/leads/LeadSidebar';
import BulkActionsMenu from '../components/leads/BulkActionsMenu';
import SearchOverlay from '../components/leads/SearchOverlay';
import FilterMenu from '../components/leads/FilterMenu';
import toast from 'react-hot-toast';
const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'won'] as const;

const statusColors = {
  new: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
  contacted: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
  qualified: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
  won: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800'
};

export default function Leads() {
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [savedLayout, setSavedLayout] = useState<Layout[]>([]);
  const [newLead, setNewLead] = useState<Lead | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [leads, setLeads] = useState<Lead[]>([]);

  // Animation ref for new lead
  const newLeadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        setIsLoading(true);
        const data = await getLeads(filters);
        setLeads(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching leads:', err);
        setError('Failed to load leads');
      } finally {
        setIsLoading(false);
      }
    };

    loadLeads();
  }, [filters]);

  // Scroll to new lead when added
  useEffect(() => {
    if (newLead && newLeadRef.current) {
      newLeadRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Clear new lead highlight after animation
      const timer = setTimeout(() => setNewLead(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [newLead]);

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedLeads = LEAD_STATUSES.reduce((acc, status) => {
    acc[status] = filteredLeads.filter(lead => lead.status === status);
    return acc;
  }, {} as Record<typeof LEAD_STATUSES[number], Lead[]>);

  const fetchLeads = async () => {
    try {
      setIsLoading(true);
      const data = await getLeads(filters, handleRealtimeUpdate);
      setLeads(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to load leads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setIsImporting(true);
      setError(null);
      await importLeadsFromCSV(file); 
      await fetchLeads();
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error importing leads:', error);
      if (error instanceof Error) {
        // Keep modal open and show error in modal
        throw error;
      } else {
        throw new Error('Failed to import leads');
      }
    } finally {
      setIsImporting(false);
    }
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csv = await exportLeadsToCSV();
      downloadCSV(csv, `safari-leads-${new Date().toISOString().split('T')[0]}.csv`);
    } catch (error) {
      console.error('Error exporting leads:', error);
      // Show error toast
    } finally {
      setIsExporting(false);
    }
  };

  const handleLeadClick = (lead: Lead) => {
    // TODO: Implement lead details view
    console.log('Lead clicked:', lead);
  };

  const handleAddLead = async (data: Lead) => {
    try {
      // TODO: Implement API call to create lead
      console.log('Creating lead:', data);
      toast.success('Lead created successfully');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error('Failed to create lead');
    }
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  const handleLeadSuccess = (lead: Lead) => {
    // Add new lead to the list
    setLeads(prevLeads => [lead, ...prevLeads]);
    // Set new lead for animation
    setNewLead(lead);
    // Close modal
    setIsAddingLead(false);
    // Show success message
    toast.success('Lead added successfully!');
  };

  return (
    <main className="flex-1">
      <div className="flex-1 flex flex-col p-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* File Upload Modal */}
        {showUploadModal && (
          <FileUploadModal
            onClose={() => setShowUploadModal(false)}
            onUpload={handleFileUpload}
          />
        )}

        <div className="max-w-7xl mx-auto space-y-4">
          {/* First Row - Title and Integrations */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="w-7 h-7 text-primary" />
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Leads</h1>
              </div>
              <button
                onClick={() => setShowIntegrations(!showIntegrations)}
                className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Integrations</span>
                {showIntegrations && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-50">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Zapier</span>
                        <span className="flex items-center text-green-500">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                          Active
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Google Sheets</span>
                        <span className="flex items-center text-yellow-500">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Setup Required
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Second Row - Actions */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSearch(!showSearch)}
                    className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className="w-4 h-4" />
                  {showFilters && <FilterMenu onClose={() => setShowFilters(false)} onApplyFilters={handleFilterChange} />}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                >
                  <CheckSquare className="w-4 h-4" />
                  Bulk Actions
                  <ChevronDown className="w-4 h-4" />
                  {showBulkActions && <BulkActionsMenu onClose={() => setShowBulkActions(false)} />}
                </button>

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-700 text-primary shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    Import
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Exporting...' : 'Export'}
                  </button>
                </div>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Lead
                </button>
              </div>
            </div>
          </div>

          {/* Search Overlay */}
          <SearchOverlay
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Main Content */}
          <div className="flex-1 overflow-hidden min-h-[calc(100vh-12rem)]">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
              {isLoading ? (
                <div className="p-6 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : error ? (
                <div className="p-6 text-center">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No leads found. Create your first lead to get started.
                  </p>
                  <button 
                    onClick={() => setShowAddForm(true)}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add Lead
                  </button>
                </div>
              ) : (
                <LeadList 
                  leads={leads} 
                  onLeadClick={handleLeadClick}
                  viewMode={viewMode}
                />
              )}
            </div>
          </div>

          {/* Add Lead Modal */}
          {showAddForm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Add New Lead
                  </h2>
                  <MultiStepLeadForm
                    onSubmit={handleAddLead}
                    onCancel={() => setShowAddForm(false)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Kanban Board */}
          <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-12rem)]">
            {LEAD_STATUSES.map(status => (
              <div
                key={status}
                className="flex-1 min-w-[320px] max-w-md flex flex-col bg-gray-100 dark:bg-gray-800/50 rounded-xl"
              >
                {/* Column Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
                      {status}
                    </h3>
                    <span className="px-2 py-1 text-xs font-medium bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
                      {groupedLeads[status].length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {/* Lead Cards */}
                <div className="flex-1 p-2 space-y-3 overflow-y-auto">
                  {groupedLeads[status].map(lead => (
                    <div
                      key={lead.id}
                      ref={lead.id === newLead?.id ? newLeadRef : null}
                      onClick={() => handleLeadClick(lead)}
                      className={`p-4 bg-white dark:bg-gray-800 border ${statusColors[lead.status]} rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${
                        lead.id === newLead?.id ? 'animate-highlight' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-primary/5 flex items-center justify-center">
                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                              {lead.name[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {lead.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {lead.company || 'No company'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <Mail className="w-4 h-4 mr-2" />
                          {lead.email}
                        </div>
                        {lead.phone && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Phone className="w-4 h-4 mr-2" />
                            {lead.phone}
                          </div>
                        )}
                        {lead.budget && (
                          <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {lead.budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}