"use client";

import { createContext, useState, ReactNode } from "react";
import { translations, Language, TranslationKey } from "@/locales";
import Cookies from "js-cookie";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLanguage }: { children: ReactNode; initialLanguage: Language }) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    Cookies.set("language", lang, { path: "/" });
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key];
  };

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

export { LanguageContext };
