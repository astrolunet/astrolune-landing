/**
 * Deterministic pseudo-randomness.
 *
 * Every fixture in `lib/data` is generated from a string seed through these
 * functions, never from `Math.random()` or a clock. That is not an aesthetic
 * choice: a server-rendered row and its client re-render must be byte-identical
 * or React throws a hydration mismatch. Same seed in, same bytes out, on both
 * sides of the boundary.
 *
 * When a real backend arrives, nothing here survives — `lib/api` returns the
 * same shapes and the generators are deleted. Until then this is the closest a
 * fixture gets to "a chain that is internally consistent".
 */

/** xmur3 — string → 32-bit seed. */
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

/** mulberry32 — fast, adequate PRNG for fixtures. */
function mulberry32(a: number): () => number {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A small deterministic random source, seeded by any string. */
export class Rng {
  private next: () => number;

  constructor(seed: string) {
    this.next = mulberry32(xmur3(seed)());
  }

  /** float in [0, 1). */
  float(): number {
    return this.next();
  }

  /** integer in [min, max]. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** float in [min, max]. */
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  /** true with probability p. */
  chance(p: number): boolean {
    return this.next() < p;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  /** Weighted pick. `weights` need not be normalised. */
  weighted<T>(items: readonly T[], weights: readonly number[]): T {
    const total = weights.reduce((a, b) => a + b, 0);
    let r = this.next() * total;
    for (let i = 0; i < items.length; i++) {
      r -= weights[i];
      if (r <= 0) return items[i];
    }
    return items[items.length - 1];
  }

  /** `length` lowercase hex characters. */
  hex(length: number): string {
    const digits = "0123456789abcdef";
    let out = "";
    for (let i = 0; i < length; i++) out += digits[Math.floor(this.next() * 16)];
    return out;
  }
}

/** 32-byte hash as 64 hex chars — the wire form the explorer renders. */
export function makeHash(seed: string): string {
  return new Rng(seed).hex(64);
}

/**
 * An Astrolune address: the `al1` human-readable prefix the wallet UI uses,
 * followed by hex. The specification derives an address from all 32 bytes of a
 * tagged SHA-256; the fixtures keep the prefix and a shortened body so a full
 * address still fits a table cell without truncation doing all the work.
 */
export const ADDR_PREFIX = "al1";
export const ADDR_BODY = 40;
export const ADDR_RE = new RegExp(`^${ADDR_PREFIX}[0-9a-f]{${ADDR_BODY}}$`);

export function makeAddress(seed: string): string {
  return ADDR_PREFIX + new Rng(seed).hex(ADDR_BODY);
}

export function isAddress(value: string): boolean {
  return ADDR_RE.test(value.trim().toLowerCase());
}

export function isHash(value: string): boolean {
  return /^[0-9a-f]{64}$/.test(value.trim().toLowerCase());
}

export function isName(value: string): boolean {
  return /^[a-z0-9](?:[a-z0-9-]{0,30}[a-z0-9])?\.lune$/.test(
    value.trim().toLowerCase(),
  );
}
