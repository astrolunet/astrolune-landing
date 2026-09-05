/**
 * Signed change readout. Together with `<StatusDot>` this is the only place
 * `--color-live` appears — see the note in `status-dot.tsx`.
 */
export function Delta({
  value,
  unit = "%",
  /** Set when a *fall* is the good outcome (block time, latency, gas). */
  invert = false,
  digits = 1,
  className = "",
}: {
  value: number;
  unit?: string;
  invert?: boolean;
  digits?: number;
  className?: string;
}) {
  const flat = Math.abs(value) < 10 ** -digits / 2;
  const good = invert ? value < 0 : value > 0;
  const tone = flat ? "text-ash-2" : good ? "text-live" : "text-down";
  const sign = flat ? "±" : value > 0 ? "+" : "−";

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[0.6875rem] tabular-nums ${tone} ${className}`}
    >
      <span aria-hidden className="text-[0.8em]">
        {flat ? "•" : good ? "▲" : "▼"}
      </span>
      {sign}
      {Math.abs(value).toFixed(digits)}
      {unit}
    </span>
  );
}
