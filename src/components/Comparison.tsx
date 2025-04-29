import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import ispData from '../data/ispPlans.json';
import { ISPPlan } from '../types';

interface ComparisonProps {
  filters?: {
    planType: string;
    speedTier: string;
    contractType: string;
    sortBy: string;
  };
}

// 确保ispData与ISPPlan类型兼容
const transformedData: ISPPlan[] = ispData.map(plan => ({
  ...plan,
  rrpPrice: plan.price,
  discountPrice: plan.promoPrice ? parseFloat(plan.promoPrice.match(/\d+\.\d+|\d+/)[0]) : plan.price,
  typicalEveningSpeed: `${plan.typicalSpeed}/${plan.speed.upload}`,
  downloadUpload: `${plan.speed.download}/${plan.speed.upload}`
}));

const Comparison: React.FC<ComparisonProps> = ({ filters: propFilters }) => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<ISPPlan[]>(transformedData);
  const [filteredPlans, setFilteredPlans] = useState<ISPPlan[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    contractType: 'all',
    sortBy: 'price'
  });

  // Update local filters when props change
  useEffect(() => {
    if (propFilters) {
      setFilters(prevFilters => ({
        ...prevFilters,
        ...propFilters
      }));
    }
  }, [propFilters]);

  // Apply filters whenever filters state changes
  useEffect(() => {
    let result = [...plans];

    // Search filtering
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(plan => 
        plan.provider.toLowerCase().includes(query) ||
        plan.name.toLowerCase().includes(query) ||
        plan.features.some(feature => feature.toLowerCase().includes(query))
      );
    }

    // Plan type filtering
    if (filters.planType !== 'all') {
      result = result.filter(plan => plan.type.toLowerCase() === filters.planType);
    }

    // Speed tier filtering
    if (filters.speedTier !== 'all') {
      const speedMap = {
        'nbn25': 25,
        'nbn50': 50,
        'nbn100': 100,
        'nbn250': 250,
        'nbn1000': 1000
      };
      const selectedSpeed = speedMap[filters.speedTier];
      result = result.filter(plan => plan.speed.download === selectedSpeed);
    }

    // Contract type filtering
    if (filters.contractType !== 'all') {
      const contractMap = {
        'month': 0,
        '12month': 12,
        '24month': 24
      };
      const selectedContract = contractMap[filters.contractType];
      result = result.filter(plan => plan.contract === selectedContract);
    }

    // Apply sorting
    if (filters.sortBy) {
      result.sort((a, b) => {
        switch (filters.sortBy) {
          case 'price':
            return a.price - b.price;
          case 'speed':
            return b.typicalSpeed - a.typicalSpeed;
          case 'rating':
            return b.rating - a.rating;
          case 'value':
            // Value for money (speed per dollar)
            return (b.typicalSpeed / b.price) - (a.typicalSpeed / a.price);
          default:
            return 0;
        }
      });
    }

    setFilteredPlans(result);
  }, [plans, filters, searchQuery]);

  // Listen for search queries from the Hero component
  useEffect(() => {
    // Setup event listener for postcode search
    const handlePostcodeSearch = (event) => {
      const { postcode } = event.detail;
      if (postcode) {
        // In a real app, we would search plans by postcode here
        // For the demo, just simulate filtering
        setSearchQuery(`postcode:${postcode}`);
      }
    };

    window.addEventListener('search:postcode', handlePostcodeSearch);
    
    return () => {
      window.removeEventListener('search:postcode', handlePostcodeSearch);
    };
  }, []);

  return (
    <section className="comparison">
      <div className="container">
        <h3>{t('comparison.title', 'Internet Plan Comparison')}</h3>
        
        {/* Search input for filtering plans */}
        <div className="search-filters">
          <input
            type="text"
            placeholder={t('comparison.searchPlaceholder', 'Search providers, plans, or features...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="comparison-grid" id="comparison-results">
          {filteredPlans.length > 0 ? (
            filteredPlans.map(plan => (
              <PlanCard key={plan.id} plan={plan} />
            ))
          ) : (
            <div className="no-results">
              {t('comparison.noResults', 'No plans match your selected filters. Please try different criteria.')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Comparison; 