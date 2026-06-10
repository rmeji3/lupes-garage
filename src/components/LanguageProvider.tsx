"use client";

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dictionaries, type Dictionary, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  t: Dictionary;
  toggle: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "lupes-garage-lang";

// Language preference lives in a tiny external store so it can be read from
// localStorage / browser settings without setState-in-effect, and so the
// server render ("en") hydrates cleanly before the client value kicks in.
let currentLang: Lang | null = null;
const listeners = new Set<() => void>();

function getClientLang(): Lang {
  if (currentLang === null) {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") {
      currentLang = saved;
    } else {
      currentLang = navigator.language.toLowerCase().startsWith("es")
        ? "es"
        : "en";
    }
  }
  return currentLang;
}

function getServerLang(): Lang {
  return "en";
}

function setLang(lang: Lang) {
  currentLang = lang;
  window.localStorage.setItem(STORAGE_KEY, lang);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getClientLang, getServerLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const toggle = () => setLang(lang === "en" ? "es" : "en");

  return (
    <LanguageContext value={{ lang, t: dictionaries[lang], toggle }}>
      {children}
    </LanguageContext>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
