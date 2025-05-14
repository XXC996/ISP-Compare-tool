import { useTranslation } from 'react-i18next';
import React, { useState, useEffect } from 'react';

interface NavItem {
  id: string;
  label: string;
  targetId: string;
}

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [activeNav, setActiveNav] = useState('home');

  const navItems: NavItem[] = [
    { id: 'home', label: t('header.home', 'Home'), targetId: 'top' },
    { id: 'speed-matcher', label: t('header.speedMatcher', 'Speed Matcher'), targetId: 'speed-selector' },
    { id: 'availability', label: t('header.availability', 'Service Availability'), targetId: 'postcode-checker-section' },
    { id: 'compare-plan', label: t('header.comparePlan', 'Compare Plan'), targetId: 'compare-plan-section' }
  ];

  // 设置页面初始滚动位置监听
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      
      // Home特殊处理，在顶部时激活
      if (scrollPosition < 100) {
        setActiveNav('home');
        return;
      }
      
      // 获取所有目标部分的位置
      const sections = navItems.slice(1).map(item => {
        const element = document.getElementById(item.targetId);
        if (!element) return { id: item.id, top: 0, bottom: 0 };
        
        const rect = element.getBoundingClientRect();
        return {
          id: item.id,
          top: scrollPosition + rect.top,
          bottom: scrollPosition + rect.bottom
        };
      });
      
      // 找到当前滚动位置对应的部分
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].top - 100) {
          setActiveNav(sections[i].id);
          break;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // 初始触发一次计算当前位置
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navItems]);

  const handleNavClick = (nav: string, targetId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setActiveNav(nav);
    
    if (targetId === 'top') {
      // 如果是Home，滚动到页面顶部
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      // 使用平滑滚动效果
      targetElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="modern-header">
      <div className="container">
        <div className="logo">
          <h1>CompareISP<span>.com.au</span></h1>
        </div>
        <nav className="main-navigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a 
                  href={item.targetId === 'top' ? '#' : `#${item.targetId}`} 
                  className={activeNav === item.id ? 'active' : ''}
                  onClick={(e) => handleNavClick(item.id, item.targetId, e)}
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