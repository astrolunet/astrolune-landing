"use client";

import { useI18n } from "@/components/i18n-provider";
import { Counter, Reveal } from "@/components/motion";
import { CornerTicks, SectionLabel } from "@/components/ui";
import { POTB, quorumThreshold } from "@/lib/chain";

/**
 * Committee mechanics, with the seat lattice as the centrepiece.
 *
 * The rotation figure is the one number in PoTB that is easier to see than to
 * read: ten of a hundred seats change every block, so the whole committee turns
 * over in ten blocks without a full reshuffle. The grid below draws all
 * `committeeSize` seats and pulses the rotating tenth.
 *
 * Which seats rotate is chosen by index arithmetic rather than `Math.random`, so
 * the server and client renders agree and the animation is pure CSS.
 */
function SeatLattice() {
  const { dict } = useI18n();
  const t = dict.consensus.committee;

  const total = POTB.committeeSize;
  const rotating = Math.round(total * POTB.rotationFraction);

  // Spread the rotating seats evenly instead of taking the first ten, which is
  // both closer to a weighted draw and reads better as a lattice.
  const stride = Math.floor(total / rotating);

  return (
    <div className="relative panel rounded-xl p-6 md:p-8">
      <CornerTicks className="absolute inset-0" />

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="label-mono text-ash">{t.rotationTitle}</p>
        <p className="font-mono text-[0.6875rem] text-ash-3">
          {rotating} / {total}
        </p>
      </div>

      <div
        className="mt-7 grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(20, minmax(0, 1fr))" }}
        aria-hidden
      >
        {Array.from({ length: total }, (_, i) => {
          const isRotating = i % stride === 0;
          return (
            <span
              key={i}
              className={`aspect-square rounded-[2px] ${
                isRotating ? "bg-chalk/85" : "bg-line-2"
              }`}
              style={
                isRotating
                  ? {
                      animation: `pulseGlow ${2.4 + (i % 5) * 0.35}s ease-in-out ${
                        (i / stride) * 0.12
                      }s infinite`,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 border-t border-line pt-5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-chalk/85" />
          <span className="label-mono text-ash-2">
            {rotating} {t.rotatingLabel}
          </span>
        </span>
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="size-2 rounded-[2px] bg-line-2" />
          <span className="label-mono text-ash-2">
            {total - rotating} {t.holdingLabel}
          </span>
        </span>
      </div>

      <p className="mt-5 text-[0.75rem] leading-relaxed text-ash-3">
        {t.rotationNote}
      </p>
    </div>
  );
}

export function Committee() {
  const { dict } = useI18n();
  const t = dict.consensus.committee;

  const rows = [t.items.selection, t.items.rotation, t.items.quorum, t.items.seed];

  const figures = [
    { value: POTB.committeeSize, label: t.seatLabel, suffix: "" },
    {
      value: quorumThreshold(POTB.committeeSize),
      label: dict.scan.block.quorum,
      suffix: "",
    },
    {
      value: POTB.committeeLifetimeBlocks,
      label: dict.status.charts.blocks,
      suffix: "",
    },
  ];

  return (
    <section
      id="committee"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="04">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.6rem,3.4vw,2.6rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash">
              {t.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* left — the four mechanics as a definition list */}
          <div className="lg:col-span-6">
            <dl className="divide-y divide-line border-t border-line">
              {rows.map((row, i) => (
                <Reveal key={row.k} delay={i * 80} className="group py-6">
                  <dt className="flex items-baseline gap-4">
                    <span className="label-mono text-ash-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.9375rem] font-medium tracking-tight text-chalk">
                      {row.k}
                    </span>
                  </dt>
                  <dd className="mt-3 pl-[3.1rem] text-[0.8125rem] leading-relaxed text-ash">
                    {row.v}
                  </dd>
                </Reveal>
              ))}
            </dl>

            <Reveal delay={340}>
              <div className="mt-10 grid grid-cols-3 gap-px border border-line bg-line">
                {figures.map((f) => (
                  <div key={f.label} className="bg-panel px-4 py-5 text-center">
                    <p className="display text-[1.6rem] text-chalk tabular-nums">
                      <Counter to={f.value} decimals={0} />
                    </p>
                    <p className="mt-2 label-mono text-ash-3">{f.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* right — the seat lattice */}
          <Reveal delay={200} className="lg:col-span-6">
            <SeatLattice />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
