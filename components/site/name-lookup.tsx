"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Panel, PanelHead } from "@/components/site/chrome";
import { Chip, IconSearch } from "@/components/ui";
import type { NameRecord } from "@/lib/api/types";
import { isName } from "@/lib/data/rng";
import { PATHS } from "@/lib/routes";

/**
 * `.lune` name lookup.
 *
 * The candidate set is passed in from the server rather than fetched, because
 * the fixture zone is small and a round trip would be pretending to be a
 * resolver. When the zone actually exists this becomes a call into `lib/api` and
 * the rest of the component is unchanged.
 *
 * A well-formed name that is *not* in the set reports "available" rather than
 * "not found" — that is the answer a registrar UI owes the person typing.
 */
export function NameLookup({ names }: { names: NameRecord[] }) {
  const { dict, href } = useI18n();
  const [query, setQuery] = useState("");

  const trimmed = query.trim().toLowerCase();
  // Typing `moon` should behave like `moon.lune` — the zone is implied.
  const candidate = trimmed.endsWith(".lune") ? trimmed : `${trimmed}.lune`;

  const index = useMemo(
    () => new Map(names.map((record) => [record.name, record])),
    [names],
  );

  const state = !trimmed
    ? "idle"
    : !isName(candidate)
      ? "invalid"
      : index.has(candidate)
        ? "taken"
        : "free";

  const hit = state === "taken" ? index.get(candidate)! : null;

  return (
    <Panel ticks>
      <PanelHead title={dict.dns.lookupTitle} note={dict.dns.lookupNote} />

      <div className="mt-7">
        <div className="flex items-center gap-3 rounded-full border border-line-2 bg-panel-2 py-2 pr-2 pl-5 transition-colors duration-300 focus-within:border-line-3">
          <IconSearch className="size-4 shrink-0 text-ash-3" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={dict.dns.lookupPlaceholder}
            spellCheck={false}
            autoComplete="off"
            aria-label={dict.dns.lookupTitle}
            className="min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] text-chalk placeholder:text-ash-3 focus:outline-none"
          />
          {state !== "idle" && (
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 label-mono ${
                state === "taken"
                  ? "bg-chalk text-void"
                  : state === "free"
                    ? "border border-live/30 text-live"
                    : "border border-line-2 text-ash-2"
              }`}
            >
              {state === "taken"
                ? dict.dns.lookupTaken
                : state === "free"
                  ? dict.dns.lookupFree
                  : dict.dns.lookupInvalid}
            </span>
          )}
        </div>

        {state !== "idle" && state !== "invalid" && (
          <p className="mt-4 pl-5 font-mono text-[0.8125rem] text-ash">
            {candidate}
          </p>
        )}

        {/* the resolved record */}
        {hit && (
          <div className="mt-6 rounded-xl border border-line bg-panel-2/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href={href(PATHS.name(hit.name))}
                className="font-mono text-[0.875rem] text-chalk underline decoration-white/25 underline-offset-4 transition-colors duration-200 hover:decoration-white/70"
              >
                {hit.name}
              </Link>
              <span className="label-mono text-ash-3">
                {hit.records.length} {dict.dns.recordsTitle.toLowerCase()}
              </span>
            </div>

            <dl className="mt-5 space-y-3 border-t border-line pt-4">
              {hit.records.map((record) => (
                <div
                  key={`${record.kind}-${record.label}`}
                  className="flex flex-wrap items-baseline gap-3"
                >
                  <dt className="shrink-0">
                    <Chip tone="muted">{record.label}</Chip>
                  </dt>
                  <dd className="min-w-0 flex-1 truncate font-mono text-[0.75rem] text-ash">
                    {record.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </Panel>
  );
}
