import type { Metadata } from "next";

import { AddressLink, BlockLink } from "@/components/scan/entities";
import {
  Notice,
  PageHero,
  Panel,
  Section,
} from "@/components/site/chrome";
import { Table, TBody, TD, TH, THead, TR } from "@/components/site/table";
import { ButtonGhost, Chip, IconArrow, IconCheck } from "@/components/ui";
import * as api from "@/lib/api";
import { fmtBytes, fmtInt } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.contracts.title,
    description: dict.contracts.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.contracts),
      languages: Object.fromEntries(
        LOCALES.map((l) => [
          LOCALE_META[l].htmlLang,
          localePath(l, ROUTES.contracts),
        ]),
      ),
    },
  };
}

export default async function ContractsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const [system, verified] = await Promise.all([
    api.getSystemContracts(),
    api.getVerifiedContracts(1, 10),
  ]);

  const steps = [
    dict.contracts.steps.write,
    dict.contracts.steps.compile,
    dict.contracts.steps.assemble,
    dict.contracts.steps.validate,
    dict.contracts.steps.deploy,
  ];

  const validation = [
    dict.contracts.validation.opcode,
    dict.contracts.validation.jump,
    dict.contracts.validation.float,
    dict.contracts.validation.clock,
    dict.contracts.validation.size,
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.contracts.title }]}
        title={dict.contracts.title}
        subtitle={dict.contracts.subtitle}
        aside={
          <ButtonGhost href={at(DOC_ROUTES.languages)} size="sm" arrow>
            {dict.nav.groups.build.cta}
          </ButtonGhost>
        }
      >
        <Notice tone="warn">{dict.contracts.systemNote}</Notice>
      </PageHero>

      {/* pipeline */}
      <Section>
        <div className="max-w-3xl">
          <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
            {dict.contracts.pipelineTitle}
          </h2>
          <p className="mt-5 text-[0.9375rem] leading-relaxed text-ash">
            {dict.contracts.pipelineBody}
          </p>
        </div>

        {/* five stages, as a rail */}
        <div className="mt-12 grid gap-px border border-line bg-line lg:grid-cols-5">
          {steps.map((step, i) => (
            <div
              key={step.name}
              className="group relative flex flex-col bg-panel px-5 py-6 transition-colors duration-400 hover:bg-panel-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-mono text-ash-3">
                  / {String(i + 1).padStart(2, "0")}
                </span>
                {i < steps.length - 1 && (
                  <IconArrow className="size-3.5 text-ash-3 transition-transform duration-400 group-hover:translate-x-0.5" />
                )}
              </div>
              <h3 className="mt-5 text-[0.9375rem] font-medium tracking-tight text-chalk">
                {step.name}
              </h3>
              <p className="mt-2.5 text-[0.75rem] leading-relaxed text-ash-2">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* what validation rejects */}
      <Section className="border-t border-line" lattice>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
              {dict.contracts.validationTitle}
            </h2>
            <p className="mt-5 max-w-md text-[0.875rem] leading-relaxed text-ash">
              {dict.contracts.steps.validate.desc}
            </p>
          </div>

          <div className="lg:col-span-7">
            <ul className="divide-y divide-line border-t border-line">
              {validation.map((rule) => (
                <li key={rule} className="flex items-start gap-4 py-4">
                  {/* a cross, not a check — these are rejections */}
                  <span
                    aria-hidden
                    className="mt-1 grid size-4 shrink-0 place-items-center rounded-full border border-down/35 text-down"
                  >
                    <span className="block h-px w-2 bg-current" />
                  </span>
                  <span className="text-[0.875rem] leading-relaxed text-ash">
                    {rule}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* system registry */}
      <Section className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.contracts.systemTitle}
        </h2>

        <div className="mt-10">
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
      </Section>

      {/* verified */}
      <Section className="border-t border-line">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
              {dict.contracts.verifiedTitle}
            </h2>
            <p className="mt-4 text-[0.875rem] text-ash">
              {dict.contracts.verifiedNote}
            </p>
          </div>
          <ButtonGhost href={at(ROUTES.scanContracts)} size="sm" arrow>
            {dict.common.viewAll}
          </ButtonGhost>
        </div>

        <div className="mt-10">
          <Table minWidth="48rem">
            <THead>
              <TH>{dict.contracts.table.name}</TH>
              <TH>{dict.contracts.table.address}</TH>
              <TH>{dict.contracts.table.language}</TH>
              <TH align="right">{dict.contracts.table.deployed}</TH>
              <TH align="right">{dict.contracts.table.verified}</TH>
            </THead>
            <TBody>
              {verified.rows.map((contract) => (
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
                    <Chip
                      tone={contract.language === "Trocto" ? "neutral" : "muted"}
                    >
                      {contract.language}
                    </Chip>
                  </TD>
                  <TD align="right">
                    <BlockLink height={contract.deployedHeight} at={at} />
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
      </Section>
    </>
  );
}
