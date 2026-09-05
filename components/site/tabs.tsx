import Link from "next/link";

/**
 * URL-driven tab rails.
 *
 * Both of these are server components on purpose. A tab that owns client state
 * cannot be linked to, bookmarked or shared, and it forces the table beneath it
 * into the client too. Routing the selection through the URL keeps every SCAN
 * and news view addressable, and keeps the data fetching on the server.
 */

export type TabItem = {
  key: string;
  label: string;
  href: string;
  /** Optional count rendered as a mono superscript. */
  count?: number;
};

/** Underlined rail — the primary navigation between SCAN views. */
export function Tabs({
  items,
  active,
}: {
  items: TabItem[];
  active: string;
}) {
  return (
    <div
      role="tablist"
      className="-mx-5 flex gap-1 overflow-x-auto border-b border-line px-5 md:mx-0 md:px-0"
    >
      {items.map((item) => {
        const on = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            role="tab"
            aria-selected={on}
            className={`group relative shrink-0 px-4 py-3 label-mono transition-colors duration-300 ${
              on ? "text-chalk" : "text-ash-2 hover:text-chalk"
            }`}
          >
            {item.label}
            {item.count !== undefined && (
              <span className="ml-1.5 align-super text-[0.5625rem] text-ash-3">
                {item.count.toLocaleString("en-US")}
              </span>
            )}
            <span
              aria-hidden
              className={`absolute inset-x-3 -bottom-px h-px origin-center bg-chalk transition-transform duration-400 ${
                on ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
            />
          </Link>
        );
      })}
    </div>
  );
}

/** Pill rail — secondary filtering, as on the news index and validator set. */
export function FilterChips({
  items,
  active,
}: {
  items: TabItem[];
  active: string;
}) {
  return (
    <div className="-mx-5 flex flex-wrap gap-2 px-5 md:mx-0 md:px-0">
      {items.map((item) => {
        const on = item.key === active;
        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={on ? "true" : undefined}
            className={`shrink-0 rounded-full border px-4 py-2 label-mono transition-all duration-300 ${
              on
                ? "border-transparent bg-chalk text-void"
                : "border-line-2 bg-panel/60 text-ash-2 hover:border-line-3 hover:bg-panel-2 hover:text-chalk"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
