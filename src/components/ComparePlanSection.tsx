import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../styles/ComparePlanSection.css';
import ispPlans from '../data/ispPlans.json';
import ispDataRaw from '../data/ispData.json';

// Import logo images
import superloopLogo from '../assets/company_icon/Superloop.jpeg';
import aussieBroadbandLogo from '../assets/company_icon/AussieBroadband.jpeg';
import occomLogo from '../assets/company_icon/occom.jpeg';
import tpgLogo from '../assets/company_icon/TPG.png';
import optusLogo from '../assets/company_icon/Optus.png';
import telstraLogo from '../assets/company_icon/Telstra.jpeg';

// Plan improvement options
type ImprovementFocus = 'price' | 'speed' | 'reliability' | 'support';

// Plan data type
interface PlanData {
  provider: string;
  name: string;
  speed: number;
  monthlyPrice: number;
  contractLength: number;
  features: string[];
  rating: number;
  supportHours?: string;
  typicalEveningSpeed?: string;
  setupFee?: number;
  dataAllowance?: string;
  modemIncluded?: boolean;
  logoSrc?: string;
}

// Define speed tier options interface
interface SpeedOption {
  value: string;
  label: string;
  downloadSpeed: number;
}

// Interface for the price options
interface PriceOption {
  value: string;
  label: string;
  price: number | null;
}

const ComparePlanSection: React.FC = () => {
  const { t } = useTranslation();
  const [currentProvider, setCurrentProvider] = useState('');
  const [currentSpeed, setCurrentSpeed] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [useCustomPrice, setUseCustomPrice] = useState(false);
  const [priceOptions, setPriceOptions] = useState<PriceOption[]>([]);
  const [improvementFocus, setImprovementFocus] = useState<ImprovementFocus>('speed');
  const [isComparing, setIsComparing] = useState(false);
  const [recommendations, setRecommendations] = useState<PlanData[]>([]);
  
  // Get unique provider names from ISP data
  const providerOptions = [
    "Telstra",
    "TPG",
    "Aussie Broadband",
    "Optus",
    "iiNet",
    "Exetel",
    "Vodafone",
    "Belong",
    "Superloop",
    "Tangerine",
    "Occom",
    "Mate",
    "Dodo",
    "Spintel",
    "Kogan",
    "AGL"
  ].sort();

  // Define common speed tiers
  const speedOptions: SpeedOption[] = [
    { value: '12', label: '12 Mbps (Basic)', downloadSpeed: 12 },
    { value: '25', label: '25 Mbps (Standard)', downloadSpeed: 25 },
    { value: '50', label: '50 Mbps (Standard Plus)', downloadSpeed: 50 },
    { value: '100', label: '100 Mbps (Fast)', downloadSpeed: 100 },
    { value: '250', label: '250 Mbps (Superfast)', downloadSpeed: 250 },
    { value: '1000', label: '1000 Mbps (Ultrafast)', downloadSpeed: 1000 }
  ];

  const improvementOptions: { id: ImprovementFocus; label: string; icon: string }[] = [
    { id: 'price', label: t('compare.focusPrice', 'Better Price'), icon: '💰' },
    { id: 'speed', label: t('compare.focusSpeed', 'Faster Speed'), icon: '🚀' },
    { id: 'reliability', label: t('compare.focusReliability', 'More Reliable'), icon: '🔒' },
    { id: 'support', label: t('compare.focusSupport', 'Better Support'), icon: '🛠️' }
  ];

  // Update price options when provider or speed changes
  useEffect(() => {
    if (currentProvider && currentSpeed) {
      // Find matching plans with the selected provider and speed
      const matchingPlans = ispPlans.filter(plan => 
        plan.provider === currentProvider && 
        plan.speed.download.toString() === currentSpeed
      );
      
      console.log('Found matching plans:', matchingPlans.length, matchingPlans);
      
      const newPriceOptions: PriceOption[] = [];
      
      // Add plans found in data
      if (matchingPlans.length > 0) {
        matchingPlans.forEach(plan => {
          newPriceOptions.push({
            value: plan.price.toString(),
            label: `$${plan.price.toFixed(2)} - ${plan.name}`,
            price: plan.price
          });
        });
        console.log('Added price options from plans:', newPriceOptions);
      } else {
        // If no exact matches found, add provider-specific price options based on speed tier
        // This mapping provides realistic pricing for each provider based on their typical price points
        const providerPricingMap: {[key: string]: {[key: string]: number[]}} = {
          'Telstra': {
            '12': [55, 59],
            '25': [75, 79],
            '50': [90, 95],
            '100': [110, 120],
            '250': [140, 150],
            '1000': [180, 190]
          },
          'Optus': {
            '12': [49, 55],
            '25': [69, 75],
            '50': [79, 85],
            '100': [99, 105],
            '250': [120, 129],
            '1000': [149, 159]
          },
          'TPG': {
            '12': [45, 49],
            '25': [59, 65],
            '50': [69.99, 74.99],
            '100': [89.99, 94.99],
            '250': [119.99, 124.99],
            '1000': [139.99, 144.99]
          },
          'Aussie Broadband': {
            '12': [59, 65],
            '25': [69, 75],
            '50': [79, 85],
            '100': [99, 109],
            '250': [129, 139],
            '1000': [149, 159]
          },
          'Superloop': {
            '12': [49, 55],
            '25': [65, 69],
            '50': [75, 79],
            '100': [85, 89.90],
            '250': [99, 109],
            '1000': [119, 129]
          },
          'iiNet': {
            '12': [49.99, 54.99],
            '25': [64.99, 69.99],
            '50': [74.99, 79.99],
            '100': [94.99, 99.99],
            '250': [119.99, 129.99],
            '1000': [149.99, 159.99]
          },
          'Vodafone': {
            '12': [45, 50],
            '25': [60, 65],
            '50': [75, 80],
            '100': [85, 90],
            '250': [100, 110],
            '1000': [135, 145]
          },
          'Belong': {
            '12': [45, 50],
            '25': [60, 65],
            '50': [70, 75],
            '100': [90, 95],
            '250': [110, 115],
            '1000': [135, 140]
          },
          'Occom': {
            '12': [45, 49],
            '25': [59, 65],
            '50': [75, 79],
            '100': [84.90, 89.90],
            '250': [99.90, 104.90],
            '1000': [119.90, 129.90]
          },
          'Tangerine': {
            '12': [44.90, 49.90],
            '25': [54.90, 59.90],
            '50': [64.90, 69.90],
            '100': [74.90, 84.90],
            '250': [94.90, 104.90],
            '1000': [119.90, 129.90]
          },
          'Mate': {
            '12': [49, 55],
            '25': [59, 65],
            '50': [69, 75],
            '100': [79, 89],
            '250': [99, 109],
            '1000': [129, 139]
          },
          'Dodo': {
            '12': [45, 50],
            '25': [55, 60],
            '50': [65, 70],
            '100': [75, 85],
            '250': [95, 105],
            '1000': [120, 130]
          },
          'Spintel': {
            '12': [49.95, 54.95],
            '25': [59.95, 64.95],
            '50': [64.95, 69.95],
            '100': [74.95, 84.95],
            '250': [94.95, 104.95],
            '1000': [119.95, 129.95]
          },
          'Kogan': {
            '12': [46.90, 51.90],
            '25': [56.90, 61.90],
            '50': [65.90, 70.90],
            '100': [78.90, 88.90],
            '250': [95.90, 105.90],
            '1000': [120.90, 130.90]
          },
          'AGL': {
            '12': [50, 55],
            '25': [60, 65],
            '50': [70, 75],
            '100': [80, 90],
            '250': [100, 110],
            '1000': [125, 135]
          }
        };
        
        // Default prices if provider not in map
        const defaultPrices = {
          '12': [45, 49, 55],
          '25': [59, 65, 69],
          '50': [69, 75, 79],
          '100': [85, 89, 95],
          '250': [99, 109, 119],
          '1000': [129, 139, 149]
        };
        
        // Get provider-specific pricing if available, otherwise use default
        const providerPricing = providerPricingMap[currentProvider];
        const speedPrices = providerPricing && providerPricing[currentSpeed] 
          ? providerPricing[currentSpeed] 
          : defaultPrices[currentSpeed as keyof typeof defaultPrices] || [75];
        
        // Generate plan names based on speed
        const planNames = {
          '12': ['Basic', 'Starter'],
          '25': ['Standard', 'Regular'],
          '50': ['Standard Plus', 'Family'],
          '100': ['Fast', 'Premium'],
          '250': ['Superfast', 'Elite'],
          '1000': ['Ultrafast', 'Ultimate']
        };
        
        // Plan features or qualifiers that make plans different even at same speed/price
        const planQualifiers = [
          'Unlimited', 
          'Value',
          'Essential',
          'Premium',
          'Plus',
          'Max'
        ];
        
        const speedNames = planNames[currentSpeed as keyof typeof planNames] || ['Plan'];
        
        // Add each price option with a sensible plan name
        speedPrices.forEach((price, index) => {
          const planName = index < speedNames.length 
            ? speedNames[index] 
            : speedNames[0];
            
          // Add a qualifier to differentiate plans at same speed
          const qualifier = index < planQualifiers.length 
            ? planQualifiers[index] 
            : '';
          
          // Format the label differently based on provider naming conventions
          let label = '';
          
          if (['Telstra', 'Optus', 'TPG', 'Aussie Broadband'].includes(currentProvider)) {
            // Provider Name - Plan Name NBN Speed Qualifier
            label = `$${price.toFixed(2)} - ${currentProvider} ${planName} NBN ${currentSpeed} ${qualifier}`.trim();
          } else if (['Superloop', 'Belong', 'Mate'].includes(currentProvider)) {
            // Provider Name - NBN Speed Plan Name Qualifier
            label = `$${price.toFixed(2)} - ${currentProvider} NBN ${currentSpeed} ${planName} ${qualifier}`.trim();
          } else {
            // Provider Name - Qualifier NBN Speed
            label = `$${price.toFixed(2)} - ${currentProvider} ${qualifier} NBN ${currentSpeed}`.trim();
          }
          
          newPriceOptions.push({
            value: price.toString(),
            label: label,
            price: price
          });
        });
        
        console.log('Added provider-specific price options:', newPriceOptions);
      }
      
      // Always add the custom price option
      newPriceOptions.push({
        value: 'custom',
        label: t('compare.customPrice', 'Enter custom price...'),
        price: null
      });
      
      setPriceOptions(newPriceOptions);
      
      // Reset price selection when provider or speed changes
      setCurrentPrice('');
      setUseCustomPrice(false);
    } else {
      setPriceOptions([{
        value: 'custom',
        label: t('compare.customPrice', 'Enter custom price...'),
        price: null
      }]);
    }
  }, [currentProvider, currentSpeed, t]);

  // Handle price selection change
  const handlePriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setCurrentPrice(value);
    setUseCustomPrice(value === 'custom');
  };

  // Generate recommendations based on user input and focus
  const generateRecommendations = () => {
    if (!currentProvider || !currentSpeed || (!currentPrice && !customPrice)) {
      // Show error or alert
      return;
    }

    // Get the price value
    const priceValue = useCustomPrice 
      ? parseFloat(customPrice) 
      : parseFloat(currentPrice);
    
    if (isNaN(priceValue)) {
      return;
    }

    // Parse speed value
    const speedValue = parseInt(currentSpeed, 10);

    // Get provider logo based on name
    const getProviderLogo = (providerName: string): string => {
      switch(providerName.toLowerCase()) {
        case 'superloop':
          return superloopLogo;
        case 'aussie broadband':
          return aussieBroadbandLogo;
        case 'occom':
          return occomLogo;
        case 'tpg':
          return tpgLogo;
        case 'optus':
          return optusLogo;
        case 'telstra':
          return telstraLogo;
        default:
          return '';
      }
    };

    // Enhanced mock data for recommendations with more detailed information
    const allRecommendations: PlanData[] = [
      {
        provider: 'Superloop',
        name: 'NBN Fast 100',
        speed: 100,
        monthlyPrice: 89.90,
        contractLength: 0,
        features: ['No Lock-in Contract', 'Australian Support', 'Free Setup'],
        rating: 4.7,
        supportHours: '8AM-8PM 7 days',
        typicalEveningSpeed: '93 Mbps',
        setupFee: 0,
        dataAllowance: 'Unlimited',
        modemIncluded: false,
        logoSrc: superloopLogo
      },
      {
        provider: 'Aussie Broadband',
        name: 'NBN 100/20 Unlimited',
        speed: 100,
        monthlyPrice: 95,
        contractLength: 0,
        features: ['No Lock-in Contract', '100% Australian Support', 'Unlimited Data'],
        rating: 4.8,
        supportHours: '24/7 Australian Support',
        typicalEveningSpeed: '95 Mbps',
        setupFee: 0,
        dataAllowance: 'Unlimited',
        modemIncluded: false,
        logoSrc: aussieBroadbandLogo
      },
      {
        provider: 'Occom',
        name: 'NBN 100 Unlimited',
        speed: 100,
        monthlyPrice: 84.90,
        contractLength: 0,
        features: ['No Lock-in Contract', 'Multilingual Support', 'Free Setup'],
        rating: 4.6,
        supportHours: '8AM-10PM 7 days',
        typicalEveningSpeed: '91 Mbps',
        setupFee: 0,
        dataAllowance: 'Unlimited',
        modemIncluded: true,
        logoSrc: occomLogo
      },
      {
        provider: 'TPG',
        name: 'NBN SL Bundle',
        speed: 50,
        monthlyPrice: 69.99,
        contractLength: 0,
        features: ['No Lock-in Contract', 'Unlimited Data', 'Included Modem'],
        rating: 4.1,
        supportHours: '8AM-10PM Support',
        typicalEveningSpeed: '46 Mbps',
        setupFee: 0,
        dataAllowance: 'Unlimited',
        modemIncluded: true,
        logoSrc: tpgLogo
      },
      {
        provider: 'Optus',
        name: 'Internet Everyday',
        speed: 50,
        monthlyPrice: 79,
        contractLength: 0,
        features: ['No Lock-in Contract', 'Optus Sport Included', '4G Backup'],
        rating: 4.0,
        supportHours: '24/7 Support',
        typicalEveningSpeed: '45 Mbps',
        setupFee: 0,
        dataAllowance: 'Unlimited',
        modemIncluded: true,
        logoSrc: optusLogo
      }
    ];

    // Filter and sort recommendations based on focus
    let filteredRecommendations: PlanData[] = [...allRecommendations];
    
    // Don't recommend the same provider unless it's significantly better
    filteredRecommendations = filteredRecommendations.filter(plan => 
      plan.provider.toLowerCase() !== currentProvider.toLowerCase() || 
      (plan.speed > speedValue * 1.5) || 
      (plan.monthlyPrice < priceValue * 0.8)
    );

    // First sort according to improvement focus - this determines the ranking for recommendation relevance
    switch(improvementFocus) {
      case 'price':
        // Sort for price focus (cheapest options first)
        filteredRecommendations.sort((a, b) => a.monthlyPrice - b.monthlyPrice);
        break;
      case 'speed':
        // Sort for speed focus (fastest options first)
        filteredRecommendations.sort((a, b) => b.speed - a.speed);
        break;
      case 'reliability':
        // Sort for reliability focus (highest rated options first)
        filteredRecommendations.sort((a, b) => b.rating - a.rating);
        break;
      case 'support':
        // Sort for support focus (based on provider support reputation)
        const supportPriority = {
          'Aussie Broadband': 1,
          'Superloop': 2,
          'Occom': 3,
          'TPG': 4,
          'Optus': 5
        };
        filteredRecommendations.sort((a, b) => 
          (supportPriority[a.provider as keyof typeof supportPriority] || 99) - 
          (supportPriority[b.provider as keyof typeof supportPriority] || 99)
        );
        break;
    }
    
    // Take top 3 recommendations based on focus
    let topRecommendations = filteredRecommendations.slice(0, 3);
    
    // Now, ensure the highest rated plan is first (will be marked as "Best Match")
    topRecommendations.sort((a, b) => b.rating - a.rating);
    
    setRecommendations(topRecommendations);
    setIsComparing(true);
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="star-rating">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={
            i < fullStars 
              ? "star full" 
              : (i === fullStars && hasHalfStar) 
                ? "star half" 
                : "star empty"
          }>★</span>
        ))}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const resetForm = () => {
    setIsComparing(false);
    setRecommendations([]);
  };

  // Determine which detail should be highlighted based on improvement focus
  const getHighlightedDetails = (plan: PlanData) => {
    switch(improvementFocus) {
      case 'price':
        return (
          <div className="highlighted-detail price-highlight">
            <div className="highlight-icon">💰</div>
            <div className="highlight-content">
              <div className="highlight-label">{t('compare.bestPriceLabel', 'Best Price')}</div>
              <div className="highlight-value">${plan.monthlyPrice.toFixed(2)}/mo</div>
              <div className="highlight-subtext">
                {plan.setupFee === 0 ? t('compare.noSetupFee', 'No Setup Fee') : `$${plan.setupFee} ${t('compare.setupFee', 'Setup Fee')}`}
              </div>
            </div>
          </div>
        );
      case 'speed':
        return (
          <div className="highlighted-detail speed-highlight">
            <div className="highlight-icon">🚀</div>
            <div className="highlight-content">
              <div className="highlight-label">{t('compare.bestSpeedLabel', 'Fast Speed')}</div>
              <div className="highlight-value">{plan.speed} Mbps</div>
              <div className="highlight-subtext">
                {t('compare.typicalEvening', 'Typical evening: ')} {plan.typicalEveningSpeed}
              </div>
            </div>
          </div>
        );
      case 'reliability':
        return (
          <div className="highlighted-detail reliability-highlight">
            <div className="highlight-icon">🔒</div>
            <div className="highlight-content">
              <div className="highlight-label">{t('compare.reliabilityLabel', 'Highly Reliable')}</div>
              <div className="highlight-value">{renderStars(plan.rating)}</div>
              <div className="highlight-subtext">
                {t('compare.contractType', 'Contract: ')} 
                {plan.contractLength === 0 
                  ? t('compare.noLockIn', 'No Lock-in') 
                  : `${plan.contractLength} ${t('compare.months', 'months')}`}
              </div>
            </div>
          </div>
        );
      case 'support':
        return (
          <div className="highlighted-detail support-highlight">
            <div className="highlight-icon">🛠️</div>
            <div className="highlight-content">
              <div className="highlight-label">{t('compare.supportLabel', 'Great Support')}</div>
              <div className="highlight-value">{plan.supportHours}</div>
              <div className="highlight-subtext">
                {plan.features.find(f => f.toLowerCase().includes('support')) || 
                 t('compare.dedicatedSupport', 'Dedicated customer service')}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <section className="compare-plan-section" id="compare-plan-section">
      <div className="container">
        <h3 className="section-title">{t('compare.title', 'Compare Your Current Plan')}</h3>
        <p className="section-description">
          {t('compare.description', 'Tell us about your current internet plan, and what you want to improve. We\'ll find you better options.')}
        </p>

        {!isComparing ? (
          <div className="compare-form-container">
            <div className="input-group">
              <div className="form-field">
                <label htmlFor="currentProvider">{t('compare.currentProvider', 'Current Provider')}</label>
                <select
                  id="currentProvider"
                  value={currentProvider}
                  onChange={(e) => setCurrentProvider(e.target.value)}
                  className="form-select"
                >
                  <option value="">{t('compare.selectProvider', 'Select Provider')}</option>
                  {providerOptions.map((provider, index) => (
                    <option key={index} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <label htmlFor="currentSpeed">{t('compare.currentSpeed', 'Current Speed (Mbps)')}</label>
                <select
                  id="currentSpeed"
                  value={currentSpeed}
                  onChange={(e) => setCurrentSpeed(e.target.value)}
                  className="form-select"
                >
                  <option value="">{t('compare.selectSpeed', 'Select Speed')}</option>
                  {speedOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-field">
                <label htmlFor="currentPrice">{t('compare.currentPrice', 'Monthly Price ($)')}</label>
                <div className="price-input-container">
                  <select
                    id="currentPrice"
                    value={currentPrice}
                    onChange={handlePriceChange}
                    className="form-select"
                    disabled={!currentProvider || !currentSpeed}
                  >
                    <option value="">{t('compare.selectPrice', 'Select Price')}</option>
                    {priceOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  
                  {useCustomPrice && (
                    <input
                      type="number"
                      id="customPrice"
                      value={customPrice}
                      onChange={(e) => setCustomPrice(e.target.value)}
                      placeholder={t('compare.enterCustomPrice', 'Enter your monthly fee')}
                      className="custom-price-input"
                    />
                  )}
                </div>
              </div>
            </div>
            
            <div className="improvement-focus">
              <h4>{t('compare.improvementTitle', 'What do you want to improve?')}</h4>
              <div className="focus-options">
                {improvementOptions.map(option => (
                  <button
                    key={option.id}
                    className={`focus-option ${improvementFocus === option.id ? 'selected' : ''}`}
                    onClick={() => setImprovementFocus(option.id)}
                  >
                    <span className="option-icon">{option.icon}</span>
                    <span className="option-label">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="compare-action">
              <button 
                className="compare-button"
                onClick={generateRecommendations}
                disabled={
                  !currentProvider || 
                  !currentSpeed || 
                  (!currentPrice && !useCustomPrice) || 
                  (useCustomPrice && !customPrice)
                }
              >
                {t('compare.findButton', 'Find Better Options')}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-container">
            <div className="results-header">
              <h4>{t('compare.recommendationsTitle', 'Recommended Alternatives')}</h4>
              <p className="results-subheader">
                {t('compare.improvementFocus', 'Optimized for: ')}
                <span className="focus-highlight">
                  {improvementOptions.find(o => o.id === improvementFocus)?.icon} {' '}
                  {improvementOptions.find(o => o.id === improvementFocus)?.label}
                </span>
              </p>
            </div>
            
            <div className="recommendations-grid">
              {recommendations.map((plan, index) => (
                <div key={index} className={`recommendation-card ${index === 0 ? 'best-match' : ''}`}>
                  {index === 0 && (
                    <div className="best-match-badge">
                      {t('compare.bestMatch', 'Highest Rated')}
                    </div>
                  )}
                  
                  <div className="plan-header">
                    <div className="provider-info">
                      {plan.logoSrc && (
                        <img 
                          src={plan.logoSrc} 
                          alt={plan.provider} 
                          className="provider-logo-image" 
                        />
                      )}
                      <div className="provider-details">
                        <h5 className="provider-name">{plan.provider}</h5>
                        <div className="provider-rating">
                          {renderStars(plan.rating)}
                        </div>
                      </div>
                    </div>
                    <p className="plan-name">{plan.name}</p>
                    <div className="plan-primary-details">
                      <div className="primary-detail">
                        <span className="detail-label">Speed</span>
                        <span className="detail-value">{plan.speed} Mbps</span>
                      </div>
                      <div className="primary-detail">
                        <span className="detail-label">Price</span>
                        <span className="detail-value">${plan.monthlyPrice.toFixed(2)}</span>
                      </div>
                      <div className="primary-detail">
                        <span className="detail-label">Data</span>
                        <span className="detail-value">{plan.dataAllowance}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Highlighted section based on improvement focus */}
                  {getHighlightedDetails(plan)}
                  
                  <div className="plan-details">
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.speed', 'Speed:')}</span>
                      <span className="detail-value highlight">{plan.speed} Mbps</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.price', 'Price:')}</span>
                      <span className="detail-value highlight">${plan.monthlyPrice.toFixed(2)}/mo</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.contract', 'Contract:')}</span>
                      <span className="detail-value">
                        {plan.contractLength === 0 
                          ? t('compare.noContract', 'No Lock-in') 
                          : t('compare.monthContract', '{months} months', { months: plan.contractLength })}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.data', 'Data:')}</span>
                      <span className="detail-value">{plan.dataAllowance}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.typicalSpeed', 'Typical Evening:')}</span>
                      <span className="detail-value">{plan.typicalEveningSpeed}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">{t('compare.modem', 'Modem:')}</span>
                      <span className="detail-value">
                        {plan.modemIncluded 
                          ? t('compare.modemIncluded', 'Included') 
                          : t('compare.modemOptional', 'Optional Purchase')}
                      </span>
                    </div>
                    
                    <div className="features-list">
                      <h6>{t('compare.features', 'Features:')}</h6>
                      <ul>
                        {plan.features.map((feature, i) => (
                          <li key={i}>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="plan-action">
                      <button className="view-plan-button">
                        {t('compare.viewPlan', 'View Plan Details')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="back-button-container">
              <button className="back-button" onClick={resetForm}>
                {t('compare.backButton', 'Compare Different Plan')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ComparePlanSection; 