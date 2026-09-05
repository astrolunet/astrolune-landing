import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";

import { IconExternal } from "@/components/ui";

/**
 * The MDX component map for specification pages.
 *
 * Most block elements are already styled by the `prose-astro` utility in
 * `globals.css`, so this file only overrides what a CSS utility cannot do:
 *
 * - **Tables.** The specification is table-heavy (`core-api.md` alone has 51
 *   rows) and a table needs a scroll container on mobile, which is a wrapper
 *   element rather than a style.
 * - **Links.** Internal cross-references must go through `next/link` to stay
 *   client-side; external ones need `rel` and a marker.
 * - **Code blocks.** The fence language is only available on the inner `<code>`
 *   className, so surfacing it as a badge requires reading children.
 */

/* ------------------------------------------------------------------
   Links
   ------------------------------------------------------------------ */

function A({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:/i.test(href);

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-baseline gap-1"
        {...rest}
      >
        {children}
        <IconExternal className="size-3 shrink-0 translate-y-px text-ash-3" />
      </a>
    );
  }

  // In-page anchors stay plain anchors so the browser handles the jump.
  if (href.startsWith("#")) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/* ------------------------------------------------------------------
   Tables
   ------------------------------------------------------------------ */

function Table({ children }: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="-mx-5 my-7 overflow-x-auto px-5 md:mx-0 md:px-0">
      <table className="w-full border-collapse text-left text-[0.8125rem]">
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...rest }: ComponentPropsWithoutRef<"th">) {
  return (
    <th
      scope="col"
      className="border-b border-line-2 px-3 py-2.5 pl-0 align-bottom label-mono font-normal text-ash-3 last:pr-0"
      {...rest}
    >
      {children}
    </th>
  );
}

function Td({ children, ...rest }: ComponentPropsWithoutRef<"td">) {
  return (
    <td
      className="border-b border-line px-3 py-3 pl-0 align-top leading-relaxed text-ash last:pr-0"
      {...rest}
    >
      {children}
    </td>
  );
}

function Tr({ children, ...rest }: ComponentPropsWithoutRef<"tr">) {
  return (
    <tr className="transition-colors duration-200 hover:bg-panel-2/60" {...rest}>
      {children}
    </tr>
  );
}

/* ------------------------------------------------------------------
   Code blocks
   ------------------------------------------------------------------ */

/** Reads `language-c` off the inner `<code>` that MDX nests inside `<pre>`. */
function fenceLanguage(children: ReactNode): string | null {
  const el = children as ReactElement<{ className?: string }> | undefined;
  const className = el?.props?.className ?? "";
  const match = /language-([a-z0-9+#-]+)/i.exec(className);
  return match ? match[1] : null;
}

function Pre({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  const lang = fenceLanguage(children);

  return (
    <div className="group relative my-7">
      {lang && (
        <span className="absolute top-3 right-3 z-10 rounded-full border border-line bg-panel-3/90 px-2.5 py-1 label-mono text-ash-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {lang}
        </span>
      )}
      <pre
        className="overflow-x-auto rounded-xl border border-line bg-panel/70 p-5 leading-relaxed"
        {...rest}
      >
        {children}
      </pre>
    </div>
  );
}

/* ------------------------------------------------------------------
   Authoring components — available to any future `.mdx` page
   ------------------------------------------------------------------ */

/** A pulled-out warning or aside. */
export function Callout({
  tone = "muted",
  title,
  children,
}: {
  tone?: "muted" | "warn";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    muted: "border-line bg-panel/60",
    warn: "border-warn/25 bg-warn/[0.05]",
  } as const;

  return (
    <aside className={`my-7 rounded-xl border px-5 py-4 ${tones[tone]}`}>
      {title && (
        <p
          className={`label-mono ${tone === "warn" ? "text-warn/85" : "text-ash-2"}`}
        >
          {title}
        </p>
      )}
      <div className="mt-2 text-[0.8125rem] leading-relaxed text-ash-2 [&>*+*]:mt-3">
        {children}
      </div>
    </aside>
  );
}

export const mdxComponents = {
  a: A,
  table: Table,
  th: Th,
  td: Td,
  tr: Tr,
  pre: Pre,
  Callout,
};
