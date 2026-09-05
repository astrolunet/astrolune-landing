/**
 * Deterministic pseudo-randomness for the fixture data.
 *
 * Every figure the prototype shows is generated, not typed out, but it must be
 * generated *identically* on the server and on the client or React replaces the
 * markup and logs a hydration error. So: a seeded PRNG, never `Math.random`,
 * and a fixed epoch, never `Date.now()`, anywhere a value is derived at module
 * scope.
 *
 * xmur3 for string→seed, mulberry32 for the stream. Both are tiny, both are
 * stable across engines, and neither pretends to be cryptographic.
 */

function xmur3(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number): () => number {
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Rng {
  private next: () => number;

  constructor(seed: string) {
    this.next = mulberry32(xmur3(seed)());
  }

  /** [0, 1) */
  float(): number {
    return this.next();
  }

  /** Integer in [min, max], inclusive. */
  int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  /** Float in [min, max) rounded to `digits`. */
  range(min: number, max: number, digits = 2): number {
    const value = min + this.next() * (max - min);
    const f = 10 ** digits;
    return Math.round(value * f) / f;
  }

  pick<T>(items: readonly T[]): T {
    return items[Math.floor(this.next() * items.length)];
  }

  bool(chance = 0.5): boolean {
    return this.next() < chance;
  }

  hex(length: number): string {
    let out = "";
    while (out.length < length) out += "0123456789abcdef"[this.int(0, 15)];
    return out;
  }
}

export const ADDR_PREFIX = "al1";
export const ADDR_BODY = 40;

export function makeAddress(seed: string): string {
  return ADDR_PREFIX + new Rng(seed).hex(ADDR_BODY);
}

export function makeHash(seed: string): string {
  return `0x${new Rng(seed).hex(64)}`;
}

const ADDR_RE = new RegExp(`^${ADDR_PREFIX}[0-9a-f]{${ADDR_BODY}}$`);

export function isAddress(value: string): boolean {
  return ADDR_RE.test(value.trim().toLowerCase());
}
