"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { StatusPill } from "@/components/status-dot";
import { IconGithub, IconTelegram, IconX, Logo } from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
import { LINKS, NETWORK_LIVE, SITE } from "@/lib/site";

type FooterItem = { label: string; href: string; external?: boolean };

export function Footer() {
  const { locale, dict } = useI18n();
  const at = (path: string) => localePath(locale, path);
  const f = dict.footer;

  const columns: { heading: string; items: FooterItem[] }[] = [
    {
      heading: f.cols.protocol.heading,
      items: [
        { label: f.cols.protocol.items.potb, href: at(ROUTES.network) },
        {
          label: f.cols.protocol.items.architecture,
          href: at(DOC_ROUTES.architecture),
        },
        { label: f.cols.protocol.items.vm, href: at(DOC_ROUTES.vm) },
        { label: f.cols.protocol.items.state, href: at(DOC_ROUTES.stateModel) },
        { label: f.cols.protocol.items.crypto, href: at(DOC_ROUTES.crypto) },
      ],
    },
    {
      heading: f.cols.build.heading,
      items: [
        { label: f.cols.build.items.docs, href: at(ROUTES.docs) },
        {
          label: f.cols.build.items.languages,
          href: at(DOC_ROUTES.languages),
        },
        { label: f.cols.build.items.coreApi, href: at(DOC_ROUTES.coreApi) },
        {
          label: f.cols.build.items.buildTest,
          href: at(DOC_ROUTES.buildAndTest),
        },
        {
          label: f.cols.build.items.github,
          href: LINKS.githubCore,
          external: true,
        },
      ],
    },
    {
      heading: f.cols.network.heading,
      items: [
        { label: f.cols.network.items.scan, href: at(ROUTES.scan) },
        { label: f.cols.network.items.status, href: at(ROUTES.status) },
        { label: f.cols.network.items.validators, href: at(ROUTES.validators) },
        { label: f.cols.network.items.node, href: at(ROUTES.node) },
        { label: f.cols.network.items.contracts, href: at(ROUTES.contracts) },
      ],
    },
    {
      heading: f.cols.use.heading,
      items: [
        { label: f.cols.use.items.id, href: at(ROUTES.id) },
        { label: f.cols.use.items.wallets, href: at(ROUTES.wallets) },
        { label: f.cols.use.items.lune, href: at(ROUTES.lune) },
        { label: f.cols.use.items.dns, href: at(ROUTES.dns) },
        { label: f.cols.use.items.roadmap, href: at(DOC_ROUTES.roadmap) },
      ],
    },
    {
      heading: f.cols.project.heading,
      items: [
        { label: f.cols.project.items.about, href: at(ROUTES.about) },
        { label: f.cols.project.items.careers, href: at(ROUTES.careers) },
        { label: f.cols.project.items.blog, href: at(ROUTES.blog) },
        { label: f.cols.project.items.news, href: at(ROUTES.news) },
      ],
    },
  ];

  const socials = [
    { Icon: IconTelegram, label: dict.common.telegram, href: LINKS.telegram },
    { Icon: IconX, label: "X", href: LINKS.x },
    { Icon: IconGithub, label: dict.common.github, href: LINKS.github },
  ];

  const legal = [
    { label: dict.legal.privacy, href: at(ROUTES.legalPrivacy) },
    { label: dict.legal.terms, href: at(ROUTES.legalTerms) },
    { label: dict.legal.disclaimer, href: at(ROUTES.legalDisclaimer) },
    { label: dict.legal.cookies, href: at(ROUTES.legalCookies) },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink">
      <div className="container-rail relative">
        <div className="grid gap-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Reveal>
              <Link href={at(ROUTES.home)} className="inline-flex">
                <Logo />
              </Link>
            </Reveal>
            <Reveal delay={70}>
              <p className="mt-6 max-w-sm text-sm leading-relaxed text-ash">
                {f.blurb}
              </p>
            </Reveal>

            <Reveal delay={140}>
              <div className="mt-8 flex items-center gap-2">
                {socials.map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="grid size-10 place-items-center rounded-full border border-line text-ash-2 transition-all duration-300 hover:border-line-3 hover:bg-panel-2 hover:text-chalk"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </Reveal>

          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5 lg:col-span-8">
            {columns.map((col, ci) => (
              <Reveal key={col.heading} delay={ci * 80}>
                <p className="label-mono text-ash-3">{col.heading}</p>
                <ul className="mt-5 space-y-3.5">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      {item.external ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="group inline-flex items-center gap-1.5 text-sm text-ash transition-colors duration-300 hover:text-chalk"
                        >
                          <FooterLabel>{item.label}</FooterLabel>
                        </a>
                      ) : (
                        <Link
                          href={item.href}
                          className="group inline-flex items-center gap-1.5 text-sm text-ash transition-colors duration-300 hover:text-chalk"
                        >
                          <FooterLabel>{item.label}</FooterLabel>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>

        {/* giant wordmark, clipped at the baseline */}
        <div className="relative overflow-hidden border-t border-line pt-10">
          <Reveal>
            <p
              className="display select-none text-[clamp(3.4rem,15.5vw,13rem)] leading-[0.78] text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.17) 0%, rgba(255,255,255,0.02) 82%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
              }}
              aria-hidden
            >
              {SITE.name}
            </p>
          </Reveal>
        </div>

        <div className="flex flex-col gap-4 border-t border-line py-7 md:flex-row md:items-center md:justify-between">
          <p className="label-mono text-ash-3">{f.rights}</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {legal.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="label-mono text-ash-3 transition-colors duration-300 hover:text-chalk"
              >
                {l.label}
              </Link>
            ))}
            <StatusPill bare tone={NETWORK_LIVE ? "live" : "idle"}>
              {NETWORK_LIVE ? dict.common.mainnet : f.networkLabel}
            </StatusPill>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-chalk/50 transition-transform duration-400 group-hover:scale-x-100" />
    </span>
  );
}
