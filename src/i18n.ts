import i18n from 'i18next';
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

i18n
  // Load translations from /public/locales
  .use(Backend)
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Init i18next
  .init({
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: `${getBasePath()}locales/{{lng}}/{{ns}}.json`,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n; 