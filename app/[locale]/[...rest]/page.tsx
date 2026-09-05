import { notFound } from "next/navigation";

/**
 * Locale-scoped catch-all.
 *
 * Next only renders a segment's `not-found.tsx` when something inside that
 * segment calls `notFound()` — an URL that matches *no* route at all would
 * otherwise fall through to the framework's default 404. Claiming every
 * unmatched path under `[locale]` here and unwinding it guarantees the custom
 * 404 renders site-wide (paths without a locale prefix are redirected into the
 * tree by the middleware first).
 */
export default function UnmatchedRoute() {
  notFound();
}
