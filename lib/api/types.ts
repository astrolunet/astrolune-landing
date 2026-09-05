/**
 * Domain types for everything the site reads about the chain.
 *
 * This file is the contract. `lib/api` currently satisfies it from the
 * deterministic fixtures in `lib/data`; a real node would satisfy it from RPC.
 * Because every accessor in `lib/api` is already `async`, swapping the
 * implementation does not change a single call site.
 *
 * Amounts are **strings of base units** (10⁹ per Lune), never numbers — see the
 * note at the top of `lib/format.ts`.
 */

export type TxType =
  | "transfer"
  | "deploy"
  | "call"
  | "register"
  | "attest"
  | "challenge"
  | "evidence"
  | "bond"
  | "commit"
  | "reveal"
  | "vote"
  | "name";

export type TxStatus = "success" | "failed" | "pending" | "reverted";

/** Section 6 of `01-consensus/potb.md` — rights by level. */
export type NodeLevel = "relay" | "candidate" | "validator";

export type Block = {
  height: number;
  hash: string;
  parent: string;
  stateRoot: string;
  txRoot: string;
  /** Node id of the committee member that proposed it. */
  proposer: string;
  committee: number;
  quorum: number;
  votes: number;
  /** Derived from height, never from a clock. */
  protocolDay: number;
  epoch: number;
  seed: string;
  size: number;
  gasUsed: number;
  gasLimit: number;
  txCount: number;
  finalized: boolean;
};

export type Tx = {
  hash: string;
  /** Hashed under `AL_TAG_TX_SIGNING`, deliberately distinct from `hash`. */
  signingHash: string;
  type: TxType;
  status: TxStatus;
  height: number;
  /** Index within the block. */
  index: number;
  from: string;
  to: string | null;
  amount: string;
  fee: string;
  gasLimit: number;
  gasUsed: number;
  nonce: number;
  chainId: string;
  payload: string;
  signature: string;
  publicKey: string;
};

export type AccountKind = "external" | "contract";

export type Account = {
  address: string;
  kind: AccountKind;
  balance: string;
  nonce: number;
  codeHash: string | null;
  storageRoot: string;
  firstSeenHeight: number;
  txCount: number;
  names: string[];
  /** Set when this address also carries a PoTB record. */
  nodeId: string | null;
};

export type Slash = {
  height: number;
  /** Dictionary key under `node.slash`. */
  offence: string;
  penalty: string;
};

export type Validator = {
  rank: number;
  nodeId: string;
  address: string;
  level: NodeLevel;
  /** min(TBS, capTbs) × min(TGW, capTgw) × NDM × COD */
  weight: number;
  tbs: number;
  tgw: number;
  ndm: number;
  cod: number;
  uptimeDays: number;
  /** 0–1. */
  correctness: number;
  asn: string;
  asnName: string;
  region: string;
  inCommittee: boolean;
  committeeSinceHeight: number;
  blocksProposed: number;
  votes: number;
  missed: number;
  bond: string;
  slashes: Slash[];
};

export type NameRecordEntry = {
  /** Dictionary key under `dns.recordTypes`. */
  kind: "address" | "content" | "text" | "dns";
  label: string;
  value: string;
};

export type NameRecord = {
  name: string;
  owner: string;
  address: string;
  registeredHeight: number;
  expiresHeight: number;
  records: NameRecordEntry[];
};

export type ContractRow = {
  /** Dictionary key under `contracts.system` for system contracts. */
  key: string;
  address: string;
  language: "Trocto" | "Regol";
  deployedHeight: number;
  verified: boolean;
  calls: number;
  size: number;
  system: boolean;
};

export type NetworkStats = {
  head: number;
  blockMs: number;
  avgBlockMs: number;
  tps: number;
  committee: number;
  quorum: number;
  accounts: number;
  txTotal: number;
  validators: number;
  candidates: number;
  relays: number;
  medianUptimeDays: number;
  supply: string;
  circulating: string;
  bonded: string;
  burned: string;
  epoch: number;
  /** 0–1 through the current epoch. */
  epochProgress: number;
  protocolDay: number;
  blocksThisEpoch: number;
  rotations: number;
};

/** A chart series. `points` are raw values; the chart scales them. */
export type Series = {
  points: number[];
  min: number;
  max: number;
  mean: number;
};

export type ServiceState = "complete" | "thin" | "stub" | "absent" | "operational";

export type Service = {
  /** Dictionary key under `status.services`. */
  key: string;
  state: ServiceState;
  /** 0–100, only meaningful for states that can degrade. */
  uptime: number | null;
};

export type Incident = {
  id: string;
  /** Height the event was recorded at. */
  height: number;
  tone: "live" | "warn" | "down";
  title: string;
  body: string;
};

export type SearchHit =
  | { kind: "block"; height: number }
  | { kind: "tx"; hash: string }
  | { kind: "account"; address: string }
  | { kind: "name"; name: string }
  | { kind: "validator"; nodeId: string };

/** A page of rows plus the total, so pagination needs one call. */
export type Page<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
};
