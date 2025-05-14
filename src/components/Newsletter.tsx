import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import '../styles/Newsletter.css';

const Newsletter: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const saveToLocalStorage = (data: any) => {
    try {
      // Get existing data from localStorage
      const existingData = localStorage.getItem('newsletterSubscribers');
      let subscribers = [];
      
      if (existingData) {
        subscribers = JSON.parse(existingData);
      }
      
      // Add timestamp to the data
      const subscriberData = {
        ...data,
        timestamp: new Date().toISOString()
      };
      
      // Add new subscriber
      subscribers.push(subscriberData);
      
      // Save back to localStorage
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
      
      // Log for development purposes
      console.log('Saved subscriber data:', subscriberData);
      console.log('All subscribers:', subscribers);
      
      return true;
    } catch (err) {
      console.error('Error saving to localStorage:', err);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate email
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Validate name fields
    if (!formData.firstName || !formData.lastName) {
      setError('Please enter your full name');
      return;
    }
    
    // Save data
    const saveSuccess = saveToLocalStorage(formData);
    
    if (saveSuccess) {
      // Show success message
      setIsSubmitted(true);
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: ''
        });
        setIsSubmitted(false);
      }, 5000);
    } else {
      setError('There was an error saving your information. Please try again.');
    }
  };

  return (
    <section className="newsletter">
      <div className="container">
        <h3>Stay Updated</h3>
        <p>Subscribe to receive notifications about price drops, new plans, and exclusive offers.</p>
        
        {isSubmitted ? (
          <div className="success-message">
            <p>Thank you, {formData.firstName}! You're now subscribed to our updates.</p>
          </div>
        ) : (
          <form className="newsletter-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input 
                  type="text" 
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number (Optional)</label>
                <input 
                  type="tel" 
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="privacy-notice">
              <p>By submitting this form, you agree to our privacy policy and consent to receive communications from us.</p>
            </div>
            
            <button type="submit" className="submit-button">
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default Newsletter; 