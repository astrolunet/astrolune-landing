import type { Metadata } from "next";
import Link from "next/link";
import {
  IdAuthWidget,
  IdConsole,
  IdIconGlobe,
  IdIconLayers,
  IdIconNode,
  IdIconRoute,
  IdIconShield,
  IdIconWallet,
} from "@astrolune/id";

import {
  InfoList,
  InfoRow,
  Notice,
  PageHero,
  Panel,
  PanelHead,
  Section,
  SectionHead,
} from "@/components/site/chrome";
import {
  ButtonGhost,
  IconArrow,
  IconMoon,
  IconUser,
} from "@/components/ui";
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
    title: dict.id.title,
    description: dict.id.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.id),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.id)]),
      ),
    },
  };
}

/** Both snippets are copy-paste literal, so they live outside the component. */
const INSTALL = "npm i @astrolune/id";

const USAGE = `import { AstroluneIdProvider, IdSignInButton } from "@astrolune/id";

export default function RootLayout({ children }) {
  return (
    <AstroluneIdProvider locale="en">
      <header>
        <IdSignInButton consoleHref="/id" />
      </header>
      {children}
    </AstroluneIdProvider>
  );
}`;

export default async function IdPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);
  const t = dict.id;

  const capabilities = [
    { key: "identity", Icon: IconUser, ...t.capabilities.identity },
    { key: "wallets", Icon: IdIconWallet, ...t.capabilities.wallets },
    { key: "domains", Icon: IdIconGlobe, ...t.capabilities.domains },
    { key: "share", Icon: IdIconLayers, ...t.capabilities.share },
    { key: "proxy", Icon: IdIconRoute, ...t.capabilities.proxy },
    { key: "nodes", Icon: IdIconNode, ...t.capabilities.nodes },
    { key: "validator", Icon: IdIconShield, ...t.capabilities.validator },
    { key: "payment", Icon: IconMoon, ...t.capabilities.payment },
  ];

  const docLinks = [
    { ...t.docLinks.overview, href: at(DOC_ROUTES.idOverview) },
    { ...t.docLinks.sdk, href: at(DOC_ROUTES.idSdk) },
    { ...t.docLinks.ui, href: at(DOC_ROUTES.idUiKit) },
  ];

  return (
    <>
      {/* <PageHero
        crumbs={[{ label: t.title }]}
        title={t.title}
        subtitle={t.subtitle}
        wide
        aside={
          <ButtonGhost href={at(DOC_ROUTES.idOverview)} size="sm" arrow>
            {t.docsCta}
          </ButtonGhost>
        }
      >
        <Notice tone="warn">{t.prototypeNotice}</Notice>
      </PageHero> */}

      {/* what one account holds */}
      {/* <Section>
        <SectionHead index="01" label={t.title} title={t.accountTitle} body={t.accountBody} />

        <div className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map(({ key, Icon, name, desc }) => (
            <div
              key={key}
              className="group flex flex-col bg-panel px-5 py-6 transition-colors duration-400 hover:bg-panel-2"
            >
              <Icon className="size-5 text-ash-2 transition-colors duration-400 group-hover:text-chalk" />
              <h3 className="mt-5 text-[0.9375rem] font-medium tracking-tight text-chalk">
                {name}
              </h3>
              <p className="mt-2.5 text-[0.75rem] leading-relaxed text-ash-2">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </Section> */}

      {/* sign in — the widget beside what the session actually is */}
      {/* <Section className="border-t border-line" lattice>
        <SectionHead index="02" label={t.signInTitle} title={t.signInTitle} body={t.signInBody} />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <IdAuthWidget consoleHref={at(ROUTES.id)} />
          </div>

          <div className="lg:col-span-7">
            <Panel>
              <PanelHead title={t.sessionTitle} note={t.sdkNote} />
              <div className="mt-5">
                <InfoList>
                  <InfoRow label={t.session.storage.label} mono>
                    {t.session.storage.value}
                  </InfoRow>
                  <InfoRow label={t.session.backend.label} mono>
                    {t.session.backend.value}
                  </InfoRow>
                  <InfoRow label={t.session.signature.label} mono>
                    {t.session.signature.value}
                  </InfoRow>
                  <InfoRow label={t.session.reset.label} mono>
                    {t.session.reset.value}
                  </InfoRow>
                </InfoList>
              </div>
            </Panel>
          </div>
        </div>
      </Section> */}

      {/*
        The console asks for the wide rail: it is a seven-panel dashboard with
        tables in it, and the reading-width rail would put a scroller inside
        every one of them.
      */}
      <Section className="border-t border-line" wide>
        <SectionHead index="01" label={t.consoleTitle} title={t.consoleTitle} body={t.consoleBody} />
        <div className="mt-12">
          <IdConsole />
        </div>
      </Section>

      {/* integration */}
      <Section className="border-t border-line">
        <SectionHead index="02" label={t.sdkTitle} title={t.sdkTitle} body={t.sdkBody} />

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="label-mono text-ash-3">{t.installLabel}</p>
            <pre className="mt-4 overflow-x-auto rounded-xl border border-line bg-panel/70 p-5 text-[0.8125rem] leading-relaxed text-chalk">
              <code>{INSTALL}</code>
            </pre>
            <pre className="mt-3 overflow-x-auto rounded-xl border border-line bg-panel/70 p-5 text-[0.8125rem] leading-relaxed text-ash">
              <code>{USAGE}</code>
            </pre>
          </div>

          <div className="lg:col-span-5">
            <ul className="flex flex-col gap-1.5">
              {docLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-4 rounded-xl border border-line bg-panel/60 px-4 py-3.5 transition-colors duration-300 hover:bg-panel-2"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-[0.875rem] text-chalk">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-[0.75rem] leading-snug text-ash-2">
                        {link.desc}
                      </span>
                    </span>
                    <IconArrow className="size-3.5 shrink-0 text-ash-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
