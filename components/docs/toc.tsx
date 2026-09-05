"use client";

import { useEffect, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import type { TocItem } from "@/lib/docs/load";

/**
 * The "on this page" rail.
 *
 * Highlights the heading currently in view with an IntersectionObserver rather
 * than a scroll handler, and treats a heading as "active" from the moment it
 * crosses the upper third of the viewport — the `-45% 0px -50%` root margin —
 * so the rail leads the reader rather than lagging behind the scroll.
 */
export function DocsToc({ items }: { items: TocItem[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <div className="sticky top-[92px]">
      <p className="label-mono text-ash-3">{dict.common.onThisPage}</p>
      <ul className="mt-4 flex flex-col gap-0.5 border-l border-line">
        {items.map((item) => {
          const on = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                className={`-ml-px block border-l py-1.5 text-[0.75rem] leading-snug transition-colors duration-200 ${
                  item.depth === 3 ? "pl-6" : "pl-3.5"
                } ${
                  on
                    ? "border-chalk text-chalk"
                    : "border-transparent text-ash-3 hover:text-ash"
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
