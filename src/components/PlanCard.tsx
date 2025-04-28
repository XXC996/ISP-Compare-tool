import { useTranslation } from 'react-i18next';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ISPPlan } from '../types';
// import { 
//   faStar, faStarHalfAlt, faWifi, faDollarSign, 
//   faRouter, faCalculator, faHeadset, faLanguage 
// } from '@fortawesome/free-solid-svg-icons';
// import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

interface PlanCardProps {
  plan: ISPPlan;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan }) => {
  const { t } = useTranslation();
  
  // Generate star rating
  const renderStars = (rating: number): React.ReactNode[] => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      // stars.push(<FontAwesomeIcon key={`star-${i}`} icon={faStar} />);
      stars.push(<span key={`star-${i}`}>★</span>);
    }
    
    if (hasHalfStar) {
      // stars.push(<FontAwesomeIcon key="half-star" icon={faStarHalfAlt} />);
      stars.push(<span key="half-star">½</span>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      // stars.push(<FontAwesomeIcon key={`empty-star-${i}`} icon={farStar} />);
      stars.push(<span key={`empty-star-${i}`}>☆</span>);
    }
    
    return stars;
  };

  // Determine contract display text
  const getContractText = (months: number): string => {
    if (months === 0) return t('planCard.noContract', 'No Contract');
    return t('planCard.monthContract', '{{months}} Months', { months });
  };

  return (
    <div className="plan-card">
      <div className="provider-logo">
        <img src={plan.logoSrc} alt={plan.provider} />
      </div>
      <div className="plan-details">
        <h4>{plan.name}</h4>
        <div className="badges">
          <span className={`badge ${plan.type.toLowerCase()}`}>{plan.type}</span>
          <span className="badge speed">{plan.speed.download} Mbps</span>
          <span className="badge contract">{getContractText(plan.contract)}</span>
        </div>
        <div className="price-section">
          <div className="current-price">${plan.price}<span>/month</span></div>
          {plan.promoPrice && (
            <div className="promo-price">{plan.promoPrice}</div>
          )}
        </div>
        <div className="feature-list">
          <div className="feature">
            {/* <FontAwesomeIcon icon={faWifi} />  */}
            {t('comparison.speed')}: <strong>{plan.typicalSpeed} Mbps</strong>
          </div>
          <div className="feature">
            {/* <FontAwesomeIcon icon={faDollarSign} />  */}
            {t('comparison.setupFee', 'Setup Fee')}: <strong>${plan.setupFee}</strong>
          </div>
          <div className="feature">
            {/* <FontAwesomeIcon icon={faRouter} />  */}
            {t('comparison.modem', 'Modem')}: <strong>{plan.modem}</strong>
          </div>
          <div className="feature">
            {/* <FontAwesomeIcon icon={faCalculator} />  */}
            {t('comparison.yearCost', '12-month cost')}: <strong>${plan.yearCost}</strong>
          </div>
        </div>
        <div className="rating-section">
          <div className="stars">
            {renderStars(plan.rating)}
            <span className="rating-text">{plan.rating}/5 ({plan.reviewCount} {t('comparison.reviews', 'reviews')})</span>
          </div>
          <div className="support-info">
            {plan.support && (
              <div>
                {/* <FontAwesomeIcon icon={faHeadset} /> {plan.support} */}
                {plan.support}
              </div>
            )}
            {plan.languages && (
              <div>
                {/* <FontAwesomeIcon icon={faLanguage} /> {plan.languages} */}
                {plan.languages}
              </div>
            )}
          </div>
        </div>
        <a href="#" className="cta-button">{t('comparison.viewDetails', 'View Deal')}</a>
      </div>
    </div>
  );
};

export default PlanCard; 