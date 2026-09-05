import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AddressLink, BlockLink, LevelChip } from "@/components/scan/entities";
import { ScanShell } from "@/components/scan/shell";
import { BarRows } from "@/components/site/charts";
import { InfoList, InfoRow, Notice, Panel, StatGrid } from "@/components/site/chrome";
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
import { StatusPill } from "@/components/status-dot";
import * as api from "@/lib/api";
import { POTB } from "@/lib/chain";
import { fmtAmount, fmtInt, fmtPct } from "@/lib/format";
import { isLocale, localePath } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

export const dynamicParams = true;

export async function generateStaticParams() {
  const committee = await api.getCommittee();
  return committee.slice(0, 20).map((v) => ({ nodeId: v.nodeId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; nodeId: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);
  return { title: dict.scan.validator.title };
}

export default async function ValidatorPage({
  params,
}: {
  params: Promise<{ locale: string; nodeId: string }>;
}) {
  const { locale, nodeId } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const validator = await api.getValidator(nodeId);
  if (!validator) notFound();

  const cards = [
    { label: dict.scan.validator.weight, value: validator.weight.toFixed(3) },
    { label: dict.scan.validator.level, value: <LevelChip level={validator.level} dict={dict} /> },
    { label: dict.scan.validator.uptime, value: `${validator.uptimeDays}d` },
    {
      label: dict.scan.validator.correctness,
      value: fmtPct(validator.correctness * 100, 2),
    },
  ];

  /**
   * The four factors as bars, each scaled against its own cap rather than
   * against the largest — the point is how close this node sits to *its* ceiling
   * on each axis, and a shared scale would hide that.
   */
  const factors = [
    { label: `TBS / ${POTB.capTbs}`, value: Math.min(validator.tbs, POTB.capTbs) },
    { label: `TGW / ${POTB.capTgw}`, value: validator.tgw * POTB.capTbs },
    { label: `NDM ×${validator.ndm}`, value: validator.ndm * POTB.capTbs * 0.7 },
    { label: `COD ×${validator.cod}`, value: validator.cod * POTB.capTbs * 0.7 },
  ];

  return (
    <ScanShell
      dict={dict}
      at={at}
      active="validators"
      crumbs={[
        { label: dict.validators.title, href: at(ROUTES.scanValidators) },
        { label: validator.nodeId.replace("al-node-", "") },
      ]}
      title={dict.scan.validator.title}
      subtitle={dict.validators.subtitle}
    >
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <StatusPill tone={validator.inCommittee ? "live" : "idle"}>
          {validator.inCommittee
            ? dict.validators.committee
            : dict.common.notAvailable}
        </StatusPill>
        <span className="label-mono text-ash-3">
          {dict.scan.table.rank} {validator.rank}
        </span>
      </div>

      <StatGrid stats={cards} columns={4} />

      <div className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <InfoList>
            <InfoRow label={dict.scan.validator.nodeId} mono>
              <CopyInline value={validator.nodeId}>{validator.nodeId}</CopyInline>
            </InfoRow>
            <InfoRow label={dict.scan.account.address} mono>
              <AddressLink
                address={validator.address}
                at={at}
                head={42}
                tail={8}
                copy
              />
            </InfoRow>
            <InfoRow label={dict.scan.validator.asn} mono>
              {validator.asn} · {validator.asnName}
            </InfoRow>
            <InfoRow label={dict.scan.validator.region} mono>
              {validator.region}
            </InfoRow>
            <InfoRow label={dict.scan.validator.committeeSince} mono>
              <BlockLink height={validator.committeeSinceHeight} at={at} />
            </InfoRow>
            <InfoRow label={dict.scan.validator.blocksProposed} mono>
              {fmtInt(validator.blocksProposed)}
            </InfoRow>
            <InfoRow label={dict.scan.validator.votes} mono>
              {fmtInt(validator.votes)}
            </InfoRow>
            <InfoRow label={dict.scan.validator.missed} mono>
              {fmtInt(validator.missed)}
            </InfoRow>
            <InfoRow label={dict.scan.validator.bond} mono>
              {validator.bond === "0" ? (
                <span className="text-ash-3">—</span>
              ) : (
                `${fmtAmount(validator.bond, { max: 2 })} ${SITE.coin.ticker}`
              )}
            </InfoRow>
          </InfoList>
        </div>

        <div className="lg:col-span-5">
          <Panel ticks>
            <p className="label-mono text-ash">{dict.validators.formula}</p>
            <p className="mt-3 font-mono text-[0.6875rem] text-ash-3">
              {dict.consensus.formula}
            </p>
            <div className="mt-7">
              <BarRows rows={factors} max={POTB.capTbs} digits={2} />
            </div>
            <p className="mt-7 border-t border-line pt-5 text-[0.75rem] leading-relaxed text-ash-2">
              {dict.validators.formulaNote}
            </p>
          </Panel>
        </div>
      </div>

      {/* slashing history */}
      <section className="mt-14">
        <h2 className="label-mono text-chalk">{dict.scan.validator.slashes}</h2>
        <div className="mt-4">
          <Table minWidth="32rem">
            <THead>
              <TH>{dict.scan.table.height}</TH>
              <TH>{dict.node.slashTable.offence}</TH>
              <TH align="right">{dict.node.slashTable.penalty}</TH>
            </THead>
            <TBody>
              {validator.slashes.length === 0 ? (
                <TableEmpty colSpan={3}>
                  {dict.scan.validator.noSlashes}
                </TableEmpty>
              ) : (
                validator.slashes.map((slash) => {
                  const meta =
                    dict.node.slash[slash.offence as keyof typeof dict.node.slash];
                  return (
                    <TR key={`${slash.height}-${slash.offence}`}>
                      <TD>
                        <BlockLink height={slash.height} at={at} />
                      </TD>
                      <TD mono={false} className="text-ash">
                        {meta?.o ?? slash.offence}
                      </TD>
                      <TD align="right" className="text-warn/90">
                        {slash.penalty}
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
