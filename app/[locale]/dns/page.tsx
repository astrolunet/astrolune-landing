import type { Metadata } from "next";

import { NameLookup } from "@/components/site/name-lookup";
import {
  Notice,
  PageHero,
  Panel,
  Section,
} from "@/components/site/chrome";
import { StatusPill } from "@/components/status-dot";
import { ButtonGhost, Chip, IconGlobe } from "@/components/ui";
import * as api from "@/lib/api";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.dns.title,
    description: dict.dns.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.dns),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.dns)]),
      ),
    },
  };
}

export default async function DnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const names = await api.getNames(1, 100);

  const recordTypes = [
    { label: "ADDR", body: dict.dns.recordTypes.address },
    { label: "CONTENT", body: dict.dns.recordTypes.content },
    { label: "TXT", body: dict.dns.recordTypes.text },
    { label: "A / AAAA", body: dict.dns.recordTypes.dns },
  ];

  const open = [
    dict.dns.open.allocation,
    dict.dns.open.reserved,
    dict.dns.open.resolution,
    dict.dns.open.subdomains,
    dict.dns.open.privacy,
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.dns.title }]}
        title={dict.dns.title}
        subtitle={dict.dns.subtitle}
        aside={<StatusPill tone="idle">{dict.dns.statusBadge}</StatusPill>}
      >
        <Notice tone="warn">{dict.dns.statusBody}</Notice>
      </PageHero>

      {/* lookup + record types */}
      <Section>
        <div className="grid gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <NameLookup names={names.rows} />
          </div>

          <Panel className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-lg border border-line-2 bg-panel-3 text-chalk/85">
                <IconGlobe className="size-4" />
              </span>
              <h2 className="label-mono text-chalk">{dict.dns.recordsTitle}</h2>
            </div>

            <dl className="mt-7 space-y-4">
              {recordTypes.map((record) => (
                <div key={record.label} className="flex gap-3">
                  <dt className="shrink-0">
                    <Chip tone="muted">{record.label}</Chip>
                  </dt>
                  <dd className="text-[0.75rem] leading-relaxed text-ash-2">
                    {record.body}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>

        <div className="mt-8">
          <ButtonGhost href={at(ROUTES.scanNames)} size="sm" arrow>
            {dict.common.viewAll}
          </ButtonGhost>
        </div>
      </Section>

      {/* open questions */}
      <Section className="border-t border-line" lattice>
        <div className="max-w-3xl">
          <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
            {dict.dns.openTitle}
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ash">
            {dict.dns.openNote}
          </p>
        </div>

        <div className="mt-10 divide-y divide-line border-t border-line">
          {open.map((item, i) => (
            <div key={item.q} className="group py-6">
              <div className="flex items-baseline gap-4">
                <span className="label-mono text-ash-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[0.9375rem] font-medium tracking-tight text-chalk">
                  {item.q}
                </h3>
              </div>
              <p className="mt-3 max-w-3xl pl-[3.1rem] text-[0.8125rem] leading-relaxed text-ash">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* dependencies */}
      <Section className="border-t border-line">
        <Panel ticks className="max-w-3xl">
          <h2 className="text-lg font-medium tracking-tight text-chalk">
            {dict.dns.dependsTitle}
          </h2>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ash">
            {dict.dns.dependsBody}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonGhost href={at(DOC_ROUTES.dnsSpec)} size="sm" arrow>
              {dict.common.readDocs}
            </ButtonGhost>
            <ButtonGhost href={at(DOC_ROUTES.vm)} size="sm" arrow>
              {dict.footer.cols.protocol.items.vm}
            </ButtonGhost>
          </div>
        </Panel>
      </Section>
    </>
  );
}
