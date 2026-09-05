# @astrolune/id

One account for the whole network: wallets, `.lune` names, Share buckets, proxy
endpoints and nodes, linked to a single identity. This package is the client —
hooks, a store, and a UI kit that matches the Astrolune design system.

> **Prototype.** There is no backend. Every figure is a local fixture, the
> session lives in `localStorage`, and payments are simulated. The types,
> hooks and components are the real surface; the transport underneath them is
> not. Swapping `mock.ts` for a real client should not change a single consumer.

## Install

```
npm i @astrolune/id
```

The package ships **TypeScript source**, not a build. It is consumed by
bundlers that already compile TS — Next, Vite, or anything on SWC/esbuild — and
publishing source keeps the prototype honest about being source. If your build
does not transpile dependencies, transpile this one explicitly (in Next:
`transpilePackages: ["@astrolune/id"]`).

## Quick start

```tsx
// app/layout.tsx
import { AstroluneIdProvider } from "@astrolune/id";
import "@astrolune/id/tokens.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AstroluneIdProvider locale="en">{children}</AstroluneIdProvider>
      </body>
    </html>
  );
}
```

```tsx
// anywhere below the provider
import { IdSignInButton, IdConsole } from "@astrolune/id";

<IdSignInButton consoleHref="/id" />;
<IdConsole />;
```

That is the whole integration. `IdSignInButton` renders the sign-in pill when
anonymous and an account menu when authenticated, and owns its own dialog.
`IdConsole` renders every panel, the section nav, the signed-out gate, and the
one payment modal all purchases flow through.

## Stylesheets

Two files, and you want exactly one of them:

| File | Contains | Use when |
| --- | --- | --- |
| `tokens.css` | `@theme` tokens, `@utility` helpers, keyframes | The host has no Astrolune design system of its own |
| `theme.css` | Keyframes only | The host already defines the tokens (e.g. the Astrolune site) |

Loading both means the package fights the host over `--font-display` and the
panel utilities, and whichever import lands last wins. Pick one.

Tailwind 4 also has to be told to scan the package, or the classes are compiled
away:

```css
@import "tailwindcss";
@source "../node_modules/@astrolune/id/src";
```

## Hooks

Every hook is a selector over one store. Call the narrow one — it reads better
than reaching through a god object.

| Hook | Returns |
| --- | --- |
| `useIdentity()` | `identity`, `ready`, `isAuthenticated`, `isValidator` |
| `useSignIn()` | `prepare`, `signIn`, `signOut`, `cancel`, `status`, `challenge`, `methods` |
| `useWallets()` | `wallets`, `primary`, `total`, `link`, `unlink`, `setPrimary` |
| `useDomains()` | `domains`, `expiring(now)`, `register`, `renew`, `setAutoRenew`, `setTarget` |
| `useShare()` | `buckets`, `usedBytes`, `quotaBytes`, `create`, `grow`, `remove` |
| `useProxy()` | `proxies`, `usedGb`, `quotaGb`, `buy`, `configure`, `rotate`, `topUp` |
| `useNodes()` | `nodes`, `online`, `refresh` |
| `useValidator()` | `validator`, `node` |
| `useCatalog()` | `catalog`, `buy(sku)` |
| `useCheckout()` | `invoice`, `remaining`, `simulate`, `close` |

`ready` is the one to respect. It is `false` until the persisted session has
been read in an effect, which is what keeps the server render and the first
client render identical. Gate anything session-dependent on it:

```tsx
const { ready, isAuthenticated } = useIdentity();
if (!ready) return <Skeleton />;
```

## Components

**Auth** — `IdSignInButton`, `IdAuthModal`, `IdAccountMenu`, `IdAuthWidget`,
`IdAvatar`.

**Overlays** — `IdPayModal` (crypto checkout), `IdProxyModal` (configure or
buy an endpoint), `IdWalletDrawer`, `IdBucketDrawer`, `IdDomainDrawer`.

**Panels** — `IdOverviewPanel`, `IdDomainsPanel`, `IdWalletsPanel`,
`IdSharePanel`, `IdProxyPanel`, `IdNodesPanel`, `IdValidatorPanel`.

**Primitives** — `IdButton`, `IdIconButton`, `IdChip`, `IdStatusDot`,
`IdDelta`, `IdPanel`, `IdPanelHead`, `IdStat`, `IdRow`, `IdNotice`, `IdEmpty`,
`IdMeter`, `IdSparkline`, `IdQr`, `IdField`, `IdSelect`, `IdSegmented`,
`IdSwitch`, `IdCopyField`, `IdModal`, `IdDrawer`, `IdDisclosure`, `IdTable`,
`IdTr`, `IdTd`, plus 21 hairline icons.

Composing panels by hand instead of using `IdConsole`? Mount `<IdPayModal />`
**once**, high in the tree. Several panels can open an invoice, and a modal per
panel stacks identical dialogs on the same one.

## Language

`locale` selects a bundled language (`en`, `ru`). `strings` overrides any leaf:

```tsx
const OVERRIDE = { auth: { signIn: "Enter" } }; // hoist to module scope

<AstroluneIdProvider locale="en" strings={OVERRIDE} />;
```

Hoisting is not a style note. A fresh object literal on every render re-runs
the merge and hands every consumer a new `strings` reference.

## Without React

```ts
import { createIdStore } from "@astrolune/id";

const store = createIdStore();
store.actions.hydrate();
const off = store.subscribe(() => console.log(store.getSnapshot().status));
store.actions.signIn("wallet");
```

## Design rules the kit enforces

- **Amounts are strings of base units.** One Lune is 10⁹ base units and
  balances exceed `Number.MAX_SAFE_INTEGER`, so `format.ts` does the arithmetic
  by column. Never `Number(balance)`.
- **Timestamps are epoch milliseconds**, and "now" only ever arrives through
  `useNow()`, which returns `null` on the server and on the first client render.
- **Status colour is confined** to `IdStatusDot`, `IdDelta` and
  `IdChip tone="warn"`. Meters, buttons, headings and chart strokes stay
  monochrome — a full quota is announced by a chip beside the bar, not by
  turning the bar red.
- **Overlays portal to `document.body`.** A `backdrop-filter` anywhere above
  them becomes the containing block for `position: fixed`, and the dialog gets
  clipped into a header.
