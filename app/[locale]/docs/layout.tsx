import type { ReactNode } from "react";

import { DocsMobileNav } from "@/components/docs/mobile-nav";
import { DocsSidebar } from "@/components/docs/sidebar";

/**
 * The docs shell: a persistent tree on the left, content on the right.
 *
 * The sidebar is `sticky` inside a tall grid column rather than `fixed`, so it
 * scrolls with short pages and pins on long ones without any measurement. It
 * lives in a layout so navigating between specification pages never re-mounts or
 * re-collapses the tree.
 */
export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pt-[68px]">
      <div className="container-rail">
        <div className="grid gap-10 lg:grid-cols-[15.5rem_minmax(0,1fr)] lg:gap-14">
          {/* rail */}
          <div className="pt-8 lg:pt-12">
            <div className="lg:sticky lg:top-[92px] lg:max-h-[calc(100svh-7rem)] lg:overflow-y-auto lg:pr-2">
              <div className="hidden lg:block">
                <DocsSidebar />
              </div>
              <DocsMobileNav />
            </div>
          </div>

          {/* content */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
