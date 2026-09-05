import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
import { InfoList, InfoRow, Notice, StatGrid } from "@/components/site/chrome";
import { CopyInline } from "@/components/site/copy";
import {
  Table,
  TBody,
  TableEmpty,
  TD,
  TH,
  THead,
  TR,
} from "@/components/site/table";
import { Chip } from "@/components/ui";
import * as api from "@/lib/api";
import { ageOf, fmtAmount, fmtInt } from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/**
 * An account, by address.
 *
 * Fully on-demand: an address space of 2²⁵⁶ has no meaningful "recent" subset to
 * prerender, so unlike blocks and transactions this route ships no
 * `generateStaticParams` at all.
 */
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; address: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.scan.account.title };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string; address: string }>;
}) {
  const { locale, address } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const account = await api.getAccount(address);
  if (!account) notFound();

  const [stats, history, contract] = await Promise.all([
    api.getNetworkStats(),
    api.getAccountTxs(account.address, 25),
    api.getContract(account.address),
  ]);

  const cards = [
    {
      label: dict.scan.account.balance,
      value: `${fmtAmount(account.balance, { max: 4 })} ${SITE.coin.ticker}`,
    },
    { label: dict.scan.account.nonce, value: fmtInt(account.nonce) },
    { label: dict.scan.account.txCount, value: fmtInt(account.txCount) },
    {
      label: dict.scan.account.names,
      value: account.names.length === 0 ? "—" : String(account.names.length),
    },
  ];

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="accounts"
      crumbs={[
        { label: dict.scan.tabs.accounts, href: at(ROUTES.scanAccounts) },
        { label: `${account.address.slice(0, 12)}…` },
      ]}
      title={dict.scan.account.title}
      subtitle={dict.nav.groups.scan.items.accounts.desc}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Chip tone={account.kind === "contract" ? "neutral" : "muted"}>
          {account.kind === "contract"
            ? dict.scan.account.contract
            : dict.scan.account.external}
        </Chip>
        {account.nodeId && (
          <Link href={at(PATHS.validator(account.nodeId))}>
            <Chip tone="solid">{dict.scan.account.node}</Chip>
          </Link>
        )}
      </div>

      <StatGrid stats={cards} columns={4} />

      <div className="mt-12">
        <InfoList>
          <InfoRow label={dict.scan.account.address} mono>
            <CopyInline value={account.address}>{account.address}</CopyInline>
          </InfoRow>
          <InfoRow label={dict.scan.account.storageRoot} mono>
            <CopyInline value={account.storageRoot}>
              {account.storageRoot}
            </CopyInline>
          </InfoRow>
          {account.codeHash && (
            <InfoRow label={dict.scan.account.codeHash} mono>
              <CopyInline value={account.codeHash}>{account.codeHash}</CopyInline>
            </InfoRow>
          )}
          {contract && (
            <InfoRow label={dict.contracts.table.language} mono>
              {contract.language}
            </InfoRow>
          )}
          <InfoRow label={dict.scan.account.firstSeen} mono>
            <BlockLink height={account.firstSeenHeight} at={at} />
          </InfoRow>
          {account.names.length > 0 && (
            <InfoRow label={dict.scan.account.names} mono>
              <span className="flex flex-wrap gap-2">
                {account.names.map((name) => (
                  <Link key={name} href={at(PATHS.name(name))}>
                    <Chip tone="muted">{name}</Chip>
                  </Link>
                ))}
              </span>
            </InfoRow>
          )}
        </InfoList>
      </div>

      {/* transaction history */}
      <section className="mt-14">
        <h2 className="label-mono text-chalk">{dict.scan.account.history}</h2>
        <div className="mt-4">
          <Table minWidth="48rem">
            <THead>
              <TH>{dict.scan.table.hash}</TH>
              <TH>{dict.scan.table.type}</TH>
              <TH>{dict.scan.table.from}</TH>
              <TH>{dict.scan.table.to}</TH>
              <TH align="right">{dict.scan.table.amount}</TH>
              <TH align="right">{dict.scan.table.age}</TH>
            </THead>
            <TBody>
              {history.length === 0 ? (
                <TableEmpty colSpan={6}>
                  {dict.scan.account.noHistory}
                </TableEmpty>
              ) : (
                history.map((tx) => {
                  const outgoing = tx.from === account.address;
                  return (
                    <TR key={tx.hash}>
                      <TD>
                        <TxLink hash={tx.hash} at={at} head={8} tail={6} />
                      </TD>
                      <TD>
                        <TxTypeChip type={tx.type} dict={dict} />
                      </TD>
                      <TD>
                        {outgoing ? (
                          <span className="text-ash-3">
                            {dict.common.notAvailable}
                          </span>
                        ) : (
                          <AddressLink
                            address={tx.from}
                            at={at}
                            head={6}
                            tail={4}
                          />
                        )}
                      </TD>
                      <TD>
                        {tx.to ? (
                          <AddressLink
                            address={tx.to}
                            at={at}
                            head={6}
                            tail={4}
                          />
                        ) : (
                          <EmptyCell />
                        )}
                      </TD>
                      <TD align="right">
                        {tx.amount === "0" ? (
                          <EmptyCell />
                        ) : (
                          <span
                            className={outgoing ? "text-down" : "text-live"}
                          >
                            {outgoing ? "−" : "+"}
                            {fmtAmount(tx.amount, { max: 4 })}
                          </span>
                        )}
                      </TD>
                      <TD align="right">
                        <AgeCell
                          ago={ageOf(stats.head, tx.height, stats.blockMs)}
                          dict={dict}
                        />
                      </TD>
                    </TR>
                  );
                })
              )}
            </TBody>
          </Table>
        </div>
      </section>

      <Notice className="mt-10">{dict.common.mockNotice}</Notice>
    </ScanShell>
  );
}
