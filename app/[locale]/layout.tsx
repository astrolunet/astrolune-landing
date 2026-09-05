import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Archivo, Inter, JetBrains_Mono, Roboto_Flex } from "next/font/google";
import { AstroluneIdProvider } from "@astrolune/id";
import "../globals.css";

import { Footer } from "@/components/footer";
import { I18nProvider } from "@/components/i18n-provider";
import { Header } from "@/components/nav/header";
import { ScrollProgress } from "@/components/scroll-progress";
import {
  LOCALES,
  LOCALE_META,
  isLocale,
  localePath,
  type Locale,
} from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { SITE } from "@/lib/site";

// Variable font: omitting `weight` keeps the wght axis fluid and lets us
// request `wdth` too, which is what produces the wide squared display type.
const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

// Archivo ships no Cyrillic. Roboto Flex is the closest grotesque that has it
// *and* a `wdth` axis, so the 125% stretch in `.display` survives the fallback
// and a Russian headline still reads as the same lockup.
const robotoFlex = Roboto_Flex({
  subsets: ["cyrillic", "latin"],
  variable: "--font-display-cyr",
  axes: ["wdth"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono-jb",
  weight: ["400", "500"],
  display: "swap",
});


export const viewport: Viewport = {
  themeColor: "#000000",
  colorScheme: "dark",
};

/** Both locale trees prerender; nothing else resolves. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * Deliberately left at the default (`true`).
 *
 * Setting it to `false` here is inherited by every nested dynamic segment, which
 * silently 404s any block height, address or transaction hash outside the small
 * set enumerated at build time — an explorer over a 59-million-block chain
 * cannot work that way. An unknown locale is rejected explicitly by the
 * `isLocale` guard below instead, which is the same outcome for the only param
 * this segment owns.
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: dict.meta.title,
      template: `%s — ${SITE.name}`,
    },
    description: dict.meta.description,
    applicationName: SITE.name,
    alternates: {
      canonical: localePath(locale, "/"),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, "/")]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title: dict.meta.title,
      description: dict.meta.description,
      url: localePath(locale, "/"),
      locale: LOCALE_META[locale].htmlLang,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    icons: { icon: "/logo.png", apple: "/logo.png" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const active: Locale = locale;
  const dict = await getDict(active);

  return (
    <html lang={LOCALE_META[active].htmlLang} className="dark">
      <body
        className={`${archivo.variable} ${robotoFlex.variable} ${inter.variable} ${jetbrains.variable} bg-void antialiased`}
      >
        <I18nProvider locale={active} dict={dict}>
          {/*
            The ID session wraps the whole tree, not just `/id`: the header's
            sign-in control lives on every page, and a provider mounted lower
            would drop the session on every navigation out of the console.
            `AstroluneIdProvider` carries its own strings, so it takes the
            locale rather than reading the site dictionary.
          */}
          <AstroluneIdProvider locale={active}>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-chalk focus:px-5 focus:py-2.5 focus:label-mono focus:text-void"
            >
              {dict.common.skipToContent}
            </a>
            <ScrollProgress />
            <Header />
            <main id="main">{children}</main>
            <Footer />
          </AstroluneIdProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
