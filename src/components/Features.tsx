import { useTranslation } from 'react-i18next';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faLanguage, faSearchDollar } from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Features: React.FC = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      id: 1,
      icon: faRobot,
      titleKey: 'features.aiRecommendations',
      descriptionKey: 'features.aiDescription'
    },
    {
      id: 2,
      icon: faLanguage,
      titleKey: 'features.multilanguage',
      descriptionKey: 'features.multilanguageDescription'
    },
    {
      id: 3,
      icon: faSearchDollar,
      titleKey: 'features.priceUpdates',
      descriptionKey: 'features.priceUpdatesDescription'
    },
    {
      id: 4,
      icon: faStar,
      titleKey: 'features.reviews',
      descriptionKey: 'features.reviewsDescription'
    }
  ];

  return (
    <section className="features" id="features-section">
      <div className="container">
        <h3>{t('features.title')}</h3>
        <div className="features-grid">
          {features.map(feature => (
            <div className="feature-box" key={feature.id}>
              <FontAwesomeIcon icon={feature.icon} />
              <h4>{t(feature.titleKey)}</h4>
              <p>{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 