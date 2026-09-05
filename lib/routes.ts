/**
 * Root-relative route map. Every internal link goes through here so a rename
 * is a single edit, and `localePath()` prefixes the locale at render time.
 */
export const ROUTES = {
  home: "/",

  network: "/network",
  validators: "/validators",
  status: "/status",
  node: "/node",

  scan: "/scan",
  scanBlocks: "/scan/blocks",
  scanTxs: "/scan/txs",
  scanAccounts: "/scan/accounts",
  scanContracts: "/scan/contracts",
  scanNames: "/scan/names",
  scanValidators: "/scan/validators",
  scanSearch: "/scan/search",

  docs: "/docs",
  news: "/news",
  blog: "/blog",

  about: "/about",
  careers: "/careers",

  wallets: "/wallets",
  lune: "/lune",
  dns: "/dns",
  contracts: "/contracts",
  id: "/id",

  legalPrivacy: "/legal/privacy",
  legalTerms: "/legal/terms",
  legalDisclaimer: "/legal/disclaimer",
  legalCookies: "/legal/cookies",
} as const;

/** Deep links into the docs tree, referenced from nav and footer. */
export const DOC_ROUTES = {
  vision: "/docs/00-overview/vision",
  glossary: "/docs/00-overview/glossary",
  potb: "/docs/01-consensus/potb",
  architecture: "/docs/02-architecture/system-architecture",
  componentMap: "/docs/02-architecture/component-map",
  boundary: "/docs/02-architecture/c-cpp-boundary",
  crypto: "/docs/02-architecture/cryptography",
  dataFlow: "/docs/02-architecture/data-flow",
  networking: "/docs/02-architecture/networking-p2p",
  vm: "/docs/03-vm/vm-spec",
  isa: "/docs/03-vm/bytecode-isa",
  gas: "/docs/03-vm/gas-model",
  transactions: "/docs/04-state/transactions",
  stateModel: "/docs/04-state/state-model",
  languages: "/docs/05-languages/contract-languages",
  dnsSpec: "/docs/06-services/dns-lune",
  storage: "/docs/06-services/storage",
  proxy: "/docs/06-services/proxy",
  roadmap: "/docs/07-roadmap/roadmap",
  openQuestions: "/docs/07-roadmap/open-questions",
  implementationStatus: "/docs/08-implementation/implementation-status",
  coreApi: "/docs/08-implementation/core-api",
  buildAndTest: "/docs/08-implementation/build-and-test",
  idOverview: "/docs/09-id/astrolune-id",
  idSdk: "/docs/09-id/id-sdk",
  idUiKit: "/docs/09-id/id-ui-kit",
} as const;

/** Anchors into the home page, used by the in-page section nav. */
export const HOME_SECTIONS = [
  "home",
  "network",
  "features",
  "stack",
  "coin",
  "levels",
  "roadmap",
  "faq",
] as const;

/**
 * Builders for the dynamic routes. Kept beside `ROUTES` so that every link in
 * the tree — static or parameterised — is still written in exactly one place.
 * Identifiers are encoded here rather than at the call sites.
 */
export const PATHS = {
  block: (height: number | string) => `/scan/blocks/${height}`,
  tx: (hash: string) => `/scan/txs/${hash}`,
  account: (address: string) => `/scan/accounts/${address}`,
  contract: (address: string) => `/scan/contracts/${address}`,
  name: (name: string) => `/scan/names/${encodeURIComponent(name)}`,
  validator: (nodeId: string) => `/scan/validators/${nodeId}`,
  newsPost: (slug: string) => `/news/${slug}`,
  blogPost: (slug: string) => `/blog/${slug}`,
  doc: (slug: string) => `/docs/${slug}`,
} as const;
