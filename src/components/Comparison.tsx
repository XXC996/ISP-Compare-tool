import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import PlanCard from './PlanCard';
import ispDataRaw from '../data/ispData.json';
import { ISPProvider, ISPPlan } from '../types';

interface ComparisonProps {
  filters?: {
    planType: string;
    speedTier: string;
    priceTier: string;
    contractType: string;
    sortBy: string;
    language: string;
  };
}

const ispData: { providers: ISPProvider[] } = ispDataRaw;

const Comparison: React.FC<ComparisonProps> = ({ filters: propFilters }) => {
  const { t } = useTranslation();
  const [providers, setProviders] = useState<ISPProvider[]>(ispData.providers);
  const [filteredProviders, setFilteredProviders] = useState<ISPProvider[]>([]);
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    priceTier: 'all',
    contractType: 'all',
    sortBy: 'price',
    language: 'all'
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
    console.log('Filters:', filters);
    let result = [...providers];

    // Plan type filtering
    if (filters.planType !== 'all') {
      result = result.filter(provider => provider.networkTypes[filters.planType.toLowerCase()]);
    }

    // Speed tier filtering
    if (filters.speedTier !== 'all') {
      result = result.filter(provider => {
        const speedPlan = provider.plans[filters.speedTier];
        return speedPlan && speedPlan.rrpPrice !== '---';
      });
    }

    // Price tier filtering
    if (filters.priceTier !== 'all') {
      const speedTierForPrice = filters.speedTier === 'all' ? '50M' : filters.speedTier;
      result = result.filter(provider => {
        const plan = provider.plans[speedTierForPrice];
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

    if (filters.language !== 'all') {
      result = result.filter(provider => {
        const languagePlan = provider.supportedLanguages.includes(filters.language);
        return languagePlan;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      const speedTierForSort = filters.speedTier === 'all' ? '50M' : filters.speedTier;
      result.sort((a, b) => {
        const planA = a.plans[speedTierForSort];
        const planB = b.plans[speedTierForSort];

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

    setFilteredProviders(result);
  }, [providers, filters]);

  const createPlanFromProvider = (provider: ISPProvider, speedTier: string): ISPPlan => {
    const selectedPlan = provider.plans[speedTier];
    return {
      id: provider.id,
      provider: provider.name,
      logoSrc: provider.logo,
      name: `${speedTier} Plan`,
      type: "NBN",
      speed: {
        download: parseInt(selectedPlan.downloadUpload.split('/')[0]),
        upload: parseInt(selectedPlan.downloadUpload.split('/')[1])
      },
      data: "Unlimited",
      contract: 0,
      price: typeof selectedPlan.rrpPrice === 'number' ? selectedPlan.rrpPrice : 0,
      promoPrice: selectedPlan.discountPrice !== selectedPlan.rrpPrice ? `${selectedPlan.discountPrice}` : undefined,
      typicalSpeed: parseInt(selectedPlan.typicalEveningSpeed.split('/')[0]),
      setupFee: 0,
      modem: "Optional",
      yearCost: typeof selectedPlan.rrpPrice === 'number' ? selectedPlan.rrpPrice * 12 : 0,
      rating: typeof provider.googleReviews.score === 'number' ? provider.googleReviews.score : 0,
      reviewCount: typeof provider.googleReviews.count === 'number' ? provider.googleReviews.count : 0,
      support: provider.operationHours.technicalSupport,
      languages: provider.supportedLanguages.join(', '),
      features: [
        provider.supportChannels.phone ? "Phone Support" : "",
        provider.supportChannels.liveChat ? "Live Chat" : "",
        provider.supportChannels.email ? "Email Support" : ""
      ].filter(Boolean),
      rrpPrice: selectedPlan.rrpPrice,
      discountPrice: selectedPlan.discountPrice,
      typicalEveningSpeed: selectedPlan.typicalEveningSpeed,
      downloadUpload: selectedPlan.downloadUpload
    };
  };

  return (
    <section className="comparison">
      <div className="container">
        <h3>{t('comparison.title')}</h3>
        
        <div className="comparison-grid" id="comparison-results">
          {filteredProviders.length > 0 ? (
            filteredProviders.map(provider => {
              const speedTier = filters.speedTier === 'all' ? '50M' : filters.speedTier;
              const selectedPlan = provider.plans[speedTier];
              if (!selectedPlan || selectedPlan.rrpPrice === '---') return null;

              const plan = createPlanFromProvider(provider, speedTier);
              return <PlanCard key={provider.id} plan={plan} />;
            })
          ) : (
            <div className="no-results">
              {t('comparison.noResults')}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Comparison; 