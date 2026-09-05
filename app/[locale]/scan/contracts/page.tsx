import type { Metadata } from "next";

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
import { Chip, IconCheck } from "@/components/ui";
import * as api from "@/lib/api";
import { fmtBytes, fmtInt } from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.scan.tabs.contracts, description: dict.contracts.subtitle };
}

const PAGE_SIZE = 25;

export default async function ScanContractsPage({
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

  const [system, result] = await Promise.all([
    api.getSystemContracts(),
    api.getVerifiedContracts(Number(page) || 1, PAGE_SIZE),
  ]);

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="contracts"
      crumbs={[{ label: dict.scan.tabs.contracts }]}
      title={dict.scan.tabs.contracts}
      subtitle={dict.nav.groups.scan.items.contracts.desc}
    >
      <Notice className="mb-8">{dict.contracts.systemNote}</Notice>

      {/* system registry */}
      <section>
        <h2 className="label-mono text-chalk">{dict.contracts.systemTitle}</h2>
        <div className="mt-4">
          <Table minWidth="44rem">
            <THead>
              <TH>{dict.contracts.table.name}</TH>
              <TH>{dict.contracts.table.address}</TH>
              <TH align="right">{dict.contracts.table.calls}</TH>
              <TH align="right">{dict.contracts.table.size}</TH>
            </THead>
            <TBody>
              {system.map((contract) => {
                const meta =
                  dict.contracts.system[
                    contract.key as keyof typeof dict.contracts.system
                  ];
                return (
                  <TR key={contract.address}>
                    <TD mono={false}>
                      <span className="block text-[0.8125rem] text-chalk">
                        {meta?.name ?? contract.key}
                      </span>
                      <span className="mt-1 block text-[0.75rem] text-ash-2">
                        {meta?.desc}
                      </span>
                    </TD>
                    <TD>
                      <AddressLink
                        address={contract.address}
                        at={at}
                        head={12}
                        tail={6}
                      />
                    </TD>
                    <TD align="right" className="text-ash-2">
                      {fmtInt(contract.calls)}
                    </TD>
                    <TD align="right" className="text-ash-2">
                      {fmtBytes(contract.size)}
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        </div>
      </section>

      {/* verified deployments */}
      <section className="mt-14">
        <h2 className="label-mono text-chalk">{dict.contracts.verifiedTitle}</h2>
        <p className="mt-2 text-[0.75rem] text-ash-2">
          {dict.contracts.verifiedNote}
        </p>
        <div className="mt-4">
          <Table minWidth="50rem">
            <THead>
              <TH>{dict.contracts.table.name}</TH>
              <TH>{dict.contracts.table.address}</TH>
              <TH>{dict.contracts.table.language}</TH>
              <TH align="right">{dict.contracts.table.deployed}</TH>
              <TH align="right">{dict.contracts.table.calls}</TH>
              <TH align="right">{dict.contracts.table.verified}</TH>
            </THead>
            <TBody>
              {result.rows.map((contract) => (
                <TR key={contract.address}>
                  <TD className="text-chalk">{contract.key}</TD>
                  <TD>
                    <AddressLink
                      address={contract.address}
                      at={at}
                      head={12}
                      tail={6}
                    />
                  </TD>
                  <TD>
                    <Chip tone={contract.language === "Trocto" ? "neutral" : "muted"}>
                      {contract.language}
                    </Chip>
                  </TD>
                  <TD align="right">
                    <BlockLink height={contract.deployedHeight} at={at} />
                  </TD>
                  <TD align="right" className="text-ash-2">
                    {fmtInt(contract.calls)}
                  </TD>
                  <TD align="right">
                    {contract.verified ? (
                      <IconCheck className="ml-auto size-3.5 text-live" />
                    ) : (
                      <span className="text-ash-3">—</span>
                    )}
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        <Pagination
          page={result.page}
          total={result.total}
          pageSize={result.pageSize}
          basePath={at(ROUTES.scanContracts)}
          labels={{
            previous: dict.common.previous,
            next: dict.common.next,
            page: dict.common.page,
            of: dict.common.of,
          }}
        />
      </section>
    </ScanShell>
  );
}
