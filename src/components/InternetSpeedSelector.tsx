import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import '../styles/InternetSpeedSelector.css';

// EmailJS配置信息
const EMAIL_SERVICE_ID = 'service_dmfhkaf'; // 已更新为提供的Service ID
const EMAIL_TEMPLATE_ID = 'template_deksswe'; // 已更新为新提供的模板ID
const EMAIL_PUBLIC_KEY = 'suKHT-g0o2Dgos4zd'; // 已更新为提供的Public Key

// Remove export from here
function PostcodeAvailabilityChecker() {
  const { t } = useTranslation();
  const [postcode, setPostcode] = useState('');
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  
  const handlePostcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.length === 4) {
      setAvailabilityChecked(true);
    }
  };
  
  return (
    <section className="postcode-checker-section" id="postcode-checker-section">
      <div className="container">
        <h3 className="section-title">{t('availability.title', 'Check Service Availability')}</h3>
        <p className="section-description">
          {t('availability.description', 'Enter your postcode to check which services are available at your location.')}
        </p>
        
        <div className="postcode-form">
          <form onSubmit={handlePostcodeSubmit}>
            <div className="postcode-input">
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.replace(/[^0-9]/g, '').substring(0, 4))}
                placeholder={t('availability.postcodePrompt', 'Enter your postcode')}
                aria-label={t('availability.postcodePrompt', 'Enter your postcode')}
              />
              <button 
                type="submit"
                disabled={postcode.length !== 4}
              >
                {t('availability.checkButton', 'Check')}
              </button>
            </div>
          </form>
          
          {availabilityChecked && (
            <div className="service-types">
              <h5>{t('availability.servicesAvailable', 'Services available at')}: {postcode}</h5>
              <ul>
                <li className="available">NBN Fibre to the Premises (FTTP)</li>
                <li className="available">NBN Fibre to the Curb (FTTC)</li>
                <li className="available">NBN Hybrid Fibre Coaxial (HFC)</li>
                <li className="unavailable">5G Fixed Wireless</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function InternetSpeedSelector() {
  const { t } = useTranslation();
  const [selectedPriority, setSelectedPriority] = useState('speed');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [users, setUsers] = useState<number>(2);
  const [simultaneousUsers, setSimultaneousUsers] = useState<number>(1);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const priorities = [
    { id: 'speed', name: t('speedSelector.speedPriority', 'Speed Priority') },
    { id: 'price', name: t('speedSelector.pricePriority', 'Price Priority') },
    { id: 'balance', name: t('speedSelector.balancePriority', 'Balance Performance & Price') }
  ];

  const activities = [
    { id: 'netflix', name: t('speedSelector.netflix', 'Netflix/Disney+ Streaming'), icon: '📺' },
    { id: 'zoom', name: t('speedSelector.zoom', 'Zoom/Teams Video Calls'), icon: '🎥' },
    { id: 'gaming', name: t('speedSelector.gaming', 'Online Gaming (e.g. Fortnite)'), icon: '🎮' },
    { id: 'downloads', name: t('speedSelector.downloads', 'Large File Downloads (1GB+)'), icon: '📁' },
    { id: 'multiple', name: t('speedSelector.multiple', 'Multiple Devices Online (3+)'), icon: '📱' },
    { id: 'kids', name: t('speedSelector.kids', 'Kids Streaming'), icon: '👶' }
  ];

  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };

  // Handle next step transition
  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Show results at the end
      setResultsVisible(true);
    }
  };

  // Handle previous step transition
  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle restart from results
  const restartWizard = () => {
    setResultsVisible(false);
    setCurrentStep(1);
  };

  // Update recommended speed when user or activity count changes
  useEffect(() => {
    // Auto-select "multiple" if there are more than 2 simultaneous users
    if (simultaneousUsers >= 3 && !selectedActivities.includes('multiple')) {
      if (!selectedActivities.includes('multiple')) {
        setSelectedActivities([...selectedActivities, 'multiple']);
      }
    }
  }, [simultaneousUsers]);

  const getRecommendedSpeed = () => {
    // Logic to determine minimum recommended speed based on selected activities and users
    if (selectedActivities.length === 0) return null;
    
    let recommendedSpeed = '25Mbps';
    
    // Base recommendation on activities
    if (selectedActivities.includes('gaming') || 
        selectedActivities.includes('multiple') ||
        (selectedActivities.includes('netflix') && selectedActivities.includes('zoom'))) {
      recommendedSpeed = '100Mbps';
    }
    
    if (selectedActivities.length > 3 || 
        (selectedActivities.includes('gaming') && selectedActivities.includes('multiple'))) {
      recommendedSpeed = '250Mbps';
    }
    
    if (selectedActivities.length > 4) {
      recommendedSpeed = '1000Mbps';
    }
    
    // Adjust based on number of simultaneous users
    if (simultaneousUsers >= 3 && recommendedSpeed === '25Mbps') {
      recommendedSpeed = '50Mbps';
    }
    
    if (simultaneousUsers >= 4 && recommendedSpeed === '50Mbps') {
      recommendedSpeed = '100Mbps';
    }
    
    if (simultaneousUsers >= 6 && recommendedSpeed === '100Mbps') {
      recommendedSpeed = '250Mbps';
    }
    
    if (simultaneousUsers >= 8 && recommendedSpeed === '250Mbps') {
      recommendedSpeed = '1000Mbps';
    }
    
    // Adjust based on priority (only if price is priority and current speed is high)
    if (selectedPriority === 'price') {
      if (recommendedSpeed === '1000Mbps' && selectedActivities.length < 5) {
        recommendedSpeed = '250Mbps';
      } else if (recommendedSpeed === '250Mbps' && simultaneousUsers < 5) {
        recommendedSpeed = '100Mbps';
      }
    } else if (selectedPriority === 'speed') {
      // Boost recommendation for speed priority
      if (recommendedSpeed === '25Mbps') {
        recommendedSpeed = '50Mbps';
      } else if (recommendedSpeed === '50Mbps') {
        recommendedSpeed = '100Mbps';
      }
    }
    
    return recommendedSpeed;
  };
  
  const getRelevantSpeedInfo = () => {
    const speed = getRecommendedSpeed();
    if (!speed) return null;
    
    const speedInfo = {
      '25Mbps': {
        name: '25Mbps (Basic)',
        netflix: t('speedSelector.netflix25', '1 screen'),
        zoom: t('speedSelector.zoom25', '1 call'),
        gaming: t('speedSelector.gaming25', 'Risk of lag'),
        downloads: t('speedSelector.downloads25', 'Slow (~5-7 mins)'),
        multiple: t('speedSelector.multiple25', 'Struggles'),
        kids: t('speedSelector.kids25', 'Lag likely')
      },
      '50Mbps': {
        name: '50Mbps (Everyday)',
        netflix: t('speedSelector.netflix50', '2-3 screens'),
        zoom: t('speedSelector.zoom50', '2-3 calls'),
        gaming: t('speedSelector.gaming50', 'Solo play'),
        downloads: t('speedSelector.downloads50', 'Moderate (~3-5 mins)'),
        multiple: t('speedSelector.multiple50', 'Light use only'),
        kids: t('speedSelector.kids50', 'Okay with limits')
      },
      '100Mbps': {
        name: '100Mbps (Family Favorite)',
        netflix: t('speedSelector.netflix100', '4K on 2-3 screens'),
        zoom: t('speedSelector.zoom100', 'Group calls + multitasking'),
        gaming: t('speedSelector.gaming100', 'Multi-player & downloads'),
        downloads: t('speedSelector.downloads100', 'Fast (~1-2 mins)'),
        multiple: t('speedSelector.multiple100', 'Handles 5+ devices'),
        kids: t('speedSelector.kids100', 'Smooth for both')
      },
      '250Mbps': {
        name: '250Mbps (Power User)',
        netflix: t('speedSelector.netflix250', '4K across household'),
        zoom: t('speedSelector.zoom250', '5+ calls at once'),
        gaming: t('speedSelector.gaming250', 'Fast downloads + zero lag'),
        downloads: t('speedSelector.downloads250', 'Very fast (<1 min)'),
        multiple: t('speedSelector.multiple250', 'Handles 10+ devices'),
        kids: t('speedSelector.kids250', 'Zero interruption')
      },
      '1000Mbps': {
        name: '1000Mbps (Elite Fibre)',
        netflix: t('speedSelector.netflix1000', 'All devices, no buffering'),
        zoom: t('speedSelector.zoom1000', 'Flawless, zero lag'),
        gaming: t('speedSelector.gaming1000', 'Pro-level performance'),
        downloads: t('speedSelector.downloads1000', 'Instant-like (~seconds)'),
        multiple: t('speedSelector.multiple1000', 'Everything, all at once'),
        kids: t('speedSelector.kids1000', 'Peak performance always')
      }
    };
    
    return {
      recommendation: speed,
      details: speedInfo[speed]
    };
  };

  // Get NBN type based on recommended speed
  const getNBNType = (speed: string) => {
    switch(speed) {
      case '25Mbps':
        return 'NBN 25';
      case '50Mbps':
        return 'NBN 50';
      case '100Mbps':
        return 'NBN 100';
      case '250Mbps':
        return 'NBN 250';
      case '1000Mbps':
        return 'NBN 1000';
      default:
        return 'NBN 50';
    }
  };

  const getProviderPrices = (speed: string) => {
    const basePrice = {
      superloop: {
        '25Mbps': 75,
        '50Mbps': 85,
        '100Mbps': 95,
        '250Mbps': 115,
        '1000Mbps': 129
      },
      occom: {
        '25Mbps': 79,
        '50Mbps': 89,
        '100Mbps': 99,
        '250Mbps': 119,
        '1000Mbps': 139
      }
    };
    
    // Apply discount if price is priority
    const discountMultiplier = selectedPriority === 'price' ? 0.9 : 1;
    
    return {
      superloop: Math.round(basePrice.superloop[speed] * discountMultiplier),
      occom: Math.round(basePrice.occom[speed] * discountMultiplier)
    };
  };

  // Determine if user can proceed to next step
  const canProceedToNextStep = () => {
    switch (currentStep) {
      case 1: // Household section - Always valid
        return true;
      case 2: // Priority section - Always valid
        return true;
      case 3: // Activities section
        return selectedActivities.length > 0;
      default:
        return false;
    }
  };

  // Determine back button text based on current step
  const getBackButtonText = () => {
    switch (currentStep) {
      case 1:
        return null; // No back button on first step
      case 2:
      case 3:
        return t('speedSelector.backStep', 'Previous Step');
      default:
        return t('speedSelector.backStep', 'Previous Step');
    }
  };

  // Determine next button text based on current step
  const getNextButtonText = () => {
    switch (currentStep) {
      case 1:
      case 2:
        return t('speedSelector.nextStep', 'Next Step');
      case 3:
        return t('speedSelector.seeResults', 'See My Results');
      default:
        return t('speedSelector.nextStep', 'Next Step');
    }
  };

  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email) {
      setEmailError(t('speedSelector.emailRequired', 'Email is required'));
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('speedSelector.invalidEmail', 'Please enter a valid email'));
      return;
    }
    
    // Clear any previous errors
    setEmailError('');
    setSendingEmail(true);
    
    // 准备发送的数据
    const recommendedSpeed = getRecommendedSpeed() || '50Mbps';
    const nbnType = getNBNType(recommendedSpeed);
    
    // 打印参数用于调试
    console.log('EmailJS配置信息:', {
      SERVICE_ID: EMAIL_SERVICE_ID,
      TEMPLATE_ID: EMAIL_TEMPLATE_ID,
      PUBLIC_KEY: EMAIL_PUBLIC_KEY.substring(0, 5) + '...' // 出于安全考虑只显示前几位
    });
    
    // 准备模板参数
    const templateParams = {
      to_email: email,
      user_name: email.split('@')[0], // 简单提取用户名
      recommended_speed: recommendedSpeed,
      nbn_type: nbnType,
      household_size: users,
      simultaneous_users: simultaneousUsers,
      priority: selectedPriority === 'speed' ? 'Speed' : selectedPriority === 'price' ? 'Price' : 'Balance',
      activities: selectedActivities.join(', '),
      superloop_price: getProviderPrices(recommendedSpeed).superloop,
      occom_price: getProviderPrices(recommendedSpeed).occom
    };
    
    console.log('尝试发送邮件，使用以下参数:', templateParams);
    
    try {
      // 使用包装函数发送邮件
      const sendResult = await sendEmailWithEmailJS(templateParams);
      
      if (sendResult.success) {
        console.log('邮件发送成功!', sendResult.result);
        handleEmailSuccess();
      } else {
        throw sendResult.error || new Error('Failed to send email');
      }
    } catch (error) {
      console.error('邮件发送失败:', error);
      
      // 显示具体错误消息给用户
      let errorMsg = 'Failed to send email. Please try again later.';
      
      if (error.text) {
        errorMsg = `Error: ${error.text}`;
      } else if (error.message) {
        errorMsg = `Error: ${error.message}`;
      }
      
      setEmailError(errorMsg);
      setSendingEmail(false);
    }
  };
  
  // 处理邮件发送成功
  const handleEmailSuccess = () => {
    setEmailSuccess(true);
    setSendingEmail(false);
    
    // 5秒后重置成功状态
    setTimeout(() => {
      setEmailSuccess(false);
    }, 5000);
  };
  
  // 处理邮件发送失败
  const handleEmailError = () => {
    setEmailError(t('speedSelector.emailFailed', 'Failed to send email. Please try again later.'));
    setSendingEmail(false);
  };

  // Render the current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="wizard-step household-step">
            <h4>
              <span className="step-number">1</span>
              {t('speedSelector.householdTitle', 'Your Household')}
            </h4>
            
            <div className="form-group">
              <label htmlFor="users">{t('calculator.totalUsers', 'How many people in your household?')}</label>
              <div className="users-slider">
                <input 
                  type="range" 
                  id="users" 
                  min="1" 
                  max="10" 
                  value={users} 
                  onChange={(e) => setUsers(parseInt(e.target.value))} 
                />
                <span className="users-value">{users}</span>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="simultaneousUsers">
                {t('calculator.simultaneousUsers', 'Maximum users online simultaneously?')}
              </label>
              <div className="users-slider">
                <input 
                  type="range" 
                  id="simultaneousUsers" 
                  min="1" 
                  max={users} 
                  value={simultaneousUsers} 
                  onChange={(e) => setSimultaneousUsers(parseInt(e.target.value))} 
                />
                <span className="users-value">{simultaneousUsers}</span>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="wizard-step priority-step">
            <h4>
              <span className="step-number">2</span>
              {t('speedSelector.priorityTitle', 'Your Priority')}
            </h4>
            <div className="priority-buttons">
              {priorities.map(priority => (
                <button
                  key={priority.id}
                  onClick={() => setSelectedPriority(priority.id)}
                  className={`priority-button ${selectedPriority === priority.id ? 'selected' : ''}`}
                >
                  {priority.name}
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="wizard-step activities-step">
            <h4>
              <span className="step-number">3</span>
              {t('speedSelector.activitiesTitle', 'Your Online Activities')}
            </h4>
            <p className="activities-help">{t('speedSelector.activitiesHelp', 'Select all that apply to your household:')}</p>
            
            <div className="activities-grid">
              {activities.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => handleActivityToggle(activity.id)}
                  className={`activity-button ${selectedActivities.includes(activity.id) ? 'selected' : ''}`}
                >
                  <span className="activity-icon">{activity.icon}</span>
                  <span className="activity-name">{activity.name}</span>
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // 直接初始化EmailJS
  emailjs.init(EMAIL_PUBLIC_KEY);

  // 创建一个包装函数，处理EmailJS发送
  const sendEmailWithEmailJS = async (templateParams) => {
    try {
      console.log('发送前重新初始化EmailJS...');
      emailjs.init(EMAIL_PUBLIC_KEY);
      
      // 添加发件人信息，减少被标记为垃圾邮件的可能性
      const enhancedParams = {
        ...templateParams,
        from_name: 'ISP Comparison Tool',  // 发件人名称
        reply_to: 'noreply@ispcomparison.com',  // 回复地址
        subject: 'Your Personalized NBN Speed Recommendation'  // 自定义邮件主题
      };
      
      console.log('尝试直接发送邮件...');
      const result = await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        enhancedParams,
        EMAIL_PUBLIC_KEY
      );
      
      console.log('直接发送成功:', result);
      return { success: true, result };
    } catch (error) {
      console.error('直接发送失败:', error);
      
      // 尝试第二种方法
      try {
        console.log('尝试使用另一种方法发送...');
        // 使用带有完整配置的发送方法
        const result = await emailjs.send(
          EMAIL_SERVICE_ID,
          EMAIL_TEMPLATE_ID,
          templateParams
        );
        console.log('第二种方法发送成功:', result);
        return { success: true, result };
      } catch (secondError) {
        console.error('第二种方法也失败:', secondError);
        return { success: false, error: secondError };
      }
    }
  };

  return (
    <section className="speed-selector" id="speed-selector">
      <div className="container">
        <h3 className="section-title">{t('speedSelector.title', 'Internet Speed Matcher')}</h3>
        <p className="section-description">
          {t('speedSelector.description', 'Tell us about your internet usage, and we\'ll recommend the perfect NBN speed tier for your household.')}
        </p>
        
        {!resultsVisible ? (
          <div className="wizard-container">
            <div className="wizard-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
              <div className="progress-steps">
                <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
                  <div className="step-indicator">1</div>
                  <span>{t('speedSelector.stepHousehold', 'Household')}</span>
                </div>
                <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
                  <div className="step-indicator">2</div>
                  <span>{t('speedSelector.stepPriority', 'Priority')}</span>
                </div>
                <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
                  <div className="step-indicator">3</div>
                  <span>{t('speedSelector.stepActivities', 'Activities')}</span>
                </div>
              </div>
            </div>
            
            {/* Current Step Content */}
            <div className="wizard-step-content">
              {renderStepContent()}
            </div>
            
            {/* Navigation Buttons */}
            <div className="wizard-navigation">
              {getBackButtonText() && (
                <button 
                  onClick={goToPreviousStep}
                  className="back-button wizard-back"
                >
                  {getBackButtonText()}
                </button>
              )}
              
              <button 
                onClick={goToNextStep}
                disabled={!canProceedToNextStep()}
                className={`next-button wizard-next ${!canProceedToNextStep() ? 'disabled' : ''}`}
              >
                {getNextButtonText()}
              </button>
            </div>
          </div>
        ) : (
          <div className="results-container">
            <h3 className="results-title">
              {t('speedSelector.resultsTitle', 'Your Recommended Internet Speed')}
            </h3>
            
            {getRelevantSpeedInfo() && (
              <>
                <div className="recommendation">
                  <span className="speed-name">
                    {getRelevantSpeedInfo()?.details.name}
                  </span>
                  <span className="nbn-type">
                    {getNBNType(getRelevantSpeedInfo()?.recommendation || '50Mbps')}
                  </span>
                </div>
                
                <div className="activities-details">
                  {selectedActivities.map(activityId => {
                    const activity = activities.find(a => a.id === activityId);
                    if (!activity || !getRelevantSpeedInfo()) return null;
                    return (
                      <div key={activityId} className="activity-detail">
                        <span className="activity-icon">{activity.icon}</span>
                        <div className="activity-info">
                          <p className="activity-name">{activity.name}</p>
                          <p className="activity-performance">
                            {getRelevantSpeedInfo()?.details[activityId]}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="price-comparison">
                  <p className="comparison-title">{t('speedSelector.priceComparison', 'Provider Price Comparison')}</p>
                  <div className="providers">
                    <div className="provider">
                      <p className="provider-name">Superloop</p>
                      <p className="provider-price">
                        ${getProviderPrices(getRelevantSpeedInfo()?.recommendation || '50Mbps').superloop}/mo
                      </p>
                    </div>
                    <div className="provider">
                      <p className="provider-name">Occom</p>
                      <p className="provider-price">
                        ${getProviderPrices(getRelevantSpeedInfo()?.recommendation || '50Mbps').occom}/mo
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="email-section">
                  <h4>{t('speedSelector.getPersonalizedEmail', 'Get Personalized Recommendations')}</h4>
                  <p>{t('speedSelector.emailDescription', 'Enter your email to receive personalized ISP recommendations based on your needs.')}</p>
                  
                  <form ref={formRef} onSubmit={handleEmailSubmit} className="email-form">
                    <div className="email-input-container">
                      <input
                        type="email"
                        name="user_email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t('speedSelector.emailPlaceholder', 'Your email address')}
                        className={emailError ? 'error' : ''}
                        disabled={sendingEmail || emailSuccess}
                      />
                      <button 
                        type="submit" 
                        className="email-submit-button"
                        disabled={sendingEmail || emailSuccess}
                      >
                        {sendingEmail ? t('speedSelector.sending', 'Sending...') : t('speedSelector.sendButton', 'Send')}
                      </button>
                    </div>
                    
                    {emailError && <p className="email-error">{emailError}</p>}
                    {emailSuccess && (
                      <p className="email-success">
                        {t('speedSelector.emailSuccess', 'Thanks! We\'ve sent your personalized recommendations to your email.')}
                        <span className="check-spam-note"> Please check your spam folder if you don't see it in your inbox.</span>
                      </p>
                    )}
                  </form>
                </div>
                
                <div className="results-action-buttons">
                  <button
                    onClick={restartWizard}
                    className="back-button"
                  >
                    {t('speedSelector.modifySelections', 'Modify My Selections')}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Include PostcodeAvailabilityChecker directly here */}
      <PostcodeAvailabilityChecker />
    </section>
  );
} 