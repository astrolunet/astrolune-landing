import type { Metadata } from "next";

import { BarRows, SplitBar } from "@/components/site/charts";
import {
  Notice,
  PageHero,
  Panel,
  PanelHead,
  Section,
  StatGrid,
} from "@/components/site/chrome";
import { Table, TBody, TD, TH, THead, TR } from "@/components/site/table";
import { ButtonGhost, Chip, IconMoon } from "@/components/ui";
import * as api from "@/lib/api";
import { POTB } from "@/lib/chain";
import { fmtAmount, fmtCompact } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.lune.title,
    description: dict.lune.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.lune),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.lune)]),
      ),
    },
  };
}

export default async function LunePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const stats = await api.getNetworkStats();

  /** The denomination ladder — 10⁰ … 10⁹ base units. */
  const units = [
    { name: dict.lune.units.nano, exp: 0, value: "1" },
    { name: dict.lune.units.micro, exp: 3, value: "1 000" },
    { name: dict.lune.units.milli, exp: 6, value: "1 000 000" },
    { name: dict.lune.units.lune, exp: 9, value: "1 000 000 000" },
  ];

  const supply = [
    {
      label: dict.lune.supply.total,
      value: `${fmtCompact(stats.supply)} ${SITE.coin.ticker}`,
    },
    {
      label: dict.lune.supply.circulating,
      value: `${fmtCompact(stats.circulating)} ${SITE.coin.ticker}`,
    },
    {
      label: dict.lune.supply.bonded,
      value: `${fmtCompact(stats.bonded)} ${SITE.coin.ticker}`,
    },
    {
      label: dict.lune.supply.burned,
      value: `${fmtAmount(stats.burned, { max: 2 })} ${SITE.coin.ticker}`,
    },
  ];

  const uses = [
    dict.lune.uses.gas,
    dict.lune.uses.transfer,
    dict.lune.uses.bond,
    dict.lune.uses.names,
  ];

  const rewardParts = [
    { label: dict.home.coin.rewards.flat, pct: POTB.rewardFlatBp / 100 },
    { label: dict.home.coin.rewards.weighted, pct: POTB.rewardWeightedBp / 100 },
    { label: dict.home.coin.rewards.bonded, pct: POTB.rewardBondedBp / 100 },
  ];

  const facts = [
    { label: dict.home.coin.facts.ticker, value: SITE.coin.ticker },
    { label: dict.home.coin.facts.decimals, value: String(SITE.coin.decimals) },
    {
      label: dict.home.coin.facts.unit,
      value: `10⁻${SITE.coin.decimals} ${SITE.coin.ticker}`,
    },
    { label: dict.home.coin.facts.type, value: "u64" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.lune.title }]}
        title={dict.lune.title}
        subtitle={dict.lune.subtitle}
        aside={
          <span className="grid size-14 place-items-center rounded-2xl border border-line-2 bg-panel-3">
            <IconMoon className="size-6 text-chalk/85" />
          </span>
        }
      >
        <StatGrid stats={facts} columns={4} />
      </PageHero>

      {/* denominations */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
              {dict.lune.unitsTitle}
            </h2>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ash">
              {dict.lune.unitsNote}
            </p>
          </div>

          <div className="lg:col-span-7">
            <Table minWidth="28rem">
              <THead>
                <TH>{dict.scan.table.name}</TH>
                <TH align="right">10ⁿ</TH>
                <TH align="right">{dict.home.coin.facts.unit}</TH>
              </THead>
              <TBody>
                {units.map((unit) => (
                  <TR key={unit.name}>
                    <TD mono={false} className="text-chalk">
                      {unit.name}
                    </TD>
                    <TD align="right" className="text-ash-2">
                      10{unit.exp === 0 ? "⁰" : `^${unit.exp}`}
                    </TD>
                    <TD align="right" className="text-chalk/90">
                      {unit.value}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </div>
      </Section>

      {/* supply */}
      <Section className="border-t border-line" lattice>
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.lune.supplyTitle}
        </h2>

        <div className="mt-10">
          <StatGrid stats={supply} columns={4} />
        </div>

        {/* Emission belongs in genesis, and there is no genesis block yet —
            saying so is more useful than a confident-looking chart. */}
        <Notice tone="warn" className="mt-8">
          {dict.lune.supplyNote}
        </Notice>
      </Section>

      {/* rewards */}
      <Section className="border-t border-line">
        <div className="grid gap-3 lg:grid-cols-12">
          <Panel className="lg:col-span-7">
            <PanelHead title={dict.lune.rewardTitle} />
            <div className="mt-8">
              <SplitBar parts={rewardParts} />
            </div>
            <p className="mt-8 border-t border-line pt-6 text-[0.75rem] leading-relaxed text-ash-2">
              {dict.lune.rewardNote}
            </p>
          </Panel>

          <Panel className="lg:col-span-5" ticks>
            <PanelHead title={dict.lune.feeTitle} />
            <p className="mt-5 text-[0.875rem] leading-relaxed text-ash">
              {dict.lune.feeBody}
            </p>
            <div className="mt-8">
              <Chip tone="warn">{dict.docs.sections.roadmap}</Chip>
            </div>
          </Panel>
        </div>
      </Section>

      {/* uses */}
      <Section className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.lune.useTitle}
        </h2>

        <dl className="mt-10 divide-y divide-line border-t border-line">
          {uses.map((use) => (
            <div
              key={use.k}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8"
            >
              <dt className="label-mono pt-0.5 text-ash-2">{use.k}</dt>
              <dd className="text-[0.875rem] leading-relaxed text-ash">
                {use.v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonGhost href={at(ROUTES.network)} size="sm" arrow>
            {dict.consensus.rewards.label}
          </ButtonGhost>
          <ButtonGhost href={at(DOC_ROUTES.transactions)} size="sm" arrow>
            {dict.footer.cols.protocol.items.state}
          </ButtonGhost>
        </div>
      </Section>
    </>
  );
}
