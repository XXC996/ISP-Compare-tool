import React from 'react';
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
  const { t } = useTranslation();
  
  return (
    <>
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
    </>
  );
};

export default App; 