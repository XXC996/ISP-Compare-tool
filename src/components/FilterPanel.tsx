import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import filterConfig from '../data/filterConfig.json';
import '../styles/FilterPanel.css';

interface FilterPanelProps {
  onFilterChange?: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    priceTier: 'all',
    contractType: 'all',
    sortBy: 'price',
    language: 'all',
    operationHours: 'all'
  });

  // State for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    networkTypes: true,
    speedAndPrice: true,
    supportOptions: false,
    sortOptions: true
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      planType: 'all',
      speedTier: 'all',
      priceTier: 'all',
      contractType: 'all',
      sortBy: 'price',
      language: 'all',
      operationHours: 'all'
    });
  };

  // Listen for global reset event
  useEffect(() => {
    const handleResetEvent = () => {
      resetFilters();
    };
    
    window.addEventListener('filters:reset', handleResetEvent);
    
    return () => {
      window.removeEventListener('filters:reset', handleResetEvent);
    };
  }, []);

  // This effect would trigger the filtering of plans in a real app
  useEffect(() => {
    // Notify parent component about filter changes
    if (onFilterChange) {
      onFilterChange(filters);
    }
    
    // In a real application with global state, we might dispatch an action
    // Dispatch event for components that don't receive props directly
    const event = new CustomEvent('filters:changed', { detail: { filters } });
    window.dispatchEvent(event);
    
    console.log('Filters changed:', filters);
  }, [filters, onFilterChange]);

  // Filter group mappings
  const filterGroups = {
    networkTypes: ['planType'],
    speedAndPrice: ['speedTier', 'priceTier'],
    supportOptions: ['language', 'operationHours', 'contractType'],
    sortOptions: ['sortBy']
  };

  // Get filter group title
  const getGroupTitle = (group: string): string => {
    switch (group) {
      case 'networkTypes':
        return t('filters.networkTypeGroup', 'Network Types');
      case 'speedAndPrice':
        return t('filters.speedPriceGroup', 'Speed & Price');
      case 'supportOptions':
        return t('filters.supportGroup', 'Support & Features');
      case 'sortOptions':
        return t('filters.sortOptions', 'Sort Results');
      default:
        return group;
    }
  };

  return (
    <section className="filter-panel">
      <div className="container">
        <div className="filter-panel-header">
          <h3>{t('filters.findYourPlan', 'Find Your Perfect Plan')}</h3>
          <div className="filter-actions">
            <button className="reset-filters" onClick={resetFilters}>
              {t('filters.resetAll', 'Reset All')}
            </button>
          </div>
        </div>
        
        <div className="filter-panel-body">
          {Object.entries(filterGroups).map(([groupKey, filterKeys]) => (
            <div key={groupKey} className={`filter-group-section ${expandedSections[groupKey] ? 'expanded' : ''}`}>
              <div 
                className="filter-group-header" 
                onClick={() => toggleSection(groupKey)}
              >
                <h4>{getGroupTitle(groupKey)}</h4>
                <span className="toggle-icon">{expandedSections[groupKey] ? '−' : '+'}</span>
              </div>
              
              <div className="filter-group-content">
                {filterKeys.map(filterKey => {
                  const filterData = filterConfig.filters[filterKey];
                  return (
                    <div key={filterKey} className="filter-control">
                      <label htmlFor={filterKey}>{t(filterData.label)}</label>
                      <select
                        id={filterKey}
                        name={filterKey}
                        value={filters[filterKey]}
                        onChange={handleFilterChange}
                      >
                        {filterData.options.map(option => (
                          <option key={option.value} value={option.value}>
                            {t(option.label)}
                          </option>
                        ))}
                      </select>
                      {filterData.description && (
                        <div className="filter-description">
                          {t(filterData.description)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="active-filters">
          <div className="active-filters-title">
            {t('filters.activeFilters', 'Active Filters:')}
          </div>
          <div className="active-filters-tags">
            {Object.entries(filters).filter(([_, value]) => value !== 'all').map(([key, value]) => {
              const filterData = filterConfig.filters[key];
              if (!filterData) return null;
              
              const option = filterData.options.find(opt => opt.value === value);
              if (!option) return null;
              
              return (
                <div key={key} className="filter-tag">
                  <span>{t(filterData.label)}: {t(option.label)}</span>
                  <button 
                    onClick={() => setFilters({...filters, [key]: 'all'})}
                    aria-label={`Clear ${t(filterData.label)} filter`}
                  >
                    ×
                  </button>
                </div>
              );
            })}
            {!Object.values(filters).some(value => value !== 'all') && (
              <span className="no-filters">{t('filters.noActiveFilters', 'No active filters')}</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel; 