import React from 'react';
import { Search, Filter } from 'lucide-react';
import { ModuleCategory } from '../../contexts/ModuleContext/types';
import { MODULE_CATEGORIES } from '../../contexts/ModuleContext/constants';

interface ModuleFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: ModuleCategory | 'all';
  onCategoryChange: (category: ModuleCategory | 'all') => void;
  showInactive: boolean;
  onShowInactiveChange: (show: boolean) => void;
}

export default function ModuleFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showInactive,
  onShowInactiveChange
}: ModuleFiltersProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('all')}
          className={`px-3 py-1 rounded-lg text-sm ${
            selectedCategory === 'all'
              ? 'bg-primary text-black'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          All
        </button>
        {Object.entries(MODULE_CATEGORIES).map(([key, label]) => (
          <button
            key={key}
            onClick={() => onCategoryChange(key as ModuleCategory)}
            className={`px-3 py-1 rounded-lg text-sm ${
              selectedCategory === key
                ? 'bg-primary text-black'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Show Inactive Toggle */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Show Inactive Modules
        </span>
        <button
          onClick={() => onShowInactiveChange(!showInactive)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            showInactive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              showInactive ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}