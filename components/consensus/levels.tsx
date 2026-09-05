"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { WeightCalculator } from "@/components/consensus/weight-calculator";
import { IconCheck, SectionLabel } from "@/components/ui";
import { POTB } from "@/lib/chain";

/**
 * The participation ladder beside the live weight calculator.
 *
 * Copy still lives under `dict.home.levels` — the namespace predates this
 * component moving off the home page and renaming it would churn both
 * dictionaries for no reader-visible gain.
 */
export function Levels() {
  const { dict } = useI18n();
  const t = dict.home.levels;

  const levels = [
    {
      ...t.items.relay,
      req: "—",
    },
    {
      ...t.items.candidate,
      req: `TBS ≥ ${POTB.minTbsCandidate}`,
    },
    {
      ...t.items.validator,
      req: `TBS ≥ ${POTB.minTbsValidator} · TGW ≥ ${POTB.minTgwValidator}`,
    },
  ];

  return (
    <section
      id="levels"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* left — the ladder */}
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="05">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
                {t.title1}
                <br />
                {t.title2}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash">
                {t.body}
              </p>
            </Reveal>

            <div className="mt-11 space-y-px">
              {levels.map((l, i) => (
                <Reveal
                  key={l.name}
                  delay={i * 100}
                  className="group relative border-b border-line py-6"
                >
                  {/* the rung mark — filled proportionally to the level */}
                  <div className="flex items-start gap-4">
                    <span className="mt-0.5 flex shrink-0 flex-col gap-1">
                      {[0, 1, 2].map((r) => (
                        <span
                          key={r}
                          className={`block h-[3px] w-4 ${
                            r <= i ? "bg-chalk/80" : "bg-line-2"
                          }`}
                        />
                      ))}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-[0.9375rem] font-medium tracking-tight text-chalk">
                          {l.name}
                        </h3>
                        <span className="font-mono text-[0.6875rem] text-ash-3">
                          {l.req}
                        </span>
                      </div>
                      <p className="mt-2 text-[0.8125rem] leading-relaxed text-ash">
                        {l.desc}
                      </p>
                      <p className="mt-3 flex items-center gap-2 label-mono text-ash-3">
                        <IconCheck className="size-3" />
                        {l.entry}
                      </p>
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-chalk/40 transition-transform duration-700 group-hover:scale-x-100"
                  />
                </Reveal>
              ))}
            </div>
          </div>

          {/* right — the calculator, driving the real formula */}
          <Reveal delay={160} className="lg:col-span-7">
            <WeightCalculator />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
