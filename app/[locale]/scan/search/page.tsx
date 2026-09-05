import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { ScanShell } from "@/components/scan/shell";
import { Notice } from "@/components/site/chrome";
import { ButtonGhost } from "@/components/ui";
import * as api from "@/lib/api";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";

/**
 * The search resolver.
 *
 * The box in the SCAN masthead posts here rather than deciding anything itself.
 * That keeps entity recognition on the server — the client bundle never needs to
 * know what a valid address looks like — and makes a search result a shareable
 * URL. A hit redirects to the entity; a miss renders the "nothing matched" state
 * with the query still visible so it can be corrected.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.common.search, robots: { index: false } };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale } = await params;
  const { q } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const query = (q ?? "").trim();
  const hit = query ? await api.search(query) : null;

  if (hit) {
    switch (hit.kind) {
      case "block":
        redirect(at(PATHS.block(hit.height)));
      case "tx":
        redirect(at(PATHS.tx(hit.hash)));
      case "account":
        redirect(at(PATHS.account(hit.address)));
      case "name":
        redirect(at(PATHS.name(hit.name)));
      case "validator":
        redirect(at(PATHS.validator(hit.nodeId)));
    }
  }

  return (
    <ScanShell
      dict={dict}
      at={at}
      active=""
      crumbs={[{ label: dict.common.search }]}
      title={dict.common.noResults}
      subtitle={dict.scan.notFound}
    >
      {query && (
        <p className="mb-6 font-mono text-[0.8125rem] text-ash-2">
          {dict.scan.resultsFor}:{" "}
          <span className="break-all text-chalk">{query}</span>
        </p>
      )}

      <Notice>{dict.scan.searchHint}</Notice>

      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonGhost href={at(ROUTES.scanBlocks)} size="sm" arrow>
          {dict.scan.tabs.blocks}
        </ButtonGhost>
        <ButtonGhost href={at(ROUTES.scanTxs)} size="sm" arrow>
          {dict.scan.tabs.txs}
        </ButtonGhost>
        <ButtonGhost href={at(ROUTES.scanNames)} size="sm" arrow>
          {dict.scan.namesTitle}
        </ButtonGhost>
      </div>
    </ScanShell>
  );
}
