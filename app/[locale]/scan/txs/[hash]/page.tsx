import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AddressLink,
  AgeCell,
  BlockLink,
  EmptyCell,
  TxStatusBadge,
  TxTypeChip,
} from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { InfoList, InfoRow, Notice } from "@/components/site/chrome";
import { CopyInline } from "@/components/site/copy";
import * as api from "@/lib/api";
import {
  ageOf,
  blockTime,
  fmtAmount,
  fmtDateTime,
  fmtInt,
  fmtPct,
} from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * A transaction, by hash.
 *
 * Unlike a block, a hash carries no position, so it can only be resolved through
 * the indexer's retention window. Anything outside it 404s — which is the honest
 * behaviour for an index that does not claim to cover the whole chain.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const txs = await api.getLatestTxs(20);
  return txs.map((tx) => ({ hash: tx.hash }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.scan.tx.title };
}

export default async function TxPage({
  params,
}: {
  params: Promise<{ locale: string; hash: string }>;
}) {
  const { locale, hash } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const [tx, stats] = await Promise.all([
    api.getTx(hash),
    api.getNetworkStats(),
  ]);
  if (!tx) notFound();

  const gasPct = (tx.gasUsed / tx.gasLimit) * 100;

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="txs"
      crumbs={[
        { label: dict.scan.tabs.txs, href: at(ROUTES.scanTxs) },
        { label: `${tx.hash.slice(0, 10)}…` },
      ]}
      title={dict.scan.tx.title}
      subtitle={dict.nav.groups.scan.items.txs.desc}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <TxStatusBadge status={tx.status} dict={dict} />
        <TxTypeChip type={tx.type} dict={dict} />
      </div>

      <InfoList>
        <InfoRow label={dict.scan.tx.hash} mono>
          <CopyInline value={tx.hash}>{tx.hash}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.tx.signingHash} mono>
          <CopyInline value={tx.signingHash}>{tx.signingHash}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.tx.block} mono>
          <BlockLink height={tx.height} at={at} />
          <span className="ml-3 text-ash-3">
            <AgeCell
              ago={ageOf(stats.head, tx.height, stats.blockMs)}
              dict={dict}
            />
          </span>
        </InfoRow>
        <InfoRow label={dict.scan.block.timestamp} mono>
          {fmtDateTime(blockTime(stats.head, tx.height, stats.blockMs))}
        </InfoRow>
        <InfoRow label={dict.scan.tx.from} mono>
          <AddressLink address={tx.from} at={at} head={42} tail={8} copy />
        </InfoRow>
        <InfoRow label={dict.scan.tx.to} mono>
          {tx.to ? (
            <AddressLink address={tx.to} at={at} head={42} tail={8} copy />
          ) : (
            <EmptyCell />
          )}
        </InfoRow>
        <InfoRow label={dict.scan.tx.amount} mono>
          {tx.amount === "0" ? (
            <EmptyCell />
          ) : (
            <>
              {fmtAmount(tx.amount)} {SITE.coin.ticker}
            </>
          )}
        </InfoRow>
        <InfoRow label={dict.scan.tx.fee} mono>
          {fmtAmount(tx.fee, { max: 9 })} {SITE.coin.ticker}
        </InfoRow>
        <InfoRow label={dict.scan.tx.gasUsed} mono>
          {fmtInt(tx.gasUsed)} / {fmtInt(tx.gasLimit)}
          <span className="ml-3 text-ash-3">{fmtPct(gasPct)}</span>
        </InfoRow>
        <InfoRow label={dict.scan.tx.nonce} mono>
          {tx.nonce}
        </InfoRow>
        <InfoRow label={dict.scan.tx.chainId} mono>
          {tx.chainId}
        </InfoRow>
        <InfoRow label={dict.scan.tx.publicKey} mono>
          <CopyInline value={tx.publicKey}>{tx.publicKey}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.tx.signature} mono>
          <span className="block break-all text-ash">{tx.signature}</span>
        </InfoRow>
        <InfoRow label={dict.scan.tx.payload} mono>
          {tx.payload === "0x" ? (
            <EmptyCell />
          ) : (
            <span className="block break-all text-ash">{tx.payload}</span>
          )}
        </InfoRow>
      </InfoList>

      {/* Why the two hashes above differ — a detail worth stating on the page
          where a reader can see both of them at once. */}
      <Notice className="mt-10">{dict.scan.tx.tagNote}</Notice>
      <Notice tone="warn" className="mt-3">
        {dict.common.insecureCrypto}
      </Notice>
    </ScanShell>
  );
}
