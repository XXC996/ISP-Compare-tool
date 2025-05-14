import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaStarHalf, FaRegStar, FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaGlobe, FaPhone, FaEnvelope, FaComments } from 'react-icons/fa';
import { BiTime } from 'react-icons/bi';
import { ISPProvider } from '../types';
import '../styles/ProviderCard.css';

interface ProviderCardProps {
  provider: ISPProvider;
  isSelected: boolean;
  onSelect: (provider: ISPProvider) => void;
  useDiscountPrice?: boolean;
  selectedSpeed: string;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ 
  provider, 
  isSelected, 
  onSelect,
  useDiscountPrice = false,
  selectedSpeed
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  
  // 获取当前速度的价格
  const getPlanPrice = () => {
    const plan = provider.plans[selectedSpeed];
    if (!plan) return "N/A";
    
    const price = useDiscountPrice ? plan.discountPrice : plan.rrpPrice;
    if (price === "---") return "N/A";
    
    return `$${price}`;
  };

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="star" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalf key={i} className="star" />);
      } else {
        stars.push(<FaRegStar key={i} className="star" />);
      }
    }
    
    return (
      <div className="rating-stars">
        {stars}
        <span className="rating-number">({rating.toFixed(1)})</span>
      </div>
    );
  };

  // 检查是否支持特定语言
  const supportsLanguage = (language: string) => {
    return provider.supportedLanguages.some(lang => 
      lang.toLowerCase().includes(language.toLowerCase())
    );
  };

  // 检查是否支持特定网络类型
  const supportsNetworkType = (type: string) => {
    return provider.networkTypes[type as keyof typeof provider.networkTypes];
  };

  // 获取典型晚间速度
  const getTypicalSpeed = () => {
    const plan = provider.plans[selectedSpeed];
    if (!plan || plan.typicalEveningSpeed === "---") return "N/A";
    return plan.typicalEveningSpeed;
  };

  // 切换展开/折叠详情
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // 选择该提供商进行比较
  const handleSelect = () => {
    onSelect(provider);
  };
  
  return (
    <div className={`provider-card ${isSelected ? 'selected' : ''}`}>
      <div className="provider-card-header">
        <img src={provider.logo} alt={`${provider.name} logo`} className="provider-logo" />
        <div className="provider-name-rating">
          <h3 className="provider-name">{provider.name}</h3>
          {renderStars(Number(provider.googleReviews.score))}
        </div>
        <div className="provider-price">{getPlanPrice()}<span className="price-period">/mo</span></div>
      </div>
      
      <div className="provider-card-summary">
        <div className="summary-item">
          <div className="summary-label">{t('comparison.speed', 'Speed')}</div>
          <div className="summary-value">{getTypicalSpeed()}</div>
        </div>
        <div className="summary-item">
          <div className="summary-label">{t('comparison.rating', 'Rating')}</div>
          <div className="summary-value rating">
            {renderStars(Number(provider.googleReviews.score))}
            <span className="review-count">({provider.googleReviews.count})</span>
          </div>
        </div>
        <div className="summary-item">
          <div className="summary-label">{t('comparison.networkTypes', 'Network')}</div>
          <div className="summary-value network-types">
            {supportsNetworkType('nbn') && <span className="network-type nbn">NBN</span>}
            {supportsNetworkType('opticomm') && <span className="network-type opticomm">OptiComm</span>}
            {supportsNetworkType('redtrain') && <span className="network-type redtrain">Redtrain</span>}
            {supportsNetworkType('supa') && <span className="network-type supa">SUPA</span>}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="provider-card-details">
          <div className="details-section">
            <h4>{t('comparison.supportedLanguages', 'Languages')}</h4>
            <div className="languages-grid">
              {['English', 'Chinese', 'Hindi', 'Spanish', 'Arabic', 'Vietnamese', 'Korean'].map(lang => (
                <div key={lang} className={`language-item ${supportsLanguage(lang) ? 'supported' : 'not-supported'}`}>
                  {supportsLanguage(lang) ? <FaCheck /> : <FaTimes />}
                  <span>{t(`filters.${lang.toLowerCase()}`, lang)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="details-section">
            <h4>{t('comparison.operationHours', 'Hours')}</h4>
            <div className="hours-grid">
              <div className="hours-item">
                <div className="hours-label">{t('filters.salesHours', 'Sales')}</div>
                <div className="hours-value">{provider.operationHours.sales}</div>
              </div>
              <div className="hours-item">
                <div className="hours-label">{t('filters.customerServiceHours', 'Customer Service')}</div>
                <div className="hours-value">{provider.operationHours.customerService}</div>
              </div>
              <div className="hours-item">
                <div className="hours-label">{t('filters.technicalSupportHours', 'Technical Support')}</div>
                <div className="hours-value">{provider.operationHours.technicalSupport}</div>
              </div>
            </div>
          </div>
          
          <div className="details-section">
            <h4>{t('comparison.supportChannels', 'Support')}</h4>
            <div className="support-grid">
              <div className={`support-item ${provider.supportChannels.phone ? 'supported' : 'not-supported'}`}>
                {provider.supportChannels.phone ? <FaCheck /> : <FaTimes />}
                <span>{t('filters.phone', 'Phone')}</span>
              </div>
              <div className={`support-item ${provider.supportChannels.liveChat ? 'supported' : 'not-supported'}`}>
                {provider.supportChannels.liveChat ? <FaCheck /> : <FaTimes />}
                <span>{t('filters.liveChat', 'Live Chat')}</span>
              </div>
              <div className={`support-item ${provider.supportChannels.email ? 'supported' : 'not-supported'}`}>
                {provider.supportChannels.email ? <FaCheck /> : <FaTimes />}
                <span>{t('filters.email', 'Email')}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="provider-card-footer">
        <button 
          className="expand-button" 
          onClick={toggleExpand}
        >
          {expanded ? (
            <>
              {t('comparison.hideDetails', 'Hide Details')} <FaChevronUp />
            </>
          ) : (
            <>
              {t('comparison.viewDetails', 'View Details')} <FaChevronDown />
            </>
          )}
        </button>
        
        <button 
          className={`select-button ${isSelected ? 'selected' : ''}`} 
          onClick={handleSelect}
        >
          {isSelected ? t('comparison.selected', 'Selected') : t('comparison.select', 'Compare')}
        </button>
      </div>
    </div>
  );
};

export default ProviderCard; 