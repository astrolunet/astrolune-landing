"use client";

/**
 * The React surface: one provider, and a hook per resource.
 *
 * Every hook is a selector over the same store. They exist as separate hooks
 * rather than one big `useAstroluneId()` because a component that only renders
 * the domain table should not re-render when a proxy credential rotates — and
 * because `useDomains()` reads better at a call site than
 * `useAstroluneId().domains`.
 *
 * The re-render granularity is honest about its limits: `useSyncExternalStore`
 * compares the whole snapshot by reference, so any action re-renders every
 * subscriber. For a prototype with a handful of panels that is the right
 * trade — the alternative is a selector-with-equality layer that would need to
 * be correct before it is useful.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createIdStore, type IdActions, type IdStore, type LinkResult } from "./store";
import {
  resolveStrings,
  type IdLocale,
  type Strings,
  type StringsOverride,
} from "./strings";
import { addBase, daysUntil } from "./format";
import type {
  AuthMethod,
  Bucket,
  CatalogItem,
  Domain,
  IdState,
  Identity,
  Invoice,
  NodeStat,
  ProxyEndpoint,
  ValidatorInfo,
  Wallet,
} from "./types";

type IdContextValue = {
  store: IdStore;
  strings: Strings;
  locale: IdLocale;
};

const IdContext = createContext<IdContextValue | null>(null);

export type AstroluneIdProviderProps = {
  children: React.ReactNode;
  /** Bundled language for the packaged UI. */
  locale?: IdLocale;
  /**
   * Partial override tree, merged over the bundled language.
   *
   * Hoist this to module scope. A fresh object literal on every render forces
   * the merge to re-run and hands every consumer a new `strings` reference.
   */
  strings?: StringsOverride;
};

export function AstroluneIdProvider({
  children,
  locale = "en",
  strings,
}: AstroluneIdProviderProps) {
  // One store per provider, created lazily so it is never built during a
  // server render it would be thrown away from.
  const ref = useRef<IdStore | null>(null);
  if (!ref.current) ref.current = createIdStore();
  const store = ref.current;

  useEffect(() => {
    // Reading localStorage here rather than during render is what keeps the
    // first client paint identical to the server's.
    store.actions.hydrate();
    return () => store.dispose();
  }, [store]);

  const value = useMemo<IdContextValue>(
    () => ({ store, strings: resolveStrings(locale, strings), locale }),
    [store, locale, strings],
  );

  return <IdContext.Provider value={value}>{children}</IdContext.Provider>;
}

function useIdContext(): IdContextValue {
  const ctx = useContext(IdContext);
  if (!ctx) {
    throw new Error(
      "Astrolune ID hooks require <AstroluneIdProvider> above them in the tree.",
    );
  }
  return ctx;
}

function useIdState(): IdState {
  const { store } = useIdContext();
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}

/** Actions only — for components that dispatch but render nothing from state. */
export function useIdActions(): IdActions {
  return useIdContext().store.actions;
}

export function useIdStrings(): Strings {
  return useIdContext().strings;
}

export function useIdLocale(): IdLocale {
  return useIdContext().locale;
}

/** The whole snapshot plus actions. Convenient; re-renders on everything. */
export function useAstroluneId(): IdState & {
  actions: IdActions;
  strings: Strings;
  locale: IdLocale;
} {
  const { store, strings, locale } = useIdContext();
  const state = useIdState();
  return { ...state, actions: store.actions, strings, locale };
}

/* ------------------------------------------------------------------
   Session
   ------------------------------------------------------------------ */

export function useIdentity(): {
  identity: Identity | null;
  ready: boolean;
  isAuthenticated: boolean;
  isValidator: boolean;
} {
  const { ready, status, identity } = useIdState();
  return {
    identity,
    ready,
    isAuthenticated: status === "authenticated" && identity !== null,
    isValidator: identity?.isValidator ?? false,
  };
}

const ALL_METHODS: readonly AuthMethod[] = ["wallet", "passkey", "email", "recovery"];

export function useSignIn(): {
  prepare: (method: AuthMethod) => void;
  signIn: (method: AuthMethod) => void;
  signOut: () => void;
  cancel: () => void;
  status: IdState["status"];
  pending: AuthMethod | null;
  error: string | null;
  ready: boolean;
  isAuthenticated: boolean;
  methods: readonly AuthMethod[];
  challenge: string;
} {
  const { store } = useIdContext();
  const { status, pending, error, ready, identity } = useIdState();
  return {
    prepare: store.actions.prepare,
    signIn: store.actions.signIn,
    signOut: store.actions.signOut,
    cancel: store.actions.cancelSignIn,
    status,
    pending,
    error,
    ready,
    isAuthenticated: status === "authenticated" && identity !== null,
    methods: ALL_METHODS,
    challenge: store.actions.challenge(),
  };
}

/* ------------------------------------------------------------------
   Resources
   ------------------------------------------------------------------ */

export function useWallets(): {
  wallets: Wallet[];
  primary: Wallet | null;
  total: string;
  link: (input: Parameters<IdActions["linkWallet"]>[0]) => LinkResult;
  unlink: (id: string) => void;
  setPrimary: (id: string) => void;
} {
  const { store } = useIdContext();
  const { wallets } = useIdState();
  // Watch-only balances are excluded: the account cannot spend them, so
  // counting them in a total would overstate what is actually available.
  const total = useMemo(
    () =>
      wallets
        .filter((w) => w.verified)
        .map((w) => w.balance)
        .reduce(addBase, "0"),
    [wallets],
  );
  return {
    wallets,
    primary: wallets.find((w) => w.primary) ?? null,
    total,
    link: store.actions.linkWallet,
    unlink: store.actions.unlinkWallet,
    setPrimary: store.actions.setPrimaryWallet,
  };
}

/** Days inside which a name counts as expiring soon. */
export const EXPIRY_WINDOW_DAYS = 30;

export function useDomains(): {
  domains: Domain[];
  /** Needs a client clock; `null` until one is passed in. */
  expiring: (now: number) => Domain[];
  setAutoRenew: (name: string, on: boolean) => void;
  setTarget: (name: string, target: string | null) => void;
  register: (name: string) => void;
  renew: (name: string) => void;
} {
  const { store } = useIdContext();
  const { domains } = useIdState();
  const expiring = useCallback(
    (now: number) =>
      domains.filter(
        (d) =>
          d.status === "grace" ||
          (d.status === "active" && daysUntil(d.expiresAt, now) <= EXPIRY_WINDOW_DAYS),
      ),
    [domains],
  );
  return {
    domains,
    expiring,
    setAutoRenew: store.actions.setAutoRenew,
    setTarget: store.actions.setDomainTarget,
    register: store.actions.registerDomain,
    renew: store.actions.renewDomain,
  };
}

export function useShare(): {
  buckets: Bucket[];
  usedBytes: number;
  quotaBytes: number;
  create: IdActions["createBucket"];
  grow: IdActions["growBucket"];
  remove: (id: string) => void;
} {
  const { store } = useIdContext();
  const { buckets } = useIdState();
  const totals = useMemo(
    () => ({
      usedBytes: buckets.reduce((sum, b) => sum + b.usedBytes, 0),
      quotaBytes: buckets.reduce((sum, b) => sum + b.quotaBytes, 0),
    }),
    [buckets],
  );
  return {
    buckets,
    ...totals,
    create: store.actions.createBucket,
    grow: store.actions.growBucket,
    remove: store.actions.deleteBucket,
  };
}

export function useProxy(): {
  proxies: ProxyEndpoint[];
  usedGb: number;
  quotaGb: number;
  buy: IdActions["buyProxy"];
  configure: IdActions["configureProxy"];
  rotate: (id: string) => void;
  topUp: (id: string, quotaGb: number) => void;
} {
  const { store } = useIdContext();
  const { proxies } = useIdState();
  const totals = useMemo(
    () => ({
      usedGb: proxies.reduce((sum, p) => sum + p.usedGb, 0),
      quotaGb: proxies.reduce((sum, p) => sum + p.quotaGb, 0),
    }),
    [proxies],
  );
  return {
    proxies,
    ...totals,
    buy: store.actions.buyProxy,
    configure: store.actions.configureProxy,
    rotate: store.actions.rotateProxy,
    topUp: store.actions.topUpProxy,
  };
}

export function useNodes(): {
  nodes: NodeStat[];
  online: number;
  refresh: () => void;
} {
  const { store } = useIdContext();
  const { nodes } = useIdState();
  return {
    nodes,
    online: nodes.filter((n) => n.status === "online").length,
    refresh: store.actions.refreshNodes,
  };
}

export function useValidator(): {
  validator: ValidatorInfo | null;
  node: NodeStat | null;
} {
  const { validator, nodes } = useIdState();
  return {
    validator,
    node: validator ? nodes.find((n) => n.nodeId === validator.nodeId) ?? null : null,
  };
}

export function useCatalog(): { catalog: CatalogItem[]; buy: (sku: string) => void } {
  const { store } = useIdContext();
  const { catalog } = useIdState();
  return { catalog, buy: store.actions.buy };
}

/* ------------------------------------------------------------------
   Checkout
   ------------------------------------------------------------------ */

export function useCheckout(): {
  invoice: Invoice | null;
  /** Milliseconds left in the window; `null` before the client clock starts. */
  remaining: number | null;
  simulate: () => void;
  close: () => void;
} {
  const { store } = useIdContext();
  const { invoice } = useIdState();
  const open = invoice !== null && invoice.status === "awaiting";
  const now = useNow(1000, open);

  useEffect(() => {
    if (!open || now === null || !invoice) return;
    if (now >= invoice.expiresAt) store.actions.expireInvoice();
  }, [open, now, invoice, store]);

  return {
    invoice,
    remaining: invoice && now !== null ? Math.max(0, invoice.expiresAt - now) : null,
    simulate: store.actions.simulatePayment,
    close: store.actions.closeCheckout,
  };
}

/* ------------------------------------------------------------------
   Small utilities the UI kit leans on
   ------------------------------------------------------------------ */

/**
 * A ticking clock that is `null` on the server and on the first client render.
 *
 * Anything that formats "now" has to go through this. Reading `Date.now()`
 * during render puts a different string in the server HTML than in the client
 * tree, and React discards the whole subtree when it notices.
 */
export function useNow(intervalMs = 1000, active = true): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!active) {
      setNow(null);
      return;
    }
    setNow(Date.now());
    const handle = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(handle);
  }, [intervalMs, active]);

  return now;
}

/** Clipboard write plus a self-clearing confirmation flag. */
export function useCopy(resetMs = 1400): {
  copied: string | null;
  copy: (value: string, key?: string) => void;
} {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    (value: string, key?: string) => {
      const mark = () => {
        setCopied(key ?? value);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(null), resetMs);
      };
      // `writeText` rejects without a user gesture and on insecure origins.
      // A failed copy leaves the value on screen to select by hand, so the
      // rejection is swallowed rather than surfaced.
      navigator.clipboard?.writeText(value).then(mark, () => {});
    },
    [resetMs],
  );

  return { copied, copy };
}

/** Escape-to-dismiss, attached only while the overlay is open. */
export function useEscape(onClose: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, active]);
}

/**
 * Freezes background scroll while an overlay is open.
 *
 * Restores the previous inline value rather than clearing it, so two nested
 * overlays closing in sequence do not leave the page unscrollable.
 */
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

/**
 * Moves focus into an overlay on open and returns it on close.
 *
 * Not a full focus trap — Tab can still leave the dialog. A real trap needs a
 * sentinel pair and careful ordering; this covers the case that actually
 * bites, which is a keyboard user landing nowhere when a dialog appears.
 */
export function useAutoFocus<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!active) return;
    const previous = document.activeElement as HTMLElement | null;
    const handle = requestAnimationFrame(() => ref.current?.focus());
    return () => {
      cancelAnimationFrame(handle);
      previous?.focus?.();
    };
  }, [active]);

  return ref;
}
