import type { ReactNode } from "react";

/**
 * The only component in the tree allowed to render `--color-live`.
 *
 * The palette rule is that green means *status* — never a button, a heading or
 * a chart stroke. Routing every green pixel through one file makes that rule
 * structural instead of a thing to remember.
 */
export type Tone = "live" | "warn" | "down" | "idle" | "muted";

const DOT: Record<Tone, string> = {
  live: "bg-live",
  warn: "bg-warn",
  down: "bg-down",
  idle: "bg-ash-2",
  muted: "bg-ash-3",
};

const HALO: Record<Tone, string> = {
  live: "bg-live/30",
  warn: "bg-warn/30",
  down: "bg-down/30",
  idle: "bg-ash-2/20",
  muted: "bg-transparent",
};

const TEXT: Record<Tone, string> = {
  live: "text-live",
  warn: "text-warn",
  down: "text-down",
  idle: "text-ash",
  muted: "text-ash-2",
};

export function StatusDot({
  tone = "live",
  pulse,
  className = "",
}: {
  tone?: Tone;
  /** Defaults on for `live`; off for everything else. */
  pulse?: boolean;
  className?: string;
}) {
  const animate = pulse ?? tone === "live";
  return (
    <span
      aria-hidden
      className={`relative grid size-2 shrink-0 place-items-center ${className}`}
    >
      {animate && (
        <span
          className={`absolute size-2 rounded-full ${HALO[tone]} animate-pulse-glow`}
        />
      )}
      <span className={`relative size-1.5 rounded-full ${DOT[tone]}`} />
    </span>
  );
}

/** Dot + mono label, the form used in the footer, header and status header. */
export function StatusPill({
  tone = "live",
  children,
  bare = false,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  /** Drops the pill chrome, leaving just dot + label. */
  bare?: boolean;
  className?: string;
}) {
  const chrome = bare
    ? ""
    : "rounded-full border border-line-2 bg-panel/70 px-3 py-1.5";
  return (
    <span
      className={`inline-flex items-center gap-2 label-mono ${chrome} ${TEXT[tone]} ${className}`}
    >
      <StatusDot tone={tone} />
      {children}
    </span>
  );
}

export { TEXT as STATUS_TEXT };
