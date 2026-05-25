import { useTranslation as useTranslationBase } from "react-i18next";

type AvailableNamespaces = "common" | "dashboard" | "transaction" | "analysis" | "profile";

export const useTranslation = (namespace?: AvailableNamespaces) => {
  const { t, i18n } = useTranslationBase(namespace);

  const switchLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const currentLanguage = i18n.language;

  return {
    t,
    i18n,
    switchLanguage,
    currentLanguage,
    isVietnamese: currentLanguage === "vi",
    isEnglish: currentLanguage === "en",
  };
};
