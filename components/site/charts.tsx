import type { ReactNode } from "react";

/**
 * Monochrome SVG charts.
 *
 * Three rules, so a chart never breaks the page's discipline:
 *
 * 1. **No colour.** Strokes and fills come from `chalk` / `ash` / `line` only.
 *    `--color-live` belongs to `<StatusDot>` and `<Delta>`; a chart that reached
 *    for green would be the first thing to make the page look like a dashboard
 *    template.
 * 2. **No chart library.** These are a few dozen lines of path arithmetic. A
 *    dependency would be larger than the feature.
 * 3. **Server rendered where possible.** Everything here is a server component;
 *    only `<AreaChart>` needs the client, because it tracks a pointer.
 */

/* ------------------------------------------------------------------
   Path helpers, shared with the client area chart
   ------------------------------------------------------------------ */

export type Point = { x: number; y: number };

export function project(
  values: number[],
  {
    width,
    height,
    padX = 0,
    padY = 6,
    min,
    max,
  }: {
    width: number;
    height: number;
    padX?: number;
    padY?: number;
    min?: number;
    max?: number;
  },
): Point[] {
  const lo = min ?? Math.min(...values);
  const hi = max ?? Math.max(...values);
  // A flat series would divide by zero; give it a nominal band instead.
  const span = hi - lo || 1;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const step = values.length > 1 ? innerW / (values.length - 1) : 0;

  return values.map((value, i) => ({
    x: padX + i * step,
    y: padY + innerH - ((value - lo) / span) * innerH,
  }));
}

/**
 * Catmull-Rom → cubic Bezier. Produces the soft telemetry curve without the
 * overshoot a naive spline gives on spiky data.
 */
export function smoothPath(points: Point[]): string {
  if (points.length === 0) return "";
  if (points.length < 3) {
    return points.map((p, i) => `${i ? "L" : "M"}${p.x} ${p.y}`).join(" ");
  }

  let d = `M${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function closeArea(path: string, points: Point[], height: number): string {
  if (!points.length) return "";
  const first = points[0];
  const last = points[points.length - 1];
  return `${path} L${last.x} ${height} L${first.x} ${height} Z`;
}

/* ------------------------------------------------------------------
   Sparkline — inline, no axes
   ------------------------------------------------------------------ */

export function Sparkline({
  values,
  className = "",
  width = 120,
  height = 32,
}: {
  values: number[];
  className?: string;
  width?: number;
  height?: number;
}) {
  const points = project(values, { width, height, padY: 3 });
  const line = smoothPath(points);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
      preserveAspectRatio="none"
    >
      <path
        d={closeArea(line, points, height)}
        fill="url(#spark-fill)"
        opacity="0.5"
      />
      <path
        d={line}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        vectorEffect="non-scaling-stroke"
      />
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------
   BarRows — horizontal distribution (ASN share, committee weight)
   ------------------------------------------------------------------ */

export function BarRows({
  rows,
  unit = "",
  max,
  digits = 1,
}: {
  rows: { label: string; value: number }[];
  unit?: string;
  max?: number;
  digits?: number;
}) {
  const ceiling = max ?? Math.max(...rows.map((r) => r.value));

  return (
    <ul className="flex flex-col gap-2.5">
      {rows.map((row) => {
        const pct = ceiling > 0 ? (row.value / ceiling) * 100 : 0;
        return (
          <li key={row.label} className="group grid gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="truncate text-[0.75rem] text-ash">
                {row.label}
              </span>
              <span className="shrink-0 font-mono text-[0.75rem] tabular-nums text-chalk/90">
                {row.value.toFixed(digits)}
                {unit}
              </span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-panel-3">
              <div
                className="h-full rounded-full bg-chalk/55 transition-all duration-700 group-hover:bg-chalk"
                style={{ width: `${Math.max(pct, 1.5)}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/* ------------------------------------------------------------------
   Histogram — vertical bars (finality distribution, weight spread)
   ------------------------------------------------------------------ */

export function Histogram({
  values,
  height = 132,
  className = "",
}: {
  values: number[];
  height?: number;
  className?: string;
}) {
  const max = Math.max(...values) || 1;

  return (
    <div
      className={`flex items-end gap-px ${className}`}
      style={{ height }}
      aria-hidden
    >
      {values.map((value, i) => (
        <span
          key={i}
          className="group/bar relative min-w-0 flex-1 bg-chalk/18 transition-colors duration-300 hover:bg-chalk/70"
          style={{ height: `${Math.max((value / max) * 100, 2)}%` }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------
   Ring — epoch progress
   ------------------------------------------------------------------ */

export function Ring({
  value,
  size = 112,
  stroke = 3,
  children,
}: {
  /** 0–1. */
  value: number;
  size?: number;
  stroke?: number;
  children?: ReactNode;
}) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(1, Math.max(0, value));

  return (
    <div
      className="relative grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-line-2)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-chalk)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - clamped)}
          className="transition-[stroke-dashoffset] duration-1000 ease-out"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 grid place-items-center text-center">
          {children}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   SplitBar — the 60 / 25 / 15 reward buckets
   ------------------------------------------------------------------ */

export function SplitBar({
  parts,
}: {
  parts: { label: string; pct: number; note?: string }[];
}) {
  const shades = ["bg-chalk/85", "bg-chalk/50", "bg-chalk/25"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex h-2 gap-px overflow-hidden rounded-full bg-panel-3">
        {parts.map((part, i) => (
          <span
            key={part.label}
            className={`h-full transition-all duration-700 ${shades[i] ?? "bg-chalk/20"}`}
            style={{ width: `${part.pct}%` }}
          />
        ))}
      </div>

      <ul className="grid gap-3 sm:grid-cols-3">
        {parts.map((part, i) => (
          <li key={part.label} className="flex gap-2.5">
            <span
              aria-hidden
              className={`mt-1 h-3 w-px shrink-0 ${shades[i] ?? "bg-chalk/20"}`}
            />
            <span className="min-w-0">
              <span className="block font-mono text-[0.9375rem] tabular-nums text-chalk">
                {part.pct}%
              </span>
              <span className="mt-1 block label-mono text-ash-3">
                {part.label}
              </span>
              {part.note && (
                <span className="mt-1.5 block text-[0.6875rem] leading-snug text-ash-2">
                  {part.note}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
