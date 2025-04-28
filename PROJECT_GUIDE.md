# React ISP 比较网站项目指南

## 项目概述

这是一个使用 React 构建的互联网服务提供商(ISP)比较网站，支持多语言（英文和中文），使用 TypeScript 进行类型检查以提高代码质量。该项目允许用户比较不同的互联网套餐，查看详细信息并根据各种条件进行筛选。

## 项目结构

```
react-isp-comparison/
├── public/                  # 静态资源
│   ├── locales/             # 多语言翻译文件
│   │   ├── en/              # 英文翻译
│   │   └── zh/              # 中文翻译
├── src/                     # 源代码
│   ├── components/          # React组件
│   ├── styles/              # CSS样式文件
│   ├── types/               # TypeScript类型定义
│   ├── i18n.ts              # 国际化配置
│   ├── App.tsx              # 主应用组件
│   └── index.tsx            # 入口文件
└── package.json             # 项目依赖和脚本
```

## 核心文件和组件解释

### 1. 入口文件 (src/index.tsx)

这是应用的入口点，负责渲染根组件并设置国际化支持：

```jsx
import React, { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';
import './i18n';  // 导入i18n配置

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <Suspense fallback="Loading...">  {/* 用于i18n资源加载时显示的内容 */}
      <App />
    </Suspense>
  </StrictMode>
);
```

### 2. 主应用组件 (src/App.tsx)

App组件是整个应用的容器，它引入并组织所有其他组件：

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from './components/Header';
import Hero from './components/Hero';
import Filters from './components/Filters';
// ... 其他组件导入

const App = () => {
  const { t } = useTranslation();  // 获取翻译函数
  
  return (
    <>
      <Header />
      <LanguageSwitcher />  {/* 语言切换器 */}
      <Hero />
      <Filters />
      <Comparison />
      {/* ... 其他组件 */}
    </>
  );
};
```

### 3. 国际化配置 (src/i18n.ts)

这个文件配置了i18next库，使应用支持多语言：

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)  // 从服务器加载翻译文件
  .use(LanguageDetector)  // 自动检测用户语言
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',  // 默认语言
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',  // 翻译文件路径
    },
  });
```

### 4. 翻译文件

翻译文件位于 `public/locales/` 目录下，按语言分为不同文件夹：

- `public/locales/en/translation.json`：英文翻译
- `public/locales/zh/translation.json`：中文翻译

示例翻译文件结构：
```json
{
  "header": {
    "home": "Home",
    "plans": "Plans"
  },
  "hero": {
    "title": "Find Your Perfect ISP Plan",
    "subtitle": "Compare prices, speeds, and features"
  }
}
```

### 5. 语言切换器 (src/components/LanguageSwitcher.tsx)

用户可以通过这个组件切换网站语言：

```jsx
import { useTranslation } from 'react-i18next';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);  // 切换语言
  };

  return (
    <div className="language-switcher">
      <FontAwesomeIcon icon={faGlobe} />
      <button 
        onClick={() => changeLanguage('en')} 
        className={i18n.language === 'en' ? 'active' : ''}
      >
        English
      </button>
      <button 
        onClick={() => changeLanguage('zh')} 
        className={i18n.language === 'zh' ? 'active' : ''}
      >
        中文
      </button>
    </div>
  );
};
```

## 主要组件介绍

### 1. Header (src/components/Header.tsx)

顶部导航栏，显示网站标题和主要导航链接。

### 2. Hero (src/components/Hero.tsx)

网站顶部的大横幅区域，包含主标题、副标题和邮编搜索功能：

```jsx
const Hero = () => {
  const { t } = useTranslation();
  const [postcode, setPostcode] = useState('');
  
  // ... 处理函数

  return (
    <section className="hero">
      <div className="container">
        <h2>{t('hero.title')}</h2>  {/* 使用翻译 */}
        <p>{t('hero.subtitle')}</p>
        <div className="search-box">
          {/* 搜索输入框 */}
        </div>
      </div>
    </section>
  );
};
```

### 3. Filters (src/components/Filters.tsx)

筛选工具，让用户可以根据套餐类型、速度、合约等条件筛选结果：

```jsx
const Filters = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    planType: 'all',
    speedTier: 'all',
    // ... 其他筛选条件
  });

  // ... 处理函数

  return (
    <section className="filters">
      <div className="container">
        {/* 筛选选项 */}
        <div className="filter-group">
          <label>{t('filters.planType')}</label>
          <select 
            name="planType" 
            value={filters.planType} 
            onChange={handleFilterChange}
          >
            <option value="all">{t('filters.allTypes')}</option>
            {/* ... 其他选项 */}
          </select>
        </div>
        {/* ... 其他筛选组 */}
      </div>
    </section>
  );
};
```

### 4. Comparison (src/components/Comparison.tsx)

展示比较结果的网格，使用PlanCard组件显示每个套餐的详细信息。

### 5. PlanCard (src/components/PlanCard.tsx)

显示单个ISP套餐的卡片组件，包含价格、速度、合约等信息：

```jsx
const PlanCard = ({ plan }) => {
  const { t } = useTranslation();
  
  return (
    <div className="plan-card">
      <div className="provider-logo">
        <img src={plan.logoSrc} alt={plan.provider} />
      </div>
      <div className="plan-details">
        <h4>{plan.name}</h4>
        {/* ... 其他套餐详情 */}
        <a href="#" className="cta-button">
          {t('comparison.viewDetails')}
        </a>
      </div>
    </div>
  );
};
```

### 6. Features (src/components/Features.tsx)

展示网站的主要特点和优势：

```jsx
const Features = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      id: 1,
      icon: faRobot,
      titleKey: 'features.aiRecommendations',
      descriptionKey: 'features.aiDescription'
    },
    // ... 其他特点
  ];

  return (
    <section className="features">
      <div className="container">
        <h3>{t('features.title')}</h3>
        <div className="features-grid">
          {features.map(feature => (
            <div className="feature-box" key={feature.id}>
              <FontAwesomeIcon icon={feature.icon} />
              <h4>{t(feature.titleKey)}</h4>
              <p>{t(feature.descriptionKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

### 7. FAQ (src/components/FAQ.tsx)

常见问题和答案部分，使用手风琴样式展示：

```jsx
const FAQ = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState(0);
  
  // ... 处理函数
  
  return (
    <section className="faq">
      <div className="container">
        <h3>{t('faq.title')}</h3>
        <div className="accordion">
          {faqItems.map((item, index) => (
            <div className={`accordion-item ${activeItem === index ? 'active' : ''}`}>
              <div className="accordion-header" onClick={() => toggleAccordion(index)}>
                {t(item.questionKey)}
              </div>
              <div className="accordion-content">
                <p>{t(item.answerKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
```

## TypeScript 类型

所有类型定义位于 `src/types` 目录中：

```typescript
// src/types/index.ts
export interface ISPPlan {
  id: string;
  provider: string;
  name: string;
  price: number;
  speed: {
    download: number;
    upload: number;
  };
  // ... 其他属性
}

export interface FilterOptions {
  location: string;
  minSpeed: number;
  maxPrice: number;
  minRating: number;
}

// ... 其他接口
```

## 如何修改和扩展项目

### 1. 添加新组件

1. 在 `src/components` 目录下创建新的 `.tsx` 文件
2. 导入必要的依赖并实现组件
3. 在 `App.tsx` 中导入并使用新组件

### 2. 添加新的翻译

1. 在 `public/locales/en/translation.json` 和 `public/locales/zh/translation.json` 中添加新的翻译键值对
2. 在组件中使用 `t('新的键')` 来使用新的翻译

### 3. 添加新的语言

1. 在 `public/locales` 下创建新的语言文件夹，如 `ja` 表示日语
2. 复制 `en/translation.json` 并将内容翻译成新语言
3. 在 `LanguageSwitcher` 组件中添加新的语言选择按钮

### 4. 修改样式

所有样式定义位于 `src/styles/main.css` 文件中，按组件分类。

### 5. 修改数据模型

如果需要更改数据模型，请更新 `src/types/index.ts` 中的接口定义。

## 常见问题和解决方案

### TypeScript 错误

如果遇到类型错误，请确保：
1. 所有组件的 props 都有正确的类型定义
2. 所有函数参数和返回值都有类型注解

### 国际化问题

如果翻译不显示：
1. 检查翻译键是否在翻译文件中正确定义
2. 确保组件中使用了 `useTranslation` hook

### 新增功能

要添加新功能：
1. 先考虑这个功能应该属于哪个组件
2. 实现必要的 UI 组件和逻辑
3. 添加相应的翻译
4. 集成到主应用中

## 构建和部署

构建生产版本：
```bash
npm run build
```

部署到服务器：将 `build` 目录的内容上传到你的网站服务器。 