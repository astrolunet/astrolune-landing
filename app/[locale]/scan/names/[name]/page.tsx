import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddressLink, BlockLink } from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { InfoList, InfoRow, Notice } from "@/components/site/chrome";
import { CopyInline } from "@/components/site/copy";
import { Table, TBody, TD, TH, THead, TR } from "@/components/site/table";
import { Chip } from "@/components/ui";
import * as api from "@/lib/api";
import { BLOCKS_PER_DAY } from "@/lib/api";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

export const dynamicParams = true;

export async function generateStaticParams() {
  const names = await api.getNames(1, 40);
  return names.rows.map((record) => ({ name: record.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}): Promise<Metadata> {
  const { locale, name } = await params;
  if (!isLocale(locale)) return {};
  return { title: decodeURIComponent(name) };
}

export default async function NamePage({
  params,
}: {
  params: Promise<{ locale: string; name: string }>;
}) {
  const { locale, name } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const record = await api.getName(decodeURIComponent(name));
  if (!record) notFound();

  // Expiry is measured in blocks, because a name must never be timed off a
  // wall clock — the same rule the DNS skeleton states.
  const remainingBlocks = record.expiresHeight - record.registeredHeight;
  const remainingDays = Math.round(remainingBlocks / BLOCKS_PER_DAY);

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="names"
      crumbs={[
        { label: dict.scan.namesTitle, href: at(ROUTES.scanNames) },
        { label: record.name },
      ]}
      title={record.name}
      subtitle={dict.dns.subtitle}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <Chip tone="solid">{dict.dns.lookupTaken}</Chip>
        <Chip tone="warn">{dict.dns.statusBadge}</Chip>
      </div>

      <InfoList>
        <InfoRow label={dict.scan.table.name} mono>
          <CopyInline value={record.name}>{record.name}</CopyInline>
        </InfoRow>
        <InfoRow label={dict.scan.table.address} mono>
          <AddressLink address={record.address} at={at} head={42} tail={8} copy />
        </InfoRow>
        <InfoRow label={dict.scan.table.owner} mono>
          <AddressLink address={record.owner} at={at} head={42} tail={8} copy />
        </InfoRow>
        <InfoRow label={dict.dns.lookupTitle} mono>
          <BlockLink height={record.registeredHeight} at={at} />
        </InfoRow>
        <InfoRow label={dict.scan.table.expires} mono>
          {record.expiresHeight.toLocaleString("en-US")}
          <span className="ml-3 text-ash-3">≈ {remainingDays}d</span>
        </InfoRow>
      </InfoList>

      <section className="mt-14">
        <h2 className="label-mono text-chalk">{dict.dns.recordsTitle}</h2>
        <div className="mt-4">
          <Table minWidth="34rem">
            <THead>
              <TH>{dict.scan.table.type}</TH>
              <TH>{dict.common.details}</TH>
            </THead>
            <TBody>
              {record.records.map((entry) => (
                <TR key={`${entry.kind}-${entry.label}`}>
                  <TD mono={false}>
                    <Chip tone="muted">{entry.label}</Chip>
                    <span className="mt-2 block text-[0.75rem] text-ash-2">
                      {dict.dns.recordTypes[entry.kind]}
                    </span>
                  </TD>
                  <TD className="break-all text-chalk/90">{entry.value}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>
      </section>

      <Notice tone="warn" className="mt-10">
        {dict.dns.statusBody}
      </Notice>
    </ScanShell>
  );
}
