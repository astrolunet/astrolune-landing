import type { Metadata } from "next";

import { AreaChart } from "@/components/site/area-chart";
import { BarRows, Ring } from "@/components/site/charts";
import {
  Notice,
  PageHero,
  Panel,
  PanelHead,
  Section,
  StatGrid,
} from "@/components/site/chrome";
import { FilterChips } from "@/components/site/tabs";
import { StatusDot, StatusPill, type Tone } from "@/components/status-dot";
import { Chip } from "@/components/ui";
import * as api from "@/lib/api";
import type { ServiceState } from "@/lib/api/types";
import type { TimeRange } from "@/lib/api";
import { BlockLink } from "@/components/scan/entities";
import { fmtInt, fmtPct } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.status.title,
    description: dict.status.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.status),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.status)]),
      ),
    },
  };
}

/**
 * Maps a module's implementation state onto a status tone.
 *
 * `stub` is the interesting case: the signature backend is *running*, so a naive
 * health check would report it green. It is deliberately rendered as `down`,
 * because "compiles and answers" and "is safe to rely on" are different claims
 * and this page should not conflate them.
 */
const STATE_TONE: Record<ServiceState, Tone> = {
  complete: "live",
  operational: "live",
  thin: "warn",
  stub: "down",
  absent: "muted",
};

const RANGES: TimeRange[] = ["h24", "d7", "d30"];

export default async function StatusPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { locale } = await params;
  const { range } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const window: TimeRange = RANGES.includes(range as TimeRange)
    ? (range as TimeRange)
    : "h24";

  const [stats, snapshot] = await Promise.all([
    api.getNetworkStats(),
    api.getStatus(window),
  ]);

  const stateLabel: Record<ServiceState, string> = {
    complete: dict.status.services.complete,
    operational: dict.status.services.operational,
    thin: dict.status.services.thin,
    stub: dict.status.services.stub,
    absent: dict.status.services.absent,
  };

  const cards = [
    {
      label: dict.status.charts.blockTime,
      value: `${Math.round(snapshot.blockTime.mean)} ${dict.status.charts.ms}`,
      sub: dict.home.network.subs.blockTime,
    },
    {
      label: dict.status.charts.tps,
      value: snapshot.tps.mean.toFixed(1),
      sub: dict.status.charts.tx,
    },
    {
      label: dict.status.charts.participation,
      value: fmtPct(snapshot.participation.mean),
      sub: dict.status.charts.participationNote,
    },
    {
      label: dict.status.charts.finality,
      value: `${Math.round(snapshot.finality.mean)} ${dict.status.charts.ms}`,
      sub: dict.status.charts.finalityNote,
    },
  ];

  const rangeChips = RANGES.map((key) => ({
    key,
    label: dict.status.ranges[key],
    href:
      key === "h24"
        ? at(ROUTES.status)
        : `${at(ROUTES.status)}?range=${key}`,
  }));

  const ticks =
    window === "h24"
      ? ["-24h", "-18h", "-12h", "-6h", "now"]
      : window === "d7"
        ? ["-7d", "-5d", "-3d", "-1d", "now"]
        : ["-30d", "-22d", "-15d", "-7d", "now"];

  return (
    <>
      <PageHero
        wide
        crumbs={[{ label: dict.status.title }]}
        title={dict.status.title}
        subtitle={dict.status.subtitle}
        aside={<StatusPill tone="warn">{dict.status.degraded}</StatusPill>}
      >
        <Notice>{dict.common.mockNotice}</Notice>
      </PageHero>

      <Section wide>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="label-mono text-ash-2">{dict.status.rangeLabel}</h2>
          <FilterChips items={rangeChips} active={window} />
        </div>

        <div className="mt-8">
          <StatGrid stats={cards} columns={4} />
        </div>

        {/* the two headline series */}
        <div className="mt-14 grid gap-3 lg:grid-cols-2">
          <Panel>
            <PanelHead
              title={dict.status.charts.blockTime}
              note={dict.status.charts.blockTimeNote}
            />
            <div className="mt-6">
              <AreaChart
                values={snapshot.blockTime.points}
                digits={0}
                unit={dict.status.charts.ms}
                ticks={ticks}
                ariaLabel={dict.status.charts.blockTime}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title={dict.status.charts.tps}
              note={dict.status.charts.tpsNote}
            />
            <div className="mt-6">
              <AreaChart
                values={snapshot.tps.points}
                digits={1}
                unit={dict.status.charts.tx}
                ticks={ticks}
                ariaLabel={dict.status.charts.tps}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title={dict.status.charts.participation}
              note={dict.status.charts.participationNote}
            />
            <div className="mt-6">
              <AreaChart
                values={snapshot.participation.points}
                digits={1}
                suffix="%"
                ticks={ticks}
                ariaLabel={dict.status.charts.participation}
              />
            </div>
          </Panel>

          <Panel>
            <PanelHead
              title={dict.status.charts.finality}
              note={dict.status.charts.finalityNote}
            />
            <div className="mt-6">
              <AreaChart
                values={snapshot.finality.points}
                digits={0}
                unit={dict.status.charts.ms}
                ticks={ticks}
                ariaLabel={dict.status.charts.finality}
              />
            </div>
          </Panel>
        </div>
      </Section>

      {/* epoch + distributions */}
      <Section wide className="border-t border-line" lattice>
        <div className="grid gap-3 lg:grid-cols-12">
          <Panel className="lg:col-span-4" ticks>
            <PanelHead title={dict.status.epoch.title} />
            <div className="mt-8 flex items-center gap-6">
              <Ring value={stats.epochProgress}>
                <span className="font-mono text-[1.05rem] text-chalk tabular-nums">
                  {Math.round(stats.epochProgress * 100)}%
                </span>
              </Ring>
              <div className="min-w-0 space-y-3">
                <Figure
                  label={dict.status.epoch.blocks}
                  value={fmtInt(stats.blocksThisEpoch)}
                />
                <Figure
                  label={dict.status.epoch.rotations}
                  value={fmtInt(stats.rotations)}
                />
                <Figure
                  label={dict.scan.block.epoch}
                  value={fmtInt(stats.epoch)}
                />
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
              <span className="label-mono text-ash-3">
                {dict.status.epoch.seedStatus}
              </span>
              <Chip tone="neutral">{dict.status.epoch.mixed}</Chip>
            </div>
          </Panel>

          <Panel className="lg:col-span-4">
            <PanelHead
              title={dict.status.charts.asn}
              note={dict.status.charts.asnNote}
            />
            <div className="mt-6">
              <BarRows rows={snapshot.asn.slice(0, 8)} unit="%" />
            </div>
          </Panel>

          <Panel className="lg:col-span-4">
            <PanelHead
              title={dict.status.charts.committee}
              note={dict.status.charts.committeeNote}
            />
            <div className="mt-6">
              <BarRows rows={snapshot.committee.slice(0, 8)} digits={2} />
            </div>
          </Panel>
        </div>
      </Section>

      {/* per-module state */}
      <Section wide className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.status.services.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[0.875rem] leading-relaxed text-ash">
          {dict.status.services.note}
        </p>

        <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {snapshot.services.map((service) => {
            const label =
              dict.status.services[
                service.key as keyof typeof dict.status.services
              ];
            return (
              <div
                key={service.key}
                className="flex items-start justify-between gap-4 bg-panel px-5 py-4 transition-colors duration-300 hover:bg-panel-2"
              >
                <span className="min-w-0">
                  <span className="flex items-center gap-2.5">
                    <StatusDot
                      tone={STATE_TONE[service.state]}
                      pulse={service.state === "complete"}
                    />
                    <span className="truncate text-[0.8125rem] text-chalk/90">
                      {typeof label === "string" ? label : service.key}
                    </span>
                  </span>
                  <span className="mt-1.5 block pl-[1.1rem] label-mono text-ash-3">
                    {stateLabel[service.state]}
                  </span>
                </span>
                {service.uptime !== null && (
                  <span className="shrink-0 font-mono text-[0.75rem] text-ash-2 tabular-nums">
                    {service.uptime.toFixed(2)}%
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <Notice tone="warn" className="mt-8">
          {dict.common.insecureCrypto}
        </Notice>
      </Section>

      {/* incidents */}
      <Section wide className="border-t border-line">
        <h2 className="display text-fade-b text-[clamp(1.4rem,2.8vw,2rem)]">
          {dict.status.incidents.title}
        </h2>

        <ul className="mt-10 divide-y divide-line border-t border-line">
          {snapshot.incidents.map((incident) => (
            <li key={incident.id} className="group py-6">
              <div className="flex flex-wrap items-center gap-3">
                <StatusDot tone={incident.tone} />
                <h3 className="text-[0.9375rem] font-medium tracking-tight text-chalk">
                  {incident.title}
                </h3>
                <span className="ml-auto shrink-0 label-mono text-ash-3">
                  <BlockLink height={incident.height} at={at} />
                </span>
              </div>
              <p className="mt-3 max-w-3xl pl-[1.1rem] text-[0.8125rem] leading-relaxed text-ash">
                {incident.body}
              </p>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

function Figure({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="label-mono text-ash-3">{label}</p>
      <p className="mt-1 font-mono text-[0.875rem] text-chalk tabular-nums">
        {value}
      </p>
    </div>
  );
}
