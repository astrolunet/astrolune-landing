import type {
  Account,
  Block,
  ContractRow,
  Incident,
  NameRecord,
  NetworkStats,
  NodeLevel,
  Series,
  Service,
  Slash,
  Tx,
  TxStatus,
  TxType,
  Validator,
} from "@/lib/api/types";
import { POTB, cod as codOf, levelFor, quorumThreshold, tbs as tbsOf, weight as weightOf } from "@/lib/chain";
import { Rng, makeAddress, makeHash } from "@/lib/data/rng";
import { ENDPOINTS } from "@/lib/site";

/**
 * A fixture chain that is internally consistent.
 *
 * "Consistent" is the whole point: a block's `txCount` equals the number of
 * transactions the generator will hand back for that height, a validator's
 * `weight` is the real `weight()` from `lib/chain.ts` applied to its own TBS and
 * TGW, and `quorum` is the real `quorumThreshold()`. So clicking from a block to
 * its proposer to that node's weight never contradicts itself, and the pages can
 * be built against numbers that behave like the real thing.
 *
 * Everything is derived from a height rather than a clock — the same discipline
 * the protocol itself uses, and the reason none of this causes a hydration
 * mismatch.
 */

/* ------------------------------------------------------------------
   Chain geometry
   ------------------------------------------------------------------ */

/** 600 ms sits inside the specification's honest 400 ms – 1 s range. */
export const BLOCK_MS = 600;
export const BLOCKS_PER_DAY = Math.round((24 * 60 * 60 * 1000) / BLOCK_MS);
export const HEAD = 59_412_887;

export const protocolDayOf = (height: number) =>
  Math.floor(height / BLOCKS_PER_DAY);

const CHAIN_ID = ENDPOINTS.testnet.chainId;
const GAS_LIMIT = 30_000_000;

/* ------------------------------------------------------------------
   Validator set — generated first, because blocks reference proposers
   ------------------------------------------------------------------ */

const ASNS = [
  ["AS24940", "Hetzner Online", "Nuremberg, DE"],
  ["AS16509", "Amazon AWS", "Frankfurt, DE"],
  ["AS14061", "DigitalOcean", "Amsterdam, NL"],
  ["AS20473", "Vultr", "Tokyo, JP"],
  ["AS63949", "Akamai Linode", "London, GB"],
  ["AS8075", "Microsoft Azure", "Dublin, IE"],
  ["AS396982", "Google Cloud", "Iowa, US"],
  ["AS9009", "M247", "Bucharest, RO"],
  ["AS51167", "Contabo", "Munich, DE"],
  ["AS31898", "Oracle Cloud", "Ashburn, US"],
  ["AS45102", "Alibaba Cloud", "Singapore, SG"],
  ["AS36351", "SoftLayer", "São Paulo, BR"],
  ["AS200651", "FlokiNET", "Reykjavik, IS"],
  ["AS29802", "HIVELOCITY", "Seattle, US"],
  ["AS62240", "Clouvider", "Warsaw, PL"],
  ["AS210644", "AEZA", "Helsinki, FI"],
] as const;

const SLASH_KINDS: { offence: string; penalty: string }[] = [
  { offence: "systematic", penalty: "−5% TBS" },
  { offence: "wrong", penalty: "−10% TBS" },
  { offence: "wrongSys", penalty: "−20% TBS" },
];

const VALIDATOR_COUNT = 148;

function buildValidators(): Validator[] {
  const raw = Array.from({ length: VALIDATOR_COUNT }, (_, i) => {
    const rng = new Rng(`node/${i}`);
    const nodeId = `al-node-${new Rng(`id/${i}`).hex(8)}`;

    // A long tail: a handful of near-cap veterans, most in the middle, some
    // genuinely new. Uptime is capped by the chain's own age.
    const maxDays = protocolDayOf(HEAD);
    const uptimeDays =
      i < 12
        ? rng.int(360, maxDays)
        : i < 90
          ? rng.int(90, 359)
          : rng.int(4, 120);

    const correctness = Number(
      rng
        .range(i < 90 ? 0.982 : 0.94, i < 12 ? 0.9998 : 0.996)
        .toFixed(4),
    );

    // The real formulas, so the displayed components multiply out to the
    // displayed weight.
    const tbs = tbsOf(uptimeDays, correctness);
    const tgw = Number(
      Math.min(POTB.capTgw, rng.range(uptimeDays > 200 ? 0.34 : 0.12, 0.97)).toFixed(3),
    );
    const ndm = Number(rng.range(0.72, 1).toFixed(3));
    const correlation = rng.chance(0.18) ? rng.range(0.05, 0.55) : 0;
    const cod = Number(codOf(correlation).toFixed(3));

    const { total } = weightOf({ tbs, tgw, ndm, cod });
    const level: NodeLevel = levelFor(tbs, tgw);

    const [asn, asnName, region] = rng.pick(ASNS);

    const slashCount = rng.chance(0.14) ? rng.int(1, 2) : 0;
    const slashes: Slash[] = Array.from({ length: slashCount }, (_, s) => {
      const kind = rng.pick(SLASH_KINDS);
      return {
        height: HEAD - rng.int(40_000, 6_000_000) - s * 90_000,
        offence: kind.offence,
        penalty: kind.penalty,
      };
    }).sort((a, b) => b.height - a.height);

    const blocksProposed = Math.round((uptimeDays * BLOCKS_PER_DAY * total) / 4200);
    const votes = Math.round(blocksProposed * rng.range(9.2, 11.4));
    const missed = Math.round(votes * (1 - correctness));

    return {
      nodeId,
      address: makeAddress(`node-addr/${i}`),
      level,
      weight: Number(total.toFixed(4)),
      tbs: Number(tbs.toFixed(3)),
      tgw,
      ndm,
      cod,
      uptimeDays,
      correctness,
      asn,
      asnName,
      region,
      committeeSinceHeight: HEAD - uptimeDays * BLOCKS_PER_DAY,
      blocksProposed,
      votes,
      missed,
      bond: String(rng.int(0, 40_000) * 1_000_000_000),
      slashes,
    };
  });

  // Rank by weight, then mark the top `committeeSize` validators as seated.
  raw.sort((a, b) => b.weight - a.weight);

  let seated = 0;
  return raw.map((v, i) => {
    const inCommittee = v.level === "validator" && seated < POTB.committeeSize;
    if (inCommittee) seated++;
    return { ...v, rank: i + 1, inCommittee } satisfies Validator;
  });
}

export const VALIDATORS: Validator[] = buildValidators();

export const COMMITTEE: Validator[] = VALIDATORS.filter((v) => v.inCommittee);

const VALIDATOR_BY_ID = new Map(VALIDATORS.map((v) => [v.nodeId, v]));

export function validatorById(nodeId: string): Validator | null {
  return VALIDATOR_BY_ID.get(nodeId) ?? null;
}

/* ------------------------------------------------------------------
   Accounts — a pool the transaction generator draws from
   ------------------------------------------------------------------ */

const ACCOUNT_POOL_SIZE = 320;

export const ACCOUNT_POOL: string[] = Array.from(
  { length: ACCOUNT_POOL_SIZE },
  (_, i) => makeAddress(`acct/${i}`),
);

/* ------------------------------------------------------------------
   Contracts
   ------------------------------------------------------------------ */

/** Keys match `dict.contracts.system`. */
const SYSTEM_KEYS = [
  "registry",
  "attestation",
  "challenge",
  "bond",
  "evidence",
  "seed",
  "names",
] as const;

export const SYSTEM_CONTRACTS: ContractRow[] = SYSTEM_KEYS.map((key, i) => {
  const rng = new Rng(`sys/${key}`);
  return {
    key,
    address: makeAddress(`sys-addr/${key}`),
    language: "Regol",
    deployedHeight: 1 + i,
    verified: true,
    calls: rng.int(1_400_000, 92_000_000),
    size: rng.int(2_800, 24_000),
    system: true,
  };
});

const VERIFIED_NAMES = [
  "lune-token",
  "wrapped-lune",
  "committee-payout",
  "name-auction",
  "multisig-v2",
  "vesting-lock",
  "merkle-airdrop",
  "swap-pool",
  "oracle-feed",
  "escrow-simple",
  "nft-collection",
  "treasury-v1",
  "bond-router",
  "attestation-relay",
  "fee-splitter",
  "timelock-controller",
  "stream-payments",
  "batch-transfer",
];

export const VERIFIED_CONTRACTS: ContractRow[] = VERIFIED_NAMES.map((key, i) => {
  const rng = new Rng(`contract/${key}`);
  return {
    key,
    address: makeAddress(`contract-addr/${key}`),
    language: rng.chance(0.78) ? "Trocto" : "Regol",
    deployedHeight: HEAD - rng.int(20_000, 40_000_000),
    verified: rng.chance(0.85),
    calls: rng.int(120, 4_200_000),
    size: rng.int(640, 46_000),
    system: false,
  } satisfies ContractRow;
}).sort((a, b) => b.deployedHeight - a.deployedHeight);

export const ALL_CONTRACTS = [...SYSTEM_CONTRACTS, ...VERIFIED_CONTRACTS];

const CONTRACT_BY_ADDRESS = new Map(ALL_CONTRACTS.map((c) => [c.address, c]));

export function contractByAddress(address: string): ContractRow | null {
  return CONTRACT_BY_ADDRESS.get(address) ?? null;
}

/* ------------------------------------------------------------------
   .lune names
   ------------------------------------------------------------------ */

const NAME_WORDS = [
  "moon",
  "orbit",
  "vega",
  "lumen",
  "crater",
  "eclipse",
  "apogee",
  "zenith",
  "tycho",
  "selene",
  "albedo",
  "penumbra",
  "quorum",
  "committee",
  "relay",
  "attest",
  "trocto",
  "regol",
  "arena",
  "varint",
  "merkle",
  "sybil",
  "epoch",
  "seed",
  "beacon",
  "drift",
  "parallax",
  "azimuth",
  "sidereal",
  "terminator",
  "regolith",
  "mare",
  "rille",
  "ejecta",
  "highlands",
  "libration",
];

export const NAMES: NameRecord[] = NAME_WORDS.map((word, i) => {
  const rng = new Rng(`name/${word}`);
  const owner = ACCOUNT_POOL[rng.int(0, ACCOUNT_POOL_SIZE - 1)];
  const target = makeAddress(`name-target/${word}`);
  const registeredHeight = HEAD - rng.int(100_000, 50_000_000);

  return {
    name: `${word}.lune`,
    owner,
    address: target,
    registeredHeight,
    expiresHeight: registeredHeight + BLOCKS_PER_DAY * rng.int(365, 1460),
    records: [
      { kind: "address", label: "ADDR", value: target },
      ...(rng.chance(0.55)
        ? [
            {
              kind: "content" as const,
              label: "CONTENT",
              value: makeHash(`content/${word}`),
            },
          ]
        : []),
      ...(rng.chance(0.4)
        ? [
            {
              kind: "text" as const,
              label: "TXT",
              value: `v=astrolune1; op=${word}`,
            },
          ]
        : []),
      ...(rng.chance(0.3)
        ? [
            {
              kind: "dns" as const,
              label: "A",
              value: `${rng.int(23, 198)}.${rng.int(1, 254)}.${rng.int(1, 254)}.${rng.int(1, 254)}`,
            },
          ]
        : []),
    ],
  } satisfies NameRecord;
}).sort((a, b) => b.registeredHeight - a.registeredHeight);

const NAME_BY_NAME = new Map(NAMES.map((n) => [n.name, n]));

export function nameByName(name: string): NameRecord | null {
  return NAME_BY_NAME.get(name.trim().toLowerCase()) ?? null;
}

/* ------------------------------------------------------------------
   Blocks
   ------------------------------------------------------------------ */

/**
 * Weighted transaction mix. `transfer` and `call` dominate the way they do on a
 * live chain; the PoTB types appear at the rate the protocol would actually
 * produce them — `vote` is frequent, `evidence` is rare.
 */
const TX_TYPES: TxType[] = [
  "transfer",
  "call",
  "vote",
  "attest",
  "deploy",
  "bond",
  "register",
  "name",
  "challenge",
  "commit",
  "reveal",
  "evidence",
];
const TX_WEIGHTS = [34, 22, 14, 8, 4, 4, 3, 3, 2, 1.6, 1.6, 0.3];

export function blockAt(height: number): Block {
  const rng = new Rng(`block/${height}`);
  const proposer = COMMITTEE[height % COMMITTEE.length];
  const txCount = rng.int(0, 42);
  const gasUsed = txCount === 0 ? 0 : rng.int(21_000 * txCount, 640_000 * txCount);

  return {
    height,
    hash: makeHash(`bh/${height}`),
    parent: makeHash(`bh/${height - 1}`),
    stateRoot: makeHash(`sr/${height}`),
    txRoot: txCount === 0 ? makeHash("empty-tx-root") : makeHash(`tr/${height}`),
    proposer: proposer.nodeId,
    committee: POTB.committeeSize,
    quorum: quorumThreshold(POTB.committeeSize),
    votes: rng.int(quorumThreshold(POTB.committeeSize), POTB.committeeSize),
    protocolDay: protocolDayOf(height),
    epoch: protocolDayOf(height),
    seed: makeHash(`seed/${protocolDayOf(height)}`),
    size: 512 + txCount * rng.int(180, 420),
    gasUsed,
    gasLimit: GAS_LIMIT,
    txCount,
    // A block is final once the next committee lifetime has passed over it.
    finalized: height <= HEAD - POTB.committeeLifetimeBlocks,
  };
}

const TX_STATUSES: TxStatus[] = ["success", "failed", "reverted"];
const TX_STATUS_WEIGHTS = [95, 2, 3];

export function txsAt(height: number): Tx[] {
  const block = blockAt(height);

  return Array.from({ length: block.txCount }, (_, i) => {
    const rng = new Rng(`tx/${height}/${i}`);
    const type = rng.weighted(TX_TYPES, TX_WEIGHTS);
    const from = ACCOUNT_POOL[rng.int(0, ACCOUNT_POOL_SIZE - 1)];

    // Consensus-maintenance transactions are addressed to the system contract
    // that owns that concern, which is what makes the registry page meaningful.
    const systemTarget: Partial<Record<TxType, string>> = {
      register: "registry",
      attest: "attestation",
      challenge: "challenge",
      bond: "bond",
      evidence: "evidence",
      commit: "seed",
      reveal: "seed",
      vote: "seed",
      name: "names",
    };

    const sysKey = systemTarget[type];
    const to =
      type === "deploy"
        ? null
        : sysKey
          ? (SYSTEM_CONTRACTS.find((c) => c.key === sysKey)?.address ?? null)
          : type === "call"
            ? VERIFIED_CONTRACTS[rng.int(0, VERIFIED_CONTRACTS.length - 1)].address
            : ACCOUNT_POOL[rng.int(0, ACCOUNT_POOL_SIZE - 1)];

    const amount =
      type === "transfer"
        ? String(rng.int(1, 4_800_000) * 1_000_000)
        : type === "bond"
          ? String(rng.int(500, 40_000) * 1_000_000_000)
          : "0";

    const gasUsed =
      type === "deploy"
        ? rng.int(240_000, 1_800_000)
        : type === "call"
          ? rng.int(34_000, 420_000)
          : rng.int(21_000, 48_000);

    const status =
      height > HEAD - 2
        ? "pending"
        : rng.weighted(TX_STATUSES, TX_STATUS_WEIGHTS);

    return {
      hash: makeHash(`txh/${height}/${i}`),
      signingHash: makeHash(`txs/${height}/${i}`),
      type,
      status,
      height,
      index: i,
      from,
      to,
      amount,
      // Fee is gas × a flat fixture price. The specification records the
      // fee-to-reward relationship as undefined, so nothing more is implied.
      fee: String(gasUsed * 120),
      gasLimit: Math.round(gasUsed * rng.range(1.05, 1.6)),
      gasUsed,
      nonce: rng.int(0, 8_400),
      chainId: CHAIN_ID,
      payload:
        type === "transfer" || type === "vote"
          ? "0x"
          : `0x${new Rng(`payload/${height}/${i}`).hex(rng.int(8, 72) * 2)}`,
      signature: new Rng(`sig/${height}/${i}`).hex(128),
      publicKey: new Rng(`pk/${from}`).hex(64),
    } satisfies Tx;
  });
}

/* ------------------------------------------------------------------
   A materialised recent window, so hash lookups resolve
   ------------------------------------------------------------------ */

/**
 * How many blocks back the explorer can resolve a transaction *by hash*.
 *
 * A block is generated on demand from its height, so any height resolves. A
 * hash has no height in it, so a reverse index is needed — and an index over
 * the whole chain is not something a fixture should pretend to have. This is
 * the honest equivalent of an indexer with a retention window.
 */
const INDEX_DEPTH = 600;

/** Builds once on first use, then memoises. Pages that never look up a hash
 *  never pay for the ~12k transactions the index costs. */
function once<T>(build: () => T): () => T {
  let value: T | undefined;
  let built = false;
  return () => {
    if (!built) {
      value = build();
      built = true;
    }
    return value as T;
  };
}

export const recentBlocks = once<Block[]>(() =>
  Array.from({ length: INDEX_DEPTH }, (_, i) => blockAt(HEAD - i)),
);

export const recentTxs = once<Tx[]>(() =>
  recentBlocks().flatMap((b) => txsAt(b.height)),
);

const txIndex = once(() => new Map(recentTxs().map((t) => [t.hash, t])));

export function txByHash(hash: string): Tx | null {
  return txIndex().get(hash.trim().toLowerCase()) ?? null;
}

const blockIndex = once(() => new Map(recentBlocks().map((b) => [b.hash, b])));

export function blockByHash(hash: string): Block | null {
  return blockIndex().get(hash.trim().toLowerCase()) ?? null;
}

/* ------------------------------------------------------------------
   Accounts, derived from the indexed window
   ------------------------------------------------------------------ */

export function txsForAddress(address: string, limit = 40): Tx[] {
  const out: Tx[] = [];
  for (const tx of recentTxs()) {
    if (tx.from === address || tx.to === address) {
      out.push(tx);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export function accountAt(address: string): Account {
  const clean = address.trim().toLowerCase();
  const rng = new Rng(`account/${clean}`);
  const contract = contractByAddress(clean);
  const validator = VALIDATORS.find((v) => v.address === clean) ?? null;

  return {
    address: clean,
    kind: contract ? "contract" : "external",
    balance: contract
      ? String(rng.int(0, 92_000) * 1_000_000_000)
      : String(rng.int(1, 1_400_000) * 1_000_000),
    nonce: contract ? 0 : rng.int(0, 9_800),
    codeHash: contract ? makeHash(`code/${clean}`) : null,
    storageRoot: makeHash(`storage/${clean}`),
    firstSeenHeight: contract
      ? contract.deployedHeight
      : HEAD - rng.int(1_000, 52_000_000),
    txCount: rng.int(1, 42_000),
    names: NAMES.filter((n) => n.owner === clean).map((n) => n.name),
    nodeId: validator?.nodeId ?? null,
  };
}

/** The pool, ranked by balance — what an explorer's "top accounts" shows. */
export const TOP_ACCOUNTS: Account[] = ACCOUNT_POOL.map(accountAt).sort((a, b) => {
  const diff = BigInt(b.balance) - BigInt(a.balance);
  return diff > 0n ? 1 : diff < 0n ? -1 : 0;
});

/* ------------------------------------------------------------------
   Aggregate network figures
   ------------------------------------------------------------------ */

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function networkStats(): NetworkStats {
  const window = recentBlocks().slice(0, 200);
  const txInWindow = window.reduce((sum, b) => sum + b.txCount, 0);
  const validators = VALIDATORS.filter((v) => v.level === "validator").length;
  const candidates = VALIDATORS.filter((v) => v.level === "candidate").length;

  return {
    head: HEAD,
    blockMs: BLOCK_MS,
    avgBlockMs: BLOCK_MS + 12,
    tps: Number(((txInWindow / window.length) * (1000 / BLOCK_MS)).toFixed(1)),
    committee: POTB.committeeSize,
    quorum: quorumThreshold(POTB.committeeSize),
    accounts: 1_284_631,
    txTotal: 418_204_915,
    validators,
    candidates,
    relays: VALIDATORS.length - validators - candidates,
    medianUptimeDays: median(VALIDATORS.map((v) => v.uptimeDays)),
    supply: "18000000000000000000",
    circulating: "4182004915000000000",
    bonded: "284631000000000000",
    burned: "1204915000000",
    epoch: protocolDayOf(HEAD),
    epochProgress: (HEAD % BLOCKS_PER_DAY) / BLOCKS_PER_DAY,
    protocolDay: protocolDayOf(HEAD),
    blocksThisEpoch: HEAD % BLOCKS_PER_DAY,
    rotations: Math.floor((HEAD % BLOCKS_PER_DAY) / POTB.committeeLifetimeBlocks),
  };
}

/* ------------------------------------------------------------------
   Series for the status charts
   ------------------------------------------------------------------ */

function toSeries(points: number[]): Series {
  return {
    points,
    min: Math.min(...points),
    max: Math.max(...points),
    mean: points.reduce((a, b) => a + b, 0) / points.length,
  };
}

/**
 * Activity over the most recent blocks.
 *
 * Every series here is read off `blockAt()` rather than invented, so the chart
 * and the table below it cannot disagree — the bar for block N is the same
 * `txCount` the row for block N prints. That is the reason there is no
 * block-interval series: interval is not a property the fixture blocks carry,
 * and `ageOf()` derives age from a single `BLOCK_MS`, so charting a varying
 * interval would contradict every age in the tables.
 */
export function blockActivity(count = 60): {
  heights: number[];
  txPerBlock: Series;
  gasPerBlock: Series;
  typeMix: { key: TxType; count: number }[];
} {
  const blocks = recentBlocks().slice(0, count).reverse();

  const counts = new Map<TxType, number>();
  for (const tx of recentTxs()) {
    counts.set(tx.type, (counts.get(tx.type) ?? 0) + 1);
  }

  return {
    heights: blocks.map((b) => b.height),
    txPerBlock: toSeries(blocks.map((b) => b.txCount)),
    gasPerBlock: toSeries(blocks.map((b) => b.gasUsed)),
    typeMix: [...counts.entries()]
      .map(([key, count]) => ({ key, count }))
      .sort((a, b) => b.count - a.count),
  };
}

/**
 * A random walk with a pull back to `centre`, which is what makes a fixture
 * chart read as telemetry instead of as noise.
 */
function walk(
  seed: string,
  count: number,
  centre: number,
  spread: number,
  digits = 2,
): Series {
  const rng = new Rng(seed);
  let value = centre;
  const points: number[] = [];
  for (let i = 0; i < count; i++) {
    value += (centre - value) * 0.18 + rng.range(-spread, spread);
    points.push(Number(value.toFixed(digits)));
  }
  return toSeries(points);
}

export type TimeRange = "h24" | "d7" | "d30";

const RANGE_POINTS: Record<TimeRange, number> = { h24: 144, d7: 168, d30: 120 };

export function blockTimeSeries(range: TimeRange): Series {
  return walk(`blocktime/${range}`, RANGE_POINTS[range], BLOCK_MS, 26, 0);
}

export function tpsSeries(range: TimeRange): Series {
  return walk(`tps/${range}`, RANGE_POINTS[range], 34, 6.5, 1);
}

export function finalitySeries(range: TimeRange): Series {
  return walk(`finality/${range}`, RANGE_POINTS[range], 1_820, 90, 0);
}

export function participationSeries(range: TimeRange): Series {
  return walk(`participation/${range}`, RANGE_POINTS[range], 97.4, 0.9, 1);
}

/** Committee weight distribution — the top members, descending. */
export function committeeWeights(count = 24): { label: string; value: number }[] {
  return COMMITTEE.slice(0, count).map((v) => ({
    label: v.nodeId.replace("al-node-", ""),
    value: v.weight,
  }));
}

/** Share of the committee per autonomous system — what NDM actually watches. */
export function asnShare(): { label: string; value: number }[] {
  const counts = new Map<string, number>();
  for (const v of COMMITTEE) {
    counts.set(v.asnName, (counts.get(v.asnName) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, n]) => ({
      label,
      value: Number(((n / COMMITTEE.length) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.value - a.value);
}

/* ------------------------------------------------------------------
   Service state — mirrors the implementation-status document
   ------------------------------------------------------------------ */

export const SERVICES: Service[] = [
  { key: "consensus", state: "complete", uptime: 99.98 },
  { key: "block", state: "complete", uptime: 99.97 },
  { key: "crypto", state: "stub", uptime: null },
  { key: "vm", state: "thin", uptime: 99.4 },
  { key: "state", state: "thin", uptime: 99.6 },
  { key: "tx", state: "thin", uptime: 99.5 },
  { key: "net", state: "absent", uptime: null },
  { key: "rpc", state: "absent", uptime: null },
  { key: "scan", state: "absent", uptime: null },
  { key: "dns", state: "absent", uptime: null },
  { key: "storage", state: "absent", uptime: null },
  { key: "proxy", state: "absent", uptime: null },
];

export const INCIDENTS: Incident[] = [
  {
    id: "i-0412",
    height: HEAD - 18_400,
    tone: "warn",
    title: "Committee rotation stalled for 6 blocks",
    body: "Two seated members shared an ASN that briefly lost transit. Partial rotation replaced both within one committee lifetime and no quorum was missed.",
  },
  {
    id: "i-0411",
    height: HEAD - 402_100,
    tone: "live",
    title: "Epoch seed reveal completed early",
    body: "All committed participants revealed inside the first tenth of the epoch, so the mixed seed was available before the first rotation needed it.",
  },
  {
    id: "i-0410",
    height: HEAD - 1_284_000,
    tone: "down",
    title: "Correlation dampening suppressed a 14-node group",
    body: "Near-identical uptime rhythms and overlapping registration windows produced a correlation score of 0.61, cutting the group's joint weight to roughly six tenths.",
  },
  {
    id: "i-0409",
    height: HEAD - 4_020_000,
    tone: "warn",
    title: "Median-relative slashing absorbed a transit incident",
    body: "A regional outage pushed 22 members above their usual miss rate. Because penalties are judged against the network median for the same period, none were slashed.",
  },
];
