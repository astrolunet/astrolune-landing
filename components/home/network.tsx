"use client";

import { useI18n } from "@/components/i18n-provider";
import { Counter, Marquee, Reveal } from "@/components/motion";
import { StatusPill } from "@/components/status-dot";
import { SectionLabel } from "@/components/ui";
import { NETWORK_FACTS, POTB, quorumThreshold } from "@/lib/chain";

/* ------------------------------------------------------------------
   Ticker — infinite marquee strip under the hero
   ------------------------------------------------------------------ */
export function Ticker() {
  const { dict } = useI18n();
  const items = Object.values(dict.home.ticker);

  return (
    <div className="group relative border-y border-line bg-ink/60 py-4">
      <Marquee>
        {items.map((t, i) => (
          <span key={`${t}-${i}`} className="flex items-center">
            <span className="label-mono px-7 text-ash-2 transition-colors duration-300 hover:text-chalk">
              {t}
            </span>
            <span className="size-1 rotate-45 bg-ash-3" />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ------------------------------------------------------------------
   Network — the four headline protocol parameters
   ------------------------------------------------------------------ */
export function Network() {
  const { dict } = useI18n();
  const t = dict.home.network;

  // Every figure here is a consensus parameter from `lib/chain.ts`, not
  // telemetry — which is why it can be stated before the network exists.
  const stats = [
    {
      label: t.stats.blockTime,
      value: NETWORK_FACTS.blockTimeMs.light,
      suffix: ` ${t.units.ms}`,
      sub: t.subs.blockTime,
    },
    {
      label: t.stats.committee,
      value: POTB.committeeSize,
      suffix: "",
      sub: t.subs.committee,
    },
    {
      label: t.stats.epoch,
      value: POTB.epochDays,
      suffix: ` ${t.units.day}`,
      sub: t.subs.epoch,
    },
    {
      label: t.stats.quorum,
      value: quorumThreshold(POTB.committeeSize),
      suffix: ` ${t.units.ofCommittee}`,
      sub: t.subs.quorum,
    },
  ];

  return (
    <section id="network" className="relative overflow-hidden py-24 md:py-32">
      <div className="container-rail relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <Reveal>
              <SectionLabel index="03">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
                {t.title1}
                <br />
                {t.title2}
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <StatusPill tone="live">{t.badge}</StatusPill>
          </Reveal>
        </div>

        {/* metric grid — hairline dividers, no card chrome */}
        <div className="mt-14 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 90}
              className="group relative border-b border-line px-1 py-9 sm:px-6 lg:border-r lg:first:border-l"
            >
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
              />
              <p className="label-mono text-ash-3">
                / {String(i + 1).padStart(2, "0")}
              </p>
              <p className="display mt-5 text-[clamp(1.9rem,3.4vw,2.75rem)] text-chalk">
                <Counter to={s.value} decimals={0} suffix={s.suffix} />
              </p>
              <p className="mt-3 label-mono text-ash-2">{s.label}</p>
              <p className="mt-2 text-[0.75rem] leading-snug text-ash-3">
                {s.sub}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={220}>
          <p className="mt-10 max-w-2xl text-[0.8125rem] leading-relaxed text-ash-2">
            {t.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
