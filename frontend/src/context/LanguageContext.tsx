import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language } from "../types";
import { strings, type Strings } from "../lib/strings";

const STORAGE_KEY = "jedad-dev-lang";

interface LanguageContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Strings;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function readStoredLang(): Language {
  if (typeof window === "undefined") return "th";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "en" ? "en" : "th";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(readStoredLang);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang: setLangState, t: strings[lang] }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
