import i18n from 'i18next';
import { InitOptions } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Get base path from package.json homepage
const getBasePath = () => {
  // Extract the path from homepage in package.json, or use '/' as fallback
  // For example, from https://XXC996.github.io/ISP-Compare-tool get /ISP-Compare-tool/
  const homepage = process.env.PUBLIC_URL || '';
  return homepage ? `${homepage}/` : '/';
};

// 配置初始化选项
const initOptions: InitOptions = {
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false, // React already safes from XSS
  },
  // Options for backend loading translations
  backend: {
    // path where resources get loaded from
    loadPath: `${getBasePath()}locales/{{lng}}/{{ns}}.json`,
  },
  // Default namespace used
  defaultNS: 'translation',
  // Namespaces to load
  ns: ['translation'],
  // Enable shallow rendering to update components on language change
  react: {
    useSuspense: true,
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
  }
};

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init(initOptions);

// 添加监听器，在语言变更时更新所有组件
i18n.on('languageChanged', (lng) => {
  // 触发一个自定义事件，让全局组件可以获知语言变更
  document.documentElement.lang = lng;
  document.documentElement.setAttribute('lang', lng);
  document.title = i18n.t('app.title') || 'ISP Comparison Tool';
  
  // 将选择的语言保存到localStorage以便下次访问时使用
  localStorage.setItem('preferredLanguage', lng);
  
  // 添加一个类以便可以应用特定语言的样式
  document.body.className = document.body.className
    .replace(/lang-\w+/g, '')
    .trim() + ` lang-${lng}`;
    
  console.log(`Language changed to: ${lng}`);
});

export default i18n; 