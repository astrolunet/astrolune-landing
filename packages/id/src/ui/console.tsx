"use client";

/**
 * The console: the whole account in one component.
 *
 * It owns three things the individual panels cannot: the section nav, the
 * signed-out gate, and the single `IdPayModal` mount that every panel's
 * purchase flows through.
 *
 * The gate matters more than it looks. Panels read from the store, and an
 * anonymous store has empty collections — so without the gate a signed-out
 * visitor gets seven convincing "nothing here yet" panels instead of being
 * asked to sign in.
 */

import { useState } from "react";
import { useIdStrings, useIdentity } from "../react";
import { IdAuthWidget, IdAvatar } from "./auth";
import { IdPayModal } from "./checkout";
import {
  IdDomainsPanel,
  IdNodesPanel,
  IdOverviewPanel,
  IdProxyPanel,
  IdSharePanel,
  IdValidatorPanel,
  IdWalletsPanel,
} from "./panels";
import { IdChip, IdNotice } from "./primitives";
import {
  IdIconGauge,
  IdIconGlobe,
  IdIconLayers,
  IdIconNode,
  IdIconRoute,
  IdIconShield,
  IdIconWallet,
} from "./icons";
import { fmtPct } from "../format";

export type IdSection =
  | "overview"
  | "domains"
  | "wallets"
  | "share"
  | "proxy"
  | "nodes"
  | "validator";

const SECTIONS: readonly {
  key: IdSection;
  Icon: (props: { className?: string }) => React.JSX.Element;
  /** Shown only once a validator node is attested. */
  validatorOnly?: boolean;
}[] = [
  { key: "overview", Icon: IdIconGauge },
  { key: "domains", Icon: IdIconGlobe },
  { key: "wallets", Icon: IdIconWallet },
  { key: "share", Icon: IdIconLayers },
  { key: "proxy", Icon: IdIconRoute },
  { key: "nodes", Icon: IdIconNode },
  { key: "validator", Icon: IdIconShield, validatorOnly: true },
];

const PANELS: Record<IdSection, () => React.JSX.Element> = {
  overview: IdOverviewPanel,
  domains: IdDomainsPanel,
  wallets: IdWalletsPanel,
  share: IdSharePanel,
  proxy: IdProxyPanel,
  nodes: IdNodesPanel,
  validator: IdValidatorPanel,
};

export function IdConsole({
  initialSection = "overview",
  className = "",
}: {
  initialSection?: IdSection;
  className?: string;
}) {
  const strings = useIdStrings();
  const { identity, isAuthenticated, isValidator, ready } = useIdentity();
  const [section, setSection] = useState<IdSection>(initialSection);

  // The persisted session has not been read yet. Anything decisive drawn here
  // would be drawn twice, differently — so this is a placeholder, not a guess.
  if (!ready) {
    return (
      <div className={`grid gap-4 ${className}`}>
        <div className="h-[7.5rem] animate-pulse rounded-xl border border-line bg-panel/40" />
        <div className="h-[18rem] animate-pulse rounded-xl border border-line bg-panel/40" />
      </div>
    );
  }

  if (!isAuthenticated || !identity) {
    return (
      <div className={`grid gap-4 lg:grid-cols-[1fr_22rem] ${className}`}>
        <IdNotice title={strings.common.prototype}>
          {strings.common.prototypeBody}
        </IdNotice>
        <IdAuthWidget className="lg:row-start-1 lg:col-start-2" />
      </div>
    );
  }

  const visible = SECTIONS.filter((item) => !item.validatorOnly || isValidator);
  const active = visible.some((item) => item.key === section) ? section : "overview";
  const Panel = PANELS[active];

  return (
    <div className={`grid gap-4 ${className}`}>
      {/* Account bar */}
      <div className="panel flex flex-wrap items-center gap-4 rounded-xl px-5 py-4 sm:px-6">
        <IdAvatar seed={identity.avatarSeed} className="size-10" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.9375rem] text-chalk">
            {identity.handle ?? identity.displayName}
          </div>
          <div className="mt-0.5 font-mono text-[0.6875rem] text-ash-3">
            {identity.id}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <IdChip tone="neutral">{identity.tier}</IdChip>
          <IdChip tone="muted">
            {strings.auth.trust} {fmtPct(identity.trust, 0)}
          </IdChip>
          {isValidator && <IdChip tone="outline">{strings.nav.validator}</IdChip>}
        </div>
      </div>

      {/* Section nav. A scroller rather than a wrap, so the row height is the
          same on every viewport and the panel below never shifts. */}
      <nav
        aria-label={strings.overview.linked}
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <div role="tablist" className="flex w-max gap-1.5">
          {visible.map(({ key, Icon }) => {
            const on = key === active;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setSection(key)}
                className={`inline-flex h-8 shrink-0 items-center gap-2 rounded-full border px-4 label-mono transition-all duration-300 ${
                  on
                    ? "border-transparent bg-chalk text-void"
                    : "border-line-2 bg-panel/60 text-ash-2 hover:border-line-3 hover:text-chalk"
                }`}
              >
                <Icon className="size-3.5" />
                {strings.nav[key]}
              </button>
            );
          })}
        </div>
      </nav>

      <div role="tabpanel">
        <Panel />
      </div>

      {/* One invoice, one dialog, mounted above every panel that can start one. */}
      <IdPayModal />
    </div>
  );
}
