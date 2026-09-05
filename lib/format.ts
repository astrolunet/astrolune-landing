import { SITE } from "@/lib/site";

/**
 * Formatting helpers.
 *
 * Two rules hold everywhere in here:
 *
 * 1. **Amounts are strings of base units, never numbers.** One Lune is 10⁹
 *    base units and the representable ceiling is ~1.8e19 base units, which is
 *    past `Number.MAX_SAFE_INTEGER`. Every conversion below is string
 *    arithmetic, so a balance never loses its last digit. This also matches
 *    what a real RPC would return, so `lib/api` can be swapped for a live
 *    endpoint without touching a single call site.
 *
 * 2. **Number grouping is pinned to `en-US`.** `<Counter>` already does this.
 *    Locale-dependent grouping would render differently on the server and the
 *    client and produce a hydration mismatch, so the separator is a layout
 *    decision here rather than a translation.
 */

const GROUP = /\B(?=(\d{3})+(?!\d))/g;

/** `1234567` → `1,234,567`. Operates on a digit string, so it never rounds. */
export function group(digits: string): string {
  return digits.replace(GROUP, ",");
}

export function fmtInt(value: number): string {
  return group(Math.trunc(value).toString());
}

/**
 * Places the decimal point in a base-unit string.
 *
 * `fmtAmount("1234567890")` → `1.23456789`
 * `fmtAmount("1234567890", { min: 2 })` → `1.23`
 */
export function fmtAmount(
  base: string,
  {
    decimals = SITE.coin.decimals,
    max,
    min = 0,
  }: { decimals?: number; max?: number; min?: number } = {},
): string {
  const negative = base.startsWith("-");
  const digits = (negative ? base.slice(1) : base).replace(/\D/g, "") || "0";

  const padded = digits.padStart(decimals + 1, "0");
  const whole = padded.slice(0, padded.length - decimals);
  let frac = padded.slice(padded.length - decimals);

  // Truncate rather than round: an explorer must not display more value than
  // the chain records.
  if (max !== undefined) frac = frac.slice(0, max);
  frac = frac.replace(/0+$/, "");
  while (frac.length < min) frac += "0";

  const sign = negative ? "−" : "";
  return frac ? `${sign}${group(whole)}.${frac}` : `${sign}${group(whole)}`;
}

/** Amount plus ticker, the form used in tables and detail rows. */
export function fmtLune(base: string, opts?: { max?: number }): string {
  return `${fmtAmount(base, { max: opts?.max ?? 4 })} ${SITE.coin.ticker}`;
}

/**
 * Compact form for headline figures: `1.24M`. Reads the leading digits off the
 * string, so it is safe past 2⁵³.
 */
export function fmtCompact(base: string, decimals = SITE.coin.decimals): string {
  const digits = base.replace(/\D/g, "") || "0";
  const whole = digits.length > decimals ? digits.slice(0, -decimals) : "0";
  const units = ["", "K", "M", "B", "T"];
  const tier = Math.min(Math.floor((whole.length - 1) / 3), units.length - 1);
  if (tier <= 0) return group(whole);

  const head = whole.slice(0, whole.length - tier * 3);
  const tail = whole.slice(whole.length - tier * 3, whole.length - tier * 3 + 2);
  const frac = tail.replace(/0+$/, "");
  return `${head}${frac ? `.${frac}` : ""}${units[tier]}`;
}

/** `a1b2…f9e8` — the only way a 64-character hash is allowed into a cell. */
export function trunc(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function fmtPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

export function fmtMs(ms: number): string {
  return ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
}

/**
 * Age of a block, derived from how far behind the head it is rather than from a
 * clock.
 *
 * This is deliberate. A wall-clock age is a different string on the server than
 * it is a moment later in the browser, which is a hydration mismatch on every
 * row of every table. Height distance is exact, needs no clock, and is the
 * quantity a chain actually knows — the same reason the protocol derives its
 * own day from block height instead of reading the system time.
 */
export type Ago = { value: number; unit: "s" | "m" | "h" | "d" };

export function ageOf(head: number, height: number, blockMs = 600): Ago {
  const seconds = Math.max(0, Math.round(((head - height) * blockMs) / 1000));
  if (seconds < 60) return { value: seconds, unit: "s" };
  if (seconds < 3600) return { value: Math.floor(seconds / 60), unit: "m" };
  if (seconds < 86400) return { value: Math.floor(seconds / 3600), unit: "h" };
  return { value: Math.floor(seconds / 86400), unit: "d" };
}

/** Renders an `Ago` with the active dictionary's suffixes. */
export function fmtAgo(ago: Ago, labels: Record<Ago["unit"], string>): string {
  return `${ago.value}${labels[ago.unit]}`;
}

/**
 * Absolute timestamp for a block, anchored to a fixed epoch rather than `now`
 * so that server and client agree. Formatted with an explicit UTC locale for
 * the same reason.
 */
export function blockTime(
  head: number,
  height: number,
  blockMs = 600,
  anchorMs = ANCHOR_MS,
): Date {
  return new Date(anchorMs - (head - height) * blockMs);
}

/** 2026-01-15T00:00:00Z — the fixture chain's reference instant. */
export const ANCHOR_MS = Date.UTC(2026, 0, 15, 0, 0, 0);

export function fmtDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    ` ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} UTC`
  );
}

export function fmtDate(iso: string, locale: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
