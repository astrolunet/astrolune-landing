"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { DocsSidebar } from "@/components/docs/sidebar";
import { useI18n } from "@/components/i18n-provider";
import { IconChevron } from "@/components/ui";

/**
 * The docs sidebar in a bottom sheet, for viewports too narrow for the rail.
 *
 * A route change closes it, because on mobile the whole point of opening the
 * tree is to pick a page and leave. Body scroll is locked while it is open so
 * the sheet does not scroll the page behind it.
 */
export function DocsMobileNav() {
  const { dict } = useI18n();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 rounded-full border border-line-2 bg-panel/60 px-5 py-3 label-mono text-chalk transition-colors duration-300 hover:bg-panel-2"
      >
        {dict.docs.title}
        <IconChevron className="size-3.5 text-ash-2" />
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label={dict.docs.title}
        aria-hidden={!open}
        className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`}
      >
        <div
          aria-hidden
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-void/80 backdrop-blur-[3px] transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`panel-glass absolute inset-x-0 bottom-0 max-h-[82vh] overflow-y-auto rounded-t-2xl border-b-0 px-5 pt-5 pb-10 transition-transform duration-400 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div
            aria-hidden
            className="mx-auto mb-5 h-1 w-10 rounded-full bg-line-3"
          />
          <DocsSidebar onNavigate={() => setOpen(false)} />
        </div>
      </div>
    </div>
  );
}
