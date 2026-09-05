/**
 * Single source of truth for every external handle, endpoint and address the
 * site renders. Swap the placeholders here and the whole site follows —
 * nothing else in the tree hardcodes a URL.
 */

export const SITE = {
  name: "Astrolune",
  domain: "astrolune.network",
  url: "https://astrolune.network",
  coin: {
    name: "Lune",
    ticker: "LUNE",
    symbol: "$LUNE",
    decimals: 9,
  },
} as const;

/** External links. Placeholders — replace with the real handles. */
export const LINKS = {
  github: "https://github.com/astrolune",
  githubCore: "https://github.com/astrolune/astrolune",
  githubDocs: "https://github.com/astrolune/docs",
  telegram: "https://t.me/astrolune",
  telegramDev: "https://t.me/astrolune_dev",
  x: "https://x.com/astrolune",
  email: "hello@astrolune.network",
  security: "security@astrolune.network",
} as const;

/** Network endpoints, surfaced on the developer and node pages. */
export const ENDPOINTS = {
  mainnet: {
    label: "Mainnet",
    chainId: "astrolune-1",
    rpc: "https://rpc.astrolune.network",
    ws: "wss://rpc.astrolune.network/ws",
    scan: "https://scan.astrolune.network",
    status: "operational",
  },
  testnet: {
    label: "Testnet",
    chainId: "astrolune-testnet-4",
    rpc: "https://rpc.testnet.astrolune.network",
    ws: "wss://rpc.testnet.astrolune.network/ws",
    scan: "https://scan.testnet.astrolune.network",
    faucet: "https://faucet.testnet.astrolune.network",
    status: "operational",
  },
} as const;

/**
 * The tree is pre-mainnet. This flag drives every "not live yet" notice, so
 * flipping it once is what launch looks like from the site's side.
 */
export const NETWORK_LIVE = true;
