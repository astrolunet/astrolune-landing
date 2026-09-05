import type { Metadata } from "next";
import Link from "next/link";

import { AddressLink, BlockLink } from "@/components/scan/entities";
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
  return { title: dict.scan.namesTitle, description: dict.dns.subtitle };
}

const PAGE_SIZE = 25;

export default async function NamesPage({
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

  const result = await api.getNames(Number(page) || 1, PAGE_SIZE);

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="names"
      crumbs={[{ label: dict.scan.namesTitle }]}
      title={dict.scan.namesTitle}
      subtitle={dict.nav.groups.scan.items.names.desc}
    >
      {/* The zone is deferred by decision — saying so here is more honest than
          letting a populated table imply it exists. */}
      <Notice tone="warn" className="mb-8">
        {dict.dns.statusBody}
      </Notice>

      <Table minWidth="46rem">
        <THead>
          <TH>{dict.scan.table.name}</TH>
          <TH>{dict.scan.table.address}</TH>
          <TH>{dict.scan.table.owner}</TH>
          <TH align="right">{dict.dns.lookupTitle}</TH>
          <TH align="right">{dict.scan.table.expires}</TH>
        </THead>
        <TBody>
          {result.rows.map((record) => (
            <TR key={record.name}>
              <TD>
                <Link
                  href={at(PATHS.name(record.name))}
                  className="font-mono text-[0.8125rem] text-chalk underline decoration-transparent underline-offset-2 transition-colors duration-200 hover:decoration-white/40"
                >
                  {record.name}
                </Link>
              </TD>
              <TD>
                <AddressLink
                  address={record.address}
                  at={at}
                  head={10}
                  tail={6}
                />
              </TD>
              <TD>
                <AddressLink address={record.owner} at={at} head={8} tail={4} />
              </TD>
              <TD align="right">
                <BlockLink height={record.registeredHeight} at={at} />
              </TD>
              <TD align="right" className="text-ash-2">
                {record.expiresHeight.toLocaleString("en-US")}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath={at(ROUTES.scanNames)}
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
