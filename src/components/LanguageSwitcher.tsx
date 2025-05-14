import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faChevronDown } from '@fortawesome/free-solid-svg-icons';

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const languages: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' }
  ];
  
  // Load preferred language from localStorage on component mount
  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && languages.some(lang => lang.code === savedLang)) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n, languages]);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Save preference to localStorage
    localStorage.setItem('preferredLanguage', lng);
    // Close dropdown after selection
    setIsOpen(false);
  };

  // Get current language display name
  const getCurrentLanguage = () => {
    const currentLang = languages.find(lang => lang.code === i18n.language);
    return currentLang ? currentLang.nativeName : 'English';
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`language-switcher ${isOpen ? 'expanded' : ''}`}>
      <div 
        className="language-selector-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faGlobe} />
        <span className="current-language">{getCurrentLanguage()}</span>
        <FontAwesomeIcon icon={faChevronDown} className={`dropdown-arrow ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((language) => (
            <button 
              key={language.code}
              onClick={() => changeLanguage(language.code)} 
              className={i18n.language === language.code ? 'active' : ''}
            >
              {language.nativeName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher; 