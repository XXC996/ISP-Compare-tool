import { useTranslation } from 'react-i18next';
import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  
  // Load preferred language from localStorage on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && ['en', 'zh', 'hi', 'es'].includes(savedLang)) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', lng);
  };

  return (
    <div className="language-switcher">
      <FontAwesomeIcon icon={faGlobe} />
      <button 
        onClick={() => changeLanguage('en')} 
        className={i18n.language === 'en' ? 'active' : ''}
      >
        EN
      </button>
      <button 
        onClick={() => changeLanguage('zh')} 
        className={i18n.language === 'zh' ? 'active' : ''}
      >
        中文
      </button>
      <button 
        onClick={() => changeLanguage('hi')} 
        className={i18n.language === 'hi' ? 'active' : ''}
      >
        हिंदी
      </button>
      <button 
        onClick={() => changeLanguage('es')} 
        className={i18n.language === 'es' ? 'active' : ''}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher; 