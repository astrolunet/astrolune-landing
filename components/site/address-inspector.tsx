"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Panel, PanelHead } from "@/components/site/chrome";
import { CornerTicks, IconCheck, IconSearch } from "@/components/ui";
import { ADDR_BODY, ADDR_PREFIX, isAddress } from "@/lib/data/rng";

/**
 * Address inspector.
 *
 * Validates entirely in the browser and says so. There is no endpoint to send an
 * address to yet, and a field that looked like it were checking against a chain
 * would be claiming a capability the network does not have.
 *
 * The breakdown below the field is the useful part: it shows *which* rule failed
 * rather than a single red border, because "invalid address" is the least
 * helpful thing a wallet UI can tell someone.
 */
export function AddressInspector() {
  const { dict } = useI18n();
  const [value, setValue] = useState("");

  const trimmed = value.trim().toLowerCase();
  const touched = trimmed.length > 0;
  const valid = isAddress(trimmed);

  const checks = [
    {
      label: `${dict.wallets.fields.encoding}: ${ADDR_PREFIX}…`,
      ok: trimmed.startsWith(ADDR_PREFIX),
    },
    {
      label: `${dict.wallets.fields.length}: ${ADDR_PREFIX.length + ADDR_BODY}`,
      ok: trimmed.length === ADDR_PREFIX.length + ADDR_BODY,
    },
    {
      label: `${dict.wallets.fields.checksum}: [0-9a-f]`,
      ok: /^[0-9a-f]*$/.test(trimmed.slice(ADDR_PREFIX.length)),
    },
  ];

  return (
    <Panel ticks>
      <PanelHead title={dict.wallets.tryTitle} note={dict.wallets.tryNote} />

      <div className="mt-7">
        <div className="flex items-center gap-3 rounded-full border border-line-2 bg-panel-2 py-2 pr-2 pl-5 transition-colors duration-300 focus-within:border-line-3">
          <IconSearch className="size-4 shrink-0 text-ash-3" />
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={dict.wallets.tryPlaceholder}
            spellCheck={false}
            autoComplete="off"
            aria-label={dict.wallets.tryTitle}
            className="min-w-0 flex-1 bg-transparent font-mono text-[0.8125rem] text-chalk placeholder:text-ash-3 focus:outline-none"
          />
          {touched && (
            <span
              className={`shrink-0 rounded-full px-3 py-1.5 label-mono ${
                valid
                  ? "bg-chalk text-void"
                  : "border border-line-2 text-ash-2"
              }`}
            >
              {valid ? dict.wallets.tryValid : dict.wallets.tryInvalid}
            </span>
          )}
        </div>

        {/* per-rule breakdown */}
        <ul className="mt-6 space-y-2.5">
          {checks.map((check) => (
            <li key={check.label} className="flex items-center gap-3">
              <span
                className={`grid size-4 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  !touched
                    ? "border-line-2 text-transparent"
                    : check.ok
                      ? "border-transparent bg-live/20 text-live"
                      : "border-down/40 text-down"
                }`}
              >
                {touched && check.ok ? (
                  <IconCheck className="size-2.5" />
                ) : (
                  <span className="size-1 rounded-full bg-current" />
                )}
              </span>
              <span
                className={`font-mono text-[0.75rem] ${
                  touched && check.ok ? "text-ash" : "text-ash-3"
                }`}
              >
                {check.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Panel>
  );
}
