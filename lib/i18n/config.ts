export const LOCALES = ["en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_META: Record<
  Locale,
  { label: string; native: string; htmlLang: string }
> = {
  en: { label: "English", native: "EN", htmlLang: "en" },
  ru: { label: "Русский", native: "RU", htmlLang: "ru" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Prefix a root-relative path with the active locale. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

/** Swap the locale segment of the current pathname, preserving the rest. */
export function swapLocale(pathname: string, next: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (isLocale(parts[0])) {
    parts[0] = next;
    return `/${parts.join("/")}`;
  }
  return `/${next}${pathname === "/" ? "" : pathname}`;
}
