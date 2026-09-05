import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  AddressLink,
  AgeCell,
  EmptyCell,
  HashLink,
  TxLink,
  TxStatusBadge,
  TxTypeChip,
} from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { InfoList, InfoRow, Notice, PrevNext } from "@/components/site/chrome";
import { CopyInline } from "@/components/site/copy";
import { Table, TBody, TableEmpty, TD, TH, THead, TR } from "@/components/site/table";
import { StatusPill } from "@/components/status-dot";
import { Chip } from "@/components/ui";
import * as api from "@/lib/api";
import {
  ageOf,
  blockTime,
  fmtAmount,
  fmtBytes,
  fmtDateTime,
  fmtInt,
  fmtPct,
} from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * A block, by height.
 *
 * The 20 most recent heights are prerendered; every other height renders on
 * demand. `dynamicParams` has to be re-enabled here because the locale layout
 * sets it to `false` and the setting is inherited — a chain 59 million blocks
 * deep obviously cannot be enumerated at build time.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  const blocks = await api.getLatestBlocks(20);
  return blocks.map((block) => ({ height: String(block.height) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; height: string }>;
}): Promise<Metadata> {
  const { locale, height } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: `${dict.scan.block.title} ${height}` };
}

export default async function BlockPage({
  params,
}: {
  params: Promise<{ locale: string; height: string }>;
}) {
  const { locale, height } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  if (!/^\d+$/.test(height)) notFound();

  const [block, stats] = await Promise.all([
    api.getBlock(Number(height)),
    api.getNetworkStats(),
  ]);
  if (!block) notFound();

  const txs = await api.getBlockTxs(block.height);
  const gasPct = (block.gasUsed / block.gasLimit) * 100;

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="blocks"
      crumbs={[
        { label: dict.scan.tabs.blocks, href: at(ROUTES.scanBlocks) },
        { label: fmtInt(block.height) },
      ]}
      title={`${dict.scan.block.title} ${fmtInt(block.height)}`}
      subtitle={dict.nav.groups.scan.items.blocks.desc}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <StatusPill tone={block.finalized ? "live" : "warn"}>
          {block.finalized ? dict.scan.block.finalized : dict.common.inProgress}
        </StatusPill>
        <Chip tone="muted">
          {dict.scan.block.epoch} {block.epoch}
        </Chip>
        <Chip tone="muted">
          {dict.scan.block.protocolDay} {block.protocolDay}
        </Chip>
      </div>

      <InfoList>
        <InfoRow label={dict.scan.block.height} mono>
          {fmtInt(block.height)}
        </InfoRow>
        <InfoRow label={dict.scan.block.timestamp} mono>
          {fmtDateTime(blockTime(stats.head, block.height, stats.blockMs))}
          <span className="ml-3 text-ash-3">
            <AgeCell
              ago={ageOf(stats.head, block.height, stats.blockMs)}
              dict={dict}
            />
          </span>
        </InfoRow>
        <InfoRow label={dict.scan.block.hash} mono>
          <CopyInline value={block.hash}>{block.hash}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.block.parent} mono>
          <HashLink
            value={block.parent}
            href={at(PATHS.block(block.height - 1))}
            head={24}
            tail={10}
          />
        </InfoRow>
        <InfoRow label={dict.scan.block.stateRoot} mono>
          <CopyInline value={block.stateRoot}>{block.stateRoot}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.block.txRoot} mono>
          <CopyInline value={block.txRoot}>{block.txRoot}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.block.proposer} mono>
          <HashLink
            value={block.proposer}
            href={at(PATHS.validator(block.proposer))}
            head={24}
            tail={8}
          />
        </InfoRow>
        <InfoRow label={dict.scan.block.votes} mono>
          {block.votes} / {block.committee}
          <span className="ml-3 text-ash-3">
            {dict.scan.block.quorum} {block.quorum}
          </span>
        </InfoRow>
        <InfoRow label={dict.scan.block.seed} mono>
          <CopyInline value={block.seed}>{block.seed}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.block.gasUsed} mono>
          {fmtInt(block.gasUsed)} / {fmtInt(block.gasLimit)}
          <span className="ml-3 text-ash-3">{fmtPct(gasPct)}</span>
        </InfoRow>
        <InfoRow label={dict.scan.block.size} mono>
          {fmtBytes(block.size)}
        </InfoRow>
        <InfoRow label={dict.scan.block.txCount} mono>
          {block.txCount}
        </InfoRow>
      </InfoList>

      {/* transactions in this block */}
      <section className="mt-14">
        <h2 className="label-mono text-chalk">{dict.scan.tabs.txs}</h2>
        <div className="mt-4">
          <Table minWidth="48rem">
            <THead>
              <TH>{dict.scan.table.hash}</TH>
              <TH>{dict.scan.table.type}</TH>
              <TH>{dict.scan.table.from}</TH>
              <TH>{dict.scan.table.to}</TH>
              <TH align="right">{dict.scan.table.amount}</TH>
              <TH align="right">{dict.scan.table.status}</TH>
            </THead>
            <TBody>
              {txs.length === 0 ? (
                <TableEmpty colSpan={6}>{dict.scan.block.noTxs}</TableEmpty>
              ) : (
                txs.map((tx) => (
                  <TR key={tx.hash}>
                    <TD>
                      <TxLink hash={tx.hash} at={at} head={8} tail={6} />
                    </TD>
                    <TD>
                      <TxTypeChip type={tx.type} dict={dict} />
                    </TD>
                    <TD>
                      <AddressLink address={tx.from} at={at} head={6} tail={4} />
                    </TD>
                    <TD>
                      {tx.to ? (
                        <AddressLink address={tx.to} at={at} head={6} tail={4} />
                      ) : (
                        <EmptyCell />
                      )}
                    </TD>
                    <TD align="right">
                      {tx.amount === "0" ? (
                        <EmptyCell />
                      ) : (
                        `${fmtAmount(tx.amount, { max: 4 })} ${SITE.coin.ticker}`
                      )}
                    </TD>
                    <TD align="right">
                      <TxStatusBadge status={tx.status} dict={dict} />
                    </TD>
                  </TR>
                ))
              )}
            </TBody>
          </Table>
        </div>
      </section>

      <div className="mt-12">
        <PrevNext
          prev={
            block.height > 0
              ? {
                  label: dict.scan.block.prevBlock,
                  title: fmtInt(block.height - 1),
                  href: at(PATHS.block(block.height - 1)),
                }
              : null
          }
          next={
            block.height < stats.head
              ? {
                  label: dict.scan.block.nextBlock,
                  title: fmtInt(block.height + 1),
                  href: at(PATHS.block(block.height + 1)),
                }
              : null
          }
        />
      </div>
    </ScanShell>
  );
}
