import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import FilterPanel from './FilterPanel';
import EnhancedPlanCard from './EnhancedPlanCard';
import ispDataRaw from '../data/ispData.json';
import { ISPProvider, ISPPlan } from '../types';
import '../styles/MainComparison.css';

const MainComparison: React.FC = () => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ISPProvider[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<ISPPlan[]>([]);
  const [activeFilters, setActiveFilters] = useState({});
  const [resultsCount, setResultsCount] = useState(0);
  const [bestValue, setBestValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Initialize providers data
  useEffect(() => {
    // Simulate loading data
    setLoading(true);
    setTimeout(() => {
      setProviders(ispDataRaw.providers as ISPProvider[]);
      setLoading(false);
    }, 500);
  }, []);

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    
    // Apply filters to generate filtered plans
    if (providers.length) {
      const speedTier = filters.speedTier === 'all' ? '50M' : filters.speedTier;
      
      let result = [...providers];
      
      // Apply plan type filter
      if (filters.planType !== 'all') {
        result = result.filter(provider => {
          return provider.planTypes && provider.planTypes.includes(filters.planType);
        });
      }
      
      // Apply more filters as needed based on the filter configuration
      if (filters.language !== 'all') {
        result = result.filter(provider => {
          return provider.supportedLanguages.includes(filters.language);
        });
      }
      
      if (filters.contractType !== 'all') {
        result = result.filter(provider => {
          const plan = provider.plans[speedTier];
          if (!plan) return false;
          
          if (filters.contractType === 'no-contract') {
            return plan.contractLength === 0;
          } else if (filters.contractType === 'contract') {
            return plan.contractLength > 0;
          }
          return true;
        });
      }
      
      // Apply price tier filter
      if (filters.priceTier !== 'all') {
        result = result.filter(provider => {
          const plan = provider.plans[speedTier];
          if (!plan || plan.rrpPrice === '---') return false;
          
          const price = typeof plan.rrpPrice === 'number' ? plan.rrpPrice : Infinity;
          
          if (filters.priceTier === '0-75') {
            return price <= 75;
          } else if (filters.priceTier === '75-100') {
            return price > 75 && price <= 100;
          } else if (filters.priceTier === '100-125') {
            return price > 100 && price <= 125;
          } else if (filters.priceTier === '125+') {
            return price > 125;
          }
          
          return true;
        });
      }
      
      // Apply sorting
      if (filters.sortBy) {
        result.sort((a, b) => {
          const planA = a.plans[speedTier];
          const planB = b.plans[speedTier];

          if (!planA || !planB) return 0;

          switch (filters.sortBy) {
            case 'price':
              const priceA = typeof planA.rrpPrice === 'number' ? planA.rrpPrice : Infinity;
              const priceB = typeof planB.rrpPrice === 'number' ? planB.rrpPrice : Infinity;
              return priceA - priceB;
            case 'speed':
              const speedA = parseInt(planA.typicalEveningSpeed.split('/')[0]) || 0;
              const speedB = parseInt(planB.typicalEveningSpeed.split('/')[0]) || 0;
              return speedB - speedA;
            case 'rating':
              const ratingA = typeof a.googleReviews.score === 'number' ? a.googleReviews.score : 0;
              const ratingB = typeof b.googleReviews.score === 'number' ? b.googleReviews.score : 0;
              return ratingB - ratingA;
            case 'value':
              const speedValueA = parseInt(planA.typicalEveningSpeed.split('/')[0]) || 0;
              const priceValueA = typeof planA.rrpPrice === 'number' ? planA.rrpPrice : Infinity;
              const speedValueB = parseInt(planB.typicalEveningSpeed.split('/')[0]) || 0;
              const priceValueB = typeof planB.rrpPrice === 'number' ? planB.rrpPrice : Infinity;
              const valueA = speedValueA / priceValueA;
              const valueB = speedValueB / priceValueB;
              return valueB - valueA;
            default:
              return 0;
          }
        });
      }
      
      // Convert provider data to plan data for the EnhancedPlanCard component
      const plans = result.map(provider => {
        const selectedPlan = provider.plans[speedTier];
        if (!selectedPlan || selectedPlan.rrpPrice === '---') return null;
        
        // Ensure maxSpeed exists or use typicalEveningSpeed as fallback
        const maxSpeed = selectedPlan.maxSpeed || selectedPlan.typicalEveningSpeed;
        
        const newPlan: ISPPlan = {
          id: `${provider.id}-${speedTier}`,
          provider: provider.name,
          logoSrc: provider.logo,
          type: provider.planTypes ? provider.planTypes[0] : 'Unknown',
          speed: {
            download: parseInt(maxSpeed.split('/')[0]) || 0,
            upload: parseInt(maxSpeed.split('/')[1] || '0') || 0
          },
          typicalSpeed: parseInt(selectedPlan.typicalEveningSpeed.split('/')[0]) || 0,
          data: selectedPlan.data || 'Unlimited',
          rrpPrice: selectedPlan.rrpPrice,
          discountPrice: selectedPlan.discountPrice || selectedPlan.rrpPrice,
          promoPrice: selectedPlan.promoPrice,
          setupFee: selectedPlan.setupFee || 0,
          contract: selectedPlan.contractLength || 0,
          languages: provider.supportedLanguages.join(', '),
          support: provider.operationHours.customerService,
          rating: typeof provider.googleReviews.score === 'number' ? provider.googleReviews.score : 3.5,
          reviewCount: typeof provider.googleReviews.count === 'number' ? provider.googleReviews.count : 0,
          yearCost: typeof selectedPlan.rrpPrice === 'number' ? (selectedPlan.rrpPrice * 12).toFixed(2) : 'N/A',
          modem: selectedPlan.modemIncluded ? 'Included' : 'Not Included',
          typicalEveningSpeed: selectedPlan.typicalEveningSpeed,
          downloadUpload: selectedPlan.downloadUpload
        };
        
        return newPlan;
      }).filter(Boolean) as ISPPlan[];
      
      setFilteredPlans(plans);
      setResultsCount(plans.length);
      
      // Determine best value plan
      if (plans.length > 0 && filters.sortBy === 'value') {
        setBestValue(plans[0].id);
      } else {
        setBestValue(null);
      }
    }
  };

  return (
    <section className="main-comparison">
      <div className="container">
        <div className="comparison-intro">
          <h2>{t('comparison.mainTitle', 'Find Your Perfect Internet Plan')}</h2>
          <p>{t('comparison.mainDescription', 'Use the filters to narrow down plans that match your needs, then compare your options side by side.')}</p>
        </div>

        <div className="comparison-layout">
          <aside className="filter-sidebar">
            <FilterPanel onFilterChange={handleFilterChange} />
            
            {resultsCount > 0 && (
              <div className="results-summary">
                <p>{t('comparison.resultsFound', 'Showing {count} plans', { count: resultsCount })}</p>
              </div>
            )}
            
            <div className="filter-help-card">
              <h4>{t('comparison.needHelp', 'Not sure what you need?')}</h4>
              <p>{t('comparison.helpDescription', 'Answer a few questions about your internet usage to find the perfect plan.')}</p>
              <button className="help-button">{t('comparison.getRecommendation', 'Get a Recommendation')}</button>
            </div>
          </aside>
          
          <div className="plans-container">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>{t('comparison.loading', 'Loading plans...')}</p>
              </div>
            ) : filteredPlans.length > 0 ? (
              <div className="plans-grid">
                {filteredPlans.map(plan => (
                  <EnhancedPlanCard 
                    key={plan.id} 
                    plan={plan} 
                    highlightBestValue={bestValue === plan.id}
                  />
                ))}
              </div>
            ) : (
              <div className="no-results-message">
                <h3>{t('comparison.noResults', 'No plans match your filters')}</h3>
                <p>{t('comparison.tryDifferent', 'Try adjusting your filters to see more results.')}</p>
                <button 
                  className="reset-filters-button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('filters:reset'));
                  }}
                >
                  {t('comparison.resetFilters', 'Reset Filters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainComparison; 