"use client";

import { useCallback, useRef, useState } from "react";

import { closeArea, project, smoothPath } from "@/components/site/charts";

/**
 * Interactive area chart with a crosshair.
 *
 * The only client-side chart in the tree. It exists because a telemetry chart
 * that cannot be read at a specific point is decoration, and a tooltip needs a
 * pointer.
 *
 * The SVG uses a fixed viewBox and scales with CSS, so pointer coordinates are
 * mapped from the bounding rect back into viewBox units. That keeps it
 * responsive without a ResizeObserver, and `vectorEffect="non-scaling-stroke"`
 * keeps the hairline a hairline at every width.
 */

const W = 640;
const H = 190;
const PAD_X = 8;
const PAD_Y = 14;

export function AreaChart({
  values,
  /** Decimal places for the readout and the min/max bounds. */
  digits = 0,
  /** Uppercase mono badge after the headline value, e.g. `ms`. */
  unit,
  /** Inline suffix glued to the number, e.g. `%`. */
  suffix = "",
  /** Labels for the horizontal axis, drawn evenly across the width. */
  ticks,
  ariaLabel,
}: {
  values: number[];
  digits?: number;
  unit?: string;
  suffix?: string;
  ticks?: string[];
  ariaLabel: string;
}) {
  const ref = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  /**
   * Formatting lives here rather than arriving as a prop.
   *
   * A `format` callback would be the obvious API, but this is a client component
   * and functions cannot cross the server boundary — passing one throws
   * "Functions cannot be passed directly to Client Components" at request time,
   * which a type check does not catch. Serializable options only.
   */
  const format = (value: number) =>
    `${value.toLocaleString("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })}${suffix}`;

  // Pad the band so the curve never touches the frame, which is what makes a
  // flat stretch still read as a line rather than as the axis.
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const band = (hi - lo || Math.abs(hi) || 1) * 0.18;

  const points = project(values, {
    width: W,
    height: H,
    padX: PAD_X,
    padY: PAD_Y,
    min: lo - band,
    max: hi + band,
  });

  const line = smoothPath(points);
  const area = closeArea(line, points, H);

  const onMove = useCallback(
    (event: React.PointerEvent<SVGSVGElement>) => {
      const svg = ref.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * W;
      const step = (W - PAD_X * 2) / Math.max(1, values.length - 1);
      const index = Math.round((x - PAD_X) / step);
      setActive(Math.min(values.length - 1, Math.max(0, index)));
    },
    [values.length],
  );

  const cursor = active === null ? null : points[active];

  return (
    <figure className="group/chart relative">
      {/* readout — pinned so the chart height never shifts on hover */}
      <figcaption className="flex items-baseline justify-between gap-3 pb-3">
        <span className="font-mono text-[1.05rem] tabular-nums text-chalk">
          {format(active === null ? values[values.length - 1] : values[active])}
          {unit && (
            <span className="ml-1.5 text-[0.6875rem] tracking-[0.14em] text-ash-3 uppercase">
              {unit}
            </span>
          )}
        </span>
        <span className="label-mono text-ash-3">
          {format(lo)} — {format(hi)}
        </span>
      </figcaption>

      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full touch-none text-chalk"
        style={{ height: "auto" }}
        preserveAspectRatio="none"
        onPointerMove={onMove}
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* horizontal guides at quarters */}
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={0}
            x2={W}
            y1={PAD_Y + (H - PAD_Y * 2) * t}
            y2={PAD_Y + (H - PAD_Y * 2) * t}
            stroke="var(--color-line)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        <path d={area} fill="url(#area-fill)" />
        <path
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {cursor && (
          <g>
            <line
              x1={cursor.x}
              x2={cursor.x}
              y1={0}
              y2={H}
              stroke="var(--color-line-3)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            {/* Scaled viewBox would turn a circle into an ellipse, so the
                marker is a non-scaling square drawn with a stroke. */}
            <rect
              x={cursor.x - 3}
              y={cursor.y - 3}
              width={6}
              height={6}
              fill="var(--color-void)"
              stroke="currentColor"
              strokeWidth="1.4"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        )}
      </svg>

      {ticks && ticks.length > 0 && (
        <div className="mt-2.5 flex justify-between border-t border-line pt-2.5">
          {ticks.map((tick) => (
            <span key={tick} className="label-mono text-ash-3">
              {tick}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}
