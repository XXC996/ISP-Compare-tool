import { useTranslation } from 'react-i18next';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFacebook, faTwitter, faInstagram, faLinkedin 
} from '@fortawesome/free-brands-svg-icons';
import { 
  faEnvelope, faPhone, faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>CompareISP.com.au</h4>
            <p>Finding you the best internet and utility deals across Australia</p>
            <div className="social-icons">
              <a href="#"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Internet Plans</a></li>
              <li><a href="#">Business Internet</a></li>
              <li><a href="#">Price Comparison Tool</a></li>
              <li><a href="#">Electricity & Gas</a></li>
              <li><a href="#">About Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Help & Support</h4>
            <ul>
              <li><a href="#">Contact Us</a></li>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Glossary</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Us</h4>
            <address>
              <p>
                <FontAwesomeIcon icon={faEnvelope} /> 
                info@compareisp.com.au
              </p>
              <p>
                <FontAwesomeIcon icon={faPhone} /> 
                1300 123 456
              </p>
              <p>
                <FontAwesomeIcon icon={faMapMarkerAlt} /> 
                Sydney, Australia
              </p>
            </address>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CompareISP.com.au. All rights reserved. Disclaimer: This website is for informational purposes only. We are not affiliated with any service provider.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 