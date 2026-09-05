"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import type { Nav, NavGroup, NavItem } from "@/components/nav/model";
import {
  CornerTicks,
  IconArrow,
  IconChevron,
  IconExternal,
} from "@/components/ui";

/**
 * Desktop navigation: a row of triggers over one shared panel.
 *
 * The panel is a single animated container rather than one per group, so moving
 * from "Network" to "Build" re-flows the height instead of closing and
 * reopening. Height comes from the `grid-template-rows: 0fr → 1fr` trick, which
 * animates to intrinsic content height without measuring anything in JS.
 */
export function MegaMenu({ nav }: { nav: Nav }) {
  const { dict } = useI18n();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };

  const show = useCallback((key: string) => {
    cancel();
    setOpen(key);
  }, []);

  const hide = useCallback((delay = 140) => {
    cancel();
    timer.current = setTimeout(() => setOpen(null), delay);
  }, []);

  // A route change means the click landed — the panel should not survive it.
  useEffect(() => {
    cancel();
    setOpen(null);
  }, [pathname]);

  useEffect(() => cancel, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      rowRef.current
        ?.querySelector<HTMLButtonElement>(`[data-group="${open}"]`)
        ?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const active = nav.groups.find((g) => g.key === open) ?? null;
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div
        ref={rowRef}
        className="hidden items-center gap-0.5 lg:flex"
        onMouseEnter={cancel}
        onMouseLeave={() => hide()}
      >
        {nav.groups.map((group) => {
          const isOpen = open === group.key;
          return (
            <button
              key={group.key}
              type="button"
              data-group={group.key}
              aria-expanded={isOpen}
              aria-controls="nav-mega-panel"
              onMouseEnter={() => show(group.key)}
              onFocus={() => show(group.key)}
              onClick={() => (isOpen ? setOpen(null) : show(group.key))}
              className={`group relative inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 label-mono transition-colors duration-300 ${
                isOpen ? "text-chalk" : "text-ash-2 hover:text-chalk"
              }`}
            >
              {group.label}
              <IconChevron
                className={`size-3 text-ash-3 transition-transform duration-300 ${
                  isOpen ? "-rotate-180 text-ash" : ""
                }`}
              />
              <span
                aria-hidden
                className={`absolute inset-x-2.5 -bottom-px h-px origin-center bg-chalk/70 transition-transform duration-400 ${
                  isOpen ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          );
        })}

        {nav.links.map((link) => (
          <Link
            key={link.key}
            href={link.href}
            onMouseEnter={() => hide(0)}
            className={`relative rounded-full px-3.5 py-2 label-mono transition-colors duration-300 ${
              isCurrent(link.href)
                ? "text-chalk"
                : "text-ash-2 hover:text-chalk"
            }`}
          >
            {link.label}
            <span
              aria-hidden
              className={`absolute inset-x-2.5 -bottom-px h-px origin-center bg-chalk/70 transition-transform duration-400 ${
                isCurrent(link.href) ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </Link>
        ))}
      </div>

      {/* Backdrop — dims the page and swallows the click that closes.
          Anchored to the header with `absolute` rather than `fixed`: when the
          header is scrolled it gains `panel-glass`, whose `backdrop-filter`
          retargets `fixed` descendants to the 68px header box, which used to
          collapse this overlay (and its dimming) to zero height. */}
      <div
        aria-hidden
        onClick={() => setOpen(null)}
        className={`absolute inset-x-0 top-full -z-10 hidden h-[100vh] bg-void/90 backdrop-blur-[3px] transition-opacity duration-300 lg:block ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="nav-mega-panel"
        onMouseEnter={cancel}
        onMouseLeave={() => hide()}
        className={`absolute inset-x-0 top-full hidden overflow-hidden border-b border-line transition-[grid-template-rows,opacity] duration-300 ease-out lg:grid ${
          open
            ? "panel-glass opacity-100"
            : "pointer-events-none border-transparent opacity-0"
        }`}
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="min-h-0">
          {active && (
            <div className="relative">
              <div className="container-rail relative grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.7fr)_minmax(0,0.8fr)] gap-x-10 py-9">
                <GroupRail group={active} />
                <div className="grid grid-cols-2 gap-1.5 border-x border-line px-9">
                  {active.items.map((item, i) => (
                    <ItemCard
                      key={item.key}
                      item={item}
                      current={!item.external && isCurrent(item.href)}
                      index={i}
                    />
                  ))}
                </div>
                <ActionRail
                  title={nav.cta.title}
                  items={nav.cta.items}
                  note={dict.common.preLaunchNotice}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function GroupRail({ group }: { group: NavGroup }) {
  return (
    <div className="flex flex-col justify-between gap-6 pr-2">
      <div>
        <h2 className="display max-w-[15ch] text-[1.35rem] text-chalk">
          {group.title}
        </h2>
        <p className="mt-3.5 max-w-[34ch] text-[0.8125rem] leading-relaxed text-ash-2">
          {group.blurb}
        </p>
      </div>
      <Link
        href={group.cta.href}
        className="group inline-flex items-center gap-2.5 label-mono text-ash transition-colors duration-300 hover:text-chalk"
      >
        <span className="h-px w-6 bg-line-3 transition-all duration-400 group-hover:w-9 group-hover:bg-chalk" />
        {group.cta.label}
        <IconArrow className="size-3.5 transition-transform duration-400 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function ItemCard({
  item,
  current,
  index,
}: {
  item: NavItem;
  current: boolean;
  index: number;
}) {
  const Icon = item.icon;
  const inner = (
    <>
      <span
        className={`mt-px grid size-8 shrink-0 place-items-center rounded-lg border transition-colors duration-300 ${
          current
            ? "border-line-3 bg-chalk text-void"
            : "border-line bg-panel-2 text-ash-2 group-hover:border-line-2 group-hover:text-chalk"
        }`}
      >
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span
            className={`truncate text-[0.8125rem] font-medium transition-colors duration-300 ${
              current ? "text-chalk" : "text-chalk/90"
            }`}
          >
            {item.label}
          </span>
          {item.external && (
            <IconExternal className="size-3 shrink-0 text-ash-3" />
          )}
        </span>
        <span className="mt-1 block text-[0.75rem] leading-snug text-ash-2">
          {item.desc}
        </span>
      </span>
    </>
  );

  const className =
    "group relative flex items-start gap-3 rounded-lg border border-transparent px-3 py-2.5 transition-all duration-300 hover:border-line hover:bg-panel-2";
  const style = { animationDelay: `${index * 32}ms` };

  return item.external ? (
    <a
      href={item.href}
      target="_blank"
      rel="noreferrer noopener"
      className={className}
      style={style}
    >
      {inner}
    </a>
  ) : (
    <Link href={item.href} className={className} style={style}>
      {inner}
      {current && (
        <span
          aria-hidden
          className="absolute top-1/2 -left-px h-5 w-px -translate-y-1/2 bg-chalk"
        />
      )}
    </Link>
  );
}

/**
 * The pinned rail that replaces "Launch app". Astrolune has no app to launch —
 * what a visitor can actually do is run a node, work toward validator, or read
 * the source.
 */
function ActionRail({
  title,
  items,
  note,
}: {
  title: string;
  items: NavItem[];
  note: string;
}) {
  return (
    <div className="flex flex-col gap-3 pl-2">
      <span className="label-mono text-ash-3">{title}</span>
      <div className="flex flex-col gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const inner = (
            <>
              <CornerTicks className="inset-0" />
              <span className="flex items-center gap-2.5">
                <Icon className="size-4 shrink-0 text-ash-2 transition-colors duration-300 group-hover:text-chalk" />
                <span className="text-[0.8125rem] font-medium text-chalk">
                  {item.label}
                </span>
              </span>
              <span className="mt-1.5 block text-[0.7188rem] leading-snug text-ash-2">
                {item.desc}
              </span>
              <IconArrow className="absolute top-3.5 right-3 size-3.5 text-ash-3 transition-all duration-400 group-hover:translate-x-0.5 group-hover:text-chalk" />
            </>
          );
          const className =
            "group relative rounded-lg border border-line bg-panel/70 px-3.5 py-3 transition-all duration-300 hover:border-line-2 hover:bg-panel-2";

          return item.external ? (
            <a
              key={item.key}
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className={className}
            >
              {inner}
            </a>
          ) : (
            <Link key={item.key} href={item.href} className={className}>
              {inner}
            </Link>
          );
        })}
      </div>
      <p className="mt-auto border-t border-line pt-3 text-[0.6875rem] leading-relaxed text-ash-3">
        {note}
      </p>
    </div>
  );
}
