import type { Metadata } from "next";
import Link from "next/link";

import { LevelChip } from "@/components/scan/entities";
import { Histogram } from "@/components/site/charts";
import {
  Notice,
  PageHero,
  Panel,
  PanelHead,
  Section,
  StatGrid,
} from "@/components/site/chrome";
import {
  Table,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/site/table";
import { FilterChips } from "@/components/site/tabs";
import { StatusDot } from "@/components/status-dot";
import { ButtonGhost, ButtonSolid } from "@/components/ui";
import * as api from "@/lib/api";
import type { NodeLevel } from "@/lib/api/types";
import { POTB } from "@/lib/chain";
import { fmtInt, fmtPct } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
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

  return {
    title: dict.validators.title,
    description: dict.validators.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.validators),
      languages: Object.fromEntries(
        LOCALES.map((l) => [
          LOCALE_META[l].htmlLang,
          localePath(l, ROUTES.validators),
        ]),
      ),
    },
  };
}

const LEVELS: (NodeLevel | "all")[] = ["all", "validator", "candidate", "relay"];

export default async function ValidatorsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ level?: string }>;
}) {
  const { locale } = await params;
  const { level } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const filter = LEVELS.includes(level as NodeLevel)
    ? (level as NodeLevel)
    : undefined;

  const [stats, all, page] = await Promise.all([
    api.getNetworkStats(),
    api.getAllValidators(),
    api.getValidators(1, 40, filter),
  ]);

  const cards = [
    { label: dict.validators.total, value: fmtInt(all.length) },
    { label: dict.validators.committee, value: fmtInt(stats.committee) },
    { label: dict.validators.candidates, value: fmtInt(stats.candidates) },
    {
      label: dict.validators.avgUptime,
      value: `${Math.round(stats.medianUptimeDays)}d`,
    },
  ];

  const chips = LEVELS.map((key) => ({
    key,
    label:
      key === "all"
        ? dict.validators.filterAll
        : dict.home.levels.items[key].name,
    href:
      key === "all"
        ? at(ROUTES.validators)
        : `${at(ROUTES.validators)}?level=${key}`,
  }));

  // Weight spread across the whole set, descending — shows the long tail the
  // caps are there to flatten.
  const spread = [...all]
    .sort((a, b) => b.weight - a.weight)
    .map((v) => v.weight);

  return (
    <>
      <PageHero
        wide
        crumbs={[{ label: dict.validators.title }]}
        title={dict.validators.title}
        subtitle={dict.validators.subtitle}
        aside={
          <div className="flex flex-wrap gap-3">
            <ButtonSolid href={at(ROUTES.node)} size="sm" arrow>
              {dict.common.runNode}
            </ButtonSolid>
            <ButtonGhost href={at(ROUTES.network)} size="sm">
              {dict.consensus.formulaLabel}
            </ButtonGhost>
          </div>
        }
      >
        <Notice>{dict.validators.note}</Notice>
      </PageHero>

      <Section wide>
        <StatGrid stats={cards} columns={4} />

        <div className="mt-12 grid gap-3 lg:grid-cols-12">
          <Panel className="lg:col-span-7">
            <PanelHead
              title={dict.status.charts.committee}
              note={dict.validators.formulaNote}
            />
            <div className="mt-7">
              <Histogram values={spread} height={148} />
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-3 label-mono text-ash-3">
              <span>{dict.scan.table.rank} 1</span>
              <span>
                {dict.scan.table.rank} {all.length}
              </span>
            </div>
          </Panel>

          <Panel className="lg:col-span-5" ticks>
            <PanelHead title={dict.validators.formula} />
            <p className="mt-5 font-mono text-[0.8125rem] leading-relaxed text-chalk">
              {dict.consensus.formula}
            </p>
            <dl className="mt-7 space-y-3.5 border-t border-line pt-5">
              {[
                { k: "cap TBS", v: POTB.capTbs },
                { k: "cap TGW", v: POTB.capTgw },
                { k: "min TBS · validator", v: POTB.minTbsValidator },
                { k: "min TGW · validator", v: POTB.minTgwValidator },
                { k: "min TBS · candidate", v: POTB.minTbsCandidate },
              ].map((row) => (
                <div key={row.k} className="flex items-baseline justify-between gap-4">
                  <dt className="label-mono text-ash-3">{row.k}</dt>
                  <dd className="font-mono text-[0.8125rem] text-chalk tabular-nums">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        </div>
      </Section>

      <Section wide className="border-t border-line">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="label-mono text-ash-2">{dict.validators.title}</h2>
          <FilterChips items={chips} active={filter ?? "all"} />
        </div>

        <div className="mt-8">
          <Table minWidth="52rem">
            <THead>
              <TH>{dict.scan.table.rank}</TH>
              <TH>{dict.scan.table.node}</TH>
              <TH>{dict.scan.table.level}</TH>
              <TH align="right">{dict.scan.table.weight}</TH>
              <TH align="right">{dict.scan.validator.tbs}</TH>
              <TH align="right">{dict.scan.validator.tgw}</TH>
              <TH align="right">{dict.scan.validator.correctness}</TH>
              <TH align="right">{dict.scan.table.uptime}</TH>
              <TH>{dict.scan.validator.region}</TH>
            </THead>
            <TBody>
              {page.rows.map((v) => (
                <TR key={v.nodeId}>
                  <TD className="text-ash-3">{v.rank}</TD>
                  <TD>
                    <span className="inline-flex items-center gap-2.5">
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
                    {fmtPct(v.correctness * 100, 2)}
                  </TD>
                  <TD align="right" className="text-ash-2">
                    {v.uptimeDays}d
                  </TD>
                  <TD className="text-ash-3">{v.region}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </div>

        <div className="mt-8">
          <ButtonGhost href={at(ROUTES.scanValidators)} size="sm" arrow>
            {dict.common.viewAll}
          </ButtonGhost>
        </div>
      </Section>
    </>
  );
}
