"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  getLocaleCookieName,
  getLocaleTag,
  localeLabels,
  localizeSkin,
  type Locale,
  translate,
} from "@/lib/i18n";
import type { SkinCard } from "@/types/market";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  localizeSkin: <T extends Pick<SkinCard, "slug" | "name" | "category" | "rarity" | "exterior" | "finishStyle" | "description">>(skin: T) => T;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = getLocaleTag(locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale(nextLocale) {
        setLocaleState(nextLocale);
        document.cookie = `${getLocaleCookieName()}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
      },
      t(key, vars) {
        return translate(locale, key, vars);
      },
      localizeSkin(skin) {
        return localizeSkin(locale, skin) as typeof skin;
      },
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");
  return context;
}

export { localeLabels };
