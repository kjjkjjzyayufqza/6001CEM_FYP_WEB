import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import zh_hk from "./zh_hk.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    zh_hk: {
      translation: zh_hk,
    },
  },
  lng: "en",
  fallbackLng: "en",
  preload: ["en", "zh_hk"],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
