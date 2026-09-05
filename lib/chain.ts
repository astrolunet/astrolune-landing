/**
 * PoTB protocol constants, mirrored from `al_potb_params_default()` as
 * documented in `08-implementation/core-api.md` §8. These are consensus
 * parameters — they belong in the genesis block, not a config file — so the
 * site treats them as facts rather than copy, and the weight calculator on the
 * home page drives the real formula with them.
 */
export const POTB = {
  /** loyalty_bonus(d) = rate × (d − threshold), capped at capLoyalty. */
  loyaltyThresholdDays: 365,
  loyaltyRatePerDay: 0.001,
  capLoyalty: 4,

  /** No TBS decay inside the grace period; halves every half-life after it. */
  gracePeriodDays: 60,
  decayHalfLifeDays: 21,

  /** Hard ceilings on the first two factors. ln(1 + 3650) ≈ 8.2. */
  capTbs: 10,
  capTgw: 1,

  committeeSize: 100,
  committeeLifetimeBlocks: 10,
  rotationFraction: 0.1,
  maxCommittee: 512,

  minTbsCandidate: 3,
  minTbsValidator: 4,
  minTgwValidator: 0.3,
  candidateWeightFactor: 0.5,

  epochDays: 1,

  /** Basis points, must total 10000. */
  rewardFlatBp: 6000,
  rewardWeightedBp: 2500,
  rewardBondedBp: 1500,
  rewardMaxMultiple: 3,
} as const;

/** `al_potb_quorum_threshold(n)` — floor(2n/3) + 1. */
export function quorumThreshold(n: number): number {
  return Math.floor((2 * n) / 3) + 1;
}

/** `al_potb_tbs` — log(1 + uptime × correctness) + loyalty_bonus(uptime). */
export function tbs(uptimeDays: number, correctnessRate: number): number {
  const base = Math.log(1 + uptimeDays * correctnessRate);
  return base + loyaltyBonus(uptimeDays);
}

export function loyaltyBonus(uptimeDays: number): number {
  if (uptimeDays < POTB.loyaltyThresholdDays) return 0;
  const raw =
    POTB.loyaltyRatePerDay * (uptimeDays - POTB.loyaltyThresholdDays);
  return Math.min(raw, POTB.capLoyalty);
}

export type PotbLevel = "relay" | "candidate" | "validator";

/** Section 6 of potb.md — rights by level. */
export function levelFor(tbsScore: number, tgwScore: number): PotbLevel {
  if (tbsScore >= POTB.minTbsValidator && tgwScore >= POTB.minTgwValidator) {
    return "validator";
  }
  if (tbsScore >= POTB.minTbsCandidate) return "candidate";
  return "relay";
}

/** Weight = min(TBS, CAP_TBS) × min(TGW, CAP_TGW) × NDM × COD. */
export function weight({
  tbs: tbsScore,
  tgw,
  ndm,
  cod,
}: {
  tbs: number;
  tgw: number;
  ndm: number;
  cod: number;
}) {
  const tbsCapped = Math.min(tbsScore, POTB.capTbs);
  const tgwCapped = Math.min(tgw, POTB.capTgw);
  return {
    tbsCapped,
    tgwCapped,
    total: tbsCapped * tgwCapped * ndm * cod,
  };
}

/** COD(group) = 1 / (1 + correlation_score). */
export function cod(correlationScore: number): number {
  return 1 / (1 + correlationScore);
}

/**
 * Headline network facts as the specification states them — including the
 * places where it states a range rather than a number. Deliberately not
 * rounded into a marketing promise.
 */
export const NETWORK_FACTS = {
  blockTimeMs: { light: 400, vdf: 1000 },
  committeeSize: POTB.committeeSize,
  epochLabel: "1 day",
  quorumLabel: "⌊2n/3⌋ + 1",
  rotationPerBlock: "10%",
  committeeLifetime: "~10 blocks",
} as const;
