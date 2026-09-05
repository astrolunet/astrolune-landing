import type { Metadata } from "next";
import Link from "next/link";

import { StatusLegend } from "@/components/docs/sidebar";
import { Reveal } from "@/components/motion";
import { Breadcrumbs, Notice } from "@/components/site/chrome";
import {
  Chip,
  IconArrow,
  IconBook,
  SectionLabel,
} from "@/components/ui";
import {
  DOC_SECTIONS,
  statusTone,
  type DocStatus,
} from "@/lib/docs/registry";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { DOC_ROUTES, PATHS, ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.docs.title,
    description: dict.docs.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.docs),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.docs)]),
      ),
    },
  };
}

export default async function DocsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const startItems = [
    { ...dict.docs.startItems.project, href: at(DOC_ROUTES.vision) },
    { ...dict.docs.startItems.consensus, href: at(DOC_ROUTES.potb) },
    { ...dict.docs.startItems.built, href: at(DOC_ROUTES.implementationStatus) },
    { ...dict.docs.startItems.run, href: at(DOC_ROUTES.buildAndTest) },
    { ...dict.docs.startItems.code, href: at(DOC_ROUTES.coreApi) },
    { ...dict.docs.startItems.next, href: at(DOC_ROUTES.roadmap) },
  ];

  return (
    <div className="pb-20">
      <div className="border-b border-line py-10 md:py-12">
        <Reveal>
          <Breadcrumbs items={[{ label: dict.docs.title }]} />
        </Reveal>
        <Reveal delay={70}>
          <h1 className="display mt-6 text-graphite text-[clamp(1.9rem,4.2vw,3.2rem)]">
            {dict.docs.title}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
            {dict.docs.subtitle}
          </p>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-7">
            <Notice tone="warn">{dict.docs.warning}</Notice>
          </div>
        </Reveal>
      </div>

      {/* start here */}
      <section className="py-12">
        <Reveal>
          <SectionLabel index="01">{dict.docs.startHere}</SectionLabel>
        </Reveal>
        <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-2">
          {startItems.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <Link
                href={item.href}
                className="group flex h-full items-center justify-between gap-4 bg-panel px-5 py-5 transition-colors duration-300 hover:bg-panel-2"
              >
                <span className="min-w-0">
                  <span className="block text-[0.75rem] text-ash-3">
                    {item.q}
                  </span>
                  <span className="mt-1 block text-[0.9375rem] font-medium text-chalk">
                    {item.a}
                  </span>
                </span>
                <IconArrow className="size-4 shrink-0 text-ash-3 transition-all duration-400 group-hover:translate-x-0.5 group-hover:text-chalk" />
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* full contents */}
      <section className="py-6">
        <Reveal>
          <SectionLabel index="02">{dict.common.overview}</SectionLabel>
        </Reveal>

        <div className="mt-8 space-y-10">
          {DOC_SECTIONS.map((section) => (
            <Reveal key={section.key}>
              <div>
                <h2 className="label-mono text-ash-2">
                  {dict.docs.sections[section.key]}
                </h2>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {section.entries.map((entry) => (
                    <Link
                      key={entry.slug}
                      href={at(PATHS.doc(entry.slug))}
                      className="group flex items-center justify-between gap-3 rounded-lg border border-line bg-panel/50 px-4 py-3.5 transition-all duration-300 hover:border-line-2 hover:bg-panel-2"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <IconBook className="size-4 shrink-0 text-ash-3 transition-colors duration-300 group-hover:text-ash" />
                        <span className="truncate text-[0.875rem] text-chalk/90">
                          {entry.title}
                        </span>
                      </span>
                      <Chip
                        tone={statusTone(entry.status as DocStatus)}
                        className="shrink-0"
                      >
                        {entry.status}
                      </Chip>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* status legend */}
      <section className="py-10">
        <Reveal>
          <h2 className="label-mono text-ash-2">{dict.docs.statusLegend.title}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="mt-5">
            <StatusLegend />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
