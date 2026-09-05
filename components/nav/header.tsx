"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { IdSignInButton } from "@astrolune/id";

import { useI18n } from "@/components/i18n-provider";
import { useScrolled } from "@/components/motion";
import { LocaleSwitch } from "@/components/nav/locale-switch";
import { MegaMenu } from "@/components/nav/mega-menu";
import { MobileDrawer } from "@/components/nav/mobile-drawer";
import { buildNav } from "@/components/nav/model";
import { Logo } from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";

export function Header() {
  const { locale, dict } = useI18n();
  const scrolled = useScrolled(16);
  const pathname = usePathname() ?? "/";
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = useMemo(() => buildNav(dict, locale), [dict, locale]);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const home = `/${locale}`;
  const onHome = pathname === home || pathname === `${home}/`;

  return (
    <>
      {/*
        The drawer must stay a *sibling* of the header: once the header is
        scrolled it gains `panel-glass`, whose `backdrop-filter` would turn the
        header into the containing block for any `fixed` descendant and collapse
        the drawer to zero height — the "menu sometimes doesn't open" bug.
      */}
      <header
        className={`fixed inset-x-0 top-0 z-50 h-[68px] transition-all duration-500 ${
          scrolled
            ? "panel-glass border-b border-line shadow-[0_18px_46px_-30px_rgba(0,0,0,1)]"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="container-rail flex h-full items-center justify-between gap-4">
          <Link
            href={home}
            aria-label={dict.meta.title}
            aria-current={onHome ? "page" : undefined}
            className="group -ml-1 shrink-0 rounded-full px-1 py-1 transition-opacity duration-300 hover:opacity-80"
          >
            <Logo />
          </Link>

          <MegaMenu nav={nav} />

          <div className="flex shrink-0 items-center gap-2">
            <LocaleSwitch className="hidden sm:inline-flex" />

            {/*
              Hidden below `sm` on purpose. The account menu is 19rem wide and
              the burger has to stay reachable; the mobile drawer carries the
              same control at full width instead.
            */}
            <IdSignInButton
              consoleHref={localePath(locale, ROUTES.id)}
              className="hidden sm:inline-flex"
            />

            <button
              type="button"
              aria-label={menuOpen ? dict.nav.close : dict.nav.menu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="grid size-9 place-items-center rounded-full border border-line-2 bg-panel/60 text-chalk transition-colors duration-300 hover:bg-panel-2 lg:hidden"
            >
              <span aria-hidden className="relative block h-3 w-4">
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    menuOpen ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1.5 left-0 block h-px w-full bg-current transition-opacity duration-300 ${
                    menuOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 block h-px w-full bg-current transition-all duration-300 ${
                    menuOpen ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer nav={nav} open={menuOpen} onClose={closeMenu} />
    </>
  );
}
