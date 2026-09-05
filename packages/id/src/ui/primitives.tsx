"use client";

/**
 * Primitives for the packaged UI.
 *
 * These deliberately mirror the host application's vocabulary — pill buttons,
 * hairline panels, mono micro-labels, `data-cell` numerals — without importing
 * it. The classes resolve against Astrolune's design tokens; a standalone
 * consumer gets them from `@astrolune/id/theme.css`.
 *
 * Two rules carried over from the host and worth restating, because breaking
 * either is what makes an interface stop looking like this one:
 *
 * - Anything clickable is `rounded-full`. Panels and cards keep their 10–12px
 *   radius. That contrast is what stops controls reading as raw HTML.
 * - `live`, `warn` and `down` are *status* colours. `IdStatusDot` and
 *   `IdDelta` may use them; a button, heading, meter fill or chart stroke may
 *   not. Everything else is monochrome.
 */

import {
  useEffect,
  useId,
  useState,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Rng } from "../rng";
import { useAutoFocus, useCopy, useEscape, useScrollLock, useIdStrings } from "../react";
import { IdIconCheck, IdIconChevron, IdIconClose, IdIconCopy } from "./icons";

/* ==================================================================
   Portal
   ================================================================== */

/**
 * Renders into `document.body`.
 *
 * Not a nicety — a necessity. The host's header carries `backdrop-filter`,
 * which makes it the containing block for `position: fixed` descendants. An
 * overlay rendered inside it would be clipped to the header strip.
 */
function IdPortal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

/* ==================================================================
   Buttons
   ================================================================== */

type ButtonVariant = "solid" | "ghost" | "quiet";
type ButtonSize = "sm" | "md" | "lg";

const BUTTON_SIZES: Record<ButtonSize, string> = {
  sm: "h-7 px-3.5 text-[0.625rem]",
  md: "h-[33px] px-5",
  lg: "h-[39px] px-6",
};

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid:
    "border-transparent bg-chalk text-void hover:bg-white hover:shadow-[0_0_30px_-8px_rgba(255,255,255,0.5)]",
  ghost: "border-line-2 bg-panel/60 text-chalk hover:border-line-3 hover:bg-panel-2",
  quiet: "border-transparent bg-transparent text-ash hover:bg-panel-2 hover:text-chalk",
};

export type IdButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  busy?: boolean;
  type?: "button" | "submit";
  className?: string;
  ariaLabel?: string;
};

export function IdButton({
  children,
  onClick,
  variant = "ghost",
  size = "md",
  disabled = false,
  busy = false,
  type = "button",
  className = "",
  ariaLabel,
}: IdButtonProps) {
  const dead = disabled || busy;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={dead}
      aria-label={ariaLabel}
      aria-busy={busy || undefined}
      className={`group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full border label-mono transition-all duration-300 ${
        BUTTON_SIZES[size]
      } ${BUTTON_VARIANTS[variant]} ${
        dead ? "pointer-events-none opacity-40" : ""
      } ${className}`}
    >
      {busy && (
        <span
          aria-hidden
          className="size-3 shrink-0 animate-spin rounded-full border border-current border-t-transparent"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function IdIconButton({
  children,
  onClick,
  ariaLabel,
  size = "size-8",
  disabled = false,
  active = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel: string;
  size?: string;
  disabled?: boolean;
  active?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={active || undefined}
      className={`grid ${size} shrink-0 place-items-center rounded-full border transition-all duration-300 ${
        active
          ? "border-line-3 bg-panel-3 text-chalk"
          : "border-line-2 bg-panel/60 text-ash"
      } ${
        disabled
          ? "pointer-events-none opacity-35"
          : "hover:border-line-3 hover:bg-panel-2 hover:text-chalk"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ==================================================================
   Chips, dots, deltas
   ================================================================== */

export function IdChip({
  children,
  tone = "neutral",
  className = "",
}: {
  children: ReactNode;
  tone?: "neutral" | "muted" | "solid" | "warn" | "outline";
  className?: string;
}) {
  const tones = {
    neutral: "border-line-2 bg-panel-2 text-chalk",
    muted: "border-line bg-panel text-ash-2",
    solid: "border-transparent bg-chalk text-void",
    warn: "border-warn/25 bg-warn/8 text-warn",
    outline: "border-line-2 bg-transparent text-ash",
  } as const;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-[0.14em] uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

export type IdTone = "live" | "warn" | "down" | "idle";

/** The one place status colour is allowed, alongside `IdDelta`. */
export function IdStatusDot({
  tone,
  label,
  pulse = true,
  className = "",
}: {
  tone: IdTone;
  label?: string;
  pulse?: boolean;
  className?: string;
}) {
  const tones: Record<IdTone, string> = {
    live: "bg-live",
    warn: "bg-warn",
    down: "bg-down",
    idle: "bg-ash-3",
  };
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid size-2 shrink-0 place-items-center">
        <span className={`size-1.5 rounded-full ${tones[tone]}`} />
        {pulse && tone !== "idle" && (
          <span
            aria-hidden
            className={`absolute size-2 animate-ping rounded-full opacity-40 ${tones[tone]}`}
          />
        )}
      </span>
      {label && <span className="label-mono text-ash">{label}</span>}
    </span>
  );
}

export function IdDelta({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const tone = value > 0 ? "text-live" : value < 0 ? "text-down" : "text-ash-2";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={`data-cell ${tone} ${className}`}>
      {sign}
      {value}
      {suffix}
    </span>
  );
}

/* ==================================================================
   Surfaces
   ================================================================== */

export function IdPanel({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={`panel rounded-xl ${padded ? "p-5 sm:p-6" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function IdPanelHead({
  title,
  note,
  icon,
  actions,
  className = "",
}: {
  title: string;
  note?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={`flex flex-wrap items-start justify-between gap-4 ${className}`}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          {icon && <span className="shrink-0 text-ash-2">{icon}</span>}
          <h3 className="display text-[1.0625rem] text-chalk">{title}</h3>
        </div>
        {note && (
          <p className="mt-2 max-w-prose text-[0.8125rem] leading-relaxed text-ash-2">
            {note}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

export function IdStat({
  label,
  value,
  hint,
  className = "",
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-line bg-panel-2/60 px-3.5 py-3 ${className}`}
    >
      <div className="label-mono text-[0.5625rem] text-ash-3">{label}</div>
      <div className="mt-2 data-cell text-[0.9375rem] text-chalk">{value}</div>
      {hint && <div className="mt-1 font-mono text-[0.6875rem] text-ash-3">{hint}</div>}
    </div>
  );
}

export function IdRow({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0 ${className}`}
    >
      <span className="label-mono shrink-0 text-[0.5625rem] text-ash-3">{label}</span>
      <span className="min-w-0 data-cell text-right text-chalk">{children}</span>
    </div>
  );
}

export function IdNotice({
  children,
  title,
  className = "",
}: {
  children: ReactNode;
  title?: string;
  className?: string;
}) {
  return (
    <aside
      className={`rounded-lg border border-line bg-panel-2/50 px-4 py-3 ${className}`}
    >
      {title && (
        <div className="label-mono mb-1.5 text-[0.5625rem] text-ash-3">{title}</div>
      )}
      <div className="text-[0.8125rem] leading-relaxed text-ash-2">{children}</div>
    </aside>
  );
}

export function IdEmpty({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center gap-4 rounded-lg border border-dashed border-line-2 px-6 py-10 text-center">
      <p className="label-mono text-ash-3">{children}</p>
      {action}
    </div>
  );
}

/* ==================================================================
   Data visuals
   ================================================================== */

/**
 * Usage bar. Monochrome by design — the "you are nearly full" signal is a
 * `warn` chip next to it, not a coloured fill, which keeps status colour in
 * the one place the palette allows it.
 */
export function IdMeter({
  value,
  max,
  label,
  right,
  className = "",
}: {
  value: number;
  max: number;
  label?: string;
  right?: ReactNode;
  className?: string;
}) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  return (
    <div className={className}>
      {(label || right) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          {label && (
            <span className="label-mono text-[0.5625rem] text-ash-3">{label}</span>
          )}
          {right && <span className="data-cell text-[0.75rem] text-ash">{right}</span>}
        </div>
      )}
      <div
        role="meter"
        aria-valuenow={Math.round(ratio * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
        className="h-1 w-full overflow-hidden rounded-full bg-line"
      >
        <div
          className="h-full rounded-full bg-chalk/70 transition-[width] duration-700"
          style={{ width: `${ratio * 100}%` }}
        />
      </div>
    </div>
  );
}

/** Block-time samples as a hairline trace. No axes — it is a texture, not a chart. */
export function IdSparkline({
  series,
  className = "h-8 w-full",
}: {
  series: number[];
  className?: string;
}) {
  if (series.length < 2) return null;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const span = max - min || 1;
  const points = series
    .map((value, i) => {
      const x = (i / (series.length - 1)) * 100;
      const y = 26 - ((value - min) / span) * 22;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox="0 0 100 28"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="text-ash-2"
      />
    </svg>
  );
}

/**
 * A deterministic block pattern standing in for a payment QR.
 *
 * Seeded from the address so the same invoice always draws the same figure,
 * which matters for hydration and for screenshots. It encodes nothing —
 * `pay.qrCaption` says so on screen rather than letting someone discover it
 * with a phone.
 */
export function IdQr({ value, className = "" }: { value: string; className?: string }) {
  const cells = 25;
  const rng = new Rng(`qr:${value}`);
  const grid: boolean[][] = Array.from({ length: cells }, () =>
    Array.from({ length: cells }, () => rng.bool(0.46)),
  );

  // Three finder squares, so the shape reads as a QR at a glance.
  const finder = (ox: number, oy: number) => {
    for (let y = 0; y < 7; y++) {
      for (let x = 0; x < 7; x++) {
        const edge = x === 0 || y === 0 || x === 6 || y === 6;
        const core = x >= 2 && x <= 4 && y >= 2 && y <= 4;
        grid[oy + y][ox + x] = edge || core;
      }
    }
  };
  finder(0, 0);
  finder(cells - 7, 0);
  finder(0, cells - 7);

  return (
    <svg
      viewBox={`0 0 ${cells} ${cells}`}
      className={className}
      role="img"
      aria-label="Payment address pattern"
      shapeRendering="crispEdges"
    >
      <rect width={cells} height={cells} fill="#f5f5f5" />
      {grid.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000000" /> : null,
        ),
      )}
    </svg>
  );
}

/* ==================================================================
   Form controls
   ================================================================== */

export function IdField({
  label,
  hint,
  error,
  value,
  onChange,
  placeholder,
  mono = false,
  autoFocus = false,
  className = "",
}: {
  label: string;
  hint?: string;
  error?: string | null;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  autoFocus?: boolean;
  className?: string;
}) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block text-[0.5625rem] text-ash-3">
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        spellCheck={false}
        autoComplete="off"
        aria-invalid={error ? true : undefined}
        aria-describedby={hint || error ? `${id}-hint` : undefined}
        className={`mt-2 h-10 w-full rounded-lg border bg-panel-2 px-3.5 text-[0.875rem] text-chalk transition-colors duration-200 outline-none placeholder:text-ash-3 focus:border-line-3 ${
          mono ? "font-mono text-[0.8125rem]" : ""
        } ${error ? "border-down/40" : "border-line-2"}`}
      />
      {(error || hint) && (
        <p
          id={`${id}-hint`}
          className={`mt-1.5 font-mono text-[0.6875rem] ${error ? "text-down" : "text-ash-3"}`}
        >
          {error ?? hint}
        </p>
      )}
    </div>
  );
}

export function IdSelect({
  label,
  value,
  onChange,
  options,
  className = "",
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  className?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange" | "className">) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="label-mono block text-[0.5625rem] text-ash-3">
        {label}
      </label>
      <div className="relative mt-2">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-10 w-full appearance-none rounded-lg border border-line-2 bg-panel-2 pr-9 pl-3.5 text-[0.875rem] text-chalk outline-none transition-colors duration-200 focus:border-line-3"
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-panel">
              {option.label}
            </option>
          ))}
        </select>
        <IdIconChevron className="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-ash-3" />
      </div>
    </div>
  );
}

/** Two-to-four mutually exclusive options, shown all at once. */
export function IdSegmented<T extends string>({
  label,
  value,
  onChange,
  options,
  className = "",
}: {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: readonly { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <div className="label-mono mb-2 text-[0.5625rem] text-ash-3">{label}</div>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className="flex gap-1 rounded-full border border-line-2 bg-panel-2 p-1"
      >
        {options.map((option) => {
          const on = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(option.value)}
              className={`h-7 flex-1 rounded-full label-mono text-[0.5625rem] transition-colors duration-200 ${
                on ? "bg-chalk text-void" : "text-ash hover:bg-panel-3 hover:text-chalk"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function IdSwitch({
  label,
  hint,
  checked,
  onChange,
  className = "",
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <span className="min-w-0">
        <span className="block text-[0.8125rem] text-chalk">{label}</span>
        {hint && (
          <span className="mt-0.5 block font-mono text-[0.6875rem] text-ash-3">
            {hint}
          </span>
        )}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-300 ${
          checked ? "border-transparent bg-chalk" : "border-line-2 bg-panel-2"
        }`}
      >
        <span
          className={`absolute top-0.5 size-3.5 rounded-full transition-all duration-300 ${
            checked ? "left-[18px] bg-void" : "left-0.5 bg-ash-2"
          }`}
        />
      </button>
    </div>
  );
}

/** A mono value with a copy affordance. The workhorse of the pay modal. */
export function IdCopyField({
  label,
  value,
  display,
  hint,
  className = "",
}: {
  label: string;
  value: string;
  display?: string;
  hint?: string;
  className?: string;
}) {
  const strings = useIdStrings();
  const { copied, copy } = useCopy();
  const done = copied === value;

  return (
    <div className={className}>
      <div className="label-mono mb-2 flex items-center justify-between gap-3 text-[0.5625rem] text-ash-3">
        <span>{label}</span>
        {hint && <span className="text-ash-3 normal-case">{hint}</span>}
      </div>
      <div className="flex items-stretch gap-2">
        <div className="min-w-0 flex-1 rounded-lg border border-line-2 bg-panel-2 px-3.5 py-2.5">
          <span className="block hash-clip text-chalk">{display ?? value}</span>
        </div>
        <IdIconButton
          onClick={() => copy(value)}
          ariaLabel={done ? strings.common.copied : `${strings.common.copy} ${label}`}
          size="size-[42px]"
          className="rounded-lg"
        >
          {done ? (
            <IdIconCheck className="size-3.5 text-chalk" />
          ) : (
            <IdIconCopy className="size-3.5" />
          )}
        </IdIconButton>
      </div>
    </div>
  );
}

/* ==================================================================
   Overlays
   ================================================================== */

function IdSheetHead({
  title,
  eyebrow,
  blurb,
  onClose,
  closeLabel,
}: {
  title: string;
  eyebrow?: string;
  blurb?: string;
  onClose: () => void;
  closeLabel: string;
}) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="label-mono mb-2 text-[0.5625rem] text-ash-3">{eyebrow}</div>
        )}
        <h2 className="display text-[1.125rem] text-chalk">{title}</h2>
        {blurb && (
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ash-2">{blurb}</p>
        )}
      </div>
      <IdIconButton onClick={onClose} ariaLabel={closeLabel}>
        <IdIconClose className="size-3.5" />
      </IdIconButton>
    </header>
  );
}

export type IdOverlayProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  blurb?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Centred dialog. On narrow screens it becomes a bottom sheet, because a
 * centred modal with a keyboard open leaves the fields under the keyboard.
 */
export function IdModal({
  open,
  onClose,
  title,
  eyebrow,
  blurb,
  children,
  footer,
  className = "max-w-lg",
}: IdOverlayProps) {
  useEscape(onClose, open);
  useScrollLock(open);
  const focusRef = useAutoFocus<HTMLDivElement>(open);
  const strings = useIdStrings();

  if (!open) return null;

  return (
    <IdPortal>
      <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-6">
        <div
          aria-hidden
          onClick={onClose}
          className="absolute inset-0 bg-void/80 backdrop-blur-[3px]"
        />
        <div
          ref={focusRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={`panel-glass relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl outline-none sm:rounded-2xl ${className} animate-[rise_0.4s_cubic-bezier(0.16,1,0.3,1)_both]`}
        >
          <IdSheetHead
            title={title}
            eyebrow={eyebrow}
            blurb={blurb}
            onClose={onClose}
            closeLabel={strings.common.close}
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4 sm:px-6">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </IdPortal>
  );
}

/**
 * Side sheet — the "slide-out". Same anatomy as `IdModal`, anchored right on
 * desktop and bottom on mobile, for forms that belong beside the table they
 * edit rather than on top of it.
 */
export function IdDrawer({
  open,
  onClose,
  title,
  eyebrow,
  blurb,
  children,
  footer,
  className = "sm:max-w-md",
}: IdOverlayProps) {
  useEscape(onClose, open);
  useScrollLock(open);
  const focusRef = useAutoFocus<HTMLDivElement>(open);
  const strings = useIdStrings();

  if (!open) return null;

  return (
    <IdPortal>
      <div className="fixed inset-0 z-[100] flex items-end justify-end sm:items-stretch">
        <div
          aria-hidden
          onClick={onClose}
          className="absolute inset-0 bg-void/80 backdrop-blur-[3px]"
        />
        <div
          ref={focusRef}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          tabIndex={-1}
          className={`panel-glass relative flex max-h-[92dvh] w-full flex-col rounded-t-2xl outline-none sm:h-full sm:max-h-none sm:rounded-none sm:border-l ${className} animate-[rise_0.4s_cubic-bezier(0.16,1,0.3,1)_both] sm:animate-[slideIn_0.4s_cubic-bezier(0.16,1,0.3,1)_both]`}
        >
          <IdSheetHead
            title={title}
            eyebrow={eyebrow}
            blurb={blurb}
            onClose={onClose}
            closeLabel={strings.common.close}
          />
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>
          {footer && (
            <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4 sm:px-6">
              {footer}
            </footer>
          )}
        </div>
      </div>
    </IdPortal>
  );
}

/**
 * Inline expand — the other kind of slide-out, for detail that belongs in the
 * row it came from.
 *
 * Animates `grid-template-rows` between `0fr` and `1fr` rather than
 * `max-height`, which is the only way to transition to *content* height without
 * measuring it in JavaScript.
 */
export function IdDisclosure({
  summary,
  meta,
  children,
  defaultOpen = false,
  className = "",
}: {
  summary: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div
      className={`rounded-lg border transition-colors duration-300 ${
        open ? "border-line-2 bg-panel-2/60" : "border-line bg-panel/40"
      } ${className}`}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={id}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className="min-w-0 flex-1">{summary}</span>
        {meta && <span className="shrink-0">{meta}</span>}
        <IdIconChevron
          className={`size-3.5 shrink-0 text-ash-3 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        id={id}
        className="grid transition-[grid-template-rows] duration-400 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-line px-4 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================
   Tables
   ================================================================== */

export function IdTable({
  head,
  children,
  className = "",
}: {
  head: readonly string[];
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`-mx-5 overflow-x-auto sm:mx-0 ${className}`}>
      <table className="w-full min-w-[38rem] border-collapse">
        <thead>
          <tr className="border-b border-line-2">
            {head.map((cell, i) => (
              <th
                key={cell}
                scope="col"
                className={`label-mono px-3 pb-2.5 text-[0.5625rem] whitespace-nowrap text-ash-3 ${
                  i === 0 ? "pl-5 text-left sm:pl-3" : "text-right last:pr-5 sm:last:pr-3"
                }`}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function IdTr({ children }: { children: ReactNode }) {
  return (
    <tr className="border-b border-line transition-colors duration-200 last:border-b-0 hover:bg-panel-2/50">
      {children}
    </tr>
  );
}

export function IdTd({
  children,
  align = "right",
  className = "",
}: {
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <td
      className={`px-3 py-3 data-cell align-middle ${
        align === "left" ? "pl-5 text-left sm:pl-3" : "text-right last:pr-5 sm:last:pr-3"
      } ${className}`}
    >
      {children}
    </td>
  );
}

export { IdPortal };
