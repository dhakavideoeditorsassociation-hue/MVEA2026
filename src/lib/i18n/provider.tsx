"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { Lang, LocalizedText } from "@/lib/types";

import { DEFAULT_LANG, isLang, translate, type TranslationKey } from "./dictionaries";

const STORAGE_KEY = "gvea.lang";

type I18nContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  /** Translate an interface key. */
  t: (key: TranslationKey) => string;
  /** Pick the active language from a bilingual content field. */
  tx: (text: LocalizedText) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore the visitor's choice after hydration so the server and client
  // always render the same default markup first.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isLang(stored)) setLangState(stored);
    } catch {
      /* private mode / storage disabled */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.classList.toggle("lang-bn", lang === "bn");
    document.documentElement.classList.toggle("lang-en", lang === "en");
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang(lang === "bn" ? "en" : "bn"),
      t: (key: TranslationKey) => translate(lang, key),
      tx: (text: LocalizedText) => (text ? text[lang] || text.en : ""),
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <LanguageProvider>");
  return ctx;
}
