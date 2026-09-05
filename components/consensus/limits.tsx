"use client";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import { ButtonGhost, IconCheck, SectionLabel } from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { DOC_ROUTES } from "@/lib/routes";

/**
 * Fixed vs. open, side by side.
 *
 * This is the section the specification cares most about — "open problems are
 * recorded as open" is one of its two stated conventions. The two columns are
 * given equal width on purpose: the open risks are not a disclaimer bolted onto
 * a finished design, they are half of what the design honestly is.
 */
export function Limits() {
  const { locale, dict } = useI18n();
  const t = dict.consensus.limits;
  const at = (path: string) => localePath(locale, path);

  const fixed = [t.fixed.a, t.fixed.b, t.fixed.c, t.fixed.d];
  const open = [t.open.a, t.open.b, t.open.c, t.open.d];

  return (
    <section
      id="limits"
      className="relative overflow-hidden border-t border-line py-20 md:py-28"
    >
      <div
        aria-hidden
        className="grid-lattice-sm pointer-events-none absolute inset-0 opacity-25 mask-fade-b"
      />
      <div className="container-rail relative">
        <div className="max-w-3xl">
          <Reveal>
            <SectionLabel index="08">{t.label}</SectionLabel>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="display mt-6 text-fade-b text-[clamp(1.6rem,3.4vw,2.6rem)]">
              {t.title1}
              <br />
              {t.title2}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-6 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
              {t.body}
            </p>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {/* fixed */}
          <Reveal delay={160}>
            <div className="h-full rounded-xl border border-line bg-panel/50 p-7">
              <p className="label-mono text-ash-2">{t.fixedTitle}</p>
              <ul className="mt-6 space-y-5">
                {fixed.map((item, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border border-line-2 bg-panel-3 text-chalk/80">
                      <IconCheck className="size-3" />
                    </span>
                    <span className="text-[0.8125rem] leading-relaxed text-ash">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* open */}
          <Reveal delay={240}>
            <div className="h-full rounded-xl border border-warn/20 bg-warn/[0.04] p-7">
              <p className="label-mono text-warn/80">{t.openTitle}</p>
              <ul className="mt-6 space-y-5">
                {open.map((item, i) => (
                  <li key={i} className="flex gap-3.5">
                    <span
                      aria-hidden
                      className="mt-2 h-px w-3.5 shrink-0 bg-warn/50"
                    />
                    <span className="text-[0.8125rem] leading-relaxed text-ash-2">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="mt-10">
            <ButtonGhost href={at(DOC_ROUTES.potb)} arrow>
              {t.docsCta}
            </ButtonGhost>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
