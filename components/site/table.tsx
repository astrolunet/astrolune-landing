import Link from "next/link";
import type { ReactNode } from "react";

import { IconChevron } from "@/components/ui";

/**
 * Table primitives for the SCAN and status pages.
 *
 * Composition rather than a `columns` config, because the tables here differ
 * too much — a block row is five plain cells, a validator row carries a level
 * chip and four score components. A config object would end up with an escape
 * hatch per column anyway.
 *
 * All of these are server components. Sorting and filtering happen through the
 * URL, so a table never needs client state.
 */

export function Table({
  children,
  minWidth = "46rem",
}: {
  children: ReactNode;
  /** Below this the wrapper scrolls rather than crushing the columns. */
  minWidth?: string;
}) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table
        className="w-full border-collapse text-left"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

type Align = "left" | "right" | "center";

const ALIGN: Record<Align, string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

export function THead({ children }: { children: ReactNode }) {
  return (
    <thead>
      <tr className="border-y border-line">{children}</tr>
    </thead>
  );
}

export function TH({
  children,
  align = "left",
  className = "",
}: {
  children?: ReactNode;
  align?: Align;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={`label-mono px-3 py-3 font-normal text-ash-3 first:pl-0 last:pr-0 ${ALIGN[align]} ${className}`}
    >
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function TR({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <tr
      className={`group border-b border-line transition-colors duration-200 hover:bg-panel-2/70 ${className}`}
    >
      {children}
    </tr>
  );
}

export function TD({
  children,
  align = "left",
  className = "",
  mono = true,
}: {
  children?: ReactNode;
  align?: Align;
  className?: string;
  /** Chain data is mono and tabular; prose cells opt out. */
  mono?: boolean;
}) {
  return (
    <td
      className={`px-3 py-3 align-middle first:pl-0 last:pr-0 ${
        mono ? "data-cell" : "text-[0.8125rem]"
      } ${ALIGN[align]} ${className}`}
    >
      {children}
    </td>
  );
}

export function TableEmpty({
  colSpan,
  children,
}: {
  colSpan: number;
  children: ReactNode;
}) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-3 py-14 text-center text-[0.8125rem] text-ash-3 first:pl-0"
      >
        {children}
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------
   Pagination — URL driven, so it works without client state
   ------------------------------------------------------------------ */

export function Pagination({
  page,
  total,
  pageSize,
  basePath,
  labels,
}: {
  page: number;
  total: number;
  pageSize: number;
  /** Root-relative and locale-prefixed; `?page=` is appended. */
  basePath: string;
  labels: { previous: string; next: string; page: string; of: string };
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(Math.max(1, page), pages);
  // `basePath` may already carry a filter query (`?type=call`), so the page
  // parameter is joined with the right separator rather than always `?`.
  const join = basePath.includes("?") ? "&" : "?";
  const href = (n: number) => (n <= 1 ? basePath : `${basePath}${join}page=${n}`);

  const shell =
    "grid size-9 shrink-0 place-items-center rounded-full border border-line-2 bg-panel/60 transition-all duration-300";

  return (
    <div className="mt-8 flex items-center justify-between gap-4">
      <p className="label-mono text-ash-3">
        {labels.page} {clamped.toLocaleString("en-US")} {labels.of}{" "}
        {pages.toLocaleString("en-US")}
      </p>

      <div className="flex items-center gap-2">
        {clamped > 1 ? (
          <Link
            href={href(clamped - 1)}
            aria-label={labels.previous}
            rel="prev"
            className={`${shell} text-ash hover:border-line-3 hover:bg-panel-2 hover:text-chalk`}
          >
            <IconChevron className="size-3.5 rotate-90" />
          </Link>
        ) : (
          <span
            aria-hidden
            className={`${shell} pointer-events-none text-ash opacity-35`}
          >
            <IconChevron className="size-3.5 rotate-90" />
          </span>
        )}

        {clamped < pages ? (
          <Link
            href={href(clamped + 1)}
            aria-label={labels.next}
            rel="next"
            className={`${shell} text-ash hover:border-line-3 hover:bg-panel-2 hover:text-chalk`}
          >
            <IconChevron className="size-3.5 -rotate-90" />
          </Link>
        ) : (
          <span
            aria-hidden
            className={`${shell} pointer-events-none text-ash opacity-35`}
          >
            <IconChevron className="size-3.5 -rotate-90" />
          </span>
        )}
      </div>
    </div>
  );
}
