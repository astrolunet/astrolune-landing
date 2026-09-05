"use client";

import { useEffect, useState } from "react";

/** Hairline progress bar pinned under the header. */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-[68px] left-0 z-50 h-px bg-gradient-to-r from-ash to-chalk transition-[width] duration-150 ease-out"
      style={{ width: `${pct}%` }}
    />
  );
}
