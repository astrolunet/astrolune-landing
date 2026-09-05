"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Reveal, ScrambleText } from "@/components/motion";
import { StatusDot, type Tone } from "@/components/status-dot";
import {
  ButtonGhost,
  ButtonSolid,
  CornerTicks,
  IconClock,
  IconSpinner,
  IconTelegram,
  SectionLabel,
} from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
import { ENDPOINTS, LINKS, NETWORK_LIVE } from "@/lib/site";

/* ------------------------------------------------------------------
   Roadmap — vertical timeline. The state of each step is the state the
   specification records, not the state it was planned to be in: two of
   the five are blocked on an unresolved word size.
   ------------------------------------------------------------------ */
type State = "active" | "partial" | "blocked";

const STATE_META: Record<
  State,
  { icon: typeof IconClock; tone: Tone; spin: boolean }
> = {
  active: { icon: IconSpinner, tone: "warn", spin: true },
  partial: { icon: IconSpinner, tone: "warn", spin: false },
  blocked: { icon: IconClock, tone: "idle", spin: false },
};

export function Roadmap() {
  const { dict } = useI18n();
  const t = dict.home.roadmap;

  const steps: { state: State; phase: string; period: string; title: string; body: string }[] =
    [
      { state: "active", ...t.items.s1 },
      { state: "blocked", ...t.items.s2 },
      { state: "blocked", ...t.items.s3 },
      { state: "partial", ...t.items.s4 },
      { state: "partial", ...t.items.s5 },
    ];

  return (
    <section
      id="roadmap"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail relative">
        <div className="max-w-2xl">
          <Reveal>
            <SectionLabel index="08">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-[0.9375rem] leading-relaxed text-ash">
              {t.body}
            </p>
          </Reveal>
        </div>

        <div className="relative mt-16">
          {/* rail */}
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-[calc(11rem+7px)]"
          />

          <div className="space-y-px">
            {steps.map((r, i) => {
              const meta = STATE_META[r.state];
              const Icon = meta.icon;
              return (
                <Reveal
                  key={r.phase}
                  delay={i * 90}
                  className="group relative flex flex-col gap-4 py-8 md:flex-row md:gap-10"
                >
                  {/* phase column */}
                  <div className="shrink-0 md:w-44">
                    <p className="label-mono text-ash-3">{r.phase}</p>
                    <p className="mt-2 font-mono text-sm text-ash">
                      {String(i + 1).padStart(2, "0")} / 0{steps.length}
                    </p>
                  </div>

                  {/* node */}
                  <div className="absolute top-8 left-0 md:left-44">
                    <span
                      className={`relative grid size-[15px] place-items-center rounded-full border bg-void transition-all duration-500 ${
                        r.state === "blocked"
                          ? "border-line-2"
                          : "border-chalk/45 group-hover:border-chalk"
                      }`}
                    >
                      <StatusDot
                        tone={meta.tone}
                        pulse={r.state === "active"}
                        className="scale-75"
                      />
                    </span>
                  </div>

                  {/* body */}
                  <div className="min-w-0 flex-1 pl-8 md:pl-10">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-medium tracking-tight text-chalk md:text-xl">
                        {r.title}
                      </h3>
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 label-mono text-ash-2">
                        <Icon
                          className={`size-3 ${meta.spin ? "animate-spin-slow" : ""}`}
                        />
                        {r.period}
                      </span>
                    </div>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-ash">
                      {r.body}
                    </p>
                  </div>

                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-line-2 transition-transform duration-700 group-hover:scale-x-100"
                  />
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Faq — accordion
   ------------------------------------------------------------------ */
export function Faq() {
  const { dict } = useI18n();
  const t = dict.home.faq;
  const [open, setOpen] = useState<number | null>(0);

  const items = [
    t.items.q1,
    t.items.q2,
    t.items.q3,
    t.items.q4,
    t.items.q5,
    t.items.q6,
  ];

  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal>
            <SectionLabel index="09">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,2.75rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 text-sm leading-relaxed text-ash">{t.body}</p>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8">
              <ButtonGhost href={LINKS.telegram} size="sm">
                <span className="flex items-center gap-2">
                  <IconTelegram className="size-3.5" />
                  {dict.common.telegram}
                </span>
              </ButtonGhost>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <div className="border-t border-line">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={item.q} delay={i * 70}>
                  <div className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                    >
                      <span className="flex items-baseline gap-5">
                        <span className="label-mono text-ash-3">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className={`text-[0.9375rem] font-medium transition-colors duration-300 md:text-base ${
                            isOpen
                              ? "text-chalk"
                              : "text-ash group-hover:text-chalk"
                          }`}
                        >
                          {item.q}
                        </span>
                      </span>
                      {/* plus / minus */}
                      <span className="relative grid size-7 shrink-0 place-items-center rounded-full border border-line transition-colors duration-300 group-hover:border-line-3">
                        <span className="absolute h-px w-3 bg-chalk/80" />
                        <span
                          className={`absolute h-3 w-px bg-chalk/80 transition-transform duration-400 ${
                            isOpen ? "rotate-90 opacity-0" : ""
                          }`}
                        />
                      </span>
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-2xl pb-7 pl-[3.1rem] text-sm leading-relaxed text-ash">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   CtaBand — full-bleed closing call to action
   ------------------------------------------------------------------ */
export function CtaBand() {
  const { locale, dict } = useI18n();
  const t = dict.home.cta;
  const at = (path: string) => localePath(locale, path);

  return (
    <section className="relative overflow-hidden border-t border-line py-28 md:py-36">
      
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 size-[42rem] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.16), transparent 66%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 noise-layer opacity-[0.12]" />

      <div className="container-rail relative text-center">
        <Reveal>
          <p className="label-mono text-ash-2">
            <ScrambleText text={t.eyebrow} />
          </p>
        </Reveal>
        <Reveal delay={90}>
          <h2 className="display mx-auto mt-7 max-w-4xl text-graphite text-[clamp(2.1rem,6vw,4.5rem)]">
            {t.title1}
            <br />
            {t.title2}
          </h2>
        </Reveal>
        <Reveal delay={180}>
          <p className="mx-auto mt-7 max-w-lg text-[0.9375rem] leading-relaxed text-ash">
            {t.body}
          </p>
        </Reveal>
        <Reveal delay={260}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonSolid href={at(ROUTES.node)} size="lg" arrow>
              {dict.common.runNode}
            </ButtonSolid>
            <ButtonGhost href={at(DOC_ROUTES.potb)} size="lg">
              {dict.common.readDocs}
            </ButtonGhost>
          </div>
        </Reveal>

        {/* RPC endpoint chip — dark until the endpoint actually answers */}
        <Reveal delay={340}>
          <div className="relative mx-auto mt-14 flex max-w-md items-center gap-3 panel rounded-lg px-4 py-3">
            <CornerTicks className="absolute inset-0" />
            <span className="label-mono shrink-0 text-ash-3">{t.rpcLabel}</span>
            <code className="min-w-0 flex-1 truncate text-left font-mono text-[0.8125rem] text-ash">
              {ENDPOINTS.testnet.rpc}
            </code>
            <StatusDot tone={NETWORK_LIVE ? "live" : "idle"} />
          </div>
        </Reveal>

        {!NETWORK_LIVE && (
          <Reveal delay={400}>
            <p className="mx-auto mt-5 max-w-md text-xs leading-relaxed text-ash-3">
              {dict.common.preLaunchNotice}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
