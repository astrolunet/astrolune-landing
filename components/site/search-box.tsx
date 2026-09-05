"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { IconSearch } from "@/components/ui";
import { ROUTES } from "@/lib/routes";

/**
 * The SCAN search box.
 *
 * It does not resolve anything itself — it navigates to `/scan/search?q=…`,
 * which resolves the query on the server through `api.search()` and redirects to
 * whatever the query turned out to identify. Keeping the resolution server-side
 * means the client bundle never has to know what a valid address looks like, and
 * a shared search URL works.
 */
export function SearchBox({
  size = "lg",
  initial = "",
}: {
  size?: "md" | "lg";
  initial?: string;
}) {
  const { dict, href } = useI18n();
  const router = useRouter();
  const [value, setValue] = useState(initial);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim();
    if (!query) return;
    router.push(
      `${href(ROUTES.scanSearch)}?q=${encodeURIComponent(query.toLowerCase())}`,
    );
  };

  const tall = size === "lg";

  return (
    <form onSubmit={submit} role="search" className="w-full">
      <div
        className={`group flex items-center gap-3 rounded-full border border-line-2 bg-panel/70 backdrop-blur transition-all duration-300 focus-within:border-line-3 focus-within:bg-panel-2 hover:border-line-3 ${
          tall ? "py-2 pr-2 pl-5" : "py-1.5 pr-1.5 pl-4"
        }`}
      >
        <IconSearch className="size-4 shrink-0 text-ash-3 transition-colors duration-300 group-focus-within:text-ash" />

        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={dict.scan.searchPlaceholder}
          aria-label={dict.scan.searchPlaceholder}
          spellCheck={false}
          autoComplete="off"
          className={`min-w-0 flex-1 bg-transparent font-mono text-chalk placeholder:text-ash-3 focus:outline-none ${
            tall ? "text-[0.875rem]" : "text-[0.8125rem]"
          }`}
        />

        <button
          type="submit"
          className={`shrink-0 rounded-full bg-chalk label-mono text-void transition-all duration-300 hover:bg-white hover:shadow-[0_0_28px_-6px_rgba(255,255,255,0.5)] ${
            tall ? "px-5 py-2.5" : "px-4 py-2"
          }`}
        >
          {dict.common.search}
        </button>
      </div>

      <p className="mt-3 pl-5 text-[0.75rem] text-ash-3">{dict.scan.searchHint}</p>
    </form>
  );
}
