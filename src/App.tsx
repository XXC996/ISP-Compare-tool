import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import MainComparison from './components/MainComparison';
import CompetitorTool from './components/CompetitorTool';
import InternetSpeedSelector from './components/InternetSpeedSelector';
import ComparePlanSection from './components/ComparePlanSection';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';

const App = () => {
  const { t, i18n } = useTranslation();
  
  // Effect to update the document title and language attribute on language change
  useEffect(() => {
    // Update document title based on current language
    document.title = t('app.title', 'ISP Comparison Tool');
    
    // Set the HTML lang attribute
    document.documentElement.setAttribute('lang', i18n.language);
    
    // Add a class to the body for language-specific styling if needed
    document.body.className = `lang-${i18n.language}`;
    
    // Log language change for debugging
    console.log(`Language changed to: ${i18n.language}`);
  }, [i18n.language, t]);
  
  return (
    <div className="app-container">
      <Header />
      <LanguageSwitcher />
      <MainComparison />
      <InternetSpeedSelector />
      <ComparePlanSection />
      <Features />
      <FAQ />
      <Newsletter />
      <Footer />
      <Chatbot />
    </div>
  );
};

export default App; 