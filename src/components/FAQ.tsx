import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState(0);
  const [activeIndexList, setActiveIndexList] = useState([0, 1]);
  
  const faqItems = [
    {
      id: 1,
      questionKey: 'faq.comparePlans',
      answerKey: 'faq.comparePlansAnswer'
    },
    {
      id: 2,
      questionKey: 'faq.speedTiers',
      answerKey: 'faq.speedTiersAnswer'
    },
    {
      id: 3,
      questionKey: 'faq.priceUpdate',
      answerKey: 'faq.priceUpdateAnswer'
    },
    {
      id: 4,
      questionKey: 'faq.switchProviders',
      answerKey: 'faq.switchProvidersAnswer'
    }
  ];
  
  const toggleAccordion = (index) => {
    if (activeItem === index) return;
    setActiveItem(index);
    if (activeIndexList.includes(index)) {
      setActiveIndexList(activeIndexList.filter(i => i !== index));
    } else {
      setActiveIndexList(activeIndexList.splice(0, 1, index));
    }
  };

  return (
    <section className="faq">
      <div className="container">
        <h3>{t('faq.title')}</h3>
        <div className="accordion">
          {faqItems.map((item, index) => (
            <div 
              key={item.id} 
              className={`accordion-item ${activeItem === index ? 'active' : ''}`}
            >
              <div 
                className="accordion-header"
                onClick={() => toggleAccordion(index)}
              >
                {t(item.questionKey)}
              </div>
              <div className="accordion-content">
                <p>{t(item.answerKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 