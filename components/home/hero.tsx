"use client";

import { GridBackdrop } from "@/components/grid-backdrop";
import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import {
  ButtonGhost,
  ButtonSolid,
  CornerTicks,
  IconArrow,
  IconCheck,
  IconCube,
  IconMoon,
  IconShield,
  IconSpinner,
  Slashes,
} from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";

/* A floating status tile — the swapping / swapped / processing cards */
function StatusCard({
  icon,
  badge,
  status,
  value,
  className = "",
  float = "animate-float",
  delay = "0s",
}: {
  icon: React.ReactNode;
  badge: React.ReactNode;
  status: string;
  value: string;
  className?: string;
  float?: string;
  delay?: string;
}) {
  return (
    <div
      className={`group absolute ${className} ${float}`}
      style={{ animationDelay: delay }}
    >
      <div className="relative">
        <div className="relative grid size-[82px] place-items-center panel rounded-[10px] text-chalk/85 transition-all duration-500 group-hover:border-line-3 group-hover:text-chalk">
          <CornerTicks className="absolute inset-0" />
          {icon}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[10px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(80% 80% at 50% 0%, rgba(255,255,255,0.1), transparent 70%)",
            }}
          />
          {/* Anchored to the tile, not the wrapper — the wrapper is as wide
              as the status text, which would fling the badge sideways. */}
          <span className="absolute -top-2.5 -right-2.5 grid size-6 place-items-center rounded-full border border-line-2 bg-panel-3 text-chalk/70">
            {badge}
          </span>
        </div>

        <div className="mt-3 space-y-1.5">
          <p className="label-mono text-ash-2">{status}</p>
          <p className="font-mono text-[0.8125rem] text-chalk/90">{value}</p>
        </div>

        <Slashes className="mt-3 block" />
      </div>
    </div>
  );
}

export function Hero() {
  const { locale, dict } = useI18n();
  const t = dict.home.hero;
  const at = (path: string) => localePath(locale, path);

  return (
    <section
      id="home"
      className="relative isolate min-h-[100svh] overflow-hidden pt-[68px]"
    >
      <GridBackdrop />

      {/* Floating status cards, hidden on small screens where they'd collide.
          The inner wrapper carries no padding, so `left-0`/`right-0` line up
          with the rail's content edge rather than its padding box. */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="container-rail h-full">
          <div className="relative h-full">
            <StatusCard
              className="top-[13%] left-0 pointer-events-auto"
              icon={<IconClockish />}
              badge={<IconSpinner className="size-3.5 animate-spin-slow" />}
              status={t.cards.tbs.status}
              value={t.cards.tbs.value}
              delay="0s"
            />
            <StatusCard
              className="top-[13%] right-0 pointer-events-auto"
              icon={<IconShield className="size-7" />}
              badge={<IconCheck className="size-3.5 text-chalk/70" />}
              status={t.cards.quorum.status}
              value={t.cards.quorum.value}
              float="animate-float-slow"
              delay="1.4s"
            />
            <StatusCard
              className="top-[28%] left-1/2 -translate-x-1/2 pointer-events-auto"
              icon={<IconCube className="size-7" />}
              badge={<span className="size-1.5 rounded-full bg-chalk/60" />}
              status={t.cards.committee.status}
              value={t.cards.committee.value}
              float="animate-float"
              delay="2.6s"
            />
          </div>
        </div>
      </div>

      {/* copy block, bottom-aligned like the reference */}
      <div className="container-rail relative flex min-h-[calc(100svh-68px)] flex-col justify-end pb-16 md:pb-20">
        <div className="max-w-5xl">
          <Reveal delay={60}>
            <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-line bg-panel/70 py-1.5 pr-5 pl-1.5 backdrop-blur">
              <span className="grid size-7 place-items-center rounded-full border border-line-2 bg-panel-3">
                <IconMoon className="size-3.5 text-chalk/80" />
              </span>
              <span className="label-mono text-ash">{t.eyebrow}</span>
            </div>
          </Reveal>

          <Reveal delay={130}>
            {/* Sized so each line stays on one line at every breakpoint. */}
            <h1 className="display text-graphite text-[clamp(1.75rem,5.15vw,4.35rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mt-7 max-w-xl text-[0.9375rem] leading-relaxed text-ash md:text-base">
              {t.body}
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonSolid href={at(ROUTES.node)} arrow>
                {dict.common.runNode}
              </ButtonSolid>
              <ButtonGhost href={at(ROUTES.docs)}>
                {dict.common.readDocs}
              </ButtonGhost>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <p className="mt-8 max-w-lg border-l border-line-2 pl-4 text-[0.75rem] leading-relaxed text-ash-3">
              {t.stage}
            </p>
          </Reveal>
        </div>

        {/* "Introducing Lune" promo card, bottom-right */}
        <Reveal
          delay={380}
          className="absolute right-5 bottom-16 hidden w-[352px] md:right-8 md:bottom-20 lg:block"
        >
          <a
            href={at(ROUTES.lune)}
            className="group relative flex items-center gap-4 panel rounded-xl p-4 transition-all duration-500 hover:border-line-3 hover:bg-panel-2"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-lg border border-line-2 bg-panel-3">
              <IconMoon className="size-5 text-chalk/85" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block label-mono text-chalk">{t.promoLabel}</span>
              <span className="mt-1.5 block text-[0.8125rem] text-ash-2">
                {t.promoBody}
              </span>
            </span>
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line-2 text-ash transition-all duration-400 group-hover:border-line-3 group-hover:bg-chalk group-hover:text-void">
              <IconArrow className="size-3.5" />
            </span>
          </a>
        </Reveal>
      </div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="label-mono text-ash-3">{t.scroll}</span>
        <span className="relative h-8 w-px overflow-hidden bg-line-2">
          <span className="absolute inset-x-0 top-0 h-3 animate-[trace_2.4s_ease-in-out_infinite] bg-chalk/70" />
        </span>
      </div>
    </section>
  );
}

/** A clock face drawn at tile scale — the TBS card's mark. */
function IconClockish() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden>
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.1" />
      <path
        d="M12 6.8V12l3.6 2.2"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path d="M12 2.6v1.6M12 19.8v1.6M2.6 12h1.6M19.8 12h1.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
