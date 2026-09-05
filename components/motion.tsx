"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ReactNode,
} from "react";

/* Shared observer factory — one per threshold, reused across all instances. */
function observe(
  el: Element,
  onEnter: () => void,
  once = true,
  threshold = 0.18,
) {
  if (typeof IntersectionObserver === "undefined") {
    onEnter();
    return () => {};
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onEnter();
          if (once) io.disconnect();
        }
      }
    },
    { threshold, rootMargin: "0px 0px -8% 0px" },
  );
  io.observe(el);
  return () => io.disconnect();
}

/* ------------------------------------------------------------------
   Reveal — fade + rise + deblur when scrolled into view
   ------------------------------------------------------------------ */
export function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => setShown(true));
  }, []);

  return (
    <Tag
      ref={ref}
      className={`will-reveal ${shown ? "is-revealed" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------
   useInView — observes the element itself, with no transform applied.
   Use this instead of <Reveal> for anything inside an `overflow-hidden`
   box: Reveal's translateY would push a short element outside the clip
   region, so it never intersects and therefore never reveals.
   ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement>(threshold = 0) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return observe(el, () => setInView(true), true, threshold);
  }, [threshold]);

  return [ref, inView] as const;
}

/* ------------------------------------------------------------------
   Counter — eases a number up once visible
   ------------------------------------------------------------------ */
export function Counter({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1900,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const run = () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
      if (reduce) {
        setValue(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // easeOutExpo
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        setValue(to * eased);
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const stop = observe(el, run, true, 0.4);
    return () => {
      stop();
      cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------
   ScrambleText — decodes characters into place on view
   ------------------------------------------------------------------ */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#$%&*+=";

export function ScrambleText({
  text,
  className = "",
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [out, setOut] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let timer: ReturnType<typeof setInterval>;

    const run = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = setInterval(() => {
        frame += 1;
        const locked = Math.floor(frame / 2);
        setOut(
          text
            .split("")
            .map((ch, i) => {
              if (i < locked || ch === " ") return ch;
              return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
            })
            .join(""),
        );
        if (locked >= text.length) clearInterval(timer);
      }, speed);
    };

    const stop = observe(el, run, true, 0.5);
    return () => {
      stop();
      clearInterval(timer);
    };
  }, [text, speed]);

  return (
    <span ref={ref} className={className}>
      {out}
    </span>
  );
}

/* ------------------------------------------------------------------
   TiltCard — pointer-tracked spotlight + subtle 3D tilt
   ------------------------------------------------------------------ */
export function TiltCard({
  children,
  className = "",
  intensity = 6,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${(0.5 - py) * intensity}deg`);
    el.style.setProperty("--ry", `${(px - 0.5) * intensity}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`group/tilt relative transition-transform duration-300 ease-out [transform:perspective(1100px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] ${className}`}
    >
      {/* pointer spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        style={{
          background:
            "radial-gradient(320px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.09), transparent 62%)",
        }}
      />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------
   useScrolled — true once the page has scrolled past `offset`
   ------------------------------------------------------------------ */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);
  return scrolled;
}

/* ------------------------------------------------------------------
   useActiveSection — highlights the nav item currently in view
   ------------------------------------------------------------------ */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id.replace("#", "")))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [ids]);
  return active;
}

/* ------------------------------------------------------------------
   Marquee — seamless infinite scroller
   ------------------------------------------------------------------ */
export function Marquee({
  children,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
}) {
  return (
    <div className={`mask-fade-edges overflow-hidden ${className}`}>
      <div
        className="flex w-max animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: "reverse" } : undefined}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
