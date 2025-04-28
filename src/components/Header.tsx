import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
}

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [activeNav, setActiveNav] = useState('internet-plans');

  const navItems: NavItem[] = [
    { id: 'home', label: t('header.home') },
    { id: 'plans', label: t('header.plans') },
    { id: 'compare', label: t('header.compare') },
    { id: 'about', label: t('header.about') },
    { id: 'contact', label: t('header.contact') }
  ];

  const handleNavClick = (nav: string) => {
    setActiveNav(nav);
  };

  return (
    <header>
      <div className="container">
        <div className="logo">
          <h1>CompareISP<span>.com.au</span></h1>
        </div>
        <nav>
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={`#${item.id}`} 
                  className={activeNav === item.id ? 'active' : ''}
                  onClick={() => handleNavClick(item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header; 