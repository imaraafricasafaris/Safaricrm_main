import React, { useState } from 'react';
import { Users, Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import StaffList from '../components/staff/StaffList';
import StaffFilters from '../components/staff/StaffFilters';
import AddStaffModal from '../components/staff/AddStaffModal';
import { useStaff } from '../contexts/StaffContext';

export default function Staff() {
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { staff, isLoading } = useStaff();

  const filteredStaff = staff.filter(member => 
    member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-500" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Staff Management
            </h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Staff Member
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {showFilters && <StaffFilters />}
        </div>

        {/* Staff List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-soft">
          <StaffList staff={filteredStaff} isLoading={isLoading} />
        </div>

        {/* Add Staff Modal */}
        {showAddModal && (
          <AddStaffModal onClose={() => setShowAddModal(false)} />
        )}
      </div>
    </div>
  );
}