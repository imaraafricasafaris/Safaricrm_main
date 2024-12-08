import React, { useState, useEffect } from 'react';
import { GripHorizontal, ChevronLeft, ChevronRight, Bell, FileText, Save, Undo } from 'lucide-react';
import GridLayout from 'react-grid-layout';
import { useAuth } from '../contexts/AuthContext';
import { checkDatabaseConnection } from '../lib/api/database';
import TotalLeadsCard from '../components/dashboard/stats/TotalLeadsCard';
import RevenueCard from '../components/dashboard/stats/RevenueCard';
import ActiveSafarisCard from '../components/dashboard/stats/ActiveSafarisCard';
import ConversionRateCard from '../components/dashboard/stats/ConversionRateCard';
import LeadCard from '../components/dashboard/LeadCard';
import LeadDetailsPopup from '../components/dashboard/LeadDetailsPopup';
import UpcomingTasks from '../components/dashboard/UpcomingTasks';
import RevenueChart from '../components/dashboard/RevenueChart';
import LeadConversionChart from '../components/dashboard/LeadConversionChart';
import DocumentsList from '../components/dashboard/DocumentsList';
import AutomatedFollowUps from '../components/dashboard/AutomatedFollowUps';
import LeadNotes from '../components/dashboard/LeadNotes';
import InvoiceList from '../components/dashboard/InvoiceList';
import 'react-grid-layout/css/styles.css';

const mockLeads = [
  {
    id: '1',
    name: 'Jane Doe',
    title: 'Marketing Director',
    company: 'Microsoft',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    email: 'jane@microsoft.com',
    phone: '+1 234 567 890',
    location: 'Seattle, WA',
    source: 'linkedin',
    rating: 4,
    budget: 50000,
    status: 'hot',
    notes: 'Interested in luxury safari packages for corporate retreat',
    lastContact: '2024-03-15',
    documents: [
      { name: 'Initial Proposal.pdf', url: '#' },
      { name: 'Requirements.docx', url: '#' }
    ]
  },
  // Add more mock leads here
  {
    id: '2',
    name: 'Michael Chen',
    title: 'Operations Manager',
    company: 'Global Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    email: 'michael@globaltech.com',
    phone: '+1 345 678 901',
    location: 'San Francisco, CA',
    source: 'referral',
    rating: 5,
    budget: 75000,
    status: 'warm',
    notes: 'Looking for premium wildlife photography safari packages',
    lastContact: '2024-03-16',
    documents: [
      { name: 'Safari Proposal.pdf', url: '#' },
      { name: 'Package Details.docx', url: '#' }
    ]
  },
  {
    id: '3',
    name: 'Sarah Wilson',
    title: 'Travel Coordinator',
    company: 'Adventure Corp',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    email: 'sarah@adventurecorp.com',
    phone: '+1 456 789 012',
    location: 'Denver, CO',
    source: 'email',
    rating: 3,
    budget: 35000,
    status: 'cold',
    notes: 'Interested in group safari packages for company retreat',
    lastContact: '2024-03-14',
    documents: [
      { name: 'Group Quote.pdf', url: '#' }
    ]
  },
  {
    id: '4',
    name: 'David Thompson',
    title: 'Events Director',
    company: 'Luxury Retreats International',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    email: 'david@luxuryretreats.com',
    phone: '+1 567 890 123',
    location: 'Miami, FL',
    source: 'linkedin',
    rating: 5,
    budget: 120000,
    status: 'hot',
    notes: 'Planning multiple high-end safari experiences for VIP clients',
    lastContact: '2024-03-17',
    documents: [
      { name: 'VIP Package Proposal.pdf', url: '#' },
      { name: 'Luxury Accommodations.pdf', url: '#' },
      { name: 'Private Flight Details.docx', url: '#' }
    ]
  },
  {
    id: '5',
    name: 'Emily Rodriguez',
    title: 'Corporate Relations Manager',
    company: 'TechVentures LLC',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    email: 'emily@techventures.com',
    phone: '+1 678 901 234',
    location: 'Austin, TX',
    source: 'referral',
    rating: 4,
    budget: 85000,
    status: 'warm',
    notes: 'Seeking team-building safari experience for tech executives',
    lastContact: '2024-03-18',
    documents: [
      { name: 'Team Building Proposal.pdf', url: '#' },
      { name: 'Executive Summary.docx', url: '#' }
    ]
  }
];

export default function Dashboard() {
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [savedLayout, setSavedLayout] = useState<Layout[]>([]);
  const [layout, setLayout] = useState([
    { i: 'leads', x: 0, y: 0, w: 16, h: 1.5, minW: 12, maxW: 16, minH: 1.5, maxH: 2 },
    { i: 'stats', x: 0, y: 3, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 2 },
    { i: 'revenue-chart', x: 8, y: 3, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 2 },
    { i: 'conversion-chart', x: 0, y: 5, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 2 },
    { i: 'tasks', x: 8, y: 5, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 2 },
    { i: 'follow-ups', x: 0, y: 7, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 3 },
    { i: 'documents', x: 8, y: 7, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 3 },
    { i: 'notes', x: 0, y: 9, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 3 },
    { i: 'invoices', x: 8, y: 9, w: 8, h: 2, minW: 8, maxW: 8, minH: 2, maxH: 3 }
  ]);

  const { user } = useAuth();
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    tables: { table: string; exists: boolean; }[];
    error?: string;
  } | null>(null);

  const isSuperAdmin = user?.user_metadata?.role === 'super_admin';

  useEffect(() => {
    const checkConnection = async () => {
      const status = await checkDatabaseConnection();
      if (!status.connected) {
        console.error('Database connection issues:', status);
      } else if (status.tables.some(t => !t.exists)) {
        console.warn('Some tables are missing:', 
          status.tables.filter(t => !t.exists).map(t => t.table).join(', '));
      }
      setDbStatus(status);
    };

    checkConnection();
  }, []);

  const handleCustomizeLayout = () => {
    if (!isCustomizing) {
      setSavedLayout([...layout]);
    }
    setIsCustomizing(!isCustomizing);
  };

  const handleSaveLayout = () => {
    // Here you would typically save the layout to backend/localStorage
    setIsCustomizing(false);
  };

  const handleResetLayout = () => {
    setLayout(savedLayout);
    setIsCustomizing(false);
  };

  const scrollLeads = (direction: 'left' | 'right') => {
    const container = document.getElementById('leads-container');
    if (container) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setScrollPosition(container.scrollLeft + scrollAmount);
    }
  };

  const handleOpenDetails = (id: string) => {
    setSelectedLead(id);
  };

  return (
    <main className="flex-1 pr-4 pl-2">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Database Status Indicator - Only visible to super admins */}
        {isSuperAdmin && dbStatus && !dbStatus.connected && (
          <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
            <p className="text-red-600 dark:text-red-200">
              Database Connection Error: {dbStatus.error}
            </p>
          </div>
        )}
        {isSuperAdmin && dbStatus?.connected && dbStatus.tables.some(t => !t.exists) && (
          <div className="bg-yellow-50 dark:bg-yellow-900/50 p-4 rounded-lg">
            <p className="text-yellow-600 dark:text-yellow-200">
              Missing tables: {dbStatus.tables.filter(t => !t.exists).map(t => t.table).join(', ')}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            {isCustomizing ? (
              <>
                <button
                  onClick={handleSaveLayout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Layout
                </button>
                <button
                  onClick={handleResetLayout}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                >
                  <Undo className="w-4 h-4" />
                  Reset
                </button>
              </>
            ) : (
              <button
                onClick={handleCustomizeLayout}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <GripHorizontal className="w-4 h-4" />
                Customize Layout
              </button>
            )}
          </div>
        </div>

        <GridLayout
          className="layout bg-gray-100 dark:bg-gray-900 p-2 rounded-xl"
          layout={layout}
          cols={16}
          rowHeight={160}
          width={1200}
          onLayoutChange={setLayout}
          draggableHandle=".drag-handle"
          isDraggable={isCustomizing}
          isResizable={isCustomizing}
          margin={[16, 16]}
          containerPadding={[16, 16]}
          compactType="vertical"
          preventCollision={false}
          useCSSTransforms={true}
        >
          <div key="leads">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm h-[240px] overflow-hidden">
              <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Leads
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {mockLeads.length} leads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => scrollLeads('left')}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scrollLeads('right')}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div
              id="leads-container"
              className="flex overflow-x-auto space-x-3 pb-1 scrollbar-hide h-[calc(100%-44px)]"
              style={{ scrollBehavior: 'smooth' }}
            >
              {mockLeads.map((lead) => (
                <div key={lead.id} className="flex-none w-[280px]">
                  <LeadCard
                    lead={lead}
                    onOpenDetails={handleOpenDetails}
                  />
                </div>
              ))}
              </div>
            </div>
          </div>
          
          <div key="stats">
            <div className="grid grid-cols-2 gap-4 h-full p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow drag-handle cursor-move">
              <TotalLeadsCard />
              <RevenueCard />
              <ActiveSafarisCard />
              <ConversionRateCard />
          </div>
          </div>
          
          <div key="revenue-chart">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drag-handle cursor-move">
                Revenue Overview
              </h2>
              <RevenueChart />
            </div>
          </div>

          <div key="conversion-chart">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drag-handle cursor-move">
                Lead Conversion
              </h2>
              <LeadConversionChart />
            </div>
          </div>
          
          <div key="tasks">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drag-handle cursor-move">
                Upcoming Tasks
              </h2>
              <UpcomingTasks />
            </div>
          </div>

          <div key="follow-ups">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drag-handle cursor-move">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Automated Follow-ups
                </div>
              </h2>
              <AutomatedFollowUps />
            </div>
          </div>

          <div key="documents">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 drag-handle cursor-move">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Recent Documents
                </div>
              </h2>
              <DocumentsList />
            </div>
          </div>

          <div key="notes">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <LeadNotes />
            </div>
          </div>

          <div key="invoices">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm h-full overflow-hidden hover:shadow-md transition-shadow">
              <InvoiceList />
            </div>
          </div>

        </GridLayout>

        {selectedLead && (
          <LeadDetailsPopup
            lead={mockLeads.find(l => l.id === selectedLead)!}
            onClose={() => setSelectedLead(null)}
          />
        )}
      </div>
    </main>
  );
}