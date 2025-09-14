import { SlidersHorizontal, Sparkles, X, Grid, List, ChevronUp, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { Chevron } from 'react-day-picker';

interface FilterOption {
  name: string;
  type: string;
  options: string[];
  is_required: boolean;
}

interface FilterProps {
  filters: FilterOption[];
  showFilters: boolean;
  selectedFilters: Record<string, string[]>;
  clearFilters: () => void;
  handleFilterChange: (filterName: string, value: string) => void;
}

export default function SideBarFilter({
  filters,
  showFilters,
  selectedFilters,
  clearFilters,
  handleFilterChange
}: FilterProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Toggle section expansion
  const toggleSection = (name: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Count selected filters for a category
  const getSelectedCount = (filterName: string) => {
    return selectedFilters[filterName]?.length || 0;
  };

  // Check if any filters are selected
  const hasSelectedFilters = Object.values(selectedFilters).some(
    filters => filters.length > 0
  );

  return (
    <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-72 bg-white rounded-xl shadow-lg border border-gray-100 p-5 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-base">
          <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
          Filter Products
        </h3>
        <div className="flex items-center gap-2">
          {/* <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1 rounded-md ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        title="Grid view"
                    >
                        <Grid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-100'}`}
                        title="List view"
                    >
                        <List className="w-4 h-4" />
                    </button> */}
          <button
            onClick={clearFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Selected filters at the top */}
      {hasSelectedFilters && (
        <div className="mb-5 pb-4 border-b border-gray-100">
          <h4 className="font-medium text-sm text-gray-900 mb-3">Active Filters</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([filterName, values]) =>
              values.map(value => (
                <span
                  key={`${filterName}-${value}`}
                  className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full"
                >
                  {value}
                  <button
                    onClick={() => handleFilterChange(filterName, value)}
                    className="text-indigo-500 hover:text-indigo-700"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      <div className="space-y-5">
        {filters.map((filter) => {
          const isExpanded = expandedSections[filter.name] ?? true;
          const selectedCount = getSelectedCount(filter.name);

          return (
            <div key={filter.name} className="border-b border-gray-100 pb-4 last:border-0">
              <button
                className="flex items-center justify-between w-full mb-3"
                onClick={() => toggleSection(filter.name)}
              >
                <h4 className="font-medium text-gray-900 flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {filter.name}
                  {selectedCount > 0 && (
                    <span className="bg-indigo-100 text-primary text-xs px-2 py-0.5 rounded-full">
                      {selectedCount}
                    </span>
                  )}
                </h4>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-primary" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-primary" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-3">
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 gap-2">
                      {filter.options.map((option) => {
                        const isSelected = selectedFilters[filter.name]?.includes(option) || false;
                        return (
                          <button
                            key={option}
                            onClick={() => handleFilterChange(filter.name, option)}
                            className={`p-2 rounded-md text-sm transition-all duration-200 ${isSelected
                              ? 'bg-indigo-100 text-primary border border-primary'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                              }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filter.options.map((option) => (
                        <label
                          key={option}
                          className="flex items-center gap-3 cursor-pointer group p-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedFilters[filter.name]?.includes(option) || false}
                              onChange={() => handleFilterChange(filter.name, option)}
                              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                          </div>
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}