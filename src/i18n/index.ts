import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import resources from "./resources";

i18n.use(initReactI18next).init({
  lng: "vi",
  fallbackLng: "en",
  resources: resources,
  ns: ["common", "dashboard", "transaction", "analysis", "profile"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;