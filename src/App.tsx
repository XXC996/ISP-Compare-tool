import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import Comparison from './components/Comparison';
import CompetitorTool from './components/CompetitorTool';
import ISPSideBySideComparison from './components/ISPSideBySideComparison';
import InternetSpeedSelector from './components/InternetSpeedSelector';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';

const App = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    priceTier: 'all',
    contractType: 'all',
    sortBy: 'price',
    location: 'all',
    availability: 'all',
    language: 'all'
  });
  
  const handleFilterChange = (newFilters) => {
    console.log('New filters:', newFilters);
    setFilters(newFilters);
  };
  
  return (
    <>
      <Header />
      <LanguageSwitcher />
      <Hero />
      <Filters onFilterChange={handleFilterChange} />
      <Comparison filters={filters} />
      
      <section className="side-by-side-section">
        <div className="container">
          <h2 className="section-title">{t('comparison.sideBySideTitle', 'Compare Providers Side by Side')}</h2>
          <p className="section-description">
            {t('comparison.sideBySideDescription', 'Select any two providers to compare their plans and features directly.')}
          </p>
        </div>
        <ISPSideBySideComparison speedTier={filters.speedTier !== 'all' ? filters.speedTier : '50M'} />
      </section>
      
      <InternetSpeedSelector />
      <CompetitorTool />
      <Features />
      <FAQ />
      <Newsletter />
      <Footer />
      <Chatbot />
    </>
  );
};

export default App; 