"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Chip, IconChevron } from "@/components/ui";
import {
  DOC_SECTIONS,
  type DocStatus,
  statusTone,
} from "@/lib/docs/registry";
import { localePath } from "@/lib/i18n/config";
import { PATHS } from "@/lib/routes";

/**
 * The docs navigation tree.
 *
 * Rendered as accordions grouped by section. The group holding the current page
 * starts open; the rest collapse, because the full tree is 23 entries and an
 * always-open list would bury the reader's position. Selection state comes from
 * the pathname, so the sidebar needs no props beyond the tree itself.
 */
export function DocsSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "";

  const activeSlug = decodeURIComponent(pathname)
    .split(`/${locale}/docs/`)[1]
    ?.replace(/\/$/, "");

  const activeSection = DOC_SECTIONS.find((s) =>
    s.entries.some((e) => e.slug === activeSlug),
  )?.key;

  const [open, setOpen] = useState<string>(
    () => activeSection ?? DOC_SECTIONS[0].key,
  );

  return (
    <nav className="flex flex-col gap-1">
      <Link
        href={localePath(locale, "/docs")}
        onClick={onNavigate}
        className={`label-mono px-3 py-2.5 transition-colors duration-300 ${
          !activeSlug ? "text-chalk" : "text-ash-2 hover:text-chalk"
        }`}
      >
        {dict.common.overview}
      </Link>

      {DOC_SECTIONS.map((section) => {
        const expanded = open === section.key;
        const label = dict.docs.sections[section.key];

        return (
          <div key={section.key} className="border-t border-line">
            <button
              type="button"
              aria-expanded={expanded}
              onClick={() => setOpen(expanded ? "" : section.key)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left"
            >
              <span
                className={`label-mono transition-colors duration-300 ${
                  section.key === activeSection ? "text-chalk" : "text-ash-2"
                }`}
              >
                {label}
              </span>
              <IconChevron
                className={`size-3.5 shrink-0 text-ash-3 transition-transform duration-300 ${
                  expanded ? "-rotate-180" : ""
                }`}
              />
            </button>

            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <ul className="flex flex-col gap-0.5 pb-2">
                  {section.entries.map((entry) => {
                    const current = entry.slug === activeSlug;
                    return (
                      <li key={entry.slug}>
                        <Link
                          href={localePath(locale, PATHS.doc(entry.slug))}
                          onClick={onNavigate}
                          aria-current={current ? "page" : undefined}
                          className={`group relative flex items-center gap-2 rounded-md py-2 pr-2 pl-6 text-[0.8125rem] transition-colors duration-200 ${
                            current
                              ? "text-chalk"
                              : "text-ash-2 hover:text-chalk"
                          }`}
                        >
                          {current && (
                            <span
                              aria-hidden
                              className="absolute top-1/2 left-2.5 h-4 w-px -translate-y-1/2 bg-chalk"
                            />
                          )}
                          <span className="min-w-0 flex-1 truncate">
                            {entry.title}
                          </span>
                          <StatusMark status={entry.status} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}
    </nav>
  );
}

/** A single dot carrying the document's status via the Chip tone palette. */
function StatusMark({ status }: { status: DocStatus }) {
  const tone = statusTone(status);
  const color = {
    solid: "bg-chalk",
    neutral: "bg-ash",
    muted: "bg-ash-3",
    warn: "bg-warn",
  }[tone];

  return (
    <span
      aria-hidden
      title={status}
      className={`size-1.5 shrink-0 rounded-full ${color} opacity-70`}
    />
  );
}

/** The legend that explains the status dots, shown on the docs landing page. */
export function StatusLegend() {
  const { dict } = useI18n();
  const legend = dict.docs.statusLegend;

  const items: { status: DocStatus; label: string; body: string }[] = [
    { status: "stable", label: dict.common.shipped, body: legend.stable },
    { status: "draft", label: "draft", body: legend.draft },
    { status: "skeleton", label: "skeleton", body: legend.skeleton },
    { status: "current", label: "current", body: legend.current },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item.status}
          className="flex gap-3 rounded-xl border border-line bg-panel/50 px-4 py-3.5"
        >
          <Chip tone={statusTone(item.status)} className="h-fit shrink-0">
            {item.status}
          </Chip>
          <p className="text-[0.75rem] leading-relaxed text-ash-2">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
