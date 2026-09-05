/**
 * Formatting for the ID surfaces.
 *
 * Deliberately self-contained: the package publishes to npm on its own, so it
 * cannot reach into the host application's `lib/format.ts`. The amount helpers
 * are string arithmetic for the same reason they are in the host — a Lune
 * balance in base units exceeds `Number.MAX_SAFE_INTEGER` long before it
 * exceeds the protocol's `uint64`.
 */

/** 10⁹ base units to one Lune, fixed by the protocol. */
export const DECIMALS = 9;
export const TICKER = "LUNE";

const GROUP = /\B(?=(\d{3})+(?!\d))/g;

export function group(digits: string): string {
  return digits.replace(GROUP, ",");
}

/** `"1234567890"` → `"1.23456789"`. Truncates; never rounds up. */
export function fmtAmount(
  base: string,
  { max, min = 0 }: { max?: number; min?: number } = {},
): string {
  const digits = base.replace(/\D/g, "") || "0";
  const padded = digits.padStart(DECIMALS + 1, "0");
  const whole = padded.slice(0, padded.length - DECIMALS);
  let frac = padded.slice(padded.length - DECIMALS);

  if (max !== undefined) frac = frac.slice(0, max);
  frac = frac.replace(/0+$/, "");
  while (frac.length < min) frac += "0";

  return frac ? `${group(whole)}.${frac}` : group(whole);
}

/** Amount plus ticker — the form used in every row and every invoice. */
export function fmtLune(base: string, max = 4): string {
  return `${fmtAmount(base, { max })} ${TICKER}`;
}

/** Multiplies a base-unit string by a small integer without losing digits. */
export function mulBase(base: string, factor: number): string {
  const digits = base.replace(/\D/g, "") || "0";
  let carry = 0;
  let out = "";
  for (let i = digits.length - 1; i >= 0; i--) {
    const product = Number(digits[i]) * factor + carry;
    out = String(product % 10) + out;
    carry = Math.floor(product / 10);
  }
  while (carry > 0) {
    out = String(carry % 10) + out;
    carry = Math.floor(carry / 10);
  }
  return out.replace(/^0+(?=\d)/, "");
}

/** Adds two base-unit strings. Column addition, for the same reason. */
export function addBase(a: string, b: string): string {
  const x = a.replace(/\D/g, "") || "0";
  const y = b.replace(/\D/g, "") || "0";
  const width = Math.max(x.length, y.length);
  const left = x.padStart(width, "0");
  const right = y.padStart(width, "0");

  let carry = 0;
  let out = "";
  for (let i = width - 1; i >= 0; i--) {
    const sum = Number(left[i]) + Number(right[i]) + carry;
    out = String(sum % 10) + out;
    carry = sum > 9 ? 1 : 0;
  }
  return (carry ? "1" + out : out).replace(/^0+(?=\d)/, "");
}

/** Sums a list of base-unit strings. */
export function sumBase(values: readonly string[]): string {
  return values.reduce(addBase, "0");
}

export function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  if (bytes < 1024 ** 4) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
  return `${(bytes / 1024 ** 4).toFixed(2)} TB`;
}

export function fmtPct(value: number, digits = 1): string {
  return `${value.toFixed(digits)}%`;
}

/** `al1f3c…9e21` — the only way a full address is allowed into a cell. */
export function shortAddr(value: string, head = 8, tail = 6): string {
  if (value.length <= head + tail + 1) return value;
  return `${value.slice(0, head)}…${value.slice(-tail)}`;
}

/**
 * `mm:ss`, clamped at zero.
 *
 * Used for the invoice window. Callers pass a millisecond remainder they
 * computed from a client-side clock, never from a server render — a countdown
 * rendered on the server is a hydration mismatch by construction.
 */
export function fmtCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** `2026-09-01` in UTC, so the string does not depend on the reader's zone. */
export function fmtDay(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Whole days between now and `ms`; negative once the date has passed. */
export function daysUntil(ms: number, now: number): number {
  return Math.ceil((ms - now) / 86_400_000);
}
