import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const Hero: React.FC = () => {
  const { t } = useTranslation();
  const [postcode, setPostcode] = useState('');
  
  const handlePostcodeChange = (e) => {
    setPostcode(e.target.value);
  };
  
  const handleCheckAvailability = () => {
    if (postcode && postcode.length === 4 && !isNaN(Number(postcode))) {
      // Create and dispatch a custom event
      const event = new CustomEvent('search:postcode', { 
        detail: { postcode } 
      });
      window.dispatchEvent(event);
      
      // Show short notification
      const notification = document.createElement('div');
      notification.className = 'search-notification';
      notification.textContent = `${t('hero.checkingAvailability', 'Checking availability in')} ${postcode}`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 500);
      }, 2000);
      
      // Scroll to results section
      document.querySelector('.comparison').scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(t('hero.invalidPostcode', 'Please enter a valid 4-digit postcode'));
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCheckAvailability();
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <h2>{t('hero.title', 'Find The Best Internet Provider For Your Home')}</h2>
        <p>{t('hero.subtitle', 'Compare internet plans from Australia\'s leading providers')}</p>
        <div className="search-box">
          <input 
            type="text" 
            placeholder={t('hero.postcodeInput', 'Enter your postcode')}
            value={postcode}
            onChange={handlePostcodeChange}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleCheckAvailability}>
            {t('hero.cta', 'Check Availability')}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero; 