import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface UsageItem {
  id: string;
  name: string;
  bandwidth: number;
  description: string;
}

const ISPCalculator: React.FC = () => {
  const { t } = useTranslation();
  
  // Usage data for different activities
  const usageData: { [key: string]: UsageItem[] } = {
    browsing: [
      { id: 'basic', name: t('calculator.basic', 'Basic Web Browsing'), bandwidth: 1, description: t('calculator.basicDesc', 'Email, news, social media') },
      { id: 'advanced', name: t('calculator.advanced', 'Advanced Web Browsing'), bandwidth: 3, description: t('calculator.advancedDesc', 'Web apps, online tools') },
    ],
    streaming: [
      { id: 'music', name: t('calculator.music', 'Music Streaming'), bandwidth: 2, description: t('calculator.musicDesc', 'Spotify, Apple Music, etc.') },
      { id: 'sdVideo', name: t('calculator.sdVideo', 'SD Video Streaming'), bandwidth: 3, description: t('calculator.sdVideoDesc', '480p video quality') },
      { id: 'hdVideo', name: t('calculator.hdVideo', 'HD Video Streaming'), bandwidth: 5, description: t('calculator.hdVideoDesc', '720p-1080p video quality') },
      { id: '4kVideo', name: t('calculator.4kVideo', '4K Video Streaming'), bandwidth: 25, description: t('calculator.4kVideoDesc', 'Ultra HD video quality') },
    ],
    gaming: [
      { id: 'casualGaming', name: t('calculator.casualGaming', 'Casual Gaming'), bandwidth: 3, description: t('calculator.casualGamingDesc', 'Browser/mobile games') },
      { id: 'onlineGaming', name: t('calculator.onlineGaming', 'Online Gaming'), bandwidth: 5, description: t('calculator.onlineGamingDesc', 'Multiplayer games') },
      { id: 'competitiveGaming', name: t('calculator.competitiveGaming', 'Competitive Gaming'), bandwidth: 10, description: t('calculator.competitiveGamingDesc', 'Fast-paced games, streaming') },
    ],
    videoCall: [
      { id: 'audioCall', name: t('calculator.audioCall', 'Audio Calls'), bandwidth: 0.5, description: t('calculator.audioCallDesc', 'Voice only') },
      { id: 'videoCallSD', name: t('calculator.videoCallSD', 'Video Calls (SD)'), bandwidth: 1, description: t('calculator.videoCallSDDesc', 'Standard quality') },
      { id: 'videoCallHD', name: t('calculator.videoCallHD', 'Video Calls (HD)'), bandwidth: 3.5, description: t('calculator.videoCallHDDesc', 'High quality') },
      { id: 'groupVideo', name: t('calculator.groupVideo', 'Group Video Calls'), bandwidth: 4, description: t('calculator.groupVideoDesc', '3+ participants') },
    ],
    workStudy: [
      { id: 'basicWork', name: t('calculator.basicWork', 'Basic Remote Work'), bandwidth: 2, description: t('calculator.basicWorkDesc', 'Email, docs, messaging') },
      { id: 'advancedWork', name: t('calculator.advancedWork', 'Advanced Remote Work'), bandwidth: 5, description: t('calculator.advancedWorkDesc', 'Cloud apps, video meetings') },
      { id: 'fileSharing', name: t('calculator.fileSharing', 'Large File Sharing'), bandwidth: 10, description: t('calculator.fileSharingDesc', 'Regular uploads/downloads') },
    ],
  };
  
  // State for user selections
  const [users, setUsers] = useState<number>(2);
  const [simultaneousUsers, setSimultaneousUsers] = useState<number>(1);
  const [selectedActivities, setSelectedActivities] = useState<{ [key: string]: string }>({
    browsing: '',
    streaming: '',
    gaming: '',
    videoCall: '',
    workStudy: '',
  });
  
  // Result state
  const [recommendedSpeed, setRecommendedSpeed] = useState<number>(0);
  const [recommendedSpeedTier, setRecommendedSpeedTier] = useState<string>('');
  
  // Update the recommended speed when inputs change
  useEffect(() => {
    calculateRecommendedSpeed();
  }, [users, simultaneousUsers, selectedActivities]);
  
  // Calculate the recommended speed based on selections
  const calculateRecommendedSpeed = () => {
    // Get all selected activities' bandwidth requirements
    const selectedBandwidths = Object.keys(selectedActivities)
      .filter(category => selectedActivities[category])
      .map(category => {
        const selectedId = selectedActivities[category];
        const item = usageData[category].find(item => item.id === selectedId);
        return item ? item.bandwidth : 0;
      });
    
    // Sort bandwidths in descending order to prioritize the most demanding activities
    selectedBandwidths.sort((a, b) => b - a);
    
    // Take the highest bandwidth requirements for the number of simultaneous users
    const topBandwidths = selectedBandwidths.slice(0, simultaneousUsers);
    
    // Sum the top bandwidths
    let totalBandwidth = topBandwidths.reduce((sum, bandwidth) => sum + bandwidth, 0);
    
    // Add overhead for multiple users (20% per additional user)
    const overheadMultiplier = 1 + (Math.min(simultaneousUsers, users) - 1) * 0.2;
    totalBandwidth = totalBandwidth * overheadMultiplier;
    
    // Add 30% headroom for peak performance
    totalBandwidth = totalBandwidth * 1.3;
    
    // Round up to the nearest whole number
    totalBandwidth = Math.ceil(totalBandwidth);
    
    // Set the recommended speed
    setRecommendedSpeed(totalBandwidth);
    
    // Determine the recommended speed tier
    if (totalBandwidth <= 12) {
      setRecommendedSpeedTier('12M');
    } else if (totalBandwidth <= 25) {
      setRecommendedSpeedTier('25M');
    } else if (totalBandwidth <= 50) {
      setRecommendedSpeedTier('50M');
    } else if (totalBandwidth <= 100) {
      setRecommendedSpeedTier('100M');
    } else if (totalBandwidth <= 250) {
      setRecommendedSpeedTier('250M');
    } else if (totalBandwidth <= 500) {
      setRecommendedSpeedTier('500M');
    } else {
      setRecommendedSpeedTier('1000M');
    }
  };
  
  // Handle activity selection changes
  const handleActivityChange = (category: string, activityId: string) => {
    setSelectedActivities({
      ...selectedActivities,
      [category]: activityId,
    });
  };
  
  return (
    <section className="isp-calculator">
      <div className="container">
        <h3>{t('calculator.title', 'Internet Speed Calculator')}</h3>
        <p className="calculator-description">
          {t('calculator.description', 'Find out what internet speed you need based on your household usage.')}
        </p>
        
        <div className="calculator-form">
          <div className="calculator-section">
            <h4>{t('calculator.householdSection', 'Household Information')}</h4>
            
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
          
          <div className="calculator-section">
            <h4>{t('calculator.activitiesSection', 'Online Activities')}</h4>
            <p>{t('calculator.activitiesHelp', 'Select the most demanding activities your household engages in:')}</p>
            
            {Object.keys(usageData).map((category) => (
              <div key={category} className="activity-category">
                <h5>{t(`calculator.${category}Category`, category.charAt(0).toUpperCase() + category.slice(1))}</h5>
                <div className="activity-options">
                  {usageData[category].map((activity) => (
                    <div 
                      key={activity.id}
                      className={`activity-card ${selectedActivities[category] === activity.id ? 'selected' : ''}`}
                      onClick={() => handleActivityChange(category, activity.id)}
                    >
                      <div className="activity-name">{activity.name}</div>
                      <div className="activity-bandwidth">{activity.bandwidth} Mbps</div>
                      <div className="activity-description">{activity.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="calculator-result">
          <h4>{t('calculator.resultTitle', 'Your Recommended Internet Speed')}</h4>
          <div className="speed-recommendation">
            <div className="speed-value">{recommendedSpeed} Mbps</div>
            <div className="speed-tier">
              {t('calculator.recommendedTier', 'Recommended Plan Tier: {{tier}}', { tier: recommendedSpeedTier })}
            </div>
          </div>
          <p className="result-explanation">
            {t('calculator.explanation', 'This recommendation is based on your household size and online activities. Consider upgrading if you frequently experience slow speeds during peak hours.')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default ISPCalculator; 