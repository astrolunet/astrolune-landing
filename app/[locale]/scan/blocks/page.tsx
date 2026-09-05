import type { Metadata } from "next";

import {
  AgeCell,
  BlockLink,
  HashLink,
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
import * as api from "@/lib/api";
import { ageOf, fmtBytes, fmtInt } from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.scan.tabs.blocks, description: dict.scan.subtitle };
}

const PAGE_SIZE = 25;

export default async function BlocksPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const { page } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const current = Number(page) || 1;
  const [stats, result] = await Promise.all([
    api.getNetworkStats(),
    api.getBlocks(current, PAGE_SIZE),
  ]);

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="blocks"
      crumbs={[{ label: dict.scan.tabs.blocks }]}
      title={dict.scan.tabs.blocks}
      subtitle={dict.nav.groups.scan.items.blocks.desc}
    >
      <Notice className="mb-8">{dict.common.mockNotice}</Notice>

      <Table minWidth="56rem">
        <THead>
          <TH>{dict.scan.table.height}</TH>
          <TH>{dict.scan.table.hash}</TH>
          <TH>{dict.scan.table.proposer}</TH>
          <TH align="right">{dict.scan.table.txs}</TH>
          <TH align="right">{dict.scan.block.votes}</TH>
          <TH align="right">{dict.scan.table.gas}</TH>
          <TH align="right">{dict.scan.block.size}</TH>
          <TH align="right">{dict.scan.table.age}</TH>
        </THead>
        <TBody>
          {result.rows.map((block) => (
            <TR key={block.height}>
              <TD>
                <BlockLink height={block.height} at={at} />
              </TD>
              <TD>
                <HashLink
                  value={block.hash}
                  href={at(PATHS.block(block.height))}
                  head={10}
                  tail={6}
                />
              </TD>
              <TD className="text-ash-2">
                {block.proposer.replace("al-node-", "")}
              </TD>
              <TD align="right">{block.txCount}</TD>
              <TD align="right" className="text-ash-2">
                {block.votes} / {block.committee}
              </TD>
              <TD align="right" className="text-ash-2">
                <span className="inline-flex items-center justify-end gap-2.5">
                  <span className="tabular-nums">{fmtInt(block.gasUsed)}</span>
                  <span className="h-1 w-10 shrink-0 overflow-hidden rounded-full bg-panel-3">
                    <span
                      className="block h-full rounded-full bg-chalk/45 transition-colors duration-500 group-hover:bg-chalk/80"
                      style={{
                        width: `${Math.max((block.gasUsed / block.gasLimit) * 100, 2)}%`,
                      }}
                    />
                  </span>
                </span>
              </TD>
              <TD align="right" className="text-ash-2">
                {fmtBytes(block.size)}
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

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath={at(ROUTES.scanBlocks)}
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
