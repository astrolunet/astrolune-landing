"use client";

import Link from "next/link";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import {
  IconActivity,
  IconArrow,
  IconCode,
  IconGlobe,
  IconSearch,
  IconShield,
  IconWallet,
  SectionLabel,
} from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";

/**
 * The surface area of the network — the pages a visitor can actually use.
 *
 * Deliberately placed after the layer bento: the layers explain what Astrolune
 * is, this explains what there is to touch. Every card is a real route with real
 * (fixture-backed) data behind it, which is why none of them says "coming soon".
 */
export function Explore() {
  const { locale, dict } = useI18n();
  const t = dict.home.explore;
  const at = (path: string) => localePath(locale, path);

  const items = [
    { ...t.items.scan, href: at(ROUTES.scan), Icon: IconSearch, id: "01" },
    {
      ...t.items.validators,
      href: at(ROUTES.validators),
      Icon: IconShield,
      id: "02",
    },
    { ...t.items.status, href: at(ROUTES.status), Icon: IconActivity, id: "03" },
    { ...t.items.wallets, href: at(ROUTES.wallets), Icon: IconWallet, id: "04" },
    { ...t.items.dns, href: at(ROUTES.dns), Icon: IconGlobe, id: "05" },
    {
      ...t.items.contracts,
      href: at(ROUTES.contracts),
      Icon: IconCode,
      id: "06",
    },
  ];

  return (
    <section
      id="explore"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >

      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="07">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
              {t.body}
            </p>
          </Reveal>
        </div>

        {/* hairline cell grid — gap-px over a line-coloured bed */}
        <div className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 70}>
              <Link
                href={item.href}
                className="group relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-500 hover:bg-panel-2"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line-2 bg-panel-3 text-ash transition-colors duration-400 group-hover:border-line-3 group-hover:text-chalk">
                    <item.Icon className="size-4.5" />
                  </span>
                  <span className="font-mono text-[0.6875rem] text-ash-3">
                    / {item.id}
                  </span>
                </div>

                <h3 className="mt-6 text-[0.9375rem] font-medium tracking-tight text-chalk">
                  {item.name}
                </h3>
                <p className="mt-2.5 flex-1 text-[0.8125rem] leading-relaxed text-ash">
                  {item.desc}
                </p>

                <span className="mt-6 flex items-center gap-2.5 label-mono text-ash-3 transition-colors duration-300 group-hover:text-chalk">
                  <span className="h-px w-6 bg-line-3 transition-all duration-400 group-hover:w-9 group-hover:bg-chalk" />
                  {dict.common.overview}
                  <IconArrow className="size-3.5 transition-transform duration-400 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
