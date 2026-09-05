import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero, Section } from "@/components/site/chrome";
import { LEGAL, legalBySlug } from "@/lib/data/legal";
import { fmtDate } from "@/lib/format";
import {
  isLocale,
  localePath,
  LOCALES,
  LOCALE_META,
  type Locale,
} from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

/**
 * The four legal documents, served from one route.
 *
 * They share a structure — intro plus numbered sections — so a route per
 * document would be four copies of the same file. The copy itself lives in
 * `lib/data/legal.ts` and is written for this project specifically rather than
 * adapted from a template.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const doc = legalBySlug(slug);
  if (!doc) return {};

  const path = `/legal/${doc.slug}`;
  return {
    title: doc.title[locale],
    description: doc.intro[locale],
    alternates: {
      canonical: localePath(locale, path),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, path)]),
      ),
    },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const active: Locale = locale;

  const doc = legalBySlug(slug);
  if (!doc) notFound();

  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const nav = [
    { label: dict.legal.privacy, href: at(ROUTES.legalPrivacy), slug: "privacy" },
    { label: dict.legal.terms, href: at(ROUTES.legalTerms), slug: "terms" },
    {
      label: dict.legal.disclaimer,
      href: at(ROUTES.legalDisclaimer),
      slug: "disclaimer",
    },
    { label: dict.legal.cookies, href: at(ROUTES.legalCookies), slug: "cookies" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.legal.title }, { label: doc.title[active] }]}
        title={doc.title[active]}
        subtitle={doc.intro[active]}
        aside={
          <span className="label-mono text-ash-3">
            {dict.legal.lastUpdated} {fmtDate(doc.updated, active)}
          </span>
        }
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
          {/* sibling documents */}
          <nav className="lg:sticky lg:top-[92px] lg:self-start">
            <p className="label-mono text-ash-3">{dict.legal.title}</p>
            <ul className="mt-4 flex flex-col gap-0.5 border-l border-line">
              {nav.map((item) => {
                const on = item.slug === doc.slug;
                return (
                  <li key={item.slug}>
                    <Link
                      href={item.href}
                      aria-current={on ? "page" : undefined}
                      className={`-ml-px block border-l py-2 pl-3.5 text-[0.8125rem] transition-colors duration-200 ${
                        on
                          ? "border-chalk text-chalk"
                          : "border-transparent text-ash-2 hover:text-chalk"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <article className="min-w-0 max-w-3xl">
            {doc.sections[active].map((section, i) => (
              <section key={section.heading} className="mt-10 first:mt-0">
                <h2 className="flex items-baseline gap-4 border-t border-line pt-7 first:border-t-0 first:pt-0">
                  <span className="label-mono text-ash-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display text-[1.25rem] text-chalk">
                    {section.heading}
                  </span>
                </h2>
                <div className="mt-5 space-y-4 pl-[3.1rem]">
                  {section.body.map((paragraph, p) => (
                    <p
                      key={p}
                      className="text-[0.9375rem] leading-relaxed text-ash"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>
        </div>
      </Section>
    </>
  );
}
