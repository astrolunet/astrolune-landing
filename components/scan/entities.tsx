import Link from "next/link";

import { CopyButton } from "@/components/site/copy";
import { Chip } from "@/components/ui";
import type { NodeLevel, TxStatus, TxType } from "@/lib/api/types";
import type { Dict } from "@/lib/i18n/en";
import { fmtAgo, trunc, type Ago } from "@/lib/format";
import { PATHS } from "@/lib/routes";

/**
 * Presentational helpers shared across every SCAN view.
 *
 * These are server components — a table of five hundred rows must not ship five
 * hundred client components. Anything interactive (the copy button) is a leaf
 * that opts into the client itself.
 *
 * `at` is passed in rather than read from context because these render inside
 * server components that already hold the locale; taking it as an argument keeps
 * them out of the client boundary.
 */

type At = (path: string) => string;

/** A monospace hash that links to its entity and truncates to fit a cell. */
export function HashLink({
  value,
  href,
  head = 8,
  tail = 6,
  copy = false,
  className = "",
}: {
  value: string;
  href: string;
  head?: number;
  tail?: number;
  copy?: boolean;
  className?: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Link
        href={href}
        className={`font-mono text-[0.8125rem] text-chalk/90 underline decoration-transparent decoration-1 underline-offset-2 transition-colors duration-200 hover:decoration-white/40 ${className}`}
      >
        {trunc(value, head, tail)}
      </Link>
      {copy && <CopyButton value={value} />}
    </span>
  );
}

export function BlockLink({ height, at }: { height: number; at: At }) {
  return (
    <Link
      href={at(PATHS.block(height))}
      className="font-mono text-[0.8125rem] text-chalk/90 tabular-nums underline decoration-transparent underline-offset-2 transition-colors duration-200 hover:decoration-white/40"
    >
      {height.toLocaleString("en-US")}
    </Link>
  );
}

export function TxLink({ hash, at, ...rest }: { hash: string; at: At; head?: number; tail?: number; copy?: boolean }) {
  return <HashLink value={hash} href={at(PATHS.tx(hash))} {...rest} />;
}

export function AddressLink({
  address,
  at,
  ...rest
}: {
  address: string;
  at: At;
  head?: number;
  tail?: number;
  copy?: boolean;
}) {
  return <HashLink value={address} href={at(PATHS.account(address))} {...rest} />;
}

/**
 * A dash where an address would be — used for a contract deploy's empty `to`.
 * Reads as "no recipient" rather than as missing data.
 */
export function EmptyCell() {
  return <span className="text-ash-3">—</span>;
}

/* ------------------------------------------------------------------
   Transaction type — a chip whose tone encodes the family
   ------------------------------------------------------------------ */

/**
 * Value-moving types are the ones a reader scans for, so they get the solid
 * chip; consensus-maintenance traffic (votes, attestations, seeds) stays muted
 * so it recedes. This is the palette rule again: no colour, only weight.
 */
const TYPE_TONE: Record<TxType, "neutral" | "muted" | "solid"> = {
  transfer: "solid",
  deploy: "neutral",
  call: "neutral",
  bond: "neutral",
  name: "neutral",
  register: "muted",
  attest: "muted",
  challenge: "muted",
  evidence: "muted",
  commit: "muted",
  reveal: "muted",
  vote: "muted",
};

export function TxTypeChip({
  type,
  dict,
}: {
  type: TxType;
  dict: Dict;
}) {
  return (
    <Chip tone={TYPE_TONE[type]} className="whitespace-nowrap">
      {dict.scan.tx.types[type]}
    </Chip>
  );
}

/* ------------------------------------------------------------------
   Transaction status — a dot, since it is a state not a category
   ------------------------------------------------------------------ */

const STATUS_DOT: Record<TxStatus, string> = {
  success: "bg-live",
  failed: "bg-down",
  reverted: "bg-warn",
  pending: "bg-ash-2 animate-pulse-glow",
};

export function TxStatusBadge({
  status,
  dict,
}: {
  status: TxStatus;
  dict: Dict;
}) {
  const label = dict.scan.tx[status];
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        aria-hidden
        className={`size-1.5 shrink-0 rounded-full ${STATUS_DOT[status]}`}
      />
      <span className="text-[0.75rem] text-ash">{label}</span>
    </span>
  );
}

/* ------------------------------------------------------------------
   Node level
   ------------------------------------------------------------------ */

const LEVEL_TONE: Record<NodeLevel, "solid" | "neutral" | "muted"> = {
  validator: "solid",
  candidate: "neutral",
  relay: "muted",
};

export function LevelChip({
  level,
  dict,
}: {
  level: NodeLevel;
  dict: Dict;
}) {
  const label = dict.home.levels.items[level].name;
  return <Chip tone={LEVEL_TONE[level]}>{label}</Chip>;
}

/* ------------------------------------------------------------------
   Age
   ------------------------------------------------------------------ */

export function AgeCell({ ago, dict }: { ago: Ago; dict: Dict }) {
  return (
    <span className="whitespace-nowrap font-mono text-[0.75rem] text-ash-2 tabular-nums">
      {fmtAgo(ago, dict.scan.ago)}
    </span>
  );
}
