"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { SectionLabel } from "@/components/ui";

/**
 * PoW / PoS / PoTB side by side.
 *
 * The single most useful thing the specification says about PoTB is what it
 * removes rather than what it adds, and that only lands next to the two models a
 * reader already knows. The PoTB row is the only one drawn at full contrast —
 * the comparison is the argument, so it should be legible at a glance.
 */
export function Compare() {
  const { dict } = useI18n();
  const t = dict.consensus.compare;

  const rows = [
    { ...t.rows.pow, highlight: false },
    { ...t.rows.pos, highlight: false },
    { ...t.rows.potb, highlight: true },
  ];

  return (
    <section
      id="compare"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="02">{t.label}</SectionLabel>
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

        <Reveal delay={200}>
          <div className="mt-12 -mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-y border-line">
                  <th scope="col" className="label-mono px-3 py-3 pl-0 font-normal text-ash-3">
                    {t.head.model}
                  </th>
                  <th scope="col" className="label-mono px-3 py-3 font-normal text-ash-3">
                    {t.head.basis}
                  </th>
                  <th scope="col" className="label-mono px-3 py-3 font-normal text-ash-3">
                    {t.head.cost}
                  </th>
                  <th scope="col" className="label-mono px-3 py-3 pr-0 font-normal text-ash-3">
                    {t.head.energy}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={row.model}
                    className={`group border-b border-line transition-colors duration-300 ${
                      row.highlight ? "bg-panel/70" : "hover:bg-panel-2/60"
                    }`}
                  >
                    <td className="px-3 py-5 pl-0">
                      <span className="flex items-center gap-3">
                        {row.highlight && (
                          <span
                            aria-hidden
                            className="h-4 w-px shrink-0 bg-chalk"
                          />
                        )}
                        <span
                          className={`text-[0.875rem] font-medium tracking-tight ${
                            row.highlight ? "text-chalk" : "text-ash"
                          }`}
                        >
                          {row.model}
                        </span>
                      </span>
                    </td>
                    <td
                      className={`px-3 py-5 text-[0.8125rem] ${
                        row.highlight ? "text-chalk/90" : "text-ash-2"
                      }`}
                    >
                      {row.basis}
                    </td>
                    <td
                      className={`px-3 py-5 text-[0.8125rem] ${
                        row.highlight ? "text-chalk/90" : "text-ash-2"
                      }`}
                    >
                      {row.cost}
                    </td>
                    <td
                      className={`px-3 py-5 pr-0 font-mono text-[0.75rem] ${
                        row.highlight ? "text-chalk/90" : "text-ash-3"
                      }`}
                    >
                      {row.energy}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <p className="mt-8 max-w-2xl border-l border-line-2 pl-4 text-[0.8125rem] leading-relaxed text-ash-2">
            {t.note}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
