import type { ReactNode } from "react";

import { Reveal } from "@/components/motion";
import { SearchBox } from "@/components/site/search-box";
import { Breadcrumbs, type Crumb } from "@/components/site/chrome";
import { Tabs } from "@/components/site/tabs";
import { StatusPill } from "@/components/status-dot";
import type { Dict } from "@/lib/i18n/en";
import { ROUTES } from "@/lib/routes";
import { NETWORK_LIVE } from "@/lib/site";

/**
 * The SCAN masthead: breadcrumbs, title, search and the view tabs.
 *
 * Every explorer page shares it so the search box never moves between views —
 * the one control a visitor reaches for most should be in the same place on
 * `/scan`, `/scan/blocks` and a transaction detail page alike.
 */
export function ScanShell({
  dict,
  at,
  active,
  crumbs = [],
  title,
  subtitle,
  children,
}: {
  dict: Dict;
  at: (path: string) => string;
  /** Which tab to mark current; `""` for detail pages that match no tab. */
  active: string;
  crumbs?: Crumb[];
  title?: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const tabs = [
    { key: "blocks", label: dict.scan.tabs.blocks, href: at(ROUTES.scanBlocks) },
    { key: "txs", label: dict.scan.tabs.txs, href: at(ROUTES.scanTxs) },
    {
      key: "accounts",
      label: dict.scan.tabs.accounts,
      href: at(ROUTES.scanAccounts),
    },
    {
      key: "contracts",
      label: dict.scan.tabs.contracts,
      href: at(ROUTES.scanContracts),
    },
    {
      key: "names",
      label: dict.nav.groups.scan.items.names.label,
      href: at(ROUTES.scanNames),
    },
    {
      key: "validators",
      label: dict.validators.title,
      href: at(ROUTES.scanValidators),
    },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line pt-[68px]">
        <div
          aria-hidden
          className="grid-lattice pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
        />
        <div
          aria-hidden
          className="vignette pointer-events-none absolute inset-0"
        />

        <div className="container-wide relative py-10 md:py-12">
          <Reveal>
            <Breadcrumbs
              items={[
                { label: dict.scan.title, href: at(ROUTES.scan) },
                ...crumbs,
              ]}
            />
          </Reveal>

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <Reveal delay={70}>
                <h1 className="display text-graphite text-[clamp(1.7rem,3.8vw,2.9rem)]">
                  {title ?? dict.scan.title}
                </h1>
              </Reveal>
              <Reveal delay={130}>
                <p className="mt-3.5 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
                  {subtitle ?? dict.scan.subtitle}
                </p>
              </Reveal>
            </div>
            <Reveal delay={180} className="shrink-0">
              <StatusPill tone={NETWORK_LIVE ? "live" : "idle"}>
                {NETWORK_LIVE ? dict.common.mainnet : dict.footer.networkLabel}
              </StatusPill>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <div className="mt-8 max-w-3xl">
              <SearchBox />
            </div>
          </Reveal>
        </div>
      </section>

      <div className="container-wide">
        <div className="pt-8">
          <Tabs items={tabs} active={active} />
        </div>
        <div className="pt-8 pb-20">{children}</div>
      </div>
    </>
  );
}
