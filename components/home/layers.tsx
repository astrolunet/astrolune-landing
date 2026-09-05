"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n-provider";
import { Reveal, TiltCard } from "@/components/motion";
import {
  ButtonGhost,
  CornerTicks,
  IconArrow,
  SectionLabel,
  Slashes,
} from "@/components/ui";
import { POTB, tbs } from "@/lib/chain";
import { localePath } from "@/lib/i18n/config";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";

/**
 * The network, as layers.
 *
 * This section used to carry the four PoTB weight components. Those belong to
 * the consensus model rather than to the network as a whole, so they moved to
 * their own page and this section now does what the home page should: name each
 * layer of the system once and hand the reader off to the page that covers it.
 */

/* ------------------------------------------------------------------
   TBS curve — ln(1 + d × c) plotted against the protocol day, with the
   hard cap drawn as headroom it never reaches. Computed from the same
   function the core uses, so the shape cannot drift from the spec.
   ------------------------------------------------------------------ */
const SPAN_DAYS = 1460; // four years
const W = 320;
const H = 132;

function tbsPath() {
  const pts: string[] = [];
  for (let d = 0; d <= SPAN_DAYS; d += 20) {
    const x = (d / SPAN_DAYS) * W;
    const y = H - (tbs(d, 0.99) / POTB.capTbs) * H;
    pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

const TBS_PATH = tbsPath();
const CANDIDATE_Y = H - (POTB.minTbsCandidate / POTB.capTbs) * H;
const VALIDATOR_Y = H - (POTB.minTbsValidator / POTB.capTbs) * H;

function TbsCurve() {
  return (
    <div className="relative mt-8">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-[132px] w-full overflow-visible"
        aria-hidden
        preserveAspectRatio="none"
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1="0"
            x2={W}
            y1={H * f}
            y2={H * f}
            stroke="rgba(255,255,255,0.055)"
            strokeWidth="1"
          />
        ))}

        {[
          { y: CANDIDATE_Y, v: POTB.minTbsCandidate },
          { y: VALIDATOR_Y, v: POTB.minTbsValidator },
        ].map((t) => (
          <g key={t.v}>
            <line
              x1="0"
              x2={W}
              y1={t.y}
              y2={t.y}
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
            <text
              x={W - 2}
              y={t.y - 5}
              textAnchor="end"
              className="fill-white/35 font-mono"
              style={{ fontSize: 8, letterSpacing: "0.12em" }}
            >
              TBS {t.v}
            </text>
          </g>
        ))}

        <path
          d={`${TBS_PATH} L${W} ${H} L0 ${H} Z`}
          fill="url(#tbsFill)"
          opacity="0.5"
        />
        <path
          d={TBS_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.78)"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d={TBS_PATH}
          fill="none"
          stroke="rgba(255,255,255,1)"
          strokeWidth="1.6"
          strokeDasharray="14 340"
          style={{ animation: "dashFlow 5.2s linear infinite" }}
        />

        <defs>
          <linearGradient id="tbsFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="mt-2 flex items-center justify-between font-mono text-[0.625rem] text-ash-3">
        <span>day 0</span>
        <span>day {POTB.loyaltyThresholdDays} — loyalty starts</span>
        <span>day {SPAN_DAYS}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Fan-in — many transactions converging into one committed block,
   which is what the coin ultimately pays for.
   ------------------------------------------------------------------ */
function FlowDiagram() {
  return (
    <div className="relative mt-8 h-[152px]">
      <svg viewBox="0 0 320 150" className="size-full overflow-visible" aria-hidden>
        {[0, 1, 2].map((row) => (
          <g key={row}>
            <path
              d={`M8 ${30 + row * 45} H140 Q160 ${30 + row * 45} 160 75 H312`}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
            <path
              d={`M8 ${30 + row * 45} H140 Q160 ${30 + row * 45} 160 75 H312`}
              fill="none"
              stroke="rgba(255,255,255,0.72)"
              strokeWidth="1.1"
              strokeDasharray="10 230"
              style={{
                animation: `dashFlow ${3.4 + row * 0.5}s linear ${row * 0.6}s infinite`,
              }}
            />
            <circle cx="8" cy={30 + row * 45} r="2.4" fill="rgba(255,255,255,0.55)" />
          </g>
        ))}
        <rect
          x="296"
          y="63"
          width="24"
          height="24"
          rx="3"
          fill="#0d0d0d"
          stroke="rgba(255,255,255,0.2)"
        />
      </svg>
    </div>
  );
}

/** The animated hairline bars used by the two narrow cells. */
function Bars() {
  return (
    <div className="mt-8 flex items-end justify-between">
      <div className="flex gap-1">
        {Array.from({ length: 22 }).map((_, b) => (
          <span
            key={b}
            className="w-[3px] bg-chalk/25 transition-colors duration-500 group-hover:bg-chalk/55"
            style={{
              height: `${10 + ((b * 7) % 26)}px`,
              animation: `pulseGlow ${2.6 + (b % 5) * 0.4}s ease-in-out ${b * 0.06}s infinite`,
            }}
          />
        ))}
      </div>
      <Slashes />
    </div>
  );
}

export function Layers() {
  const { locale, dict } = useI18n();
  const t = dict.home.features;
  const at = (path: string) => localePath(locale, path);

  const cards = [
    {
      id: "01",
      span: "lg:col-span-7",
      href: at(ROUTES.network),
      art: <TbsCurve />,
      ...t.items.consensus,
    },
    {
      id: "02",
      span: "lg:col-span-5",
      href: at(DOC_ROUTES.vm),
      art: <Bars />,
      ...t.items.vm,
    },
    {
      id: "03",
      span: "lg:col-span-4",
      href: at(DOC_ROUTES.languages),
      art: <Bars />,
      ...t.items.languages,
    },
    {
      id: "04",
      span: "lg:col-span-8",
      href: at(ROUTES.lune),
      art: <FlowDiagram />,
      ...t.items.coin,
    },
  ];

  return (
    <section
      id="features"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-4xl">
            <Reveal>
              <SectionLabel index="04">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
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
          <Reveal delay={220}>
            <ButtonGhost href={at(ROUTES.network)} size="sm" arrow>
              {t.cta}
            </ButtonGhost>
          </Reveal>
        </div>

        {/* bento grid — every cell is a door into a deeper page */}
        <div className="mt-14 grid grid-cols-1 gap-3 lg:grid-cols-12">
          {cards.map((f, i) => (
            <Reveal key={f.id} delay={i * 100} className={f.span}>
              <TiltCard className="h-full">
                <Link
                  href={f.href}
                  className="group relative flex h-full flex-col overflow-hidden panel rounded-lg p-7 transition-colors duration-500 hover:border-line-3"
                >
                  <CornerTicks className="absolute inset-0 z-30" />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:scale-x-100"
                  />

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="label-mono text-ash-2">{f.tag}</span>
                    <span className="flex items-center gap-3">
                      <span className="font-mono text-[0.6875rem] text-ash-3">
                        {f.id}
                      </span>
                      <IconArrow className="size-3.5 text-ash-3 transition-all duration-400 group-hover:translate-x-0.5 group-hover:text-chalk" />
                    </span>
                  </div>

                  <h3 className="relative z-10 mt-6 text-xl font-medium tracking-tight text-chalk md:text-2xl">
                    {f.title}
                  </h3>
                  <p className="relative z-10 mt-3.5 max-w-md text-sm leading-relaxed text-ash">
                    {f.body}
                  </p>

                  <div className="relative z-10 mt-auto">{f.art}</div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
