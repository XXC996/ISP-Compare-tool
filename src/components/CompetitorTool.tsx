import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';

const CompetitorTool: React.FC = () => {
  const [formData, setFormData] = useState({
    currentProvider: '',
    currentPlan: '',
    currentPrice: ''
  });
  
  const [showResults, setShowResults] = useState(false);
  const [competitorResults, setCompetitorResults] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompare = (e) => {
    e.preventDefault();
    
    const { currentProvider, currentPlan, currentPrice } = formData;
    
    if (!currentProvider || !currentPlan || !currentPrice) {
      alert('Please fill in all fields to compare plans');
      return;
    }
    
    // Generate competitor results
    const priceNum = parseFloat(currentPrice);
    const results = generateCompetitorResults(currentProvider, currentPlan, priceNum);
    
    setCompetitorResults(results);
    setShowResults(true);
    
    // Scroll to results
    setTimeout(() => {
      const resultsElement = document.getElementById('competitor-results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const generateCompetitorResults = (provider, planType, price) => {
    // Mock data - in a real app this would come from an API or database
    const competitorPlans = [
      {
        id: 1,
        provider: 'Aussie Broadband',
        planName: `${planType} Unlimited`,
        price: (price * 0.9).toFixed(2),
        speed: getSpeedForPlan(planType),
        rating: 4.8,
        saving: (price * 0.1 * 12).toFixed(2),
        setupFee: 0
      },
      {
        id: 2,
        provider: 'Superloop',
        planName: `${planType} Unlimited`,
        price: (price * 0.85).toFixed(2),
        speed: getSpeedForPlan(planType),
        rating: 4.6,
        saving: (price * 0.15 * 12).toFixed(2),
        setupFee: 0
      },
      {
        id: 3,
        provider: 'Mate',
        planName: `${planType} Unlimited`,
        price: (price * 0.88).toFixed(2),
        speed: getSpeedForPlan(planType),
        rating: 4.5,
        saving: (price * 0.12 * 12).toFixed(2),
        setupFee: 0
      }
    ];
    
    // Filter out the current provider
    return competitorPlans.filter(plan => 
      plan.provider.toLowerCase() !== provider.toLowerCase()
    );
  };

  const getSpeedForPlan = (planType) => {
    switch(planType) {
      case 'nbn25': return 24;
      case 'nbn50': return 48;
      case 'nbn100': return 95;
      case 'nbn250': return 240;
      case '5g': return 100;
      case 'cable': return 50;
      case 'adsl': return 20;
      default: return 50;
    }
  };

  const renderCompetitorResults = () => {
    if (!showResults || competitorResults.length === 0) {
      return null;
    }
    
    return (
      <div className="competitor-results-container">
        <h4>Better deals than your current {formData.currentProvider} {formData.currentPlan} plan (${formData.currentPrice}/month)</h4>
        <div className="competitor-results-grid">
          {competitorResults.map(plan => (
            <div className="competitor-card" key={plan.id}>
              <h5>{plan.provider}</h5>
              <div className="plan-name">{plan.planName}</div>
              <div className="competitor-price">${plan.price}<span>/month</span></div>
              <div className="competitor-saving">Save ${plan.saving} over 12 months</div>
              <div className="competitor-details">
                <div><FontAwesomeIcon icon={faWifi} /> Typical Evening Speed: <strong>{plan.speed} Mbps</strong></div>
                <div>Setup Fee: <strong>${plan.setupFee}</strong></div>
                <div>Customer Rating: <strong>{plan.rating}/5</strong></div>
              </div>
              <a href="#" className="cta-button">View Deal</a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="competitor-tool">
      <div className="container">
        <h3>Compare Your Current Plan</h3>
        <p>See how much you could save by switching providers</p>
        <div className="competitor-form">
          <div className="form-group">
            <label htmlFor="current-provider">Current Provider</label>
            <select 
              id="current-provider" 
              name="currentProvider"
              value={formData.currentProvider}
              onChange={handleInputChange}
            >
              <option value="">Select your provider</option>
              <option value="telstra">Telstra</option>
              <option value="optus">Optus</option>
              <option value="tpg">TPG</option>
              <option value="aussie">Aussie Broadband</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="current-plan">Current Plan Type</label>
            <select 
              id="current-plan"
              name="currentPlan"
              value={formData.currentPlan}
              onChange={handleInputChange}
            >
              <option value="">Select plan type</option>
              <option value="nbn25">NBN 25</option>
              <option value="nbn50">NBN 50</option>
              <option value="nbn100">NBN 100</option>
              <option value="nbn250">NBN 250</option>
              <option value="cable">Cable</option>
              <option value="adsl">ADSL</option>
              <option value="5g">5G Home Internet</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="current-price">Current Monthly Price</label>
            <input 
              type="number" 
              id="current-price" 
              name="currentPrice"
              placeholder="$" 
              value={formData.currentPrice}
              onChange={handleInputChange}
            />
          </div>
          <button id="compare-button" onClick={handleCompare}>Find Better Deals</button>
        </div>
        <div id="competitor-results" className={showResults ? '' : 'hidden'}>
          {renderCompetitorResults()}
        </div>
      </div>
    </section>
  );
};

export default CompetitorTool; 