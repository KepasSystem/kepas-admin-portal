import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { LocalStorageKeys } from '../enums/LocalStorageKeys';

// Dicionários embutidos para não depender de requests externos no boot
import ptBR from '../../locales/pt-BR.json';
import enUS from '../../locales/en-US.json';

const resources = {
  'pt-BR': {
    translation: ptBR,
  },
  'en-US': {
    translation: enUS,
  },
};

// Puxa do localStorage ou cai no fallback 'pt-BR'
const savedLanguage = localStorage.getItem(LocalStorageKeys.LANGUAGE) || 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'pt-BR',
    interpolation: {
      escapeValue: false, // React já protege contra XSS
    },
  });

export default i18n;

