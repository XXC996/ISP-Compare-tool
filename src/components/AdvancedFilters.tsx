import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Filters } from '../types';
import '../styles/AdvancedFilters.css';

interface AdvancedFiltersProps {
  onFilterChange: (filters: Filters) => void;
  onSortChange: (sortBy: string) => void;
  onPriceTypeChange: (useDiscountPrice: boolean) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  onFilterChange, 
  onSortChange,
  onPriceTypeChange
}) => {
  const { t } = useTranslation();
  
  // 初始筛选条件
  const [filters, setFilters] = useState<Filters>({
    speedTier: 'all',
    priceRange: {
      min: 0,
      max: 200
    },
    rating: 0,
    language: [],
    networkType: [],
    supportHours: {
      type: 'all',
      value: 'all'
    },
    supportChannel: []
  });

  const [sortBy, setSortBy] = useState('price');
  const [useDiscountPrice, setUseDiscountPrice] = useState(true);

  // 筛选项选择
  const speeds = [
    { value: 'all', label: t('filters.allSpeeds') },
    { value: '12M', label: '12 Mbps' },
    { value: '25M', label: '25 Mbps' },
    { value: '50M', label: '50 Mbps' },
    { value: '100M', label: '100 Mbps' },
    { value: '100/40M', label: '100/40 Mbps' },
    { value: '250M', label: '250 Mbps' },
    { value: '500M', label: '500 Mbps' },
    { value: '1000M', label: '1 Gbps' }
  ];

  const languages = [
    { value: 'English', label: t('filters.english') },
    { value: 'Chinese', label: t('filters.chinese') },
    { value: 'Hindi', label: t('filters.hindi') },
    { value: 'Spanish', label: t('filters.spanish') },
    { value: 'Arabic', label: t('filters.arabic') },
    { value: 'Vietnamese', label: t('filters.vietnamese') },
    { value: 'Korean', label: t('filters.korean') },
    { value: 'Punjabi', label: t('filters.punjabi') },
    { value: 'Malay', label: t('filters.malay') },
    { value: 'Tamil', label: t('filters.tamil') }
  ];

  const networkTypes = [
    { value: 'nbn', label: 'NBN' },
    { value: 'opticomm', label: 'OptiComm' },
    { value: 'redtrain', label: 'Redtrain' },
    { value: 'supa', label: 'SUPA Network' }
  ];

  const supportHourTypes = [
    { value: 'all', label: t('filters.allHours') },
    { value: 'sales', label: t('filters.salesHours') },
    { value: 'customerService', label: t('filters.customerServiceHours') },
    { value: 'technicalSupport', label: t('filters.technicalSupportHours') }
  ];

  const supportHourValues = [
    { value: 'all', label: t('filters.allHours') },
    { value: '24_7', label: t('filters.24_7') },
    { value: 'extended', label: t('filters.extendedHours') },
    { value: 'weekend', label: t('filters.weekendSupport') },
    { value: 'evening', label: t('filters.eveningSupport') }
  ];

  const supportChannels = [
    { value: 'phone', label: t('filters.phone') },
    { value: 'liveChat', label: t('filters.liveChat') },
    { value: 'email', label: t('filters.email') },
    { value: 'socialMedia', label: t('filters.socialMedia') },
    { value: 'app', label: t('filters.mobileApp') },
    { value: 'messaging', label: t('filters.messaging') }
  ];

  const sortOptions = [
    { value: 'price', label: t('filters.monthlyPrice') },
    { value: 'speed', label: t('filters.typicalSpeed') },
    { value: 'rating', label: t('filters.customerRating') },
    { value: 'value', label: t('filters.value') }
  ];

  useEffect(() => {
    // 通知父组件筛选条件变化
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // 处理速度选择
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      speedTier: e.target.value
    });
  };

  // 处理价格范围变化
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = parseInt(e.target.value);
    setFilters({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value
      }
    });
  };

  // 处理评分变化
  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      rating: parseFloat(e.target.value)
    });
  };

  // 处理语言复选框变化
  const handleLanguageChange = (value: string) => {
    let newLanguages = [...filters.language];
    
    if (newLanguages.includes(value)) {
      newLanguages = newLanguages.filter(l => l !== value);
    } else {
      newLanguages.push(value);
    }
    
    setFilters({
      ...filters,
      language: newLanguages
    });
  };

  // 处理网络类型复选框变化
  const handleNetworkTypeChange = (value: string) => {
    let newNetworkTypes = [...filters.networkType];
    
    if (newNetworkTypes.includes(value)) {
      newNetworkTypes = newNetworkTypes.filter(n => n !== value);
    } else {
      newNetworkTypes.push(value);
    }
    
    setFilters({
      ...filters,
      networkType: newNetworkTypes
    });
  };

  // 处理客服时间变化
  const handleSupportHoursTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      supportHours: {
        ...filters.supportHours,
        type: e.target.value
      }
    });
  };

  const handleSupportHoursValueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({
      ...filters,
      supportHours: {
        ...filters.supportHours,
        value: e.target.value
      }
    });
  };

  // 处理支持渠道复选框变化
  const handleSupportChannelChange = (value: string) => {
    let newChannels = [...filters.supportChannel];
    
    if (newChannels.includes(value)) {
      newChannels = newChannels.filter(c => c !== value);
    } else {
      newChannels.push(value);
    }
    
    setFilters({
      ...filters,
      supportChannel: newChannels
    });
  };

  // 处理排序变化
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value;
    setSortBy(newSortBy);
    onSortChange(newSortBy);
  };

  // 处理价格类型变化 (RRP vs 折扣价)
  const handlePriceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUseDiscountPrice = e.target.checked;
    setUseDiscountPrice(newUseDiscountPrice);
    onPriceTypeChange(newUseDiscountPrice);
  };

  // 重置所有筛选条件
  const resetFilters = () => {
    setFilters({
      speedTier: 'all',
      priceRange: {
        min: 0,
        max: 200
      },
      rating: 0,
      language: [],
      networkType: [],
      supportHours: {
        type: 'all',
        value: 'all'
      },
      supportChannel: []
    });
  };

  return (
    <div className="advanced-filters">
      <h2>{t('filters.advancedFilters')}</h2>
      
      <div className="filter-section">
        <h3>{t('filters.speedTier')}</h3>
        <select value={filters.speedTier} onChange={handleSpeedChange}>
          {speeds.map((speed) => (
            <option key={speed.value} value={speed.value}>{speed.label}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.priceRange')}</h3>
        <div className="price-range">
          <div className="range-input">
            <label>{t('filters.min')}</label>
            <input 
              type="number" 
              min="0" 
              max={filters.priceRange.max}
              value={filters.priceRange.min} 
              onChange={(e) => handlePriceRangeChange(e, 'min')} 
            />
          </div>
          <div className="range-input">
            <label>{t('filters.max')}</label>
            <input 
              type="number" 
              min={filters.priceRange.min} 
              value={filters.priceRange.max} 
              onChange={(e) => handlePriceRangeChange(e, 'max')} 
            />
          </div>
        </div>
        
        <div className="price-type-toggle">
          <label>
            <input 
              type="checkbox" 
              checked={useDiscountPrice} 
              onChange={handlePriceTypeChange} 
            />
            {t('filters.useDiscountPrice')}
          </label>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.googleRating')}</h3>
        <div className="rating-slider">
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.5" 
            value={filters.rating} 
            onChange={handleRatingChange} 
          />
          <span>{filters.rating} {t('filters.starsAndAbove')}</span>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.supportedLanguages')}</h3>
        <div className="checkbox-grid">
          {languages.map((language) => (
            <label key={language.value} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.language.includes(language.value)} 
                onChange={() => handleLanguageChange(language.value)} 
              />
              {language.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.networkType')}</h3>
        <div className="checkbox-grid">
          {networkTypes.map((network) => (
            <label key={network.value} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.networkType.includes(network.value)} 
                onChange={() => handleNetworkTypeChange(network.value)} 
              />
              {network.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.supportHours')}</h3>
        <div className="support-hours">
          <select 
            value={filters.supportHours.type} 
            onChange={handleSupportHoursTypeChange}
          >
            {supportHourTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
          
          <select 
            value={filters.supportHours.value} 
            onChange={handleSupportHoursValueChange}
          >
            {supportHourValues.map((value) => (
              <option key={value.value} value={value.value}>{value.label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.supportChannels')}</h3>
        <div className="checkbox-grid">
          {supportChannels.map((channel) => (
            <label key={channel.value} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={filters.supportChannel.includes(channel.value)} 
                onChange={() => handleSupportChannelChange(channel.value)} 
              />
              {channel.label}
            </label>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <h3>{t('filters.sortBy')}</h3>
        <select value={sortBy} onChange={handleSortChange}>
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-actions">
        <button className="reset-button" onClick={resetFilters}>
          {t('filters.reset')}
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilters; 