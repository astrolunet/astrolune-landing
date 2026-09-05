"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Reveal } from "@/components/motion";
import {
  ButtonGhost,
  CornerTicks,
  IconArrow,
  SectionLabel,
} from "@/components/ui";
import { localePath } from "@/lib/i18n/config";
import { DOC_ROUTES } from "@/lib/routes";

/* The sample is the one in `05-languages/contract-languages.md` §3.5, kept
   verbatim so the site never shows syntax the specification doesn't. */
const SAMPLE = `contract Token {
    state {
        name: string,
        total_supply: u64,
        balances: map<address, u64>,
    }

    // called once, at deployment
    init(name: string, initial_supply: u64) {
        self.name = name;
        self.total_supply = initial_supply;
        self.balances.insert(sender(), initial_supply);
    }

    pub fn transfer(&mut self, to: address, amount: u64) -> Result<(), Error> {
        require(self.balances[sender()] >= amount, Error::InsufficientBalance);
        require(to != address::zero(), Error::InvalidAddress);

        self.balances[sender()] -= amount;   // overflow-checked by default
        self.balances[to] += amount;

        emit Transfer { from: sender(), to, amount };
        Ok(())
    }
}`;

/* Syntax colouring for the sample. Groups: 1 comment, 2 string, 3 keyword,
   4 type / std item, 5 number. Comments stay grey so the colour carries the
   structure instead of decorating it. */
const TOKEN =
  /(\/\/[^\n]*)|("[^"]*")|\b(contract|state|init|pub|fn|self|emit|require|return|let|mut)\b|\b(string|u64|address|map|Result|Error|Ok|Transfer|Token|InsufficientBalance|InvalidAddress|zero|sender|insert)\b|\b(\d+)\b/g;

function paint(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;

  for (const m of line.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(line.slice(last, at));

    const cls = m[1]
      ? "text-ash-3/80 italic"
      : m[2]
        ? "text-emerald-300/90"
        : m[3]
          ? "text-fuchsia-300"
          : m[4]
            ? "text-sky-300/90"
            : "text-amber-300/90";

    out.push(
      <span key={k++} className={cls}>
        {m[0]}
      </span>,
    );
    last = at + m[0].length;
  }

  if (last < line.length) out.push(line.slice(last));
  return out;
}

const LINES = SAMPLE.split("\n");

export function Stack() {
  const { locale, dict } = useI18n();
  const t = dict.home.stack;
  const at = (path: string) => localePath(locale, path);

  const steps = [t.steps.tc, t.steps.rg, t.steps.bc];

  return (
    <section
      id="stack"
      className="relative overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="container-rail relative">
        <div className="grid grid-cols-1 gap-x-12 gap-y-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* left rail — the pipeline */}
          <div>
            <Reveal>
              <SectionLabel index="05">{t.label}</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="display mt-6 text-fade-b text-[clamp(1.7rem,3.7vw,3rem)]">
                {t.title1}
                <br />
                {t.title2}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-ash">
                {t.body}
              </p>
            </Reveal>

            <div className="mt-11 space-y-2.5">
              {steps.map((s, i) => (
                <Reveal key={s.name} delay={200 + i * 100}>
                  <div className="group relative flex items-center gap-4 overflow-hidden panel rounded-lg px-5 py-4 transition-colors duration-500 hover:border-line-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-line-2 bg-panel-3 font-mono text-[0.6875rem] text-chalk/75">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-2">
                        <span className="text-[0.9375rem] font-medium tracking-tight text-chalk">
                          {s.name}
                        </span>
                        {s.ext && (
                          <span className="font-mono text-[0.6875rem] text-ash-3">
                            {s.ext}
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] text-ash-2">
                        {s.desc}
                      </span>
                    </span>
                    {/* the pipeline arrow, absent on the last tier */}
                    {i < steps.length - 1 && (
                      <IconArrow className="size-3.5 rotate-90 text-ash-3 transition-colors duration-500 group-hover:text-chalk/70" />
                    )}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-chalk/45 transition-transform duration-500 group-hover:scale-y-100"
                    />
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={520}>
              <div className="mt-9">
                <ButtonGhost href={at(DOC_ROUTES.languages)} size="sm">
                  {dict.common.readDocs}
                </ButtonGhost>
              </div>
            </Reveal>
          </div>

          {/* right — the code panel */}
          <Reveal delay={220}>
            <figure className="relative h-full overflow-hidden panel rounded-lg">
              <CornerTicks className="absolute inset-0 z-20" />
              <figcaption className="flex items-center justify-between border-b border-line px-5 py-3.5">
                <span className="label-mono text-ash-2">{t.sample}</span>
                <span className="font-mono text-[0.6875rem] text-ash-3">
                  token.tc
                </span>
              </figcaption>
              <div className="overflow-x-auto px-5 py-5">
                <pre className="font-mono text-[0.71875rem] leading-[1.8] text-ash-2">
                  <code>
                    {LINES.map((line, i) => (
                      <span
                        key={i}
                        className="grid grid-cols-[2.1rem_1fr] whitespace-pre"
                      >
                        <span className="select-none pr-3 text-right text-ash-3/50">
                          {i + 1}
                        </span>
                        <span>{paint(line)}</span>
                      </span>
                    ))}
                  </code>
                </pre>
              </div>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
