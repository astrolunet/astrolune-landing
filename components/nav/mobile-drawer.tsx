"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IdSignInButton } from "@astrolune/id";

import { useI18n } from "@/components/i18n-provider";
import { LocaleSwitch } from "@/components/nav/locale-switch";
import type { Nav } from "@/components/nav/model";
import {
  ButtonSolid,
  IconArrow,
  IconChevron,
  IconExternal,
} from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { ROUTES } from "@/lib/routes";

/**
 * Full-height sheet for < lg. Groups are accordions built from the same
 * `grid-template-rows: 0fr → 1fr` transition the FAQ uses, so nothing here
 * measures heights or animates in JS.
 */
export function MobileDrawer({
  nav,
  open,
  onClose,
}: {
  nav: Nav;
  open: boolean;
  onClose: () => void;
}) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "/";
  const [section, setSection] = useState<string | null>(nav.groups[0]?.key ?? null);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={dict.nav.menu}
      aria-hidden={!open}
      className={`fixed inset-0 top-[68px] z-40 lg:hidden ${
        open ? "" : "pointer-events-none"
      }`}
    >
      <div
        aria-hidden
        onClick={onClose}
        className={`absolute inset-0 bg-void/70 backdrop-blur-[3px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`panel-glass absolute inset-x-0 top-0 max-h-full overflow-y-auto border-t-0 transition-all duration-400 ease-out ${
          open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <nav className="relative container-rail flex flex-col gap-1 py-5">
          {nav.groups.map((group) => {
            const expanded = section === group.key;
            return (
              <div key={group.key} className="border-b border-line last:border-0">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setSection(expanded ? null : group.key)}
                  className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
                >
                  <span className="label-mono text-chalk">{group.label}</span>
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full border border-line-2 transition-all duration-300 ${
                      expanded
                        ? "-rotate-180 bg-panel-2 text-chalk"
                        : "text-ash-2"
                    }`}
                  >
                    <IconChevron className="size-3.5" />
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-400 ease-out"
                  style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-3 text-[0.75rem] leading-relaxed text-ash-2">
                      {group.blurb}
                    </p>
                    <ul className="flex flex-col gap-0.5 pb-4">
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const inner = (
                          <>
                            <Icon className="size-4 shrink-0 text-ash-3" />
                            <span className="flex-1 text-[0.8125rem] text-chalk/90">
                              {item.label}
                            </span>
                            {item.external ? (
                              <IconExternal className="size-3 text-ash-3" />
                            ) : (
                              <IconArrow className="size-3.5 text-ash-3" />
                            )}
                          </>
                        );
                        const cn =
                          "flex items-center gap-3 rounded-lg border border-line bg-panel/60 px-3 py-2.5";
                        return (
                          <li key={item.key}>
                            {item.external ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noreferrer noopener"
                                className={cn}
                              >
                                {inner}
                              </a>
                            ) : (
                              <Link
                                href={item.href}
                                onClick={onClose}
                                className={cn}
                              >
                                {inner}
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="mt-1 flex flex-col gap-0.5 border-t border-line pt-3">
            {nav.links.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3 label-mono text-chalk"
              >
                {link.label}
                <IconArrow className="size-3.5 text-ash-3" />
              </Link>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-line pt-5">
            <span className="label-mono text-ash-3">{nav.cta.title}</span>
            <div className="flex flex-col gap-1.5">
              {nav.cta.items.map((item) => {
                const Icon = item.icon;
                const inner = (
                  <>
                    <Icon className="size-4 shrink-0 text-ash-2" />
                    <span className="flex-1">
                      <span className="block text-[0.8125rem] font-medium text-chalk">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-[0.7188rem] leading-snug text-ash-2">
                        {item.desc}
                      </span>
                    </span>
                    <IconArrow className="size-3.5 shrink-0 text-ash-3" />
                  </>
                );
                const cn =
                  "flex items-center gap-3 rounded-lg border border-line bg-panel/70 px-3.5 py-3";
                return item.external ? (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={cn}
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    className={cn}
                  >
                    {inner}
                  </Link>
                );
              })}
            </div>

            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="label-mono text-ash-3">{dict.nav.account}</span>
              {/*
                The header hides its own sign-in below `sm`, so this is the
                only account control on a phone. When signed in it becomes the
                account menu, whose panel opens inside this scroller — that is
                why the sheet scrolls rather than clipping.
              */}
              <IdSignInButton consoleHref={localePath(locale, ROUTES.id)} />
            </div>

            <div className="flex items-center justify-between gap-3 pb-3">
              <span className="label-mono text-ash-3">{dict.nav.language}</span>
              <LocaleSwitch />
            </div>

            <ButtonSolid
              href={nav.cta.href}
              size="md"
              arrow
              onClick={onClose}
              className="w-full"
            >
              {dict.common.runNode}
            </ButtonSolid>
          </div>
        </nav>
      </div>
    </div>
  );
}
