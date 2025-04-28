import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
import Comparison from './components/Comparison';
import CompetitorTool from './components/CompetitorTool';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import LanguageSwitcher from './components/LanguageSwitcher';
import ISPTable from './components/ISPTable';

const App = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    contractType: 'all',
    sortBy: 'price',
    location: 'all',
    availability: 'all'
  });
  
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };
  
  return (
    <>
      <Header />
      <LanguageSwitcher />
      <Hero />
      <Filters onFilterChange={handleFilterChange} />
      <Comparison filters={filters} />
      <ISPTable />
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