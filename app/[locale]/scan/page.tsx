import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/motion";
import {
  AgeCell,
  AddressLink,
  BlockLink,
  EmptyCell,
  TxLink,
  TxStatusBadge,
  TxTypeChip,
} from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { AreaChart } from "@/components/site/area-chart";
import { BarRows, Sparkline } from "@/components/site/charts";
import { Notice, Panel, PanelHead, StatGrid } from "@/components/site/chrome";
import { Table, TBody, TD, TH, THead, TR } from "@/components/site/table";
import { StatusDot } from "@/components/status-dot";
import { IconArrow } from "@/components/ui";
import * as api from "@/lib/api";
import { ageOf, fmtAmount, fmtCompact, fmtInt } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.scan.title,
    description: dict.scan.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.scan),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.scan)]),
      ),
    },
  };
}

export default async function ScanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const [stats, blocks, txs, activity] = await Promise.all([
    api.getNetworkStats(),
    api.getLatestBlocks(12),
    api.getLatestTxs(12),
    api.getScanActivity(60),
  ]);

  const gasLimit = 30_000_000;
  const utilisation =
    (activity.gasPerBlock.mean / gasLimit) * 100;

  const cards = [
    {
      label: dict.scan.stats.height,
      value: fmtInt(stats.head),
      sub: `${stats.avgBlockMs} ${dict.status.charts.ms}`,
      chart: <Sparkline values={activity.txPerBlock.points} className="h-full w-full" />,
    },
    {
      label: dict.scan.stats.tps,
      value: stats.tps.toFixed(1),
      sub: dict.scan.charts.window,
      chart: <Sparkline values={activity.txPerBlock.points} className="h-full w-full" />,
    },
    {
      label: dict.scan.charts.utilisation,
      value: `${utilisation.toFixed(1)}%`,
      sub: dict.scan.charts.gasPerBlock,
      chart: <Sparkline values={activity.gasPerBlock.points} className="h-full w-full" />,
    },
    {
      label: dict.scan.stats.validators,
      value: `${stats.committee}`,
      sub: `${dict.scan.block.quorum} ${stats.quorum}`,
    },
    {
      label: dict.scan.stats.accounts,
      value: fmtInt(stats.accounts),
      sub: `${fmtInt(stats.txTotal)} ${dict.scan.tabs.txs.toLowerCase()}`,
    },
    {
      label: dict.scan.stats.supply,
      value: `${fmtCompact(stats.circulating)} ${SITE.coin.ticker}`,
      sub: `${fmtCompact(stats.bonded)} ${dict.lune.supply.bonded.toLowerCase()}`,
    },
  ];

  // Height ticks for the activity charts, evenly sampled across the window.
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const i = Math.min(
      activity.heights.length - 1,
      Math.round(f * (activity.heights.length - 1)),
    );
    return fmtInt(activity.heights[i]);
  });

  const totalTxs = activity.typeMix.reduce((sum, t) => sum + t.count, 0);
  const mixRows = activity.typeMix.slice(0, 8).map((entry) => ({
    label: dict.scan.tx.types[entry.key],
    value: Number(((entry.count / totalTxs) * 100).toFixed(1)),
  }));

  return (
    <ScanShell dict={dict} at={at} active="">
      <Notice className="mb-8">{dict.common.mockNotice}</Notice>

      <StatGrid stats={cards} columns={6} />

      {/* activity — the charts read off the same blocks the tables print */}
      <section className="mt-14">
        <Reveal>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="label-mono text-chalk">{dict.scan.charts.activity}</h2>
            <span className="label-mono text-ash-3">
              {dict.scan.charts.window}
            </span>
          </div>
        </Reveal>

        <div className="grid gap-3 xl:grid-cols-12">
          <Panel className="xl:col-span-5">
            <PanelHead
              title={dict.scan.charts.txPerBlock}
              note={dict.scan.charts.txPerBlockNote}
            />
            <div className="mt-6">
              <AreaChart
                values={activity.txPerBlock.points}
                digits={0}
                unit={dict.scan.charts.perBlock}
                ticks={ticks}
                ariaLabel={dict.scan.charts.txPerBlock}
              />
            </div>
          </Panel>

          <Panel className="xl:col-span-4">
            <PanelHead
              title={dict.scan.charts.gasPerBlock}
              note={dict.scan.charts.gasPerBlockNote}
            />
            <div className="mt-6">
              <AreaChart
                values={activity.gasPerBlock.points.map((g) =>
                  Number(((g / gasLimit) * 100).toFixed(1)),
                )}
                digits={1}
                suffix="%"
                ticks={[ticks[0], ticks[2], ticks[4]]}
                ariaLabel={dict.scan.charts.gasPerBlock}
              />
            </div>
          </Panel>

          <Panel className="xl:col-span-3">
            <PanelHead
              title={dict.scan.charts.typeMix}
              note={dict.scan.charts.typeMixNote}
            />
            <div className="mt-6">
              <BarRows rows={mixRows} unit="%" />
            </div>
          </Panel>
        </div>
      </section>

      {/* the two feeds, side by side in the wider rail */}
      <div className="mt-14 grid gap-10 xl:grid-cols-2 xl:gap-8">
        <section>
          <PanelHeading
            title={dict.scan.latestBlocks}
            href={at(ROUTES.scanBlocks)}
            cta={dict.common.viewAll}
          />
          <Table minWidth="28rem">
            <THead>
              <TH>{dict.scan.table.height}</TH>
              <TH>{dict.scan.table.proposer}</TH>
              <TH align="right">{dict.scan.table.txs}</TH>
              <TH align="right">{dict.scan.charts.utilisation}</TH>
              <TH align="right">{dict.scan.table.age}</TH>
            </THead>
            <TBody>
              {blocks.map((block, i) => (
                <TR key={block.height}>
                  <TD>
                    <span className="inline-flex items-center gap-2.5">
                      {/* the head block is genuinely the newest, so it pulses */}
                      {i === 0 ? (
                        <StatusDot tone="live" pulse />
                      ) : (
                        <span aria-hidden className="size-2 shrink-0" />
                      )}
                      <BlockLink height={block.height} at={at} />
                    </span>
                  </TD>
                  <TD className="text-ash-2">
                    {block.proposer.replace("al-node-", "")}
                  </TD>
                  <TD align="right">{block.txCount}</TD>
                  <TD align="right">
                    <GasBar used={block.gasUsed} limit={block.gasLimit} />
                  </TD>
                  <TD align="right">
                    <AgeCell
                      ago={ageOf(stats.head, block.height, stats.blockMs)}
                      dict={dict}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>

        <section>
          <PanelHeading
            title={dict.scan.latestTxs}
            href={at(ROUTES.scanTxs)}
            cta={dict.common.viewAll}
          />
          <Table minWidth="34rem">
            <THead>
              <TH>{dict.scan.table.hash}</TH>
              <TH>{dict.scan.table.type}</TH>
              <TH>{dict.scan.table.from}</TH>
              <TH align="right">{dict.scan.table.amount}</TH>
              <TH align="right">{dict.scan.table.age}</TH>
            </THead>
            <TBody>
              {txs.map((tx) => (
                <TR key={tx.hash}>
                  <TD>
                    <TxLink hash={tx.hash} at={at} head={6} tail={4} />
                  </TD>
                  <TD>
                    <TxTypeChip type={tx.type} dict={dict} />
                  </TD>
                  <TD>
                    <AddressLink address={tx.from} at={at} head={6} tail={4} />
                  </TD>
                  <TD align="right">
                    {tx.amount === "0" ? (
                      <EmptyCell />
                    ) : (
                      `${fmtAmount(tx.amount, { max: 3 })}`
                    )}
                  </TD>
                  <TD align="right">
                    <AgeCell
                      ago={ageOf(stats.head, tx.height, stats.blockMs)}
                      dict={dict}
                    />
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </section>
      </div>
    </ScanShell>
  );
}

/** Inline gas utilisation, as a number plus the bar it describes. */
function GasBar({ used, limit }: { used: number; limit: number }) {
  const pct = limit > 0 ? (used / limit) * 100 : 0;
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span className="font-mono text-[0.75rem] text-ash-2 tabular-nums">
        {pct.toFixed(1)}%
      </span>
      <span className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-panel-3">
        <span
          className="block h-full rounded-full bg-chalk/45 transition-colors duration-500 group-hover:bg-chalk/80"
          style={{ width: `${Math.max(pct, 2)}%` }}
        />
      </span>
    </span>
  );
}

function PanelHeading({
  title,
  href,
  cta,
}: {
  title: string;
  href: string;
  cta: string;
}) {
  return (
    <Reveal>
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 className="label-mono text-chalk">{title}</h2>
        <Link
          href={href}
          className="group inline-flex items-center gap-2 label-mono text-ash-3 transition-colors duration-300 hover:text-chalk"
        >
          {cta}
          <IconArrow className="size-3.5 transition-transform duration-400 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Reveal>
  );
}
