import { useTranslation } from 'react-i18next';
import React from 'react';
import { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('internet');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (e:any) => {
    setEmail(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    // In a real app, we would send this data to an API
    console.log('Newsletter subscription:', { email, category });
    
    // Show success message
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <h3>Stay Updated on the Best Deals</h3>
        <p>Subscribe to our newsletter to receive alerts when prices drop or new plans are released</p>
        
        {isSubmitted ? (
          <div className="success-message">
            <p>Thank you for subscribing! We'll send updates to your inbox.</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your email address" 
              value={email}
              onChange={handleEmailChange}
              required 
            />
            <select value={category} onChange={handleCategoryChange}>
              <option value="internet">Internet Plans</option>
              <option value="utilities">Utilities</option>
              <option value="both">Both</option>
            </select>
            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter; 