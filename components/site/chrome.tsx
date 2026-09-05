import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/motion";
import { CornerTicks, IconChevron } from "@/components/ui";

/* ------------------------------------------------------------------
   PageHero — the masthead every inner page opens with
   ------------------------------------------------------------------ */

export type Crumb = { label: string; href?: string };

/**
 * Mono breadcrumb rail: `/ SCAN / BLOCKS`. The last crumb is the current page
 * and is never a link.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2">
      {items.map((item, i) => {
        const last = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-2">
            {i > 0 && (
              <IconChevron
                className="size-3 -rotate-90 text-ash-3"
                aria-hidden
              />
            )}
            {item.href && !last ? (
              <Link
                href={item.href}
                className="label-mono text-ash-2 transition-colors duration-300 hover:text-chalk"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={last ? "page" : undefined}
                className={`label-mono ${last ? "text-chalk" : "text-ash-2"}`}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHero({
  crumbs,
  title,
  subtitle,
  aside,
  wide = false,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  subtitle?: string;
  /** Right-hand slot — status pill, actions, a headline figure. */
  aside?: ReactNode;
  /** Uses the wider data rail, matching a dashboard body below it. */
  wide?: boolean;
  /** Full-width slot under the copy — a search bar, a stat strip. */
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-line pt-[68px]">
      <div
        aria-hidden
        className="grid-lattice pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
      />
      <div aria-hidden className="vignette pointer-events-none absolute inset-0" />

      <div
        className={`${wide ? "container-wide" : "container-rail"} relative py-12 md:py-16`}
      >
        <Reveal>
          <Breadcrumbs items={crumbs} />
        </Reveal>

        <div className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <Reveal delay={70}>
              <h1 className="display text-graphite text-[clamp(1.85rem,4.4vw,3.4rem)]">
                {title}
              </h1>
            </Reveal>
            {subtitle && (
              <Reveal delay={140}>
                <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
                  {subtitle}
                </p>
              </Reveal>
            )}
          </div>

          {aside && (
            <Reveal delay={200} className="shrink-0">
              {aside}
            </Reveal>
          )}
        </div>

        {children && <div className="mt-10">{children}</div>}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
   Section — the standard content band
   ------------------------------------------------------------------ */

export function Section({
  id,
  children,
  className = "",
  lattice = false,
  wide = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Adds the faint blueprint grid behind the band. */
  lattice?: boolean;
  /** Uses the wider data rail. */
  wide?: boolean;
}) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-16 md:py-24 ${className}`}
    >
      {lattice && (
        <div
          aria-hidden
          className="grid-lattice pointer-events-none absolute inset-0 opacity-40 mask-radial"
        />
      )}
      <div className={`${wide ? "container-wide" : "container-rail"} relative`}>
        {children}
      </div>
    </section>
  );
}

/** `/ 02 — LABEL` eyebrow plus a display heading and optional blurb. */
export function SectionHead({
  index,
  label,
  title,
  body,
  aside,
}: {
  index?: string;
  label?: string;
  title: string;
  body?: string;
  aside?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {label && (
          <Reveal>
            <div className="flex items-center gap-3 label-mono text-ash-2">
              {index && <span className="text-ash-3">/ {index}</span>}
              <span className="h-px w-8 bg-line-2" />
              <span className="text-ash">{label}</span>
            </div>
          </Reveal>
        )}
        <Reveal delay={70}>
          <h2
            className={`display text-fade-b text-[clamp(1.5rem,3.2vw,2.4rem)] ${
              label ? "mt-6" : ""
            }`}
          >
            {title}
          </h2>
        </Reveal>
        {body && (
          <Reveal delay={140}>
            <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
              {body}
            </p>
          </Reveal>
        )}
      </div>
      {aside && (
        <Reveal delay={180} className="shrink-0">
          {aside}
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   Panel — the card surface
   ------------------------------------------------------------------ */

export function Panel({
  children,
  className = "",
  ticks = false,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  /** Bracket marks on the corners, as on the hero tiles. */
  ticks?: boolean;
  padded?: boolean;
}) {
  return (
    <div
      className={`group panel relative rounded-xl ${padded ? "p-5 md:p-6" : ""} ${className}`}
    >
      {ticks && <CornerTicks className="inset-0" />}
      {children}
    </div>
  );
}

export function PanelHead({
  title,
  note,
  action,
}: {
  title: string;
  note?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h3 className="label-mono text-chalk">{title}</h3>
        {note && (
          <p className="mt-2 max-w-lg text-[0.75rem] leading-relaxed text-ash-2">
            {note}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------
   Notice — the pre-launch and insecure-crypto banners
   ------------------------------------------------------------------ */

export function Notice({
  children,
  tone = "muted",
  className = "",
}: {
  children: ReactNode;
  tone?: "muted" | "warn";
  className?: string;
}) {
  const tones = {
    muted: "border-line bg-panel/60 text-ash-2",
    warn: "border-warn/25 bg-warn/[0.06] text-warn/90",
  } as const;

  return (
    <div
      className={`flex gap-3 rounded-xl border px-4 py-3.5 text-[0.75rem] leading-relaxed ${tones[tone]} ${className}`}
    >
      <span
        aria-hidden
        className={`mt-1.5 h-px w-4 shrink-0 ${
          tone === "warn" ? "bg-warn/50" : "bg-line-3"
        }`}
      />
      <p className="min-w-0">{children}</p>
    </div>
  );
}

/* ------------------------------------------------------------------
   InfoRow — the label/value rows on every detail page
   ------------------------------------------------------------------ */

export function InfoList({ children }: { children: ReactNode }) {
  return <dl className="divide-y divide-line">{children}</dl>;
}

export function InfoRow({
  label,
  children,
  mono = false,
}: {
  label: string;
  children: ReactNode;
  /** Renders the value in the tabular mono face used for chain data. */
  mono?: boolean;
}) {
  return (
    <div className="grid gap-1.5 py-3.5 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
      <dt className="label-mono pt-0.5 text-ash-3">{label}</dt>
      <dd
        className={`min-w-0 break-words ${
          mono ? "data-cell text-chalk" : "text-[0.875rem] text-chalk/90"
        }`}
      >
        {children}
      </dd>
    </div>
  );
}

/* ------------------------------------------------------------------
   StatGrid — the hairline metric strip
   ------------------------------------------------------------------ */

export type Stat = {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  /** A `<Sparkline>` or similar, pinned to the bottom of the cell. */
  chart?: ReactNode;
};

export function StatGrid({
  stats,
  columns = 4,
}: {
  stats: Stat[];
  columns?: 2 | 3 | 4 | 6;
}) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    6: "sm:grid-cols-3 lg:grid-cols-6",
  }[columns];

  return (
    <div className={`grid grid-cols-1 border-t border-line ${cols}`}>
      {stats.map((stat, i) => (
        <Reveal
          key={stat.label}
          delay={i * 70}
          className="group relative flex flex-col border-b border-line px-1 py-6 sm:px-5 lg:border-r lg:first:border-l"
        >
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
          />
          <p className="label-mono text-ash-3">{stat.label}</p>
          <p className="mt-3 font-mono text-[clamp(1.15rem,2.1vw,1.6rem)] tabular-nums text-chalk">
            {stat.value}
          </p>
          {stat.sub && (
            <p className="mt-2 text-[0.75rem] leading-snug text-ash-3">
              {stat.sub}
            </p>
          )}
          {stat.chart && (
            <div className="mt-4 h-8 text-chalk/45 transition-colors duration-500 group-hover:text-chalk/80">
              {stat.chart}
            </div>
          )}
        </Reveal>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Prev / next rail
   ------------------------------------------------------------------ */

export function PrevNext({
  prev,
  next,
}: {
  prev?: { label: string; title: string; href: string } | null;
  next?: { label: string; title: string; href: string } | null;
}) {
  return (
    <div className="grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
      {prev ? (
        <Link
          href={prev.href}
          className="group flex flex-col gap-2 rounded-xl border border-line bg-panel/50 px-5 py-4 transition-all duration-300 hover:border-line-2 hover:bg-panel-2"
        >
          <span className="flex items-center gap-2 label-mono text-ash-3">
            <IconChevron className="size-3 rotate-90 transition-transform duration-300 group-hover:-translate-x-0.5" />
            {prev.label}
          </span>
          <span className="text-[0.875rem] text-chalk/90">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-2 rounded-xl border border-line bg-panel/50 px-5 py-4 text-right transition-all duration-300 hover:border-line-2 hover:bg-panel-2 sm:col-start-2"
        >
          <span className="flex items-center gap-2 label-mono text-ash-3">
            {next.label}
            <IconChevron className="size-3 -rotate-90 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
          <span className="text-[0.875rem] text-chalk/90">{next.title}</span>
        </Link>
      )}
    </div>
  );
}
