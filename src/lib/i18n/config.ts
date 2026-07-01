import i18n from "i18next";

import en from "./locales/en.json";
import es from "./locales/es.json";

export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "wacrm.locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

let initialized = false;

export function initI18n(locale?: string): void {
  if (initialized) return;
  initialized = true;
  const lng =
    locale ??
    (typeof window !== "undefined"
      ? localStorage.getItem(LOCALE_STORAGE_KEY)
      : null) ??
    DEFAULT_LOCALE;
  i18n.init({
    resources: { en: { translation: en }, es: { translation: es } },
    lng: isLocale(lng) ? lng : DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    interpolation: { escapeValue: false },
    returnObjects: false,
  });
}

export default i18n;
