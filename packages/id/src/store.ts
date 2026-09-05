/**
 * The ID store.
 *
 * A plain observable over `IdState`, shaped for `useSyncExternalStore`:
 * `subscribe` + `getSnapshot` + a *stable* `getServerSnapshot`. Every action
 * replaces the state object rather than mutating it, because
 * `useSyncExternalStore` compares snapshots by reference.
 *
 * Hydration is the constraint that dictates the design. `ready` starts `false`
 * and `getServerSnapshot` always returns the same frozen `INITIAL`, so the
 * server render and the first client render are identical no matter what is in
 * localStorage. Only after `hydrate()` runs — in an effect, on the client — does
 * a restored session appear.
 *
 * The `mock*` calls are the seam. Replacing them with `fetch` against a real
 * API changes this file and nothing above it.
 */

import type {
  AuthMethod,
  Bucket,
  CatalogItem,
  Domain,
  IdState,
  Invoice,
  ProxyEndpoint,
  ProxyProtocol,
  ProxyRotation,
  Wallet,
  WalletKind,
} from "./types";
import {
  FIXTURE_BUCKETS,
  FIXTURE_CATALOG,
  FIXTURE_DOMAINS,
  FIXTURE_IDENTITY,
  FIXTURE_NODES,
  FIXTURE_PROXIES,
  FIXTURE_VALIDATOR,
  FIXTURE_WALLETS,
  PROXY_TRAFFIC,
  SHARE_QUOTAS,
  makeBucket,
  makeChallenge,
  makeDomain,
  makeInvoice,
  makeProxy,
  makeTxHash,
  makeWallet,
  rotateSecret,
} from "./mock";
import { isAddress } from "./rng";

const STORAGE_KEY = "astrolune.id.session.v1";
const DAY = 86_400_000;
const GB = 1024 ** 3;

/** Frozen so an accidental mutation surfaces immediately in development. */
export const INITIAL: IdState = Object.freeze({
  ready: false,
  status: "restoring",
  pending: null,
  error: null,
  identity: null,
  wallets: [],
  domains: [],
  buckets: [],
  proxies: [],
  nodes: [],
  validator: null,
  catalog: FIXTURE_CATALOG,
  invoice: null,
}) as IdState;

/** What a purchase should do to the account once its invoice settles. */
type Fulfilment =
  | { kind: "registerDomain"; name: string }
  | { kind: "renewDomain"; name: string }
  | { kind: "createBucket"; label: string; region: string; quotaGb: number }
  | { kind: "growBucket"; id: string; quotaGb: number }
  | { kind: "createProxy"; label: string; region: string; protocol: ProxyProtocol; rotation: ProxyRotation; quotaGb: number }
  | { kind: "topUpProxy"; id: string; quotaGb: number }
  | { kind: "upgradeTier" }
  | { kind: "none" };

export type LinkResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "duplicate" };

export type IdActions = {
  /** Reads the persisted session. Call once, from an effect. */
  hydrate(): void;
  /** Mints the challenge for a method without signing it yet. */
  prepare(method: AuthMethod): void;
  signIn(method: AuthMethod): void;
  cancelSignIn(): void;
  signOut(): void;
  clearError(): void;

  linkWallet(input: { address: string; label: string; kind: WalletKind }): LinkResult;
  unlinkWallet(id: string): void;
  setPrimaryWallet(id: string): void;

  setAutoRenew(name: string, on: boolean): void;
  setDomainTarget(name: string, target: string | null): void;
  registerDomain(name: string): void;
  renewDomain(name: string): void;

  createBucket(input: { label: string; region: string; quotaGb: number }): void;
  growBucket(id: string, quotaGb: number): void;
  deleteBucket(id: string): void;

  buyProxy(input: {
    label: string;
    region: string;
    protocol: ProxyProtocol;
    rotation: ProxyRotation;
    quotaGb: number;
  }): void;
  configureProxy(id: string, patch: { protocol?: ProxyProtocol; rotation?: ProxyRotation }): void;
  rotateProxy(id: string): void;
  topUpProxy(id: string, quotaGb: number): void;

  refreshNodes(): void;

  buy(sku: string): void;
  /** Stands in for a watched deposit address seeing an inbound transfer. */
  simulatePayment(): void;
  expireInvoice(): void;
  closeCheckout(): void;

  /** The nonce the current sign-in attempt is asking a wallet to sign. */
  challenge(): string;
};

export type IdStore = {
  subscribe(listener: () => void): () => void;
  getSnapshot(): IdState;
  getServerSnapshot(): IdState;
  actions: IdActions;
  /** Releases pending timers. The provider calls this on unmount. */
  dispose(): void;
};

type Persisted = {
  v: 1;
  identity: IdState["identity"];
  wallets: Wallet[];
  domains: Domain[];
  buckets: Bucket[];
  proxies: ProxyEndpoint[];
};

export function createIdStore(): IdStore {
  let state = INITIAL;
  const listeners = new Set<() => void>();
  const timers = new Set<ReturnType<typeof setTimeout>>();

  let fulfilment: Fulfilment = { kind: "none" };
  let challengeNonce = "";
  let rotations = 0;
  let refreshes = 0;

  function emit() {
    for (const listener of listeners) listener();
  }

  function set(patch: Partial<IdState>) {
    state = { ...state, ...patch };
    emit();
  }

  function later(fn: () => void, ms: number) {
    const handle = setTimeout(() => {
      timers.delete(handle);
      fn();
    }, ms);
    timers.add(handle);
  }

  function clearTimers() {
    for (const handle of timers) clearTimeout(handle);
    timers.clear();
  }

  /* --------------------------------------------------------------
     Persistence
     -------------------------------------------------------------- */

  function persist() {
    if (typeof window === "undefined") return;
    if (!state.identity) {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // Private-mode Safari throws on write. A lost session is acceptable;
        // a thrown error inside an action is not.
      }
      return;
    }
    const payload: Persisted = {
      v: 1,
      identity: state.identity,
      wallets: state.wallets,
      domains: state.domains,
      buckets: state.buckets,
      proxies: state.proxies,
    };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // As above.
    }
  }

  function read(): Persisted | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Persisted;
      // Anything but the exact shape is discarded rather than patched: a
      // half-restored session is worse than a fresh sign-in.
      if (parsed?.v !== 1 || !parsed.identity || !Array.isArray(parsed.wallets)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  /* --------------------------------------------------------------
     Session
     -------------------------------------------------------------- */

  function hydrate() {
    if (state.ready) return;
    const saved = read();
    if (!saved) {
      set({ ready: true, status: "anonymous" });
      return;
    }
    set({
      ready: true,
      status: "authenticated",
      identity: saved.identity,
      wallets: saved.wallets,
      domains: saved.domains ?? [],
      buckets: saved.buckets ?? [],
      proxies: saved.proxies ?? [],
      nodes: FIXTURE_NODES,
      validator: saved.identity?.isValidator ? FIXTURE_VALIDATOR : null,
    });
  }

  function prepare(method: AuthMethod) {
    if (state.status === "authenticating") return;
    // Mints the nonce without authenticating, so the sign-in dialog can show
    // the exact bytes it is about to ask a key to sign. A prompt that says
    // "trust me" is the thing this step exists to avoid.
    challengeNonce = makeChallenge(Date.now());
    set({ pending: method, error: null });
  }

  function signIn(method: AuthMethod) {
    if (state.status === "authenticating") return;
    // Reuse the nonce `prepare` minted for this method: the user has now seen
    // it, so signing a different one would make the display a lie.
    if (state.pending !== method || !challengeNonce) {
      challengeNonce = makeChallenge(Date.now());
    }
    set({ status: "authenticating", pending: method, error: null });

    // A believable pause. Long enough that the pending state is visible,
    // short enough not to feel broken.
    later(() => {
      const identity = { ...FIXTURE_IDENTITY };
      set({
        status: "authenticated",
        pending: null,
        error: null,
        identity,
        wallets: FIXTURE_WALLETS,
        domains: FIXTURE_DOMAINS,
        buckets: FIXTURE_BUCKETS,
        proxies: FIXTURE_PROXIES,
        nodes: FIXTURE_NODES,
        validator: identity.isValidator ? FIXTURE_VALIDATOR : null,
      });
      persist();
    }, 900);
  }

  function cancelSignIn() {
    clearTimers();
    set({ status: state.identity ? "authenticated" : "anonymous", pending: null });
  }

  function signOut() {
    clearTimers();
    fulfilment = { kind: "none" };
    state = {
      ...INITIAL,
      ready: true,
      status: "anonymous",
      catalog: FIXTURE_CATALOG,
    };
    persist();
    emit();
  }

  /* --------------------------------------------------------------
     Wallets
     -------------------------------------------------------------- */

  function linkWallet(input: {
    address: string;
    label: string;
    kind: WalletKind;
  }): LinkResult {
    const address = input.address.trim().toLowerCase();
    if (!isAddress(address)) return { ok: false, reason: "invalid" };
    if (state.wallets.some((w) => w.address === address)) {
      return { ok: false, reason: "duplicate" };
    }
    const wallet = makeWallet({ ...input, address, now: Date.now() });
    // The first wallet on an empty account is primary by definition —
    // otherwise invoices would have nothing to draw on.
    const wallets = [
      ...state.wallets,
      state.wallets.length === 0 ? { ...wallet, primary: true } : wallet,
    ];
    set({ wallets });
    persist();
    return { ok: true };
  }

  function unlinkWallet(id: string) {
    const remaining = state.wallets.filter((w) => w.id !== id);
    // Promote the next wallet if the primary was the one removed, so the
    // account never sits without a paying account.
    const wallets =
      remaining.length > 0 && !remaining.some((w) => w.primary)
        ? remaining.map((w, i) => (i === 0 ? { ...w, primary: true } : w))
        : remaining;
    set({ wallets });
    persist();
  }

  function setPrimaryWallet(id: string) {
    const target = state.wallets.find((w) => w.id === id);
    // A watch-only wallet cannot spend, so it cannot be the payer.
    if (!target || !target.verified) return;
    set({ wallets: state.wallets.map((w) => ({ ...w, primary: w.id === id })) });
    persist();
  }

  /* --------------------------------------------------------------
     Domains
     -------------------------------------------------------------- */

  function patchDomain(name: string, patch: Partial<Domain>) {
    set({
      domains: state.domains.map((d) => (d.name === name ? { ...d, ...patch } : d)),
    });
    persist();
  }

  /* --------------------------------------------------------------
     Buckets
     -------------------------------------------------------------- */

  function deleteBucket(id: string) {
    set({ buckets: state.buckets.filter((b) => b.id !== id) });
    persist();
  }

  /* --------------------------------------------------------------
     Proxies
     -------------------------------------------------------------- */

  function patchProxy(id: string, patch: Partial<ProxyEndpoint>) {
    set({
      proxies: state.proxies.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });
    persist();
  }

  /* --------------------------------------------------------------
     Nodes
     -------------------------------------------------------------- */

  function refreshNodes() {
    refreshes += 1;
    // Heights advance, peers drift, and a syncing node closes the gap. Enough
    // movement to prove the panel is live without inventing a websocket.
    set({
      nodes: state.nodes.map((n) => ({
        ...n,
        height: n.status === "offline" ? n.height : n.height + 2 + (refreshes % 3),
        peers: Math.max(8, n.peers + ((refreshes % 5) - 2)),
        series: [...n.series.slice(1), n.series[n.series.length - 1]],
      })),
    });
  }

  /* --------------------------------------------------------------
     Checkout
     -------------------------------------------------------------- */

  function open(item: CatalogItem, next: Fulfilment) {
    clearTimers();
    fulfilment = next;
    set({ invoice: makeInvoice(item, Date.now()), error: null });
  }

  function catalogItem(sku: string): CatalogItem | undefined {
    return state.catalog.find((c) => c.sku === sku);
  }

  /** Ad-hoc line item for a configuration the catalogue does not list. */
  function lineItem(input: {
    sku: string;
    kind: CatalogItem["kind"];
    label: string;
    blurb: string;
    price: string;
    period: CatalogItem["period"];
    specs: { k: string; v: string }[];
  }): CatalogItem {
    return input;
  }

  /**
   * Price for a quota, off the published tiers.
   *
   * Every form picks its quota *from* these tiers, so the exact match is the
   * normal path. An off-tier number bills at the next tier up rather than
   * pro-rata: dividing base-unit strings by a float is how rounding errors get
   * into prices, and rounding a price down is worse than rounding a quota up.
   */
  function tierPrice(
    tiers: readonly { gb: number; price: string }[],
    gb: number,
  ): string {
    return (tiers.find((t) => t.gb >= gb) ?? tiers[tiers.length - 1]).price;
  }

  const sharePrice = (gb: number) => tierPrice(SHARE_QUOTAS, gb);
  const trafficPrice = (gb: number) => tierPrice(PROXY_TRAFFIC, gb);

  function settle(invoice: Invoice) {
    apply(fulfilment);
    fulfilment = { kind: "none" };
    set({
      invoice: {
        ...invoice,
        status: "paid",
        confirmations: invoice.requiredConfirmations,
        txHash: makeTxHash(invoice.id),
      },
    });
    persist();
  }

  function simulatePayment() {
    const invoice = state.invoice;
    if (!invoice || invoice.status !== "awaiting") return;

    const seen: Invoice = {
      ...invoice,
      status: "confirming",
      confirmations: 1,
      txHash: makeTxHash(invoice.id),
    };
    set({ invoice: seen });

    // One confirmation per beat until the requirement is met, then apply.
    // Mirrors what a deposit watcher would push over a socket.
    const step = (n: number) => {
      later(() => {
        const current = state.invoice;
        if (!current || current.id !== invoice.id) return;
        if (n >= current.requiredConfirmations) {
          settle(current);
          return;
        }
        set({ invoice: { ...current, confirmations: n } });
        step(n + 1);
      }, 420);
    };
    step(2);
  }

  function apply(next: Fulfilment) {
    const now = Date.now();
    switch (next.kind) {
      case "registerDomain": {
        if (state.domains.some((d) => d.name === next.name)) return;
        set({ domains: [...state.domains, makeDomain(next.name, now)] });
        return;
      }
      case "renewDomain": {
        set({
          domains: state.domains.map((d) =>
            d.name === next.name
              ? {
                  ...d,
                  // Renewing from grace extends from *now*, not from the
                  // lapsed date — the lapsed window is not credited back.
                  expiresAt: Math.max(d.expiresAt, now) + 365 * DAY,
                  status: "active",
                }
              : d,
          ),
        });
        return;
      }
      case "createBucket": {
        set({
          buckets: [
            ...state.buckets,
            makeBucket({
              label: next.label,
              region: next.region,
              quotaGb: next.quotaGb,
              now,
            }),
          ],
        });
        return;
      }
      case "growBucket": {
        set({
          buckets: state.buckets.map((b) =>
            b.id === next.id ? { ...b, quotaBytes: next.quotaGb * GB } : b,
          ),
        });
        return;
      }
      case "createProxy": {
        set({ proxies: [...state.proxies, makeProxy({ ...next, now })] });
        return;
      }
      case "topUpProxy": {
        set({
          proxies: state.proxies.map((p) =>
            p.id === next.id
              ? {
                  ...p,
                  quotaGb: p.quotaGb + next.quotaGb,
                  expiresAt: Math.max(p.expiresAt, now) + 30 * DAY,
                  status: "active",
                }
              : p,
          ),
        });
        return;
      }
      case "upgradeTier": {
        if (!state.identity) return;
        set({ identity: { ...state.identity, tier: "operator" } });
        return;
      }
      case "none":
        return;
    }
  }

  /* --------------------------------------------------------------
     Public surface
     -------------------------------------------------------------- */

  const actions: IdActions = {
    hydrate,
    prepare,
    signIn,
    cancelSignIn,
    signOut,
    clearError: () => set({ error: null }),

    linkWallet,
    unlinkWallet,
    setPrimaryWallet,

    setAutoRenew: (name, on) => patchDomain(name, { autoRenew: on }),
    setDomainTarget: (name, target) => patchDomain(name, { target }),

    registerDomain(name) {
      const item = catalogItem("domain.register.1y");
      if (!item) return;
      open({ ...item, label: `Register ${name}` }, { kind: "registerDomain", name });
    },

    renewDomain(name) {
      const item = catalogItem("domain.register.1y");
      if (!item) return;
      open({ ...item, label: `Renew ${name}` }, { kind: "renewDomain", name });
    },

    createBucket(input) {
      open(
        lineItem({
          sku: "share.bucket",
          kind: "share",
          label: `Share · ${input.label}`,
          blurb: `${input.quotaGb} GB in ${input.region}, replicated four ways.`,
          price: sharePrice(input.quotaGb),
          period: "month",
          specs: [
            { k: "Quota", v: `${input.quotaGb} GB` },
            { k: "Region", v: input.region },
            { k: "Replicas", v: "4" },
          ],
        }),
        { kind: "createBucket", ...input },
      );
    },

    growBucket(id, quotaGb) {
      const bucket = state.buckets.find((b) => b.id === id);
      if (!bucket) return;
      open(
        lineItem({
          sku: "share.grow",
          kind: "share",
          label: `Raise ${bucket.label} to ${quotaGb} GB`,
          blurb: "Quota changes take effect immediately. No data is moved.",
          price: sharePrice(quotaGb),
          period: "month",
          specs: [
            { k: "From", v: `${Math.round(bucket.quotaBytes / GB)} GB` },
            { k: "To", v: `${quotaGb} GB` },
          ],
        }),
        { kind: "growBucket", id, quotaGb },
      );
    },

    deleteBucket,

    buyProxy(input) {
      open(
        lineItem({
          sku: "proxy.endpoint",
          kind: "proxy",
          label: `Proxy · ${input.region}`,
          blurb: `${input.protocol.toUpperCase()} egress, ${input.quotaGb} GB included.`,
          price: trafficPrice(input.quotaGb),
          period: "month",
          specs: [
            { k: "Protocol", v: input.protocol },
            { k: "Rotation", v: input.rotation },
            { k: "Traffic", v: `${input.quotaGb} GB` },
          ],
        }),
        { kind: "createProxy", ...input },
      );
    },

    configureProxy: (id, patch) => patchProxy(id, patch),

    rotateProxy(id) {
      rotations += 1;
      patchProxy(id, { secret: rotateSecret(id, rotations) });
    },

    topUpProxy(id, quotaGb) {
      const proxy = state.proxies.find((p) => p.id === id);
      if (!proxy) return;
      open(
        lineItem({
          sku: "proxy.topup",
          kind: "proxy",
          label: `Top up ${proxy.label}`,
          blurb: `Adds ${quotaGb} GB and pushes the renewal out 30 days.`,
          price: trafficPrice(quotaGb),
          period: "once",
          specs: [
            { k: "Added", v: `${quotaGb} GB` },
            { k: "Endpoint", v: proxy.host },
          ],
        }),
        { kind: "topUpProxy", id, quotaGb },
      );
    },

    refreshNodes,

    buy(sku) {
      const item = catalogItem(sku);
      if (!item) return;
      open(
        item,
        item.kind === "tier"
          ? { kind: "upgradeTier" }
          : item.kind === "share"
            ? { kind: "createBucket", label: "new-bucket", region: "eu-central", quotaGb: 100 }
            : item.kind === "proxy"
              ? {
                  kind: "createProxy",
                  label: "proxy-eu",
                  region: "eu-north",
                  protocol: "socks5",
                  rotation: "per-request",
                  quotaGb: 500,
                }
              : { kind: "none" },
      );
    },

    simulatePayment,

    expireInvoice() {
      const invoice = state.invoice;
      // Only an unpaid window expires. A payment mid-confirmation is honoured
      // past the deadline, which is how a real watcher has to behave.
      if (!invoice || invoice.status !== "awaiting") return;
      set({ invoice: { ...invoice, status: "expired" } });
    },

    closeCheckout() {
      clearTimers();
      fulfilment = { kind: "none" };
      set({ invoice: null });
    },

    challenge: () => challengeNonce,
  };

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => state,
    getServerSnapshot: () => INITIAL,
    actions,
    dispose: clearTimers,
  };
}
