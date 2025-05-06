import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import filterConfig from '../data/filterConfig.json';

interface FiltersProps {
  onFilterChange?: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
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

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

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

  return (
    <section className="filters">
      <div className="container">
        {Object.entries(filterConfig.filters).map(([filterKey, filterData]) => (
          <div key={filterKey} className="filter-group">
            <label>{t(filterData.label)}</label>
            <select
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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Filters; 