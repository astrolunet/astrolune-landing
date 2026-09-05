"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { SplitBar } from "@/components/site/charts";
import { CornerTicks, IconShield, SectionLabel } from "@/components/ui";
import { POTB } from "@/lib/chain";

/**
 * The 60 / 25 / 15 reward split, and the boundary that keeps the last bucket
 * from turning the whole model into Proof of Stake.
 *
 * The bond panel is deliberately given equal visual weight to the split itself.
 * "The bond carries no consensus weight" is the single most load-bearing
 * sentence in the economics, and burying it in a footnote would be the easiest
 * way to accidentally misrepresent the protocol.
 */
export function Rewards() {
  const { dict } = useI18n();
  const t = dict.consensus.rewards;
  const labels = dict.home.coin.rewards;

  const parts = [
    { label: labels.flat, pct: POTB.rewardFlatBp / 100 },
    { label: labels.weighted, pct: POTB.rewardWeightedBp / 100 },
    { label: labels.bonded, pct: POTB.rewardBondedBp / 100 },
  ];

  return (
    <section
      id="rewards"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="06">{t.label}</SectionLabel>
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

        <div className="mt-12 grid gap-3 lg:grid-cols-12">
          {/* the split */}
          <Reveal delay={160} className="lg:col-span-7">
            <div className="group relative h-full panel rounded-xl p-7 md:p-8">
              <CornerTicks className="absolute inset-0" />
              <p className="label-mono text-ash">{dict.home.coin.rewardTitle}</p>
              <div className="mt-8">
                <SplitBar parts={parts} />
              </div>
              <p className="mt-8 border-t border-line pt-6 text-[0.75rem] leading-relaxed text-ash-2">
                {t.note}
              </p>
            </div>
          </Reveal>

          {/* the bond boundary */}
          <Reveal delay={240} className="lg:col-span-5">
            <div className="group relative flex h-full flex-col panel rounded-xl p-7 md:p-8">
              <CornerTicks className="absolute inset-0" />
              <span className="grid size-10 place-items-center rounded-lg border border-line-2 bg-panel-3 text-chalk/85">
                <IconShield className="size-4.5" />
              </span>
              <h3 className="mt-6 text-lg font-medium tracking-tight text-chalk">
                {t.bondTitle}
              </h3>
              <p className="mt-4 text-[0.8125rem] leading-relaxed text-ash">
                {t.bondBody}
              </p>

              {/* the boundary, drawn */}
              <div className="mt-auto pt-8">
                <div className="flex items-stretch gap-px overflow-hidden rounded-lg border border-line">
                  <div className="flex-1 bg-panel-2 px-4 py-3.5">
                    <p className="label-mono text-ash-3">
                      {dict.consensus.formulaLabel}
                    </p>
                    <p className="mt-2 font-mono text-[0.75rem] text-ash-2">
                      TBS · TGW · NDM · COD
                    </p>
                  </div>
                  <div className="flex-1 bg-panel-2 px-4 py-3.5">
                    <p className="label-mono text-ash-3">
                      {dict.scan.validator.bond}
                    </p>
                    <p className="mt-2 font-mono text-[0.75rem] text-chalk/90">
                      {POTB.rewardBondedBp / 100}% {dict.common.total.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
