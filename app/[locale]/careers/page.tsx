import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion";
import { Notice, PageHero, Section, SectionHead } from "@/components/site/chrome";
import {
  ButtonGhost,
  ButtonSolid,
  Chip,
  IconArrow,
  IconCode,
  IconGlobe,
  IconLayers,
  IconShield,
  IconTelegram,
} from "@/components/ui";
import { CAREER_ROLES } from "@/lib/data/careers";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";
import { LINKS } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.careers.title,
    description: dict.careers.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.careers),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.careers)]),
      ),
    },
  };
}

const ROLE_ICONS = [IconShield, IconLayers, IconGlobe, IconCode] as const;

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const active = locale;
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);
  const c = dict.careers;

  const values = [
    { key: "depth", ...c.values.items.depth },
    { key: "honesty", ...c.values.items.honesty },
    { key: "ownership", ...c.values.items.ownership },
    { key: "leverage", ...c.values.items.leverage },
  ];

  const steps = [
    c.process.steps.s1,
    c.process.steps.s2,
    c.process.steps.s3,
    c.process.steps.s4,
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: c.title }]}
        title={c.title}
        subtitle={c.subtitle}
        aside={
          <Chip tone="muted" className="shrink-0">
            <span className="size-1.5 rounded-full bg-chalk/70" />
            {c.badge}
          </Chip>
        }
      />

      {/* Why here */}
      <Section>
        <SectionHead
          index="01"
          label={c.values.label}
          title={`${c.values.title1} ${c.values.title2}`}
          body={c.values.body}
        />
        <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {values.map((item, i) => (
            <Reveal key={item.key} delay={i * 60}>
              <div className="group relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-400 hover:bg-panel-2">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
                />
                <span className="label-mono text-ash-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 max-w-[15rem] text-[0.9375rem] leading-snug font-medium tracking-tight text-chalk">
                  {item.name}
                </h3>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ash">
                  {item.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Open roles */}
      <Section lattice id="roles">
        <SectionHead
          index="02"
          label={c.roles.label}
          title={`${c.roles.title1} ${c.roles.title2}`}
          body={c.roles.body}
        />

        {CAREER_ROLES.length === 0 ? (
          <div className="mt-12">
            <Notice>{c.none.note}</Notice>
          </div>
        ) : (
          <div className="mt-12 divide-y divide-line border-y border-line">
            {CAREER_ROLES.map((role, i) => {
              const Icon = ROLE_ICONS[i % ROLE_ICONS.length];
              return (
                <Reveal key={role.id} delay={i * 50}>
                  <article className="group grid gap-6 py-8 transition-colors duration-300 md:grid-cols-[minmax(0,1fr)_minmax(0,16rem)] md:items-start lg:gap-10">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-panel-2 text-ash-2 transition-colors duration-300 group-hover:text-chalk">
                          <Icon className="size-4" />
                        </span>
                        <h3 className="display text-[1.25rem] text-chalk">
                          {role.title[active]}
                        </h3>
                      </div>

                      <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
                        {role.summary[active]}
                      </p>

                      <p className="mt-5 label-mono text-ash-3">
                        {c.roles.skillsLabel}
                      </p>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {role.skills[active].map((skill) => (
                          <li
                            key={skill}
                            className="rounded-full border border-line bg-panel px-3 py-1.5 font-mono text-[0.6875rem] text-ash-2"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-row flex-wrap items-center gap-x-6 gap-y-3 md:flex-col md:items-start md:gap-3">
                      <dl className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-[auto_1fr] md:gap-x-4">
                        <dt className="label-mono text-ash-3">{c.roles.teamLabel}</dt>
                        <dd className="text-[0.8125rem] text-chalk/90">
                          {role.team[active]}
                        </dd>
                        <dt className="label-mono text-ash-3">{c.roles.typeLabel}</dt>
                        <dd className="text-[0.8125rem] text-chalk/90">
                          {c.roles.type}
                        </dd>
                        <dt className="label-mono text-ash-3">
                          {c.roles.locationLabel}
                        </dt>
                        <dd className="flex items-center gap-1.5 text-[0.8125rem] text-chalk/90">
                          {c.roles.location}
                        </dd>
                      </dl>
                    </div>
                  </article>

                  <div className="-mt-4 pb-8">
                    <ButtonGhost
                      href={`mailto:${LINKS.email}?subject=${encodeURIComponent(
                        c.roles.applySubject.replace("{role}", role.title.en),
                      )}`}
                      size="sm"
                      arrow
                    >
                      {c.roles.apply}
                    </ButtonGhost>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <Reveal delay={120}>
          <div className="mt-10 max-w-2xl">
            <Notice>
              <span className="font-medium text-chalk">{c.none.title}</span>{" "}
              {c.none.note}
            </Notice>
          </div>
        </Reveal>
      </Section>

      {/* Process */}
      <Section>
        <SectionHead
          index="03"
          label={c.process.label}
          title={`${c.process.title1} ${c.process.title2}`}
          body={c.process.body}
        />
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.name} delay={i * 70}>
              <div className="relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-400 hover:bg-panel-2">
                <span className="font-mono text-[clamp(1.6rem,2.6vw,2.2rem)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 text-[0.9375rem] leading-snug font-medium tracking-tight text-chalk">
                  {step.name}
                </h3>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ash">
                  {step.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA band */}
      <section className="relative overflow-hidden border-t border-line">
        <div
          aria-hidden
          className="grid-lattice pointer-events-none absolute inset-0 opacity-40 mask-radial"
        />
        <div className="container-rail relative py-20 text-center md:py-24">
          <Reveal>
            <p className="label-mono text-ash-3">{c.ctaEyebrow}</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="display mx-auto mt-6 max-w-3xl text-fade-b text-[clamp(1.75rem,4vw,3rem)]">
              {c.ctaTitle1} {c.ctaTitle2}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
              {c.ctaBody}
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonSolid
                href={`mailto:${LINKS.email}?subject=${encodeURIComponent(
                  c.roles.applySubject.replace("{role}", "General"),
                )}`}
                size="lg"
                arrow
              >
                {LINKS.email}
              </ButtonSolid>
              <ButtonGhost href={LINKS.telegramDev} size="lg" external>
                <span className="flex items-center gap-2">
                  <IconTelegram className="size-3.5" />
                  {dict.common.telegram} Dev
                </span>
              </ButtonGhost>
              <Link
                href={at(ROUTES.about)}
                className="group inline-flex items-center gap-2 label-mono text-ash-2 transition-colors duration-300 hover:text-chalk"
              >
                {dict.about.title}
                <IconArrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
