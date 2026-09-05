import type { Metadata } from "next";

import { AddressLink } from "@/components/scan/entities";
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
import { Chip } from "@/components/ui";
import * as api from "@/lib/api";
import { fmtAmount, fmtInt } from "@/lib/format";
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
  return { title: dict.scan.tabs.accounts, description: dict.scan.subtitle };
}

const PAGE_SIZE = 25;

export default async function AccountsPage({
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

  const result = await api.getAccounts(Number(page) || 1, PAGE_SIZE);
  const offset = (result.page - 1) * result.pageSize;

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="accounts"
      crumbs={[{ label: dict.scan.tabs.accounts }]}
      title={dict.scan.tabs.accounts}
      subtitle={dict.nav.groups.scan.items.accounts.desc}
    >
      <Notice className="mb-8">{dict.common.mockNotice}</Notice>

      <Table minWidth="46rem">
        <THead>
          <TH>{dict.scan.table.rank}</TH>
          <TH>{dict.scan.table.address}</TH>
          <TH>{dict.scan.account.type}</TH>
          <TH align="right">{dict.scan.table.balance}</TH>
          <TH align="right">{dict.scan.table.nonce}</TH>
          <TH align="right">{dict.scan.account.txCount}</TH>
        </THead>
        <TBody>
          {result.rows.map((account, i) => (
            <TR key={account.address}>
              <TD className="text-ash-3">{offset + i + 1}</TD>
              <TD>
                <AddressLink
                  address={account.address}
                  at={at}
                  head={14}
                  tail={8}
                />
              </TD>
              <TD>
                <Chip tone={account.kind === "contract" ? "neutral" : "muted"}>
                  {account.kind === "contract"
                    ? dict.scan.account.contract
                    : dict.scan.account.external}
                </Chip>
              </TD>
              <TD align="right" className="text-chalk">
                {fmtAmount(account.balance, { max: 4 })} {SITE.coin.ticker}
              </TD>
              <TD align="right" className="text-ash-2">
                {account.nonce}
              </TD>
              <TD align="right" className="text-ash-2">
                {fmtInt(account.txCount)}
              </TD>
            </TR>
          ))}
        </TBody>
      </Table>

      <Pagination
        page={result.page}
        total={result.total}
        pageSize={result.pageSize}
        basePath={at(ROUTES.scanAccounts)}
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
