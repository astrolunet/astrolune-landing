"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { SectionLabel } from "@/components/ui";

/**
 * The slashing table.
 *
 * Ordered by severity so the shape of the policy is visible: nothing at all for
 * ordinary noise, single-digit percentages for drift, and a near-total wipe plus
 * a ban for double-signing. Only that last pair is rendered at warn tone —
 * everything above it is recoverable, and colouring it otherwise would overstate
 * the penalty.
 */
export function Slashing() {
  const { dict } = useI18n();
  const t = dict.consensus.slashing;
  const s = dict.node.slash;

  const rows = [
    { ...s.miss, severe: false },
    { ...s.systematic, severe: false },
    { ...s.wrong, severe: false },
    { ...s.wrongSys, severe: false },
    { ...s.double, severe: true },
    { ...s.repeat, severe: true },
  ];

  return (
    <section
      id="slashing"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div className="container-rail relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel index="07">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.6rem,3.4vw,2.4rem)]">
                {t.title1}
                <br />
                {t.title2}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash">
                {t.body}
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={140}>
              <div className="-mx-5 overflow-x-auto px-5 md:mx-0 md:px-0">
                <table className="w-full min-w-[32rem] border-collapse text-left">
                  <thead>
                    <tr className="border-y border-line">
                      <th
                        scope="col"
                        className="label-mono px-3 py-3 pl-0 font-normal text-ash-3"
                      >
                        {dict.node.slashTable.offence}
                      </th>
                      <th
                        scope="col"
                        className="label-mono px-3 py-3 pr-0 text-right font-normal text-ash-3"
                      >
                        {dict.node.slashTable.penalty}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr
                        key={row.o}
                        className="group border-b border-line transition-colors duration-300 hover:bg-panel-2/60"
                      >
                        <td className="px-3 py-4 pl-0 text-[0.8125rem] text-ash">
                          <span className="flex items-center gap-3">
                            <span
                              aria-hidden
                              className={`h-3.5 w-px shrink-0 transition-colors duration-300 ${
                                row.severe
                                  ? "bg-warn/60"
                                  : "bg-line-2 group-hover:bg-line-3"
                              }`}
                            />
                            {row.o}
                          </span>
                        </td>
                        <td
                          className={`px-3 py-4 pr-0 text-right font-mono text-[0.75rem] tabular-nums ${
                            row.severe ? "text-warn/90" : "text-chalk/90"
                          }`}
                        >
                          {row.p}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-7 border-l border-line-2 pl-4 text-[0.75rem] leading-relaxed text-ash-2">
                {dict.node.slashNote}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
