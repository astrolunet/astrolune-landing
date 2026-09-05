/**
 * `@astrolune/id` — the public surface.
 *
 * Four layers, and you can stop at any of them:
 *
 * 1. `types` / `format` — the domain model and its string arithmetic. No React.
 * 2. `createIdStore` — the reactive core, usable from any framework.
 * 3. `AstroluneIdProvider` and the hooks — bring your own markup.
 * 4. `IdConsole`, `IdSignInButton`, the modals and drawers — bring nothing.
 *
 * The prototype ships layer 1's fixtures too (`FIXTURE_*`, `makeInvoice`, …).
 * They are exported on purpose: a host building its own screens needs the same
 * data the packaged UI renders, and re-deriving it would drift.
 */

export * from "./types";
export * from "./format";
export * from "./rng";
export * from "./mock";
export * from "./store";
export * from "./react";

// Renamed on the way out. `en` and `ru` are far too generic for a package's
// top-level namespace, but they read correctly inside `strings.ts`.
export {
  en as idStringsEn,
  ru as idStringsRu,
  LOCALES as ID_LOCALES,
  resolveStrings,
  type Strings as IdStrings,
  type StringsOverride as IdStringsOverride,
  type IdLocale,
} from "./strings";

export * from "./ui/icons";
export * from "./ui/primitives";
export * from "./ui/auth";
export * from "./ui/checkout";
export * from "./ui/dialogs";
export * from "./ui/panels";
export * from "./ui/console";
