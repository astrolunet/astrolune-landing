"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/components/i18n-provider";
import { LOCALES, LOCALE_META, swapLocale } from "@/lib/i18n/config";

/**
 * EN / RU segmented pill. `swapLocale` only touches the first path segment, so
 * switching language on `/en/scan/validators/…` keeps you where you were.
 */
export function LocaleSwitch({ className = "" }: { className?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "/";

  return (
    <div
      role="group"
      aria-label={dict.nav.language}
      className={`relative inline-flex items-center rounded-full border border-line-2 bg-panel/60 p-0.5 ${className}`}
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={swapLocale(pathname, code)}
            hrefLang={LOCALE_META[code].htmlLang}
            aria-current={active ? "true" : undefined}
            title={LOCALE_META[code].label}
            className={`rounded-full px-2.5 py-1.5 label-mono transition-colors duration-300 ${
              active
                ? "bg-chalk text-void"
                : "text-ash-2 hover:text-chalk"
            }`}
          >
            {LOCALE_META[code].native}
          </Link>
        );
      })}
    </div>
  );
}
