"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { Counter } from "@/components/motion";
import { CornerTicks } from "@/components/ui";
import { POTB, levelFor, loyaltyBonus, tbs, weight } from "@/lib/chain";

/* ------------------------------------------------------------------
   A slider whose track carries an optional hard stop — the point past
   which the formula clamps. Drawing the cap on the track is the whole
   pedagogical trick: you can see the input stop mattering.
   ------------------------------------------------------------------ */
function Slider({
  id,
  label,
  value,
  min,
  max,
  step,
  cap,
  display,
  onChange,
  capLabel,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  cap?: number;
  display: string;
  onChange: (v: number) => void;
  capLabel: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const capPct = cap === undefined ? null : ((cap - min) / (max - min)) * 100;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="label-mono text-ash-2">
          {label}
        </label>
        <span className="font-mono text-[0.8125rem] text-chalk tabular-nums">
          {display}
        </span>
      </div>

      <div className="relative mt-3.5">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1 w-full cursor-pointer appearance-none bg-line outline-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-chalk [&::-webkit-slider-thumb]:shadow-[0_0_0_5px_rgba(255,255,255,0.12)] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_8px_rgba(255,255,255,0.18)] [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-chalk"
          style={{
            background: `linear-gradient(to right, #f5f5f5 ${pct}%, rgba(255,255,255,0.09) ${pct}%)`,
          }}
        />

        {capPct !== null && capPct <= 100 && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 -translate-y-1/2"
            style={{ left: `calc(${capPct}% - 0.5px)` }}
          >
            <span className="block h-3 w-px bg-chalk/45" />
            <span className="absolute top-4 left-1/2 -translate-x-1/2 font-mono text-[0.5625rem] tracking-[0.12em] whitespace-nowrap text-ash-3 uppercase">
              {capLabel}
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

export function WeightCalculator() {
  const { dict } = useI18n();
  const t = dict.home.levels;

  const [days, setDays] = useState(420);
  const [correct, setCorrect] = useState(0.98);
  const [tgw, setTgw] = useState(0.62);
  const [ndm, setNdm] = useState(1.15);
  const [cod, setCod] = useState(0.85);

  const tbsScore = tbs(days, correct);
  const loyalty = loyaltyBonus(days);
  const w = weight({ tbs: tbsScore, tgw, ndm, cod });
  const level = levelFor(tbsScore, tgw);

  const levelName = {
    relay: t.items.relay.name,
    candidate: t.items.candidate.name,
    validator: t.items.validator.name,
  }[level];

  // Which rung of the ladder the current inputs sit on, for the track fill.
  const rung = { relay: 1, candidate: 2, validator: 3 }[level];

  return (
    <div className="group relative panel rounded-lg p-7 md:p-10">
      <CornerTicks className="absolute inset-0" />

      <div className="flex items-center justify-between">
        <p className="label-mono text-ash">{t.calcTitle}</p>
        <span className="font-mono text-[0.6875rem] text-ash-3">
          W = min(TBS,{POTB.capTbs}) × min(TGW,{POTB.capTgw}) × NDM × COD
        </span>
      </div>

      {/* the headline number */}
      <div className="mt-9 border-b border-line pb-8">
        <p className="label-mono text-ash-3">{t.calcWeight}</p>
        <p className="display mt-4 text-[clamp(2.2rem,5.5vw,3.5rem)] text-chalk tabular-nums">
          <Counter to={w.total} decimals={3} />
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="flex items-baseline gap-2">
            <span className="label-mono text-ash-3">{t.calcTbs}</span>
            <span className="font-mono text-[0.8125rem] text-chalk tabular-nums">
              {tbsScore.toFixed(2)}
            </span>
            {tbsScore > POTB.capTbs && (
              <span className="label-mono text-ash-3">
                → {t.calcCapped} {POTB.capTbs}
              </span>
            )}
          </span>
          <span className="flex items-baseline gap-2">
            <span className="label-mono text-ash-3">{t.calcLoyalty}</span>
            <span className="font-mono text-[0.8125rem] text-chalk tabular-nums">
              +{loyalty.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      {/* the five inputs */}
      <div className="mt-8 space-y-9">
        <Slider
          id="w-days"
          label={t.calcUptime}
          value={days}
          min={0}
          max={1460}
          step={5}
          cap={POTB.loyaltyThresholdDays}
          capLabel={t.calcLoyalty}
          display={`${days} ${t.calcDays}`}
          onChange={setDays}
        />
        <Slider
          id="w-correct"
          label={t.calcCorrect}
          value={correct}
          min={0.5}
          max={1}
          step={0.005}
          capLabel={t.calcCap}
          display={`${(correct * 100).toFixed(1)}%`}
          onChange={setCorrect}
        />
        <Slider
          id="w-tgw"
          label={t.calcTgw}
          value={tgw}
          min={0}
          max={1.4}
          step={0.01}
          cap={POTB.capTgw}
          capLabel={t.calcCap}
          display={tgw.toFixed(2)}
          onChange={setTgw}
        />
        <Slider
          id="w-ndm"
          label={t.calcNdm}
          value={ndm}
          min={0.6}
          max={1.5}
          step={0.01}
          capLabel={t.calcCap}
          display={`× ${ndm.toFixed(2)}`}
          onChange={setNdm}
        />
        <Slider
          id="w-cod"
          label={t.calcCod}
          value={cod}
          min={0.2}
          max={1}
          step={0.01}
          capLabel={t.calcCap}
          display={`× ${cod.toFixed(2)}`}
          onChange={setCod}
        />
      </div>

      {/* the level readout — a three-rung track, not a badge */}
      <div className="mt-10 border-t border-line pt-7">
        <div className="flex items-baseline justify-between">
          <span className="label-mono text-ash-3">{t.calcLevel}</span>
          <span className="text-[0.9375rem] font-medium tracking-tight text-chalk">
            {levelName}
          </span>
        </div>
        <div className="mt-4 flex gap-1.5">
          {[1, 2, 3].map((r) => (
            <span
              key={r}
              className={`h-[3px] flex-1 transition-colors duration-500 ${
                r <= rung ? "bg-chalk" : "bg-line"
              }`}
            />
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ash-3">{t.calcNote}</p>
    </div>
  );
}
