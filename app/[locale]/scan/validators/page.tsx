import type { Metadata } from "next";
import Link from "next/link";

import { LevelChip } from "@/components/scan/entities";
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
import { StatusDot } from "@/components/status-dot";
import * as api from "@/lib/api";
import { fmtPct } from "@/lib/format";
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
  return { title: dict.validators.title, description: dict.validators.subtitle };
}

const PAGE_SIZE = 25;

export default async function ScanValidatorsPage({
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

  const result = await api.getValidators(Number(page) || 1, PAGE_SIZE);

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="validators"
      crumbs={[{ label: dict.validators.title }]}
      title={dict.validators.title}
      subtitle={dict.validators.subtitle}
    >
      <Notice className="mb-8">{dict.validators.note}</Notice>

      <Table minWidth="58rem">
        <THead>
          <TH>{dict.scan.table.rank}</TH>
          <TH>{dict.scan.table.node}</TH>
          <TH>{dict.scan.table.level}</TH>
          <TH align="right">{dict.scan.table.weight}</TH>
          <TH align="right">{dict.scan.validator.tbs}</TH>
          <TH align="right">{dict.scan.validator.tgw}</TH>
          <TH align="right">{dict.scan.validator.ndm}</TH>
          <TH align="right">{dict.scan.validator.cod}</TH>
          <TH align="right">{dict.scan.table.uptime}</TH>
          <TH>{dict.scan.validator.asn}</TH>
        </THead>
        <TBody>
          {result.rows.map((v) => (
            <TR key={v.nodeId}>
              <TD className="text-ash-3">{v.rank}</TD>
              <TD>
                <span className="inline-flex items-center gap-2.5">
                  {/* seated members carry a live dot — the set turns over
                      continuously, so "in committee" is a state not a rank */}
                  <StatusDot
                    tone={v.inCommittee ? "live" : "muted"}
                    pulse={v.inCommittee}
                  />
                  <Link
                    href={at(PATHS.validator(v.nodeId))}
                    className="font-mono text-[0.8125rem] text-chalk/90 underline decoration-transparent underline-offset-2 transition-colors duration-200 hover:decoration-white/40"
                  >
                    {v.nodeId.replace("al-node-", "")}
                  </Link>
                </span>
              </TD>
              <TD>
                <LevelChip level={v.level} dict={dict} />
              </TD>
              <TD align="right" className="text-chalk">
                {v.weight.toFixed(3)}
              </TD>
              <TD align="right" className="text-ash-2">
                {v.tbs.toFixed(2)}
              </TD>
              <TD align="right" className="text-ash-2">
                {v.tgw.toFixed(2)}
              </TD>
              <TD align="right" className="text-ash-2">
                {v.ndm.toFixed(2)}
              </TD>
              <TD align="right" className="text-ash-2">
                {v.cod.toFixed(2)}
              </TD>
              <TD align="right" className="text-ash-2">
                {v.uptimeDays}d
              </TD>
              <TD className="text-ash-3">{v.asn}</TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath={at(ROUTES.scanValidators)}
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
