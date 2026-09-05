import type { Metadata } from "next";

import { AddressInspector } from "@/components/site/address-inspector";
import {
  Notice,
  PageHero,
  Panel,
  Section,
  StatGrid,
} from "@/components/site/chrome";
import { StatusPill, type Tone } from "@/components/status-dot";
import { ButtonGhost, Chip, IconWallet } from "@/components/ui";
import { ADDR_BODY, ADDR_PREFIX } from "@/lib/data/rng";
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
    title: dict.wallets.title,
    description: dict.wallets.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.wallets),
      languages: Object.fromEntries(
        LOCALES.map((l) => [
          LOCALE_META[l].htmlLang,
          localePath(l, ROUTES.wallets),
        ]),
      ),
    },
  };
}

/** Maps a wallet's readiness onto a status tone and a dictionary label. */
const STATUS: Record<string, { tone: Tone; key: "planned" | "notStarted" | "deferred" }> =
  {
    notStarted: { tone: "muted", key: "notStarted" },
    planned: { tone: "warn", key: "planned" },
    deferred: { tone: "idle", key: "deferred" },
  };

export default async function WalletsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const items = [
    dict.wallets.items.cli,
    dict.wallets.items.keystore,
    dict.wallets.items.extension,
    dict.wallets.items.mobile,
    dict.wallets.items.hardware,
  ];

  const fields = [
    { label: dict.wallets.fields.length, value: "32 bytes" },
    { label: dict.wallets.fields.derivation, value: "SHA-256 · AL_TAG_ADDRESS" },
    {
      label: dict.wallets.fields.encoding,
      value: `${ADDR_PREFIX} + ${ADDR_BODY} hex`,
    },
    { label: dict.wallets.fields.checksum, value: "—" },
  ];

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.wallets.title }]}
        title={dict.wallets.title}
        subtitle={dict.wallets.subtitle}
        aside={<StatusPill tone="warn">{dict.common.comingSoon}</StatusPill>}
      >
        <Notice tone="warn">{dict.wallets.securityBody}</Notice>
      </PageHero>

      {/* address format */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
              {dict.wallets.addressTitle}
            </h2>
            <p className="mt-5 max-w-md text-[0.9375rem] leading-relaxed text-ash">
              {dict.wallets.addressBody}
            </p>
            <div className="mt-8">
              <ButtonGhost href={at(DOC_ROUTES.crypto)} size="sm" arrow>
                {dict.footer.cols.protocol.items.crypto}
              </ButtonGhost>
            </div>
          </div>

          <div className="lg:col-span-7">
            <StatGrid stats={fields.map((f) => ({ label: f.label, value: f.value }))} columns={2} />
          </div>
        </div>
      </Section>

      {/* inspector */}
      <Section className="border-t border-line" lattice>
        <div className="max-w-2xl">
          <AddressInspector />
        </div>
      </Section>

      {/* wallet software */}
      <Section className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.wallets.listTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
          {dict.wallets.listNote}
        </p>

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2">
          {items.map((item) => {
            const meta = STATUS[item.status] ?? STATUS.planned;
            return (
              <div
                key={item.name}
                className="group flex flex-col bg-panel px-6 py-6 transition-colors duration-400 hover:bg-panel-2"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line-2 bg-panel-3 text-ash transition-colors duration-400 group-hover:text-chalk">
                    <IconWallet className="size-4.5" />
                  </span>
                  <StatusPill tone={meta.tone} bare>
                    {dict.common[meta.key]}
                  </StatusPill>
                </div>
                <h3 className="mt-6 text-[0.9375rem] font-medium tracking-tight text-chalk">
                  {item.name}
                </h3>
                <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ash">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </Section>

      {/* security */}
      <Section className="border-t border-line">
        <Panel ticks className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <Chip tone="warn">{dict.status.services.stub}</Chip>
            <h2 className="text-lg font-medium tracking-tight text-chalk">
              {dict.wallets.securityTitle}
            </h2>
          </div>
          <p className="mt-5 text-[0.875rem] leading-relaxed text-ash">
            {dict.wallets.securityBody}
          </p>
          <div className="mt-8">
            <ButtonGhost href={at(DOC_ROUTES.crypto)} size="sm" arrow>
              {dict.common.readDocs}
            </ButtonGhost>
          </div>
        </Panel>
      </Section>
    </>
  );
}
