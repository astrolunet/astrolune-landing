/**
 * Fixture data for the prototype.
 *
 * There is no backend yet, so this module *is* the backend: it holds the seed
 * state the store starts from and the factories the actions use to extend it.
 * When a real transport arrives, `store.ts` swaps its calls here for network
 * calls and nothing else in the package moves.
 *
 * Two constraints shape the whole file:
 *
 * - **No wall-clock at module scope.** Every timestamp is derived from
 *   `ANCHOR_MS`, a fixed epoch. `Date.now()` here would give the server and the
 *   client different values and every date in the console would flip on
 *   hydration.
 * - **No `Math.random`.** Same reason. `Rng` from `./rng` is seeded per record,
 *   so the same field always holds the same value.
 */

import type {
  Bucket,
  CatalogItem,
  Domain,
  Identity,
  Invoice,
  NodeStat,
  ProxyEndpoint,
  ProxyProtocol,
  ProxyRotation,
  ValidatorInfo,
  Wallet,
  WalletKind,
} from "./types";
import { DECIMALS } from "./format";
import { Rng, makeAddress, makeHash } from "./rng";

/**
 * The epoch every fixture date hangs off: 2026-09-01T00:00:00Z.
 *
 * `Date.UTC` with literal arguments is a pure function, so this is safe at
 * module scope in a way that `Date.now()` is not.
 */
export const ANCHOR_MS = Date.UTC(2026, 8, 1);

const DAY = 86_400_000;

/** `"12.5"` → `"12500000000"`. Fixture authoring convenience only. */
function toBase(decimal: string): string {
  const [whole, frac = ""] = decimal.split(".");
  return (whole + frac.padEnd(DECIMALS, "0").slice(0, DECIMALS)).replace(
    /^0+(?=\d)/,
    "",
  );
}

const GB = 1024 ** 3;

/* ------------------------------------------------------------------
   Regions — shared by the create-bucket and buy-proxy forms
   ------------------------------------------------------------------ */

export const REGIONS = [
  { id: "eu-central", label: "EU Central" },
  { id: "eu-north", label: "EU North" },
  { id: "na-east", label: "NA East" },
  { id: "na-west", label: "NA West" },
  { id: "ap-south", label: "AP South" },
  { id: "ap-east", label: "AP East" },
  { id: "sa-east", label: "SA East" },
] as const;

export function regionLabel(id: string): string {
  return REGIONS.find((r) => r.id === id)?.label ?? id;
}

export const SHARE_QUOTAS = [
  { gb: 50, price: toBase("2.4") },
  { gb: 100, price: toBase("4.4") },
  { gb: 500, price: toBase("19") },
  { gb: 2048, price: toBase("68") },
] as const;

export const PROXY_TRAFFIC = [
  { gb: 100, price: toBase("6") },
  { gb: 500, price: toBase("22") },
  { gb: 2048, price: toBase("74") },
] as const;

export const PROXY_PROTOCOLS: readonly ProxyProtocol[] = [
  "socks5",
  "https",
  "wireguard",
];

export const PROXY_ROTATIONS: readonly ProxyRotation[] = [
  "static",
  "per-request",
  "hourly",
];

export const WALLET_KINDS: readonly WalletKind[] = [
  "hardware",
  "software",
  "contract",
  "watch",
];

/* ------------------------------------------------------------------
   Identity
   ------------------------------------------------------------------ */

export const FIXTURE_IDENTITY: Identity = {
  id: "aid_9f31c4a7",
  handle: "vega.lune",
  displayName: "vega",
  avatarSeed: "aid_9f31c4a7",
  createdAt: ANCHOR_MS - 412 * DAY,
  tier: "operator",
  trust: 78,
  isValidator: true,
  methods: ["wallet", "passkey", "recovery"],
};

/* ------------------------------------------------------------------
   Wallets
   ------------------------------------------------------------------ */

export const FIXTURE_WALLETS: Wallet[] = [
  {
    id: "w_01",
    address: makeAddress("vega:wallet:cold"),
    label: "Cold · ledger",
    kind: "hardware",
    balance: toBase("184203.418922431"),
    primary: true,
    verified: true,
    linkedAt: ANCHOR_MS - 401 * DAY,
  },
  {
    id: "w_02",
    address: makeAddress("vega:wallet:hot"),
    label: "Hot · daily",
    kind: "software",
    balance: toBase("2841.907"),
    primary: false,
    verified: true,
    linkedAt: ANCHOR_MS - 233 * DAY,
  },
  {
    id: "w_03",
    address: makeAddress("vega:wallet:treasury"),
    label: "Ops treasury",
    kind: "watch",
    balance: toBase("59120.5"),
    primary: false,
    verified: false,
    linkedAt: ANCHOR_MS - 47 * DAY,
  },
];

/* ------------------------------------------------------------------
   Domains
   ------------------------------------------------------------------ */

export const FIXTURE_DOMAINS: Domain[] = [
  {
    name: "vega.lune",
    status: "active",
    registeredAt: ANCHOR_MS - 401 * DAY,
    expiresAt: ANCHOR_MS + 329 * DAY,
    autoRenew: true,
    target: FIXTURE_WALLETS[0].address,
    records: 9,
  },
  {
    name: "astrolabe.lune",
    status: "active",
    registeredAt: ANCHOR_MS - 188 * DAY,
    expiresAt: ANCHOR_MS + 17 * DAY,
    autoRenew: false,
    target: FIXTURE_WALLETS[1].address,
    records: 4,
  },
  {
    name: "lune-relay.lune",
    status: "grace",
    registeredAt: ANCHOR_MS - 736 * DAY,
    expiresAt: ANCHOR_MS - 6 * DAY,
    autoRenew: false,
    target: null,
    records: 2,
  },
  {
    name: "midnight.lune",
    status: "pending",
    registeredAt: ANCHOR_MS - 40_000,
    expiresAt: ANCHOR_MS + 365 * DAY,
    autoRenew: true,
    target: null,
    records: 0,
  },
];

/* ------------------------------------------------------------------
   Share buckets
   ------------------------------------------------------------------ */

export const FIXTURE_BUCKETS: Bucket[] = [
  {
    id: "b_01",
    label: "site-assets",
    region: "eu-central",
    usedBytes: Math.round(41.7 * GB),
    quotaBytes: 100 * GB,
    pins: 1842,
    replicas: 4,
    endpoint: "eu-central.share.astrolune.net",
    status: "ready",
  },
  {
    id: "b_02",
    label: "chain-snapshots",
    region: "na-east",
    usedBytes: Math.round(388.2 * GB),
    quotaBytes: 500 * GB,
    pins: 96,
    replicas: 3,
    endpoint: "na-east.share.astrolune.net",
    status: "syncing",
  },
];

/* ------------------------------------------------------------------
   Proxy endpoints
   ------------------------------------------------------------------ */

export const FIXTURE_PROXIES: ProxyEndpoint[] = [
  {
    id: "p_01",
    label: "scrape-eu",
    region: "eu-north",
    protocol: "socks5",
    host: "eu-north.proxy.astrolune.net",
    port: 1080,
    username: "aid9f31c4a7-eun",
    secret: new Rng("vega:proxy:p_01").hex(24),
    rotation: "per-request",
    quotaGb: 500,
    usedGb: 213.4,
    expiresAt: ANCHOR_MS + 19 * DAY,
    status: "active",
  },
  {
    id: "p_02",
    label: "egress-apac",
    region: "ap-east",
    protocol: "wireguard",
    host: "ap-east.proxy.astrolune.net",
    port: 51820,
    username: "aid9f31c4a7-ape",
    secret: new Rng("vega:proxy:p_02").hex(24),
    rotation: "static",
    quotaGb: 100,
    usedGb: 94.8,
    expiresAt: ANCHOR_MS + 4 * DAY,
    status: "active",
  },
];

/* ------------------------------------------------------------------
   Nodes
   ------------------------------------------------------------------ */

/** 24 block-time samples around a target, deterministic per node. */
function series(seed: string, target: number): number[] {
  const rng = new Rng(seed);
  return Array.from({ length: 24 }, () => rng.range(target * 0.86, target * 1.2, 0));
}

export const FIXTURE_NODES: NodeStat[] = [
  {
    id: "n_01",
    nodeId: `al-node-${new Rng("vega:node:1").hex(8)}`,
    label: "vega-primary",
    role: "validator",
    region: "eu-central",
    version: "0.9.4",
    status: "online",
    uptimePct: 99.94,
    peers: 74,
    height: 4_182_907,
    missRate: 0.08,
    series: series("vega:series:1", 400),
  },
  {
    id: "n_02",
    nodeId: `al-node-${new Rng("vega:node:2").hex(8)}`,
    label: "vega-relay-na",
    role: "relay",
    region: "na-west",
    version: "0.9.4",
    status: "online",
    uptimePct: 99.61,
    peers: 58,
    height: 4_182_907,
    missRate: 0.31,
    series: series("vega:series:2", 412),
  },
  {
    id: "n_03",
    nodeId: `al-node-${new Rng("vega:node:3").hex(8)}`,
    label: "vega-candidate-ap",
    role: "candidate",
    region: "ap-south",
    version: "0.9.3",
    status: "syncing",
    uptimePct: 96.2,
    peers: 31,
    height: 4_180_244,
    missRate: 1.42,
    series: series("vega:series:3", 448),
  },
];

/* ------------------------------------------------------------------
   Validator detail
   ------------------------------------------------------------------ */

export const FIXTURE_VALIDATOR: ValidatorInfo = {
  nodeId: FIXTURE_NODES[0].nodeId,
  tbs: 82.4,
  tgw: 71.9,
  ndm: 64.3,
  cod: 88.1,
  weight: 77.6,
  rank: 34,
  inCommittee: true,
  epochsInCommittee: 1_284,
  missedVotes: 19,
  bond: toBase("25000"),
  rewards30d: toBase("1841.209384"),
  penalties: [
    {
      label: "Missed 3 consecutive votes",
      at: ANCHOR_MS - 22 * DAY,
      delta: "-0.4 TBS",
    },
    {
      label: "Version lag beyond one release",
      at: ANCHOR_MS - 71 * DAY,
      delta: "-1.1 TBS",
    },
  ],
};

/* ------------------------------------------------------------------
   Catalogue
   ------------------------------------------------------------------ */

export const FIXTURE_CATALOG: CatalogItem[] = [
  {
    sku: "domain.register.1y",
    kind: "domain",
    label: "Register a .lune name",
    blurb: "One name, one year, renewable. Ownership is recorded on-chain.",
    price: toBase("12"),
    period: "year",
    specs: [
      { k: "Records", v: "Unlimited" },
      { k: "Transfer", v: "Any time" },
      { k: "Grace", v: "30 days" },
    ],
  },
  {
    sku: "share.100gb",
    kind: "share",
    label: "Share · 100 GB",
    blurb: "Content-addressed storage, replicated four ways across the set.",
    price: toBase("4.4"),
    period: "month",
    specs: [
      { k: "Quota", v: "100 GB" },
      { k: "Replicas", v: "4" },
      { k: "Egress", v: "Metered" },
    ],
  },
  {
    sku: "proxy.socks5.500gb",
    kind: "proxy",
    label: "Proxy · 500 GB",
    blurb: "SOCKS5 or HTTPS egress with per-request rotation.",
    price: toBase("22"),
    period: "month",
    specs: [
      { k: "Traffic", v: "500 GB" },
      { k: "Rotation", v: "Per request" },
      { k: "Regions", v: "7" },
    ],
  },
  {
    sku: "tier.operator.1y",
    kind: "tier",
    label: "Operator tier",
    blurb: "Raised quotas across every resource, plus validator telemetry.",
    price: toBase("240"),
    period: "year",
    specs: [
      { k: "Nodes", v: "Unlimited" },
      { k: "Buckets", v: "25" },
      { k: "Support", v: "Priority" },
    ],
  },
];

/* ------------------------------------------------------------------
   Factories
   ------------------------------------------------------------------ */

/** Invoice window: long enough to move coins, short enough to reprice. */
export const INVOICE_WINDOW_MS = 15 * 60 * 1000;

/**
 * Builds the deposit invoice for a catalogue item.
 *
 * `now` is passed in rather than read: the caller is always a client event
 * handler, and taking the clock as an argument is what keeps this module free
 * of wall-clock reads.
 */
export function makeInvoice(item: CatalogItem, now: number): Invoice {
  const id = `inv_${new Rng(`${item.sku}:${now}`).hex(10)}`;
  return {
    id,
    sku: item.sku,
    label: item.label,
    amount: item.price,
    address: makeAddress(`deposit:${id}`),
    memo: new Rng(`memo:${id}`).hex(16).toUpperCase(),
    network: "mainnet",
    createdAt: now,
    expiresAt: now + INVOICE_WINDOW_MS,
    status: "awaiting",
    confirmations: 0,
    requiredConfirmations: 6,
    txHash: null,
  };
}

export function makeWallet(input: {
  address: string;
  label: string;
  kind: WalletKind;
  now: number;
}): Wallet {
  const address = input.address.trim().toLowerCase();
  const rng = new Rng(`balance:${address}`);
  return {
    id: `w_${new Rng(`id:${address}`).hex(6)}`,
    address,
    label: input.label.trim() || "Unnamed wallet",
    kind: input.kind,
    // A newly linked wallet's balance is read from chain, so it is derived
    // from the address rather than left at zero.
    balance: toBase(`${rng.int(0, 8400)}.${rng.hex(3).replace(/\D/g, "") || "0"}`),
    primary: false,
    verified: input.kind !== "watch",
    linkedAt: input.now,
  };
}

export function makeBucket(input: {
  label: string;
  region: string;
  quotaGb: number;
  now: number;
}): Bucket {
  const id = `b_${new Rng(`bucket:${input.label}:${input.now}`).hex(6)}`;
  return {
    id,
    label: input.label.trim() || "untitled",
    region: input.region,
    usedBytes: 0,
    quotaBytes: input.quotaGb * GB,
    pins: 0,
    replicas: 4,
    endpoint: `${input.region}.share.astrolune.net`,
    status: "ready",
  };
}

const PROXY_PORTS: Record<ProxyProtocol, number> = {
  socks5: 1080,
  https: 8443,
  wireguard: 51820,
};

export function makeProxy(input: {
  label: string;
  region: string;
  protocol: ProxyProtocol;
  rotation: ProxyRotation;
  quotaGb: number;
  now: number;
}): ProxyEndpoint {
  const id = `p_${new Rng(`proxy:${input.region}:${input.now}`).hex(6)}`;
  return {
    id,
    label: input.label.trim() || `${input.protocol}-${input.region}`,
    region: input.region,
    protocol: input.protocol,
    host: `${input.region}.proxy.astrolune.net`,
    port: PROXY_PORTS[input.protocol],
    username: `aid9f31c4a7-${new Rng(`user:${id}`).hex(4)}`,
    secret: new Rng(`secret:${id}`).hex(24),
    rotation: input.rotation,
    quotaGb: input.quotaGb,
    usedGb: 0,
    expiresAt: input.now + 30 * DAY,
    status: "active",
  };
}

/** New credential for an existing endpoint. Salted so repeats differ. */
export function rotateSecret(id: string, salt: number): string {
  return new Rng(`secret:${id}:${salt}`).hex(24);
}

export function makeDomain(name: string, now: number): Domain {
  return {
    name,
    status: "pending",
    registeredAt: now,
    expiresAt: now + 365 * DAY,
    autoRenew: true,
    target: null,
    records: 0,
  };
}

/** The transaction hash a settled invoice reports. */
export function makeTxHash(invoiceId: string): string {
  return makeHash(`tx:${invoiceId}`);
}

/** Sign-in challenge — the nonce a wallet would be asked to sign. */
export function makeChallenge(now: number): string {
  return new Rng(`challenge:${now}`).hex(32);
}

export { toBase };
