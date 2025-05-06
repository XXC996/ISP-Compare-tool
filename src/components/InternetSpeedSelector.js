import React, { useState } from 'react';
import '../styles/InternetSpeedSelector.css';
import { FaGamepad, FaVideo, FaLaptop, FaDesktop, FaTablet, FaMobileAlt, FaCloud, FaMicrophone, FaTv, FaUsers, FaPaperPlane } from 'react-icons/fa';

// 添加一个实际发送邮件的函数
const sendEmailToBackend = async (email, data) => {
  // 这里应该是实际的API调用
  // 例如使用fetch或axios发送POST请求到后端
  console.log('Sending email to:', email, 'with data:', data);
  
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 在实际应用中，这里应该返回服务器响应
  return {
    success: true,
    message: 'Email queued for delivery'
  };
  
  // 真实实现示例:
  /*
  try {
    const response = await fetch('/api/send-recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        data
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
  */
};

const InternetSpeedSelector = () => {
  const [users, setUsers] = useState(2);
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [postcode, setPostcode] = useState('');
  const [postcodeVerified, setPostcodeVerified] = useState(false);
  const [serviceTypes, setServiceTypes] = useState({
    fttp: false,
    fttc: false,
    fttn: false,
    hfc: false
  });
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailError, setEmailError] = useState('');

  const priorities = [
    { id: 'reliability', name: 'Reliability' },
    { id: 'speed', name: 'Fast Speeds' },
    { id: 'price', name: 'Affordable Price' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'streaming', name: 'Streaming' }
  ];

  const activities = [
    { id: 'browsing', name: 'Web Browsing', icon: <FaLaptop /> },
    { id: 'email', name: 'Email', icon: <FaLaptop /> },
    { id: 'streaming_sd', name: 'SD Streaming', icon: <FaVideo /> },
    { id: 'streaming_hd', name: 'HD Streaming', icon: <FaVideo /> },
    { id: '4k_streaming', name: '4K Streaming', icon: <FaTv /> },
    { id: 'gaming', name: 'Online Gaming', icon: <FaGamepad /> },
    { id: 'video_calls', name: 'Video Calls', icon: <FaMicrophone /> },
    { id: 'wfh', name: 'Work from Home', icon: <FaDesktop /> },
    { id: 'downloads', name: 'Large Downloads', icon: <FaCloud /> },
    { id: 'smart_home', name: 'Smart Home', icon: <FaMobileAlt /> },
    { id: 'multiple_devices', name: 'Multiple Devices', icon: <FaTablet /> }
  ];

  const toggleActivity = (activityId) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  const verifyPostcode = () => {
    // In a real application, this would make an API call to verify postcode
    // For demo purposes, we'll simulate a successful verification
    if (postcode.length === 4 && /^\d+$/.test(postcode)) {
      setPostcodeVerified(true);
      
      // Simulate different service types available based on postcode
      // In real app, this would come from the API
      const lastDigit = parseInt(postcode.charAt(3));
      setServiceTypes({
        fttp: lastDigit >= 7,
        fttc: lastDigit >= 5,
        fttn: true,
        hfc: lastDigit >= 3
      });
    } else {
      setPostcodeVerified(false);
      setServiceTypes({
        fttp: false,
        fttc: false,
        fttn: false,
        hfc: false
      });
    }
  };

  const handleSubmitEmail = async () => {
    // 验证邮箱格式
    if (!userEmail || !validateEmail(userEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    if (!consentGiven) {
      setEmailError('Please consent to receive recommendations');
      return;
    }

    setEmailSubmitting(true);
    setEmailError('');
    
    try {
      // 准备发送给用户的数据
      const userData = {
        priority: selectedPriority,
        activities: selectedActivities,
        users: users,
        postcode: postcode,
        serviceTypes: postcodeVerified ? serviceTypes : null
      };
      
      // 调用发送邮件的函数
      const result = await sendEmailToBackend(userEmail, userData);
      
      if (result.success) {
        setEmailSubmitted(true);
        setEmailSubmitting(false);
        
        // 如果用户有推荐结果，则在提交邮件后显示结果
        if (selectedPriority && selectedActivities.length > 0) {
          calculateRecommendation();
        }
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      setEmailSubmitting(false);
      setEmailError('Failed to submit your email. Please try again later.');
      console.error('Error submitting email:', error);
    }
  };

  const validateEmail = (email) => {
    // 基本的邮箱格式验证
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const calculateRecommendation = () => {
    // Enhanced recommendation algorithm with priority consideration
    let baseSpeed = 25; // Starting point - NBN 25
    
    // Adjust for number of users
    if (users > 3) {
      baseSpeed = 50;
    }
    if (users > 5) {
      baseSpeed = 100;
    }
    
    // Adjust for activities
    if (selectedActivities.includes('4k_streaming')) {
      baseSpeed = Math.max(baseSpeed, 50);
    }
    
    if (selectedActivities.includes('gaming') && selectedPriority === 'gaming') {
      baseSpeed = Math.max(baseSpeed, 100);
    }
    
    if (selectedActivities.includes('multiple_devices') && users > 2) {
      baseSpeed = Math.max(baseSpeed, 100);
    }
    
    // If many high-bandwidth activities are selected
    const highBandwidthActivities = ['4k_streaming', 'gaming', 'downloads', 'multiple_devices'];
    const selectedHighBandwidth = selectedActivities.filter(id => highBandwidthActivities.includes(id));
    
    if (selectedHighBandwidth.length >= 2 && users >= 3) {
      baseSpeed = Math.max(baseSpeed, 100);
    }
    
    // Enhanced priority-based adjustments
    if (selectedPriority === 'speed') {
      baseSpeed = Math.max(baseSpeed, 100);
      
      // If FTTP is available and speed is priority, recommend higher tier
      if (serviceTypes.fttp) {
        baseSpeed = Math.max(baseSpeed, 250);
      }
    }
    
    if (selectedPriority === 'reliability') {
      // For reliability, prefer at least NBN 50 for stable connection
      baseSpeed = Math.max(baseSpeed, 50);
      
      // If activities need stability, go higher
      if (selectedActivities.includes('video_calls') || selectedActivities.includes('wfh')) {
        baseSpeed = Math.max(baseSpeed, 100);
      }
    }
    
    // Special case for price priority - try to keep costs lower
    if (selectedPriority === 'price') {
      if (baseSpeed === 100 && !selectedActivities.includes('4k_streaming') && 
          !selectedActivities.includes('gaming') && selectedHighBandwidth.length < 2) {
        baseSpeed = 50;
      }
      
      if (baseSpeed === 250 && !selectedActivities.includes('4k_streaming')) {
        baseSpeed = 100;
      }
    }
    
    // For streaming priority, ensure enough bandwidth
    if (selectedPriority === 'streaming') {
      if (selectedActivities.includes('4k_streaming')) {
        baseSpeed = Math.max(baseSpeed, 100);
      } else if (selectedActivities.includes('streaming_hd')) {
        baseSpeed = Math.max(baseSpeed, 50);
      }
    }
    
    // Generate the full recommendation
    const result = {
      speed: baseSpeed,
      nbnType: baseSpeed <= 25 ? 'NBN 25' : baseSpeed <= 50 ? 'NBN 50' : baseSpeed <= 100 ? 'NBN 100' : baseSpeed <= 250 ? 'NBN 250' : 'NBN 1000',
      activities: selectedActivities.map(id => {
        const activity = activities.find(a => a.id === id);
        const performance = baseSpeed >= 100 ? 'Excellent' : baseSpeed >= 50 ? 'Good' : 'Adequate';
        return {
          ...activity,
          performance
        };
      }),
      providers: [
        { name: 'Telstra', price: `$${85 + (baseSpeed === 100 ? 15 : baseSpeed === 50 ? 5 : baseSpeed === 250 ? 30 : baseSpeed >= 500 ? 45 : 0)}/mo` },
        { name: 'TPG', price: `$${75 + (baseSpeed === 100 ? 10 : baseSpeed === 50 ? 5 : baseSpeed === 250 ? 25 : baseSpeed >= 500 ? 35 : 0)}/mo` },
        { name: 'Aussie Broadband', price: `$${79 + (baseSpeed === 100 ? 10 : baseSpeed === 50 ? 5 : baseSpeed === 250 ? 20 : baseSpeed >= 500 ? 30 : 0)}/mo` }
      ],
      serviceTypes: postcodeVerified ? serviceTypes : null,
      userEmail: userEmail || null
    };
    
    setRecommendation(result);
    setShowResults(true);
  };

  const resetForm = () => {
    setShowResults(false);
    setRecommendation(null);
    setEmailSubmitted(false);
  };
  
  const handleConsentChange = (e) => {
    setConsentGiven(e.target.checked);
    if (e.target.checked) {
      setEmailError('');
    }
  };

  return (
    <div className="speed-selector">
      <h2 className="section-title">Internet Speed Selector</h2>
      <p className="section-description">
        Tell us about your internet usage, and we'll recommend the perfect NBN speed tier for your household.
      </p>

      {!showResults ? (
        <>
          <div className="selector-container">
            {/* Postcode verification section */}
            <div className="postcode-section">
              <h4>Check Availability</h4>
              <div className="form-group">
                <label>Enter your postcode to check service availability:</label>
                <div className="postcode-input">
                  <input 
                    type="text" 
                    value={postcode} 
                    onChange={(e) => setPostcode(e.target.value)} 
                    placeholder="e.g., 2000" 
                    maxLength="4"
                  />
                  <button onClick={verifyPostcode}>Check</button>
                </div>
                
                {postcodeVerified && (
                  <div className="service-types">
                    <h5>Available connection types:</h5>
                    <ul>
                      <li className={serviceTypes.fttp ? 'available' : 'unavailable'}>
                        FTTP (Fiber to the Premises) {serviceTypes.fttp ? '✓' : '✗'}
                      </li>
                      <li className={serviceTypes.fttc ? 'available' : 'unavailable'}>
                        FTTC (Fiber to the Curb) {serviceTypes.fttc ? '✓' : '✗'}
                      </li>
                      <li className={serviceTypes.fttn ? 'available' : 'unavailable'}>
                        FTTN (Fiber to the Node) {serviceTypes.fttn ? '✓' : '✗'}
                      </li>
                      <li className={serviceTypes.hfc ? 'available' : 'unavailable'}>
                        HFC (Hybrid Fiber Coaxial) {serviceTypes.hfc ? '✓' : '✗'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
            
            <div className="household-section">
              <h4>Household Size</h4>
              <div className="form-group">
                <label>How many people use the internet in your home?</label>
                <div className="users-slider">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={users} 
                    onChange={(e) => setUsers(parseInt(e.target.value))} 
                  />
                  <span className="users-value">{users}</span>
                </div>
              </div>
            </div>

            <div className="priorities-section">
              <h4>Your Priority</h4>
              <div className="priority-buttons">
                {priorities.map((priority) => (
                  <button
                    key={priority.id}
                    className={`priority-button ${selectedPriority === priority.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPriority(priority.id)}
                  >
                    {priority.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="activities-section">
              <h4>Internet Activities</h4>
              <p className="activities-help">Select all activities that apply to your household:</p>
              <div className="activities-grid">
                {activities.map((activity) => (
                  <button
                    key={activity.id}
                    className={`activity-button ${selectedActivities.includes(activity.id) ? 'selected' : ''}`}
                    onClick={() => toggleActivity(activity.id)}
                  >
                    <span className="activity-icon">{activity.icon}</span>
                    <span className="activity-name">{activity.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* User information collection (opt-in) */}
            <div className="user-info-section">
              <h4>Get Your Personalized Results</h4>
              <div className="form-group">
                <label>Email (optional):</label>
                <div className="email-input-container">
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => {
                      setUserEmail(e.target.value);
                      setEmailError('');
                    }} 
                    placeholder="Your email address"
                    className={emailError ? 'error' : ''}
                  />
                  <button 
                    onClick={handleSubmitEmail}
                    className="email-submit-button"
                    disabled={emailSubmitting || emailSubmitted}
                  >
                    {emailSubmitting ? 'Sending...' : emailSubmitted ? 'Sent' : <FaPaperPlane />}
                  </button>
                </div>
                {emailError && <div className="email-error">{emailError}</div>}
                {emailSubmitted && (
                  <div className="email-success">
                    <strong>Demo Mode:</strong> In a real application, recommendations would be sent to your email. 
                    Currently this is a demo version without actual email delivery.
                  </div>
                )}
                <div className="consent-checkbox">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={consentGiven}
                    onChange={handleConsentChange}
                  />
                  <label htmlFor="consent">
                    I consent to receive personalized recommendations and offers. See our <a href="#">Privacy Policy</a>.
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="action-section">
            <button 
              className={`action-button ${(!selectedPriority || selectedActivities.length === 0) ? 'disabled' : ''}`} 
              onClick={calculateRecommendation}
              disabled={!selectedPriority || selectedActivities.length === 0}
            >
              Get Recommendation
            </button>
          </div>
        </>
      ) : (
        <div className="results-container">
          <h3 className="results-title">Your Recommended Internet Plan</h3>
          
          {userEmail && emailSubmitted && (
            <div className="email-notification">
              <strong>Demo Mode:</strong> In a real application, these results would be sent to: {userEmail}.
              <div className="small-note">
                To implement actual email delivery, a backend API and email service would be needed.
              </div>
            </div>
          )}
          
          <div className="recommendation">
            <span className="speed-name">{recommendation.nbnType}</span>
            <span className="nbn-type">{recommendation.speed} Mbps</span>
          </div>
          
          {recommendation.serviceTypes && (
            <div className="availability-info">
              <h4>Connection Type Availability</h4>
              <ul className="connection-types">
                {Object.entries(recommendation.serviceTypes).map(([type, available]) => (
                  <li key={type} className={available ? 'available' : 'unavailable'}>
                    {type.toUpperCase()}: {available ? 'Available' : 'Unavailable'}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="recommendation-reason">
            <h4>Why We Recommend This</h4>
            <p>
              Based on your {selectedPriority} priority and {selectedActivities.length} selected activities,
              we've determined that {recommendation.nbnType} is the best fit for your {users}-person household.
            </p>
          </div>
          
          <div className="activities-details">
            {recommendation.activities.map((activity) => (
              <div className="activity-detail" key={activity.id}>
                <span className="activity-icon">{activity.icon}</span>
                <div className="activity-info">
                  <div className="activity-name">{activity.name}</div>
                  <div className="activity-performance">Performance: {activity.performance}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="price-comparison">
            <h4 className="comparison-title">Monthly Price Comparison</h4>
            <div className="providers">
              {recommendation.providers.map((provider, index) => (
                <div className="provider" key={index}>
                  <div className="provider-name">{provider.name}</div>
                  <div className="provider-price">{provider.price}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="back-button-container">
            <button className="back-button" onClick={resetForm}>
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternetSpeedSelector; 