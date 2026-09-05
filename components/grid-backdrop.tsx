"use client";

/**
 * GridBackdrop — the blueprint lattice from the reference.
 * Layers, back to front:
 *   1. drifting 72px lattice
 *   2. highlighted cells (a few brighter squares)
 *   3. soft glow blooms
 *   4. vertical light traces running down grid lines
 *   5. scanline + film grain
 */
export function GridBackdrop({
  traces = true,
  cells = true,
  className = "",
}: {
  traces?: boolean;
  cells?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* 1 — drifting lattice, oversized so the drift never reveals an edge */}
      <div className="absolute -inset-[20%] grid-lattice animate-drift-slow opacity-90" />
      <div className="absolute -inset-[20%] grid-lattice-sm opacity-40" />

      {/* 2 — brighter cells scattered on the lattice */}
      {cells && (
        <div className="absolute inset-0">
          {HIGHLIGHT_CELLS.map((c, i) => (
            <div
              key={i}
              className="absolute rounded-[3px] border border-white/[0.1]"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: `${c.w}px`,
                height: `${c.h}px`,
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.075), rgba(255,255,255,0) 72%)",
                animation: `pulseGlow ${7 + i * 1.3}s ease-in-out ${i * 0.7}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* 3 — glow blooms */}
      <div
        className="absolute top-[6%] left-[8%] size-[26rem] animate-pulse-glow rounded-full blur-[90px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.15), transparent 68%)",
        }}
      />
      <div
        className="absolute top-[26%] left-1/2 size-[34rem] -translate-x-1/2 animate-pulse-glow rounded-full blur-[110px] [animation-delay:2.4s]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.13), transparent 66%)",
        }}
      />
      <div
        className="absolute top-[10%] right-[6%] size-[24rem] animate-pulse-glow rounded-full blur-[92px] [animation-delay:1.2s]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.12), transparent 68%)",
        }}
      />

      {/* 4 — vertical light traces down the grid lines */}
      {traces && (
        <div className="absolute inset-0">
          {TRACES.map((t, i) => (
            <div
              key={i}
              className="absolute w-px"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                height: `${t.h}px`,
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.55), transparent)",
                animation: `trace ${t.dur}s ease-in-out ${t.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* 5 — scanline sweep */}
      <div className="absolute inset-x-0 top-0 h-px animate-scan bg-gradient-to-r from-transparent via-white/28 to-transparent" />

      {/* vignette + grain */}
      <div className="absolute inset-0 vignette" />
      <div className="absolute inset-0 noise-layer opacity-[0.13]" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-void via-void/85 to-transparent" />
    </div>
  );
}

/* Deterministic positions — no Math.random, so SSR and client agree. */
const HIGHLIGHT_CELLS = [
  { x: 26, y: 12, w: 84, h: 60 },
  { x: 45, y: 8, w: 72, h: 72 },
  { x: 68, y: 20, w: 96, h: 64 },
  { x: 15, y: 46, w: 72, h: 72 },
  { x: 33, y: 58, w: 88, h: 56 },
  { x: 74, y: 52, w: 72, h: 72 },
  { x: 57, y: 70, w: 80, h: 64 },
  { x: 87, y: 38, w: 72, h: 72 },
  { x: 8, y: 72, w: 72, h: 60 },
];

const TRACES = [
  { x: 22, y: 4, h: 150, dur: 4.2, delay: 0 },
  { x: 41, y: 10, h: 190, dur: 5.1, delay: 1.1 },
  { x: 52, y: 2, h: 130, dur: 3.8, delay: 2.3 },
  { x: 63, y: 14, h: 210, dur: 5.6, delay: 0.6 },
  { x: 78, y: 6, h: 160, dur: 4.6, delay: 1.8 },
  { x: 89, y: 18, h: 140, dur: 4.1, delay: 3.1 },
  { x: 12, y: 22, h: 175, dur: 5.3, delay: 2.7 },
];
