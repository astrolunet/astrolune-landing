"use client";

import { createContext, useContext, type ReactNode } from "react";
import { localePath, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/en";

type I18nValue = {
  locale: Locale;
  dict: Dict;
  /** Prefix a root-relative path with the active locale. */
  href: (path: string) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Server components read the dictionary directly with `getDict`. Client
 * components — the header, the calculators, the SCAN tables — read it from
 * here, so the dictionary crosses the boundary once per page instead of being
 * threaded through every prop.
 */
export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider
      value={{ locale, dict, href: (path) => localePath(locale, path) }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error("useI18n must be used inside <I18nProvider>");
  }
  return value;
}
