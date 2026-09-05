import type {
  Account,
  Block,
  ContractRow,
  Incident,
  NameRecord,
  NetworkStats,
  NodeLevel,
  Page,
  SearchHit,
  Series,
  Service,
  Tx,
  TxType,
  Validator,
} from "@/lib/api/types";
import * as chain from "@/lib/data/chain";
import { isAddress, isHash, isName } from "@/lib/data/rng";

/**
 * The data surface for the whole site.
 *
 * Every function is `async` even though the fixtures behind it are synchronous.
 * That is the entire point: pages `await` these calls today and will still
 * `await` them when the implementation becomes `fetch(rpc, …)`, so pointing the
 * site at a live node is a change to this file and nothing else.
 *
 * Pages that call these are server components, so none of the fixture
 * generation ships to the browser.
 */

export const HEAD = chain.HEAD;
export const BLOCK_MS = chain.BLOCK_MS;
export const BLOCKS_PER_DAY = chain.BLOCKS_PER_DAY;

/** Wraps an array slice as a `Page`, one-indexed. */
function paginate<T>(rows: readonly T[], page: number, pageSize: number): Page<T> {
  const safePage = Math.max(1, Math.trunc(page) || 1);
  const start = (safePage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page: safePage,
    pageSize,
  };
}

/* ------------------------------------------------------------------
   Network
   ------------------------------------------------------------------ */

export async function getNetworkStats(): Promise<NetworkStats> {
  return chain.networkStats();
}

/* ------------------------------------------------------------------
   Blocks
   ------------------------------------------------------------------ */

export async function getLatestBlocks(limit = 10): Promise<Block[]> {
  return chain.recentBlocks().slice(0, limit);
}

export async function getBlocks(page = 1, pageSize = 25): Promise<Page<Block>> {
  // The chain is generated from height, so paging past the indexed window still
  // works — it just synthesises the heights it needs.
  const safePage = Math.max(1, Math.trunc(page) || 1);
  const start = (safePage - 1) * pageSize;
  const rows = Array.from({ length: pageSize }, (_, i) =>
    chain.blockAt(chain.HEAD - start - i),
  ).filter((b) => b.height >= 0);

  return { rows, total: chain.HEAD + 1, page: safePage, pageSize };
}

export async function getBlock(height: number): Promise<Block | null> {
  if (!Number.isInteger(height) || height < 0 || height > chain.HEAD) return null;
  return chain.blockAt(height);
}

export async function getBlockByHash(hash: string): Promise<Block | null> {
  return chain.blockByHash(hash);
}

export async function getBlockTxs(height: number): Promise<Tx[]> {
  if (!Number.isInteger(height) || height < 0 || height > chain.HEAD) return [];
  return chain.txsAt(height);
}

/**
 * Recent-activity series for the explorer overview.
 *
 * Derived from the same blocks the tables render, so a bar and its row always
 * agree. `typeMix` is the transaction-type histogram over the indexed window.
 */
export type ScanActivity = {
  heights: number[];
  txPerBlock: Series;
  gasPerBlock: Series;
  typeMix: { key: TxType; count: number }[];
};

export async function getScanActivity(count = 60): Promise<ScanActivity> {
  return chain.blockActivity(count);
}

/* ------------------------------------------------------------------
   Transactions
   ------------------------------------------------------------------ */

export async function getLatestTxs(limit = 10): Promise<Tx[]> {
  return chain.recentTxs().slice(0, limit);
}

export async function getTxs(
  page = 1,
  pageSize = 25,
  type?: TxType,
): Promise<Page<Tx>> {
  const all = chain.recentTxs();
  const rows = type ? all.filter((t) => t.type === type) : all;
  return paginate(rows, page, pageSize);
}

export async function getTx(hash: string): Promise<Tx | null> {
  return chain.txByHash(hash);
}

/* ------------------------------------------------------------------
   Accounts
   ------------------------------------------------------------------ */

export async function getAccount(address: string): Promise<Account | null> {
  if (!isAddress(address)) return null;
  return chain.accountAt(address);
}

export async function getAccounts(page = 1, pageSize = 25): Promise<Page<Account>> {
  return paginate(chain.TOP_ACCOUNTS, page, pageSize);
}

export async function getAccountTxs(address: string, limit = 40): Promise<Tx[]> {
  return chain.txsForAddress(address, limit);
}

/* ------------------------------------------------------------------
   Validators
   ------------------------------------------------------------------ */

export async function getValidators(
  page = 1,
  pageSize = 25,
  level?: NodeLevel,
): Promise<Page<Validator>> {
  const rows = level
    ? chain.VALIDATORS.filter((v) => v.level === level)
    : chain.VALIDATORS;
  return paginate(rows, page, pageSize);
}

export async function getAllValidators(): Promise<Validator[]> {
  return chain.VALIDATORS;
}

export async function getCommittee(): Promise<Validator[]> {
  return chain.COMMITTEE;
}

export async function getValidator(nodeId: string): Promise<Validator | null> {
  return chain.validatorById(nodeId);
}

/* ------------------------------------------------------------------
   Contracts and names
   ------------------------------------------------------------------ */

export async function getSystemContracts(): Promise<ContractRow[]> {
  return chain.SYSTEM_CONTRACTS;
}

export async function getVerifiedContracts(
  page = 1,
  pageSize = 25,
): Promise<Page<ContractRow>> {
  return paginate(chain.VERIFIED_CONTRACTS, page, pageSize);
}

export async function getContract(address: string): Promise<ContractRow | null> {
  return chain.contractByAddress(address);
}

export async function getNames(page = 1, pageSize = 25): Promise<Page<NameRecord>> {
  return paginate(chain.NAMES, page, pageSize);
}

export async function getName(name: string): Promise<NameRecord | null> {
  return chain.nameByName(name);
}

/* ------------------------------------------------------------------
   Status
   ------------------------------------------------------------------ */

export type StatusSnapshot = {
  blockTime: Series;
  tps: Series;
  finality: Series;
  participation: Series;
  committee: { label: string; value: number }[];
  asn: { label: string; value: number }[];
  services: Service[];
  incidents: Incident[];
};

export async function getStatus(
  range: chain.TimeRange = "h24",
): Promise<StatusSnapshot> {
  return {
    blockTime: chain.blockTimeSeries(range),
    tps: chain.tpsSeries(range),
    finality: chain.finalitySeries(range),
    participation: chain.participationSeries(range),
    committee: chain.committeeWeights(),
    asn: chain.asnShare(),
    services: chain.SERVICES,
    incidents: chain.INCIDENTS,
  };
}

/** Named `TimeRange` rather than `Range` so it cannot be shadowed by the DOM's
 *  built-in `Range` interface at a call site that forgets to import it. */
export type { TimeRange } from "@/lib/data/chain";

/* ------------------------------------------------------------------
   Search — one box, every entity
   ------------------------------------------------------------------ */

/**
 * Resolves a free-text query to whatever it actually identifies.
 *
 * Order matters: a bare integer is a height, a 64-character hex string could be
 * either a transaction or a block hash so both indexes are consulted, and
 * anything ending `.lune` is a name even if it would otherwise parse.
 */
export async function search(raw: string): Promise<SearchHit | null> {
  const query = raw.trim().toLowerCase();
  if (!query) return null;

  if (/^\d+$/.test(query)) {
    const height = Number(query);
    return height >= 0 && height <= chain.HEAD ? { kind: "block", height } : null;
  }

  if (isName(query)) {
    return chain.nameByName(query) ? { kind: "name", name: query } : null;
  }

  if (isAddress(query)) {
    return { kind: "account", address: query };
  }

  if (/^al-node-[0-9a-f]{8}$/.test(query)) {
    return chain.validatorById(query) ? { kind: "validator", nodeId: query } : null;
  }

  if (isHash(query)) {
    if (chain.txByHash(query)) return { kind: "tx", hash: query };
    const block = chain.blockByHash(query);
    if (block) return { kind: "block", height: block.height };
    return null;
  }

  return null;
}
