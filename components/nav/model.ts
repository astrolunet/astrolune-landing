import type { ComponentType } from "react";

import {
  IconActivity,
  IconBook,
  IconCode,
  IconCube,
  IconGithub,
  IconGlobe,
  IconLayers,
  IconMoon,
  IconNode,
  IconSearch,
  IconShield,
  IconUser,
  IconWallet,
} from "@/components/ui";
import type { Locale } from "@/lib/i18n/config";
import { localePath } from "@/lib/i18n/config";
import type { Dict } from "@/lib/i18n/dict";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
import { LINKS } from "@/lib/site";

/**
 * The navigation tree. Labels come from the dictionary, destinations from
 * `lib/routes.ts` — this file is only the join between them, so neither copy
 * nor URLs are ever written twice.
 */

type Icon = ComponentType<{ className?: string }>;

export type NavItem = {
  key: string;
  label: string;
  desc: string;
  href: string;
  icon: Icon;
  external?: boolean;
};

export type NavGroup = {
  key: string;
  label: string;
  title: string;
  blurb: string;
  cta: { label: string; href: string };
  items: NavItem[];
};

/** Groups that are a single destination rather than a panel. */
export type NavLink = { key: string; label: string; href: string };

export type Nav = {
  groups: NavGroup[];
  links: NavLink[];
  cta: {
    label: string;
    title: string;
    href: string;
    items: NavItem[];
  };
};

export function buildNav(dict: Dict, locale: Locale): Nav {
  const at = (path: string) => localePath(locale, path);
  const g = dict.nav.groups;

  return {
    groups: [
      {
        key: "network",
        label: g.network.label,
        title: g.network.title,
        blurb: g.network.blurb,
        cta: { label: g.network.cta, href: at(ROUTES.network) },
        items: [
          {
            key: "potb",
            ...g.network.items.potb,
            href: at(ROUTES.network),
            icon: IconCube,
          },
          {
            key: "architecture",
            ...g.network.items.architecture,
            href: at(DOC_ROUTES.architecture),
            icon: IconLayers,
          },
          {
            key: "validators",
            ...g.network.items.validators,
            href: at(ROUTES.validators),
            icon: IconShield,
          },
          {
            key: "status",
            ...g.network.items.status,
            href: at(ROUTES.status),
            icon: IconActivity,
          },
          {
            key: "roadmap",
            ...g.network.items.roadmap,
            href: at(DOC_ROUTES.roadmap),
            icon: IconNode,
          },
        ],
      },
      {
        key: "scan",
        label: g.scan.label,
        title: g.scan.title,
        blurb: g.scan.blurb,
        cta: { label: g.scan.cta, href: at(ROUTES.scan) },
        items: [
          {
            key: "overview",
            ...g.scan.items.overview,
            href: at(ROUTES.scan),
            icon: IconSearch,
          },
          {
            key: "blocks",
            ...g.scan.items.blocks,
            href: at(ROUTES.scanBlocks),
            icon: IconCube,
          },
          {
            key: "txs",
            ...g.scan.items.txs,
            href: at(ROUTES.scanTxs),
            icon: IconActivity,
          },
          {
            key: "accounts",
            ...g.scan.items.accounts,
            href: at(ROUTES.scanAccounts),
            icon: IconWallet,
          },
          {
            key: "contracts",
            ...g.scan.items.contracts,
            href: at(ROUTES.scanContracts),
            icon: IconCode,
          },
          {
            key: "names",
            ...g.scan.items.names,
            href: at(ROUTES.scanNames),
            icon: IconGlobe,
          },
        ],
      },
      {
        key: "build",
        label: g.build.label,
        title: g.build.title,
        blurb: g.build.blurb,
        cta: { label: g.build.cta, href: at(DOC_ROUTES.languages) },
        items: [
          {
            key: "docs",
            ...g.build.items.docs,
            href: at(ROUTES.docs),
            icon: IconBook,
          },
          {
            key: "languages",
            ...g.build.items.languages,
            href: at(DOC_ROUTES.languages),
            icon: IconCode,
          },
          {
            key: "vm",
            ...g.build.items.vm,
            href: at(DOC_ROUTES.vm),
            icon: IconCube,
          },
          {
            key: "coreApi",
            ...g.build.items.coreApi,
            href: at(DOC_ROUTES.coreApi),
            icon: IconLayers,
          },
          {
            key: "buildTest",
            ...g.build.items.buildTest,
            href: at(DOC_ROUTES.buildAndTest),
            icon: IconShield,
          },
          {
            key: "github",
            ...g.build.items.github,
            href: LINKS.githubCore,
            icon: IconGithub,
            external: true,
          },
        ],
      },
      {
        key: "use",
        label: g.use.label,
        title: g.use.title,
        blurb: g.use.blurb,
        cta: { label: g.use.cta, href: at(ROUTES.lune) },
        items: [
          {
            key: "id",
            ...g.use.items.id,
            href: at(ROUTES.id),
            icon: IconUser,
          },
          {
            key: "wallets",
            ...g.use.items.wallets,
            href: at(ROUTES.wallets),
            icon: IconWallet,
          },
          {
            key: "lune",
            ...g.use.items.lune,
            href: at(ROUTES.lune),
            icon: IconMoon,
          },
          {
            key: "dns",
            ...g.use.items.dns,
            href: at(ROUTES.dns),
            icon: IconGlobe,
          },
          {
            key: "contracts",
            ...g.use.items.contracts,
            href: at(ROUTES.contracts),
            icon: IconCode,
          },
          {
            key: "bond",
            ...g.use.items.bond,
            href: at(ROUTES.validators),
            icon: IconShield,
          },
        ],
      },
      {
        key: "discover",
        label: g.discover.label,
        title: g.discover.title,
        blurb: g.discover.blurb,
        cta: { label: g.discover.cta, href: at(ROUTES.lune) },
        items: [
          { 
            key: "about", 
            ...g.discover.items.about, 
            href: at(ROUTES.about), 
            icon: IconMoon
          },
          { 
            key: "careers", 
            ...g.discover.items.careers, 
            href: at(ROUTES.careers), 
            icon: IconMoon 
          },
          { 
            key: "blog", 
            ...g.discover.items.blog, 
            href: at(ROUTES.blog), 
            icon: IconBook 
          },
          { 
            key: "news", 
            ...g.discover.items.news, 
            href: at(ROUTES.news), 
            icon: IconBook 
          }
        ],
      },
    ],
    links: [
      { key: "docs", label: g.build.items.docs.label, href: at(ROUTES.docs) },
    ],
    cta: {
      label: dict.nav.cta.label,
      title: dict.nav.cta.title,
      href: at(ROUTES.node),
      items: [
        {
          key: "node",
          ...dict.nav.cta.items.node,
          href: at(ROUTES.node),
          icon: IconNode,
        },
        {
          key: "validator",
          ...dict.nav.cta.items.validator,
          href: at(ROUTES.validators),
          icon: IconShield,
        },
        {
          key: "github",
          ...dict.nav.cta.items.github,
          href: LINKS.github,
          icon: IconGithub,
          external: true,
        },
      ],
    },
  };
}
