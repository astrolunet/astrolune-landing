"use client";

import { useI18n } from "@/components/i18n-provider";
import { Counter, Reveal, useInView } from "@/components/motion";
import {
  ButtonGhost,
  CornerTicks,
  IconMoon,
  SectionLabel,
} from "@/components/ui";
import { POTB } from "@/lib/chain";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/* One segment of the reward split. The fill sits inside an overflow-hidden
   track, so it animates through useInView rather than <Reveal> — a transform
   would translate it out of the clip box and it would never intersect. */
function RewardBar({
  bp,
  delay,
  index,
}: {
  bp: number;
  delay: number;
  index: number;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const pct = bp / 100;
  // Three tones of the same white — the split reads as one bar, not a pie chart.
  const tone = ["bg-chalk", "bg-chalk/55", "bg-chalk/28"][index];

  return (
    <div ref={ref} className="h-[3px] w-full overflow-hidden bg-line">
      <div
        className={`relative h-[3px] ${tone}`}
        style={{
          width: inView ? "100%" : "0%",
          transition: `width 1.3s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        }}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 right-0 w-6 animate-shimmer bg-white/40"
          style={{ animationDelay: `${delay}ms` }}
        />
      </div>
      <span className="sr-only">{pct}%</span>
    </div>
  );
}

export function Coin() {
  const { locale, dict } = useI18n();
  const t = dict.home.coin;
  const at = (path: string) => localePath(locale, path);

  const facts = [
    { k: t.facts.ticker, v: SITE.coin.ticker },
    { k: t.facts.decimals, v: String(SITE.coin.decimals) },
    { k: t.facts.unit, v: `10⁻${SITE.coin.decimals} ${SITE.coin.ticker}` },
    { k: t.facts.type, v: "u64" },
  ];

  const rewards = [
    { bp: POTB.rewardFlatBp, desc: t.rewards.flat },
    { bp: POTB.rewardWeightedBp, desc: t.rewards.weighted },
    { bp: POTB.rewardBondedBp, desc: t.rewards.bonded },
  ];

  return (
    <section
      id="coin"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail relative grid gap-14 lg:grid-cols-2 lg:gap-20">
        {/* left — copy + the four hard facts */}
        <div>
          <Reveal>
            <SectionLabel index="06">{t.label}</SectionLabel>
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

          <div className="mt-10 grid grid-cols-2 gap-px border border-line bg-line">
            {facts.map((m, i) => (
              <Reveal
                key={m.k}
                delay={i * 90}
                className="bg-panel px-5 py-6 transition-colors duration-500 hover:bg-panel-2"
              >
                <p className="label-mono text-ash-3">{m.k}</p>
                <p className="display mt-3 text-xl text-chalk md:text-2xl">
                  {m.v}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={280}>
            <div className="mt-9">
              <ButtonGhost href={at(ROUTES.lune)} size="sm" arrow>
                {t.cta}
              </ButtonGhost>
            </div>
          </Reveal>
        </div>

        {/* right — the reward split */}
        <Reveal delay={140}>
          <div className="group relative panel rounded-lg p-7 md:p-9">
            <CornerTicks className="absolute inset-0" />
            <div className="flex items-center justify-between">
              <p className="label-mono text-ash">{t.rewardTitle}</p>
              <span className="grid size-8 place-items-center rounded-full border border-line-2 bg-panel-3">
                <IconMoon className="size-3.5 text-chalk/70" />
              </span>
            </div>

            {/* one stacked hairline bar, then the legend beneath it */}
            <div className="mt-9 flex gap-1.5">
              {rewards.map((r, i) => (
                <div key={r.desc} style={{ flexGrow: r.bp }}>
                  <RewardBar bp={r.bp} delay={i * 140} index={i} />
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-6">
              {rewards.map((r, i) => (
                <div
                  key={r.desc}
                  className="flex items-baseline justify-between gap-6 border-b border-line pb-5 last:border-b-0 last:pb-0"
                >
                  <span className="flex items-baseline gap-3">
                    <span
                      aria-hidden
                      className={`inline-block size-1.5 shrink-0 translate-y-[-1px] ${
                        ["bg-chalk", "bg-chalk/55", "bg-chalk/28"][i]
                      }`}
                    />
                    <span className="text-[0.8125rem] leading-snug text-ash">
                      {r.desc}
                    </span>
                  </span>
                  <span className="display shrink-0 text-lg text-chalk tabular-nums">
                    <Counter to={r.bp / 100} decimals={0} suffix="%" />
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-9 border-t border-line pt-6">
              <p className="text-xs leading-relaxed text-ash-2">
                {t.rewardNote}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
