
"use client";

import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import ptBR from "@/lib/locales/pt-BR.json";
import enUS from "@/lib/locales/en-US.json";
import esES from "@/lib/locales/es-ES.json";
import deDE from "@/lib/locales/de-DE.json";
import frFR from "@/lib/locales/fr-FR.json";
import jaJP from "@/lib/locales/ja-JP.json";
import zhCN from "@/lib/locales/zh-CN.json";
import arAE from "@/lib/locales/ar-AE.json";
import ruRU from "@/lib/locales/ru-RU.json";

export type Locale = "pt-BR" | "en-US" | "es-ES" | "de-DE" | "fr-FR" | "ja-JP" | "zh-CN" | "ar-AE" | "ru-RU";

type Translations = Record<string, any>;

const translations: Record<Locale, Translations> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "de-DE": deDE,
  "fr-FR": frFR,
  "ja-JP": jaJP,
  "zh-CN": zhCN,
  "ar-AE": arAE,
  "ru-RU": ruRU,
};


export interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  tArray: (key: string) => string[];
  tObject: <T = any>(key: string) => T | undefined;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string) => {
  if (obj && obj[path] !== undefined) return obj[path];
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("pt-BR");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedLocale = localStorage.getItem("locale") as Locale | null;
    if (storedLocale && translations[storedLocale]) {
      setLocale(storedLocale);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale.split('-')[0];
      document.documentElement.dir = locale === 'ar-AE' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const handleSetLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
    if(typeof window !== 'undefined') {
        localStorage.setItem("locale", newLocale);
    }
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      let translation = getNestedValue(translations[locale], key) || key;
      
      if (Array.isArray(translation)) {
        return translation.join(", ");
      }
      
      if (typeof translation !== 'string') {
        return key;
      }

      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          translation = (translation as string).replace(new RegExp(`{{${k}}}`, "g"), String(v));
        });
      }
      return String(translation);
    },
    [locale]
  );

  const tArray = useCallback(
    (key: string): string[] => {
      const translation = getNestedValue(translations[locale], key);
      if (Array.isArray(translation)) {
        return translation;
      }
      return [];
    },
    [locale]
  );

  const tObject = useCallback(
    <T = any>(key: string): T | undefined => {
      return getNestedValue(translations[locale], key) as T;
    },
    [locale]
  );
  
  const contextValue = useMemo(
    () => ({
      locale,
      setLocale: handleSetLocale,
      t,
      tArray,
      tObject,
    }),
    [locale, handleSetLocale, t, tArray, tObject]
  );

  if (!isMounted) {
    const serverContextValue = {
      locale: 'pt-BR' as Locale,
      setLocale: () => {},
      t: (key: string, params?: Record<string, string | number>) => {
        let translation = getNestedValue(ptBR, key) || key;
        if (typeof translation !== 'string') return key;
        if (params) {
          Object.entries(params).forEach(([k, v]) => {
            translation = (translation as string).replace(new RegExp(`{{${k}}}`, "g"), String(v));
          });
        }
        return translation;
      },
      tArray: (key: string) => {
        const translation = getNestedValue(ptBR, key);
        if (Array.isArray(translation)) {
          return translation;
        }
        return [];
      },
      tObject: (key: string) => getNestedValue(ptBR, key),
    };
    return (
      <LocaleContext.Provider value={serverContextValue}>
        {children}
      </LocaleContext.Provider>
    );
  }

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
}
