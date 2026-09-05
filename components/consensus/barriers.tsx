"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal, TiltCard } from "@/components/motion";
import { CornerTicks, IconArrow, SectionLabel } from "@/components/ui";

/**
 * The four weight components, each with its formula and — crucially — its
 * documented weakness.
 *
 * The weakness line is the whole reason this is richer than a normal feature
 * grid. The specification refuses to present any factor as a proof, so a card
 * that showed only the strength would be misrepresenting it. Each card reveals
 * its weakness on hover, folded out from under the body, so the honest part is
 * present without shouting over the design.
 */
export function Barriers() {
  const { dict } = useI18n();
  const t = dict.consensus.barriers;

  const cards = [
    { id: "①", ...t.items.tbs },
    { id: "②", ...t.items.tgw },
    { id: "③", ...t.items.ndm },
    { id: "④", ...t.items.cod },
  ];

  return (
    <section
      id="barriers"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div
        aria-hidden
        className="grid-lattice-sm pointer-events-none absolute inset-0 opacity-25 mask-fade-b"
      />
      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="03">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.6rem,3.4vw,2.6rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
              {t.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 sm:grid-cols-2">
          {cards.map((card, i) => (
            <Reveal key={card.tag} delay={i * 90}>
              <TiltCard className="h-full">
                <article className="group relative flex h-full flex-col overflow-hidden panel rounded-xl p-7">
                  <CornerTicks className="absolute inset-0 z-20" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="label-mono text-ash-2">{card.tag}</span>
                    <span className="font-mono text-base text-ash-3">
                      {card.id}
                    </span>
                  </div>

                  <h3 className="relative z-10 mt-6 text-xl font-medium tracking-tight text-chalk">
                    {card.title}
                  </h3>

                  {/* the formula, rendered as a small code chip */}
                  <div className="relative z-10 mt-4 inline-flex w-fit items-center rounded-md border border-line bg-panel-2 px-3 py-1.5">
                    <code className="font-mono text-[0.75rem] text-chalk/90">
                      {card.formula}
                    </code>
                  </div>

                  <p className="relative z-10 mt-4 text-[0.8125rem] leading-relaxed text-ash">
                    {card.body}
                  </p>

                  {/* known weakness — always present, emphasised on hover */}
                  <div className="relative z-10 mt-auto pt-6">
                    <div className="flex items-start gap-2.5 rounded-lg border border-line bg-panel/60 px-3.5 py-3 transition-colors duration-500 group-hover:border-warn/25 group-hover:bg-warn/[0.05]">
                      <span
                        aria-hidden
                        className="mt-1.5 h-px w-3.5 shrink-0 bg-ash-3 transition-colors duration-500 group-hover:bg-warn/60"
                      />
                      <span className="min-w-0">
                        <span className="block label-mono text-ash-3 transition-colors duration-500 group-hover:text-warn/80">
                          {t.weaknessLabel}
                        </span>
                        <span className="mt-1.5 block text-[0.75rem] leading-relaxed text-ash-2">
                          {card.weakness}
                        </span>
                      </span>
                    </div>
                  </div>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        {/* the assembled formula, as a strip */}
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-line bg-panel/50 px-6 py-6 text-center">
            <span className="label-mono text-ash-3">{dict.consensus.formulaLabel}</span>
            <IconArrow className="size-3.5 text-ash-3" />
            <code className="font-mono text-[0.9375rem] tracking-tight text-chalk">
              {dict.consensus.formula}
            </code>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
