import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/en";

/**
 * One dynamic import per locale, so a page only ever pulls the dictionary it
 * renders with. Keyed by `Locale`, which means adding a locale to
 * `LOCALES` without adding a loader here is a type error.
 */
const loaders: Record<Locale, () => Promise<Dict>> = {
  en: () => import("@/lib/i18n/en").then((m) => m.en),
  ru: () => import("@/lib/i18n/ru").then((m) => m.ru),
};

export async function getDict(locale: Locale): Promise<Dict> {
  return (loaders[locale] ?? loaders[DEFAULT_LOCALE])();
}

export type { Dict };
