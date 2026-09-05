import type { Metadata } from "next";

import {
  AddressLink,
  AgeCell,
  BlockLink,
  EmptyCell,
  TxLink,
  TxStatusBadge,
  TxTypeChip,
} from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { Notice } from "@/components/site/chrome";
import {
  Pagination,
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/site/table";
import { FilterChips } from "@/components/site/tabs";
import type { TxType } from "@/lib/api/types";
import * as api from "@/lib/api";
import { ageOf, fmtAmount } from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
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
  return { title: dict.scan.tabs.txs, description: dict.scan.subtitle };
}

const PAGE_SIZE = 25;

/** The type filters offered above the table — the value-moving families plus a
 *  consensus catch-all would be noise, so only the common ones are surfaced. */
const FILTERS: (TxType | "all")[] = [
  "all",
  "transfer",
  "call",
  "deploy",
  "bond",
  "vote",
  "name",
];

export default async function TxsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const { locale } = await params;
  const { page, type } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const current = Number(page) || 1;
  const filter = FILTERS.includes(type as TxType) ? (type as TxType) : undefined;

  const [stats, result] = await Promise.all([
    api.getNetworkStats(),
    api.getTxs(current, PAGE_SIZE, filter),
  ]);

  const chips = FILTERS.map((key) => ({
    key,
    label:
      key === "all" ? dict.news.categories.all : dict.scan.tx.types[key],
    href:
      key === "all"
        ? at(ROUTES.scanTxs)
        : `${at(ROUTES.scanTxs)}?type=${key}`,
  }));

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="txs"
      crumbs={[{ label: dict.scan.tabs.txs }]}
      title={dict.scan.tabs.txs}
      subtitle={dict.nav.groups.scan.items.txs.desc}
    >
      <Notice className="mb-8">{dict.common.mockNotice}</Notice>

      <div className="mb-6">
        <FilterChips items={chips} active={filter ?? "all"} />
      </div>

      <Table minWidth="52rem">
        <THead>
          <TH>{dict.scan.table.hash}</TH>
          <TH>{dict.scan.table.type}</TH>
          <TH>{dict.scan.table.from}</TH>
          <TH>{dict.scan.table.to}</TH>
          <TH align="right">{dict.scan.table.amount}</TH>
          <TH align="right">{dict.scan.table.status}</TH>
          <TH align="right">{dict.scan.table.age}</TH>
        </THead>
        <TBody>
          {result.rows.map((tx) => (
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

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath={
          filter ? `${at(ROUTES.scanTxs)}?type=${filter}` : at(ROUTES.scanTxs)
        }
        labels={{
          previous: dict.common.previous,
          next: dict.common.next,
          page: dict.common.page,
          of: dict.common.of,
        }}
      />
    </ScanShell>
  );
}
