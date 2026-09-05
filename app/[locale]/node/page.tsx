import type { Metadata } from "next";

import { SplitBar } from "@/components/site/charts";
import {
  Notice,
  PageHero,
  Panel,
  PanelHead,
  Section,
  StatGrid,
} from "@/components/site/chrome";
import { CopyInline } from "@/components/site/copy";
import { Table, TBody, TD, TH, THead, TR } from "@/components/site/table";
import {
  ButtonGhost,
  ButtonSolid,
  CornerTicks,
  IconGithub,
  IconShield,
} from "@/components/ui";
import { POTB } from "@/lib/chain";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";
import { ENDPOINTS, LINKS } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.node.title,
    description: dict.node.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.node),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.node)]),
      ),
    },
  };
}

/** The quick start from `08-implementation/build-and-test.md` §1. */
const BUILD_STEPS = [
  {
    label: "clone",
    code: "git clone https://github.com/astrolune/astrolune\ncd astrolune",
  },
  {
    label: "configure",
    code: "cmake --preset dev",
  },
  {
    label: "build",
    code: "cmake --build --preset dev",
  },
  {
    label: "test",
    code: "ctest --preset dev --output-on-failure",
  },
];

export default async function NodePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const requirements = [
    dict.node.req.cpu,
    dict.node.req.ram,
    dict.node.req.disk,
    dict.node.req.net,
    dict.node.req.os,
    dict.node.req.toolchain,
  ];

  const steps = [
    dict.node.steps.s1,
    dict.node.steps.s2,
    dict.node.steps.s3,
    dict.node.steps.s4,
    dict.node.steps.s5,
  ];

  const slashes = [
    dict.node.slash.miss,
    dict.node.slash.systematic,
    dict.node.slash.wrong,
    dict.node.slash.wrongSys,
    dict.node.slash.double,
    dict.node.slash.repeat,
  ];

  const rewardParts = [
    { label: dict.home.coin.rewards.flat, pct: POTB.rewardFlatBp / 100 },
    { label: dict.home.coin.rewards.weighted, pct: POTB.rewardWeightedBp / 100 },
    { label: dict.home.coin.rewards.bonded, pct: POTB.rewardBondedBp / 100 },
  ];

  const cards = [
    { label: dict.scan.stats.validators, value: String(POTB.committeeSize) },
    {
      label: dict.home.levels.calcTbs,
      value: `≥ ${POTB.minTbsCandidate}`,
      sub: dict.home.levels.items.candidate.name,
    },
    {
      label: `${dict.home.levels.calcTbs} · ${dict.home.levels.calcTgw}`,
      value: `≥ ${POTB.minTbsValidator} · ${POTB.minTgwValidator}`,
      sub: dict.home.levels.items.validator.name,
    },
    { label: dict.status.epoch.title, value: `${POTB.epochDays}d` },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.node.title }]}
        title={dict.node.title}
        subtitle={dict.node.subtitle}
        aside={
          <div className="flex flex-wrap gap-3">
            <ButtonSolid href={LINKS.githubCore} size="sm" arrow external>
              <span className="flex items-center gap-2">
                <IconGithub className="size-3.5" />
                {dict.common.viewOnGithub}
              </span>
            </ButtonSolid>
            <ButtonGhost href={at(ROUTES.validators)} size="sm">
              {dict.common.becomeValidator}
            </ButtonGhost>
          </div>
        }
      >
        <Notice tone="warn">{dict.common.insecureCrypto}</Notice>
      </PageHero>

      {/* requirements */}
      <Section>
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.node.reqTitle}
        </h2>

        <dl className="mt-10 divide-y divide-line border-t border-line">
          {requirements.map((req) => (
            <div
              key={req.k}
              className="grid gap-2 py-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-8"
            >
              <dt className="label-mono pt-0.5 text-ash-2">{req.k}</dt>
              <dd className="text-[0.875rem] leading-relaxed text-ash">
                {req.v}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* build */}
      <Section className="border-t border-line" lattice>
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.node.buildTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
          {dict.node.buildNote}
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {BUILD_STEPS.map((step, i) => (
            <Panel key={step.label} padded={false} className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-line px-5 py-3">
                <span className="label-mono text-ash-2">
                  / {String(i + 1).padStart(2, "0")} {step.label}
                </span>
                <CopyInline value={step.code}>
                  <span className="label-mono text-ash-3">
                    {dict.common.copy}
                  </span>
                </CopyInline>
              </div>
              <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.75rem] leading-relaxed text-chalk/90">
                {step.code}
              </pre>
            </Panel>
          ))}
        </div>

        {/* endpoints */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {[ENDPOINTS.testnet, ENDPOINTS.mainnet].map((endpoint) => (
            <Panel key={endpoint.chainId}>
              <PanelHead title={endpoint.label} />
              <dl className="mt-5 space-y-3">
                <Row label={dict.scan.tx.chainId} value={endpoint.chainId} />
                <Row label={dict.home.cta.rpcLabel} value={endpoint.rpc} />
                <Row label="WS" value={endpoint.ws} />
              </dl>
            </Panel>
          ))}
        </div>
      </Section>

      {/* the ladder */}
      <Section className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.node.stepsTitle}
        </h2>

        <div className="relative mt-12">
          <div
            aria-hidden
            className="absolute top-0 bottom-0 left-[7px] w-px bg-line md:left-[calc(9rem+7px)]"
          />
          <div className="space-y-px">
            {steps.map((step, i) => (
              <div
                key={step.name}
                className="group relative flex flex-col gap-4 py-7 md:flex-row md:gap-10"
              >
                <div className="shrink-0 md:w-36">
                  <p className="label-mono text-ash-3">
                    {String(i + 1).padStart(2, "0")} / 05
                  </p>
                </div>
                <div className="absolute top-7 left-0 md:left-36">
                  <span className="grid size-[15px] place-items-center rounded-full border border-line-2 bg-void transition-colors duration-500 group-hover:border-chalk/60">
                    <span className="size-1.5 rounded-full bg-chalk/70" />
                  </span>
                </div>
                <div className="min-w-0 flex-1 pl-8 md:pl-10">
                  <h3 className="text-[1.0625rem] font-medium tracking-tight text-chalk">
                    {step.name}
                  </h3>
                  <p className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
                    {step.desc}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-line-2 transition-transform duration-700 group-hover:scale-x-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12">
          <StatGrid stats={cards} columns={4} />
        </div>
      </Section>

      {/* rewards + bond */}
      <Section className="border-t border-line">
        <div className="grid gap-3 lg:grid-cols-12">
          <Panel className="lg:col-span-7">
            <PanelHead title={dict.node.rewardTitle} />
            <div className="mt-8">
              <SplitBar parts={rewardParts} />
            </div>
            <p className="mt-8 border-t border-line pt-6 text-[0.75rem] leading-relaxed text-ash-2">
              {dict.consensus.rewards.note}
            </p>
          </Panel>

          <Panel className="lg:col-span-5" ticks>
            <span className="grid size-10 place-items-center rounded-lg border border-line-2 bg-panel-3 text-chalk/85">
              <IconShield className="size-4.5" />
            </span>
            <h3 className="mt-6 text-lg font-medium tracking-tight text-chalk">
              {dict.node.bondTitle}
            </h3>
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-ash">
              {dict.node.bondBody}
            </p>
          </Panel>
        </div>
      </Section>

      {/* penalties */}
      <Section className="border-t border-line">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
              {dict.node.slashTitle}
            </h2>
            <p className="mt-5 max-w-md text-[0.875rem] leading-relaxed text-ash">
              {dict.node.slashNote}
            </p>
          </div>

          <div className="lg:col-span-7">
            <Table minWidth="30rem">
              <THead>
                <TH>{dict.node.slashTable.offence}</TH>
                <TH align="right">{dict.node.slashTable.penalty}</TH>
              </THead>
              <TBody>
                {slashes.map((row, i) => (
                  <TR key={row.o}>
                    <TD mono={false} className="text-ash">
                      {row.o}
                    </TD>
                    <TD
                      align="right"
                      className={i >= 4 ? "text-warn/90" : "text-chalk/90"}
                    >
                      {row.p}
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          </div>
        </div>
      </Section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="label-mono shrink-0 text-ash-3">{label}</dt>
      <dd className="min-w-0 truncate font-mono text-[0.75rem] text-chalk/90">
        <CopyInline value={value}>{value}</CopyInline>
      </dd>
    </div>
  );
}
