"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import i18n, {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  initI18n,
  isLocale,
  type Locale,
} from "@/lib/i18n/config";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readInitialLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const fromAttr = document.documentElement.lang;
  if (isLocale(fromAttr)) return fromAttr;
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage can throw in private-browsing / sandboxed contexts.
  }
  return DEFAULT_LOCALE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  // Initialize i18n once on first mount
  useEffect(() => {
    initI18n();
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    i18n.changeLanguage(next);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Same private-browsing edge case as above.
    }
  }, []);

  // Sync from other tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (
        e.key === LOCALE_STORAGE_KEY &&
        isLocale(e.newValue) &&
        e.newValue !== locale
      ) {
        setLocaleState(e.newValue);
        document.documentElement.lang = e.newValue;
        i18n.changeLanguage(e.newValue);
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [locale]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
    };
  }
  return ctx;
}
