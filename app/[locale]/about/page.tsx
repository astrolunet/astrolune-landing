import type { Metadata } from "next";

import { Reveal } from "@/components/motion";
import {
  InfoList,
  InfoRow,
  PageHero,
  Section,
  SectionHead,
  StatGrid,
} from "@/components/site/chrome";
import {
  ButtonGhost,
  ButtonSolid,
  Chip,
  CornerTicks,
  IconArrow,
  IconBook,
  IconGithub,
  IconNode,
  IconShield,
} from "@/components/ui";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
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
    title: dict.about.title,
    description: dict.about.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.about),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.about)]),
      ),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const active = locale;
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);
  const a = dict.about;

  const stats = [
    a.stats.source,
    a.stats.assertions,
    a.stats.documents,
    a.stats.purchasable,
  ].map((s) => ({ label: s.k, value: s.v, sub: s.sub }));

  const principles = [
    { key: "honesty", icon: IconShield, ...a.principles.items.honesty },
    { key: "openness", icon: IconBook, ...a.principles.items.openness },
    { key: "craft", icon: IconGithub, ...a.principles.items.craft },
    { key: "access", icon: IconNode, ...a.principles.items.access },
  ];

  const habits = [
    a.people.items.docsFirst,
    a.people.items.adversarial,
    a.people.items.reproducible,
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: a.title }]}
        title={a.title}
        subtitle={a.subtitle}
        aside={
          <Chip tone="muted" className="shrink-0">
            <span className="size-1.5 rounded-full bg-chalk/70" />
            {a.badge}
          </Chip>
        }
      />

      {/* Mission + stat strip */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <SectionHead
              index="01"
              label={a.missionLabel}
              title={`${a.missionTitle1} ${a.missionTitle2}`}
            />
            <Reveal delay={140}>
              <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
                {a.missionBody}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="panel relative rounded-xl p-6 md:p-7">
              <CornerTicks className="inset-0" />
              <p className="text-[0.8125rem] leading-relaxed text-ash-2">
                {a.missionNote}
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-16">
          <StatGrid stats={stats} columns={4} />
        </div>
      </Section>

      {/* Principles */}
      <Section lattice>
        <SectionHead
          index="02"
          label={a.principles.label}
          title={`${a.principles.title1} ${a.principles.title2}`}
          body={a.principles.body}
        />
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-2">
          {principles.map(({ key, icon: Icon, tag, title, body }, i) => (
            <Reveal key={key} delay={i * 70}>
              <article className="group relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-400 hover:bg-panel-2">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
                />
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line bg-panel-2 text-ash-2 transition-colors duration-300 group-hover:text-chalk">
                    <Icon className="size-4" />
                  </span>
                  <span className="label-mono text-ash-3">{tag}</span>
                </div>
                <h3 className="mt-6 max-w-sm text-[1.0625rem] leading-snug font-medium tracking-tight text-chalk">
                  {title}
                </h3>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ash">
                  {body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* How we work */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
          <div>
            <SectionHead
              index="03"
              label={a.work.label}
              title={`${a.work.title1} ${a.work.title2}`}
            />
            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
                {a.work.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <InfoList>
              <InfoRow label={a.work.facts.model.k}>{a.work.facts.model.v}</InfoRow>
              <InfoRow label={a.work.facts.review.k}>
                {a.work.facts.review.v}
              </InfoRow>
              <InfoRow label={a.work.facts.testing.k}>
                {a.work.facts.testing.v}
              </InfoRow>
              <InfoRow label={a.work.facts.docs.k}>{a.work.facts.docs.v}</InfoRow>
            </InfoList>
          </Reveal>
        </div>
      </Section>

      {/* People / habits */}
      <Section>
        <SectionHead
          index="04"
          label={a.people.label}
          title={`${a.people.title1} ${a.people.title2}`}
          body={a.people.body}
        />
        <div className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
          {habits.map((habit, i) => (
            <Reveal key={habit.name} delay={i * 70}>
              <div className="group relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-400 hover:bg-panel-2">
                <span className="label-mono text-ash-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-6 max-w-[16rem] text-[0.9375rem] leading-snug font-medium tracking-tight text-chalk">
                  {habit.name}
                </h3>
                <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-ash">
                  {habit.desc}
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
            <p className="label-mono text-ash-3">{a.ctaEyebrow}</p>
          </Reveal>
          <Reveal delay={70}>
            <h2 className="display mx-auto mt-6 max-w-3xl text-fade-b text-[clamp(1.75rem,4vw,3rem)]">
              {a.ctaTitle1} {a.ctaTitle2}
            </h2>
          </Reveal>
          <Reveal delay={140}>
            <p className="mx-auto mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
              {a.ctaBody}
            </p>
          </Reveal>
          <Reveal delay={210}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <ButtonSolid href={LINKS.githubCore} size="lg" arrow external>
                {dict.common.viewOnGithub}
              </ButtonSolid>
              <ButtonGhost href={at(DOC_ROUTES.vision)} size="lg">
                <span className="flex items-center gap-2">
                  {dict.common.readDocs}
                  <IconArrow className="size-3.5" />
                </span>
              </ButtonGhost>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
