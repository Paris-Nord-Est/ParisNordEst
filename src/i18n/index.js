import { createI18n } from "vue-i18n";
import fr from "../locales/fr.json";
import en from "../locales/en.json";

// Get saved language from localStorage or default to French
const savedLocale = localStorage.getItem("locale") || "fr";

// Create i18n instance
const i18n = createI18n({
  legacy: false, // Use Composition API mode
  locale: savedLocale, // Set locale from localStorage or default
  fallbackLocale: "fr", // Fallback to French
  messages: {
    fr,
    en,
  },
  globalInjection: true, // Enable global $t
});

// Watch for locale changes and update localStorage + html lang attribute
export function setLanguage(locale) {
  i18n.global.locale.value = locale;
  localStorage.setItem("locale", locale);
  document.documentElement.setAttribute("lang", locale);
}

// Initialize html lang attribute
document.documentElement.setAttribute("lang", savedLocale);

export default i18n;
