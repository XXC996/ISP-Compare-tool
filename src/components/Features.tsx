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
      title: "AI-Powered Recommendations",
      description: "Get personalized recommendations based on your usage patterns and location"
    },
    {
      id: 2,
      icon: faLanguage,
      title: "Multi-language Support",
      description: "Compare plans in your preferred language with our translation service"
    },
    {
      id: 3,
      icon: faSearchDollar,
      title: "Real-time Price Updates",
      description: "We regularly update prices and promotions from all major providers"
    },
    {
      id: 4,
      icon: faStar,
      title: "Verified Reviews",
      description: "Read real customer reviews from multiple sources before making a decision"
    }
  ];

  return (
    <section className="features">
      <div className="container">
        <h3>Why Choose Our Comparison Service?</h3>
        <div className="features-grid">
          {features.map(feature => (
            <div className="feature-box" key={feature.id}>
              <FontAwesomeIcon icon={feature.icon} />
              <h4>{feature.title}</h4>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 