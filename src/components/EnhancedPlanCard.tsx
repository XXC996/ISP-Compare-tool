import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';
import { ISPPlan } from '../types';
import '../styles/EnhancedPlanCard.css';

// Import company icons
import telstraIcon from '../assets/company_icon/Telstra.jpeg';
import tpgIcon from '../assets/company_icon/TPG.png';
import optusIcon from '../assets/company_icon/Optus.png';
import aussieIcon from '../assets/company_icon/AussieBroadband.jpeg';
import occomIcon from '../assets/company_icon/occom.jpeg';
import superloopIcon from '../assets/company_icon/Superloop.jpeg';

interface EnhancedPlanCardProps {
  plan: ISPPlan;
  highlightBestValue?: boolean;
}

const EnhancedPlanCard: React.FC<EnhancedPlanCardProps> = ({ 
  plan, 
  highlightBestValue = false
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  // Generate star rating
  const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star half">★</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-star-${i}`} className="star empty">☆</span>);
    }
    
    return stars;
  };

  // Format price display
  const formatPrice = (price: number | string): string => {
    if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return price.toString();
  };
  
  // Calculate savings
  const calculateSavings = (): string | null => {
    if (plan.promoPrice && typeof plan.price === 'number' && typeof plan.promoPrice === 'number') {
      const savings = plan.price - plan.promoPrice;
      return savings.toFixed(2);
    }
    return null;
  };
  
  // Determine if there's a discount
  const hasDiscount = (): boolean => {
    return plan.rrpPrice !== plan.discountPrice;
  };
  
  // Get discount percentage if available
  const getDiscountPercentage = (): number | null => {
    if (typeof plan.rrpPrice === 'number' && typeof plan.discountPrice === 'number' && plan.rrpPrice !== plan.discountPrice) {
      return Math.round(((plan.rrpPrice - plan.discountPrice) / plan.rrpPrice) * 100);
    }
    return null;
  };

  // Toggle expanded state
  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Get company icon based on provider name
  const getCompanyIcon = (): string => {
    // Map of provider names to icon files (normalize keys to lowercase)
    const providerToIcon: Record<string, string> = {
      'telstra': telstraIcon,
      'tpg': tpgIcon,
      'optus': optusIcon,
      'aussie broadband': aussieIcon,
      'aussie': aussieIcon,
      'occom': occomIcon,
      'superloop': superloopIcon
    };

    // Normalize provider name for matching
    const normalizedProvider = plan.provider.toLowerCase();
    
    // Try exact match first
    if (providerToIcon[normalizedProvider]) {
      return providerToIcon[normalizedProvider];
    }
    
    // Try partial match
    for (const [key, icon] of Object.entries(providerToIcon)) {
      if (normalizedProvider.includes(key) || key.includes(normalizedProvider)) {
        return icon;
      }
    }

    // Return the original logo as fallback
    return plan.logoSrc || '';
  };

  return (
    <div className={`enhanced-plan-card ${highlightBestValue ? 'best-value' : ''} ${expanded ? 'expanded' : ''}`}>
      {highlightBestValue && (
        <div className="best-value-tag">
          {t('planCard.bestValue', 'Best Value')}
        </div>
      )}
      
      <div className="card-header">
        <div className="provider-logo">
          <img 
            src={getCompanyIcon()} 
            alt={`${plan.provider} logo`} 
            loading="lazy"
          />
        </div>
        <div className="provider-info">
          <h3 className="provider-name">{plan.provider}</h3>
          <div className="ratings">
            <div className="stars-container">
              {renderStars(plan.rating)}
            </div>
            <span className="review-count">
              {plan.rating.toFixed(1)} ({plan.reviewCount})
            </span>
          </div>
        </div>
      </div>
      
      <div className="plan-badges">
        <span className="plan-badge network-type">
          {t(`networkTypes.${plan.type.toLowerCase()}`) || plan.type}
        </span>
        <span className="plan-badge speed">{plan.speed.download} Mbps</span>
        {hasDiscount() && (
          <span className="plan-badge discount">
            -{getDiscountPercentage()}%
          </span>
        )}
      </div>
      
      <div className="plan-price">
        <div className="price-block">
          {hasDiscount() && (
            <div className="original-price">
              ${typeof plan.rrpPrice === 'number' ? plan.rrpPrice.toFixed(2) : plan.rrpPrice}
            </div>
          )}
          <div className="current-price">
            ${typeof plan.discountPrice === 'number' ? plan.discountPrice.toFixed(2) : plan.discountPrice}
            <span className="price-period">/mo</span>
          </div>
        </div>
        
        <div className="speed-info">
          <div className="typical-speed">
            {plan.typicalSpeed} Mbps
          </div>
          <div className="speed-label">
            {t('planCard.typicalSpeed', 'Typical Evening Speed')}
          </div>
        </div>
      </div>
      
      <div className="plan-features">
        <ul>
          <li>
            <span className="feature-icon data-icon"></span>
            <span className="feature-text">{plan.data}</span>
          </li>
          <li>
            <span className="feature-icon setup-icon"></span>
            <span className="feature-text">
              {plan.setupFee > 0 
                ? t('planCard.setupFee', { defaultValue: '${fee} Setup', fee: plan.setupFee }) 
                : t('planCard.noSetupFee', 'No Setup Fee')}
            </span>
          </li>
          <li>
            <span className="feature-icon contract-icon"></span>
            <span className="feature-text">
              {plan.contract === 0 
                ? t('planCard.noContract', 'No Contract') 
                : t('planCard.monthContract', { defaultValue: '{months} Month Contract', months: plan.contract })}
            </span>
          </li>
        </ul>
      </div>
      
      <div className={`plan-details ${expanded ? 'visible' : ''}`}>
        <div className="support-details">
          <h4>{t('planCard.supportDetails', 'Support')}</h4>
          <div className="detail-row">
            <span className="detail-label">{t('planCard.languages', 'Languages')}:</span>
            <span className="detail-value">{plan.languages}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('planCard.support', 'Hours')}:</span>
            <span className="detail-value">{plan.support}</span>
          </div>
        </div>
        
        <div className="technical-details">
          <h4>{t('planCard.technicalDetails', 'Technical Details')}</h4>
          <div className="detail-row">
            <span className="detail-label">{t('planCard.upload', 'Upload')}:</span>
            <span className="detail-value">{plan.speed.upload} Mbps</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('planCard.totalCost', 'Annual Cost')}:</span>
            <span className="detail-value">${plan.yearCost}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">{t('planCard.modem', 'Modem')}:</span>
            <span className="detail-value">{plan.modem}</span>
          </div>
        </div>
      </div>
      
      <div className="card-actions">
        <button className="details-toggle" onClick={toggleExpanded}>
          {expanded 
            ? t('planCard.hideDetails', 'Hide Details')
            : t('planCard.showDetails', 'Show Details')
          }
        </button>
        <a href="#" className="cta-button">{t('planCard.viewDeal', 'View Deal')}</a>
      </div>
    </div>
  );
};

export default EnhancedPlanCard; 