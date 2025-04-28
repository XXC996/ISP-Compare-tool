import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

interface FiltersProps {
  onFilterChange?: (filters: any) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    contractType: 'all',
    sortBy: 'price',
    location: 'all',
    availability: 'all',
    language: 'all',
    operationHours: 'all'
  });

  const handleFilterChange = (e) => {
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
        <div className="filter-group">
          <label>{t('filters.planType', 'Plan Type')}</label>
          <select 
            name="planType" 
            value={filters.planType} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allTypes', 'All Types')}</option>
            <option value="nbn">NBN</option>
            <option value="opticomm">OptiComm</option>
            <option value="redtrain">RedTrain</option>
            <option value="5g">{t('filters.5gHome', '5G Home')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.speedTier', 'Speed Tier')}</label>
          <select 
            name="speedTier" 
            value={filters.speedTier} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allSpeeds', 'All Speeds')}</option>
            <option value="nbn25">NBN 25</option>
            <option value="nbn50">NBN 50</option>
            <option value="nbn100">NBN 100</option>
            <option value="nbn250">NBN 250</option>
            <option value="nbn1000">NBN 1000</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.contractType', 'Contract Type')}</label>
          <select 
            name="contractType" 
            value={filters.contractType} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allContracts', 'All Contracts')}</option>
            <option value="month">{t('filters.monthToMonth', 'No Contract')}</option>
            <option value="12month">{t('filters.12Months', '12 Months')}</option>
            <option value="24month">{t('filters.24Months', '24 Months')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.location', 'Location')}</label>
          <select 
            name="location" 
            value={filters.location} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allLocations', 'All States')}</option>
            <option value="NSW">NSW</option>
            <option value="VIC">VIC</option>
            <option value="QLD">QLD</option>
            <option value="SA">SA</option>
            <option value="WA">WA</option>
            <option value="TAS">TAS</option>
            <option value="NT">NT</option>
            <option value="ACT">ACT</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.language', 'Support Language')}</label>
          <select 
            name="language" 
            value={filters.language} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allLanguages', 'All Languages')}</option>
            <option value="en">{t('filters.english', 'English')}</option>
            <option value="zh">{t('filters.chinese', 'Chinese')}</option>
            <option value="hi">{t('filters.hindi', 'Hindi')}</option>
            <option value="es">{t('filters.spanish', 'Spanish')}</option>
            <option value="ar">{t('filters.arabic', 'Arabic')}</option>
            <option value="vi">{t('filters.vietnamese', 'Vietnamese')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.operationHours', 'Operation Hours')}</label>
          <select 
            name="operationHours" 
            value={filters.operationHours} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allHours', 'All Hours')}</option>
            <option value="24_7">{t('filters.24_7', '24/7 Support')}</option>
            <option value="business">{t('filters.businessHours', 'Business Hours')}</option>
            <option value="extended">{t('filters.extendedHours', 'Extended Hours')}</option>
            <option value="weekend">{t('filters.weekendSupport', 'Weekend Support')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.availability', 'Area Type')}</label>
          <select 
            name="availability" 
            value={filters.availability} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allAreas', 'All Areas')}</option>
            <option value="Metro">{t('filters.metro', 'Metropolitan')}</option>
            <option value="Regional">{t('filters.regional', 'Regional')}</option>
            <option value="Rural">{t('filters.rural', 'Rural')}</option>
          </select>
        </div>
        <div className="filter-group">
          <label>{t('filters.sortBy', 'Sort By')}</label>
          <select 
            name="sortBy" 
            value={filters.sortBy} 
            onChange={handleFilterChange}
          >
            <option value="price">{t('filters.monthlyPrice', 'Monthly Price')}</option>
            <option value="speed">{t('filters.typicalSpeed', 'Typical Speed')}</option>
            <option value="rating">{t('filters.customerRating', 'Customer Rating')}</option>
            <option value="value">{t('filters.value', 'Value for Money')}</option>
          </select>
        </div>
      </div>
    </section>
  );
};

export default Filters; 