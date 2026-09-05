"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { StatusPill } from "@/components/status-dot";
import { Breadcrumbs } from "@/components/site/chrome";
import { CornerTicks, SectionLabel } from "@/components/ui";
import { POTB } from "@/lib/chain";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";

/**
 * The consensus masthead.
 *
 * Uses the shared `PageHero` vocabulary — lattice, vignette, breadcrumb rail,
 * graphite headline — but renders the weight formula as the centrepiece rather
 * than a status chip, because the formula *is* the page.
 */
export function ConsensusHero() {
  const { locale, dict } = useI18n();
  const t = dict.consensus;
  const at = (path: string) => localePath(locale, path);

  const factors = [
    { key: "TBS", cap: `≤ ${POTB.capTbs}` },
    { key: "TGW", cap: `≤ ${POTB.capTgw}` },
    { key: "NDM", cap: "×" },
    { key: "COD", cap: "×" },
  ];

  return (
    <section className="relative isolate overflow-hidden border-b border-line pt-[68px]">
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/3 animate-pulse-glow rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12), transparent 68%)",
        }}
      />

      <div className="container-rail relative py-12 md:py-16">
        <Reveal>
          <Breadcrumbs
            items={[
              { label: dict.nav.groups.network.label, href: at(ROUTES.home) },
              { label: "PoTB" },
            ]}
          />
        </Reveal>

        <div className="mt-7 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Reveal delay={70}>
              <h1 className="display text-graphite text-[clamp(1.85rem,4.4vw,3.4rem)]">
                {t.title}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
                {t.subtitle}
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="shrink-0">
            <StatusPill tone="live">{t.version}</StatusPill>
          </Reveal>
        </div>

        {/* the formula, as the hero object */}
        <Reveal delay={260}>
          <div className="group relative mt-12 panel rounded-xl p-6 md:p-8">
            <CornerTicks className="absolute inset-0" />

            <p className="label-mono text-ash-3">{t.formulaLabel}</p>
            <p className="mt-4 font-mono text-[clamp(0.9rem,2.4vw,1.5rem)] tracking-tight text-chalk">
              {t.formula}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
              {factors.map((f) => (
                <div
                  key={f.key}
                  className="bg-panel px-4 py-4 transition-colors duration-400 hover:bg-panel-2"
                >
                  <p className="font-mono text-[0.9375rem] text-chalk">{f.key}</p>
                  <p className="mt-1.5 label-mono text-ash-3">{f.cap}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** The opening argument: four factors, multiplied, all clock-free. */
export function Idea() {
  const { dict } = useI18n();
  const t = dict.consensus.idea;

  return (
    <section
      id="idea"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="container-rail relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="01">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.6rem,3.4vw,2.4rem)]">
                {t.title1}
                <br />
                {t.title2}
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={140}>
              <p className="text-[1rem] leading-relaxed text-ash md:text-[1.0625rem]">
                {t.body}
              </p>
            </Reveal>
            <Reveal delay={220}>
              <p className="mt-7 border-l border-line-2 pl-4 text-[0.8125rem] leading-relaxed text-ash-2">
                {t.note}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
