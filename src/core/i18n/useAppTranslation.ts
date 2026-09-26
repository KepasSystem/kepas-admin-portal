import { useTranslation } from 'react-i18next';

export interface ITranslationService {
  t(key: string, options?: any): string;
  changeLanguage(lng: string): Promise<void>;
  currentLanguage: string;
}

export const useAppTranslation = (): ITranslationService => {
  const { t, i18n } = useTranslation();

  return {
    t: (key: string, options?: any) => t(key, options),
    changeLanguage: i18n.changeLanguage,
    currentLanguage: i18n.language
  };
};
