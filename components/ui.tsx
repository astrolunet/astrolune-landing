import Link from "next/link";
import type { ReactNode } from "react";

/* ------------------------------------------------------------------
   LogoMark — the dot-matrix moon, rebuilt as an animated SVG.

   An 8×8 grid of dots whose radii swell through the moon phases
   (crescent → ring → full), traced frame-by-frame from the animated
   reference. Diameters live on the same 16-unit grid as the dots, so
   the tables below are the measured pixel diameters, halved at render.
   ------------------------------------------------------------------ */
const MOON_FRAMES: number[][][] = [
  [
    [4, 5, 4, 3, 4, 4, 4, 4],
    [5, 7, 7, 11, 11, 11, 11, 4],
    [3, 3, 7, 11, 11, 11, 11, 4],
    [5, 5, 7, 7, 11, 11, 11, 4],
    [5, 5, 4, 7, 7, 11, 11, 4],
    [5, 5, 4, 4, 7, 8, 8, 4],
    [5, 5, 4, 4, 4, 4, 8, 4],
    [4, 5, 4, 4, 4, 4, 4, 4],
  ],
  [
    [3, 3, 3, 3, 3, 4, 4, 4],
    [4, 7, 7, 7, 7, 7, 8, 4],
    [4, 7, 11, 11, 11, 11, 7, 4],
    [4, 7, 11, 4, 4, 11, 8, 4],
    [4, 7, 11, 4, 4, 11, 7, 4],
    [4, 7, 11, 11, 11, 11, 8, 4],
    [4, 7, 7, 7, 7, 7, 8, 4],
    [4, 5, 5, 4, 4, 4, 4, 4],
  ],
  [
    [4, 5, 4, 3, 4, 4, 4, 4],
    [5, 4, 7, 7, 7, 7, 4, 4],
    [3, 8, 7, 11, 11, 7, 7, 4],
    [5, 7, 11, 11, 11, 11, 7, 4],
    [5, 7, 11, 11, 11, 11, 7, 4],
    [5, 7, 7, 11, 11, 7, 7, 4],
    [5, 5, 7, 7, 7, 7, 4, 4],
    [4, 5, 4, 4, 4, 4, 4, 4],
  ],
];

export function LogoMark({ className = "" }: { className?: string }) {
  const radii = MOON_FRAMES.map((frame) =>
    frame.map((row) => row.map((d) => d / 2)),
  );
  return (
    <svg
      viewBox="0 0 128 128"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      {radii[0].map((row, j) =>
        row.map((r0, i) => (
          <circle key={`${i}-${j}`} cx={8 + i * 16} cy={8 + j * 16} r={r0}>
            <animate
              attributeName="r"
              dur="4.2s"
              repeatCount="indefinite"
              calcMode="spline"
              keyTimes="0;0.24;0.48;0.74;1"
              keySplines="0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1;0.45 0 0.25 1"
              values={`${r0};${radii[1][j][i]};${radii[2][j][i]};${radii[2][j][i]};${r0}`}
            />
          </circle>
        )),
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------
   Logo — the animated dot-matrix mark + the squared wordmark
   ------------------------------------------------------------------ */
export function Logo({
  className = "",
  wordmark = true,
}: {
  className?: string;
  wordmark?: boolean;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark className="size-[26px] shrink-0 text-chalk" />
      {wordmark && (
        <span className="display text-[1.0625rem] tracking-[0.02em] text-chalk">
          Astrolune
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------
   Buttons — full pills. Cards and panels keep their 10-12px radius;
   anything clickable is rounded-full, which is what stops them reading
   as raw HTML controls.
   ------------------------------------------------------------------ */
type ButtonSize = "sm" | "md" | "lg";

const SIZES: Record<ButtonSize, string> = {
  sm: "h-7 px-4 text-[0.625rem]",
  md: "h-[37px] px-6",
  lg: "h-[41px] px-7",
};

const ARROW_SIZES: Record<ButtonSize, string> = {
  sm: "size-5 -mr-1.5 ml-1.5",
  md: "size-6 -mr-3 ml-2.5",
  lg: "size-7 -mr-3.5 ml-3",
};

type ButtonProps = {
  children: ReactNode;
  href?: string;
  size?: ButtonSize;
  arrow?: boolean;
  external?: boolean;
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

/** Renders a Link for internal hrefs and an anchor for external ones. */
function Anchor({
  href,
  external,
  className,
  onClick,
  ariaLabel,
  children,
}: {
  href: string;
  external?: boolean;
  className: string;
  onClick?: () => void;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const isExternal = external ?? /^(https?:|mailto:|#)/.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        onClick={onClick}
        className={className}
        {...(href.startsWith("http")
          ? { target: "_blank", rel: "noreferrer noopener" }
          : {})}
      >
        {children}
      </a>
    );
  }
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      className={className}
    >
      {children}
    </Link>
  );
}

export function ButtonSolid({
  children,
  href = "#",
  size = "lg",
  arrow = false,
  external,
  className = "",
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <Anchor
      href={href}
      external={external}
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-transparent bg-chalk label-mono text-void transition-all duration-300 hover:bg-white hover:shadow-[0_0_38px_-6px_rgba(255,255,255,0.55)] ${SIZES[size]} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center">
        {children}
        {arrow && (
          <span
            aria-hidden
            className={`grid shrink-0 place-items-center rounded-full bg-void/12 text-void transition-transform duration-400 group-hover:translate-x-0.5 ${ARROW_SIZES[size]}`}
          >
            <IconArrow className="size-3.5" />
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-black/12 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]"
      />
    </Anchor>
  );
}

export function ButtonGhost({
  children,
  href = "#",
  size = "lg",
  arrow = false,
  external,
  className = "",
  onClick,
  ariaLabel,
}: ButtonProps) {
  return (
    <Anchor
      href={href}
      external={external}
      onClick={onClick}
      ariaLabel={ariaLabel}
      className={`group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-line-2 bg-panel/60 label-mono text-chalk transition-all duration-300 hover:border-line-3 hover:bg-panel-2 ${SIZES[size]} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center">
        {children}
        {arrow && (
          <span
            aria-hidden
            className={`grid shrink-0 place-items-center rounded-full border border-line-2 text-ash transition-all duration-400 group-hover:border-line-3 group-hover:bg-chalk group-hover:text-void ${ARROW_SIZES[size]}`}
          >
            <IconArrow className="size-3.5" />
          </span>
        )}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/12 to-transparent transition-transform duration-700 group-hover:translate-x-[130%]"
      />
    </Anchor>
  );
}

/** Round hairline affordance — pagination, copy, dismiss. */
export function ButtonIcon({
  children,
  href,
  onClick,
  ariaLabel,
  disabled = false,
  className = "",
  size = "size-9",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  disabled?: boolean;
  className?: string;
  size?: string;
}) {
  const shared = `grid ${size} shrink-0 place-items-center rounded-full border border-line-2 bg-panel/60 text-ash transition-all duration-300 ${
    disabled
      ? "pointer-events-none opacity-35"
      : "hover:border-line-3 hover:bg-panel-2 hover:text-chalk"
  } ${className}`;

  if (href && !disabled) {
    return (
      <Anchor href={href} ariaLabel={ariaLabel} className={shared}>
        {children}
      </Anchor>
    );
  }
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={shared}
    >
      {children}
    </button>
  );
}

/** Small pill used for tags, types and levels. Neutral by default. */
export function Chip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "muted" | "solid" | "warn";
  className?: string;
}) {
  const tones = {
    neutral: "border-line-2 bg-panel-2 text-chalk",
    muted: "border-line bg-panel text-ash-2",
    solid: "border-transparent bg-chalk text-void",
    warn: "border-warn/25 bg-warn/8 text-warn",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------
   CornerTicks — bracket marks on card corners
   ------------------------------------------------------------------ */
export function CornerTicks({ className = "" }: { className?: string }) {
  const base =
    "absolute size-[7px] border-chalk/25 transition-all duration-500 group-hover:border-chalk/70";
  return (
    <span aria-hidden className={`pointer-events-none ${className}`}>
      <span className={`${base} -top-px -left-px border-t border-l`} />
      <span className={`${base} -top-px -right-px border-t border-r`} />
      <span className={`${base} -bottom-px -left-px border-b border-l`} />
      <span className={`${base} -right-px -bottom-px border-r border-b`} />
    </span>
  );
}

/* ------------------------------------------------------------------
   SectionLabel — "/ 02 — NETWORK" eyebrow
   ------------------------------------------------------------------ */
export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 label-mono text-ash-2">
      <span className="text-ash-3">/ {index}</span>
      <span className="h-px w-8 bg-line-2" />
      <span className="text-ash">{children}</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Slash separators seen under reference cards: "//"
   ------------------------------------------------------------------ */
export function Slashes({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`label-mono text-ash-3 ${className}`}>
      //
    </span>
  );
}

/* ------------------------------------------------------------------
   Icons — hairline stroke set
   ------------------------------------------------------------------ */
type IconProps = { className?: string };

export function IconCube({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 2.6 21 7.4v9.2L12 21.4 3 16.6V7.4L12 2.6Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M3 7.4 12 12m0 9.4V12m9-4.6L12 12"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMoon({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 14.2A8.6 8.6 0 0 1 9.8 4 8.6 8.6 0 1 0 20 14.2Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCheck({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m5 12.6 4.4 4.4L19 7.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSpinner({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconClock({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M12 7.6V12l3.2 2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconArrow({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h13m0 0-5.2-5.2M18 12l-5.2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconChevron({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m7.5 10 4.5 4.5L16.5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconExternal({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M14 5h5v5M19 5l-7.4 7.4M17 14.5V18a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8.5A1.5 1.5 0 0 1 6 7h3.5"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconSearch({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="10.8" cy="10.8" r="6.3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="m15.6 15.6 3.9 3.9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCopy({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="9"
        y="9"
        width="10.5"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M15 6.2A1.7 1.7 0 0 0 13.3 4.5H6.2A1.7 1.7 0 0 0 4.5 6.2v7.1A1.7 1.7 0 0 0 6.2 15"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconBook({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 5.2A1.7 1.7 0 0 1 5.7 3.5H10a2 2 0 0 1 2 2v13a1.6 1.6 0 0 0-1.6-1.6H4V5.2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M20 5.2a1.7 1.7 0 0 0-1.7-1.7H14a2 2 0 0 0-2 2v13a1.6 1.6 0 0 1 1.6-1.6H20V5.2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconNode({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.4" cy="5.4" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.6" cy="5.4" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.4" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.6" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="m6 6.8 3.9 3.6M18 6.8l-3.9 3.6M6 17.2l3.9-3.6M18 17.2l-3.9-3.6"
        stroke="currentColor"
        strokeWidth="1.05"
      />
    </svg>
  );
}

export function IconShield({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2 19 5.8v5.5c0 4-2.8 7.4-7 9.5-4.2-2.1-7-5.5-7-9.5V5.8L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="m8.9 12.1 2.2 2.2 4-4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconWallet({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.2"
        y="6"
        width="17.6"
        height="12.6"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path d="M3.2 10.4h17.6" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="16.6" cy="14.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function IconCode({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m9 8-4 4 4 4m6-8 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconGlobe({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M3.4 12h17.2M12 3.4c2.3 2.3 3.4 5.2 3.4 8.6S14.3 18.3 12 20.6c-2.3-2.3-3.4-5.2-3.4-8.6S9.7 5.7 12 3.4Z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </svg>
  );
}

export function IconActivity({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3 12.5h3.6l2.2-6 3.4 12 2.6-8 1.7 2h4.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Identity. A shoulder line inside a frame, not a portrait bust. */
export function IconUser({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.4"
        y="3.4"
        width="17.2"
        height="17.2"
        rx="2.4"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <circle cx="12" cy="10.2" r="2.6" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M7.4 17.9a4.9 4.9 0 0 1 9.2 0"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLayers({ className = "size-5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m12 3.4 8.4 4.3-8.4 4.3-8.4-4.3 8.4-4.3Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 12 7.5 3.8 7.5-3.8M4.5 16.2l7.5 3.8 7.5-3.8"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconX({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.3 3h3.3l-7.2 8.3L21.5 21h-6l-4.3-5.6L6.2 21H2.9l7.5-8.6L2.5 3h6.2l4 5.3L17.3 3Zm-1.2 16h1.8L7.1 4.9H5.2L16.1 19Z" />
    </svg>
  );
}

export function IconTelegram({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M21.6 4.3a1.2 1.2 0 0 0-1.28-.19L3.1 11.02c-.6.24-.95.83-.86 1.45.09.62.58 1.09 1.2 1.16l4.02.44 1.5 4.83c.17.55.65.94 1.22.98h.1c.54 0 1.03-.3 1.27-.78l1.96-3.86 4.1 3.1c.28.21.62.32.96.32.17 0 .34-.03.5-.08.5-.17.87-.6.98-1.12l3-13.02c.1-.45-.05-.92-.4-1.24ZM9.5 13.06l-.62 2.98-.82-2.65 7.28-4.6-5.84 4.27ZM11 17.9l.86-1.68 1.13.86-1.99.82Zm7.72-.62-6.6-5 6.98-5.5-1.9 10.5h1.52Z" />
    </svg>
  );
}

export function IconGithub({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5A10 10 0 0 0 12 2Z" />
    </svg>
  );
}
