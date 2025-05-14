import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const FAQ: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState(0);
  const [activeIndexList, setActiveIndexList] = useState([0, 1]);
  
  const faqItems = [
    {
      id: 1,
      question: "How do we compare internet plans?",
      answer: "We compare plans based on monthly price, contract length, setup fees, typical evening speeds, and customer reviews. Our algorithm calculates the best value plans by analyzing the cost per Mbps and total cost over the contract period."
    },
    {
      id: 2,
      question: "What's the difference between NBN speed tiers?",
      answer: "NBN plans are categorized by maximum download speeds: NBN 25 (25 Mbps), NBN 50 (50 Mbps), NBN 100 (100 Mbps), and NBN 250 (250 Mbps). Higher tiers offer faster speeds but cost more. For average households, NBN 50 is sufficient for HD streaming and multiple devices."
    },
    {
      id: 3,
      question: "How often are prices updated?",
      answer: "We update our pricing information regularly to ensure accuracy. Most major providers are updated daily, while smaller providers may be updated weekly. Each comparison listing shows when the price was last verified."
    },
    {
      id: 4,
      question: "Can I switch providers if I'm in a contract?",
      answer: "Yes, but you may need to pay an early termination fee. Our comparison tool can help you calculate whether the savings from switching outweigh the termination fees. Some new providers also offer to cover switching costs as part of their sign-up incentives."
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
        <h3>Frequently Asked Questions</h3>
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
                {item.question}
              </div>
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ; 