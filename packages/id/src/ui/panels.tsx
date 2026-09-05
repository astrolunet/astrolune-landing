"use client";

/**
 * The dashboard panels.
 *
 * Each one is exported on its own because a host may want the wallets table on
 * a settings page without the rest of the console. Each also owns the overlay
 * it opens, so mounting a panel is enough to make it work — with one exception:
 * `IdPayModal` is deliberately *not* mounted here. Several panels can start a
 * purchase, and a modal per panel would stack identical dialogs on one invoice.
 * `IdConsole` mounts it once; a host composing panels by hand must too.
 */

import { useState } from "react";
import {
  fmtBytes,
  fmtDay,
  fmtLune,
  fmtPct,
  group,
  shortAddr,
} from "../format";
import { PROXY_TRAFFIC, SHARE_QUOTAS, regionLabel } from "../mock";
import {
  useCatalog,
  useDomains,
  useIdStrings,
  useIdentity,
  useNodes,
  useNow,
  useProxy,
  useShare,
  useValidator,
  useWallets,
} from "../react";
import type { Bucket, CatalogItem, Domain, NodeStat, ProxyEndpoint } from "../types";
import {
  IdBucketDrawer,
  IdDomainDrawer,
  IdProxyModal,
  IdWalletDrawer,
} from "./dialogs";
import {
  IdButton,
  IdChip,
  IdCopyField,
  IdDisclosure,
  IdEmpty,
  IdField,
  IdIconButton,
  IdMeter,
  IdNotice,
  IdPanel,
  IdPanelHead,
  IdRow,
  IdSparkline,
  IdStat,
  IdStatusDot,
  IdTable,
  IdTd,
  IdTr,
  type IdTone,
} from "./primitives";
import {
  IdIconGauge,
  IdIconGlobe,
  IdIconLayers,
  IdIconNode,
  IdIconPlus,
  IdIconRefresh,
  IdIconRoute,
  IdIconShield,
  IdIconTrash,
  IdIconWallet,
} from "./icons";

/* ------------------------------------------------------------------
   Shared tone maps
   ------------------------------------------------------------------ */

const NODE_TONES: Record<NodeStat["status"], IdTone> = {
  online: "live",
  syncing: "warn",
  offline: "down",
};

const BUCKET_TONES: Record<Bucket["status"], IdTone> = {
  ready: "live",
  syncing: "warn",
  degraded: "down",
};

const DOMAIN_TONES: Record<Domain["status"], IdTone> = {
  active: "live",
  grace: "down",
  pending: "warn",
};

const PROXY_TONES: Record<ProxyEndpoint["status"], IdTone> = {
  active: "live",
  paused: "warn",
  expired: "down",
};

/** Fraction of quota past which the panel says so out loud. */
const NEARLY_FULL = 0.85;

/* ==================================================================
   Overview
   ================================================================== */

function CatalogCard({ item, onBuy }: { item: CatalogItem; onBuy: () => void }) {
  const strings = useIdStrings();
  const period =
    item.period === "once"
      ? strings.common.once
      : item.period === "month"
        ? strings.common.perMonth
        : strings.common.perYear;

  return (
    <div className="flex flex-col rounded-lg border border-line bg-panel-2/50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[0.875rem] text-chalk">{item.label}</div>
          <div className="mt-1 font-mono text-[0.625rem] text-ash-3">{item.sku}</div>
        </div>
        <IdChip tone="muted">{item.kind}</IdChip>
      </div>

      <p className="mt-3 text-[0.8125rem] leading-relaxed text-ash-2">{item.blurb}</p>

      <dl className="mt-3 grid gap-1">
        {item.specs.map((spec) => (
          <div key={spec.k} className="flex items-baseline justify-between gap-3">
            <dt className="label-mono text-[0.5625rem] text-ash-3">{spec.k}</dt>
            <dd className="data-cell text-[0.75rem] text-ash">{spec.v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3.5">
        <span className="data-cell text-[0.875rem] text-chalk">
          {fmtLune(item.price, 2)}
          <span className="ml-1 text-ash-3">{period}</span>
        </span>
        <IdButton size="sm" variant="solid" onClick={onBuy}>
          {strings.common.buy}
        </IdButton>
      </div>
    </div>
  );
}

export function IdOverviewPanel() {
  const strings = useIdStrings();
  const { identity } = useIdentity();
  const { domains, expiring } = useDomains();
  const { wallets, primary, total } = useWallets();
  const { usedBytes, quotaBytes } = useShare();
  const { usedGb, quotaGb } = useProxy();
  const { nodes, online } = useNodes();
  const { catalog, buy } = useCatalog();
  const now = useNow(60_000);

  const soon = now === null ? [] : expiring(now);

  return (
    <div className="grid gap-4">
      <IdPanel>
        <IdPanelHead
          title={strings.overview.title}
          note={strings.common.prototypeBody}
          icon={<IdIconGauge className="size-4" />}
          actions={
            identity && <IdChip tone="neutral">{identity.tier}</IdChip>
          }
        />

        <div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          <IdStat label={strings.overview.domains} value={domains.length} />
          <IdStat
            label={strings.overview.wallets}
            value={wallets.length}
            hint={primary ? shortAddr(primary.address) : strings.common.none}
          />
          <IdStat
            label={strings.overview.balance}
            value={fmtLune(total, 2)}
            hint={strings.wallets.verified}
          />
          <IdStat
            label={strings.overview.storage}
            value={fmtBytes(usedBytes)}
            hint={`${strings.share.quota}: ${fmtBytes(quotaBytes)}`}
          />
          <IdStat
            label={strings.overview.traffic}
            value={`${usedGb.toFixed(1)} GB`}
            hint={`${strings.share.quota}: ${quotaGb} GB`}
          />
          <IdStat
            label={strings.overview.nodes}
            value={`${online} ${strings.common.of} ${nodes.length}`}
            hint={identity?.isValidator ? strings.nav.validator : undefined}
          />
        </div>
      </IdPanel>

      <IdPanel>
        <IdPanelHead
          title={strings.overview.expiring}
          icon={<IdIconGlobe className="size-4" />}
        />
        <div className="mt-4 grid gap-2">
          {now === null ? (
            // The client clock has not started, so "expiring" has no meaning
            // yet. A skeleton row keeps the panel from jumping on the tick.
            <div className="h-[52px] animate-pulse rounded-lg border border-line bg-panel-2/40" />
          ) : soon.length === 0 ? (
            <p className="label-mono text-ash-3">{strings.overview.expiringNone}</p>
          ) : (
            soon.map((domain) => (
              <div
                key={domain.name}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-panel-2/50 px-4 py-3"
              >
                <span className="data-cell text-chalk">{domain.name}</span>
                <span className="flex items-center gap-3">
                  <span className="data-cell text-[0.75rem] text-ash-3">
                    {fmtDay(domain.expiresAt)}
                  </span>
                  {domain.status === "grace" ? (
                    <IdChip tone="warn">{strings.domains.inGrace}</IdChip>
                  ) : (
                    <IdChip tone="muted">
                      {Math.max(0, Math.ceil((domain.expiresAt - now) / 86_400_000))}{" "}
                      {strings.domains.daysLeft}
                    </IdChip>
                  )}
                </span>
              </div>
            ))
          )}
        </div>
      </IdPanel>

      <IdPanel>
        <IdPanelHead
          title={strings.overview.quickBuy}
          icon={<IdIconPlus className="size-4" />}
        />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {catalog.map((item) => (
            <CatalogCard key={item.sku} item={item} onBuy={() => buy(item.sku)} />
          ))}
        </div>
      </IdPanel>
    </div>
  );
}

/* ==================================================================
   Domains
   ================================================================== */

export function IdDomainsPanel() {
  const strings = useIdStrings();
  const { domains, register } = useDomains();
  const [selected, setSelected] = useState<Domain | null>(null);
  const [name, setName] = useState("");

  const submit = () => {
    const trimmed = name.trim().replace(/\.lune$/i, "");
    if (!trimmed) return;
    register(`${trimmed}.lune`);
    setName("");
  };

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.domains.title}
        note={strings.domains.note}
        icon={<IdIconGlobe className="size-4" />}
      />

      <div className="mt-5">
        {domains.length === 0 ? (
          <IdEmpty>{strings.domains.empty}</IdEmpty>
        ) : (
          <IdTable
            head={[
              strings.domains.name,
              strings.domains.status,
              strings.domains.expires,
              strings.domains.records,
              strings.domains.autoRenew,
              "",
            ]}
          >
            {domains.map((domain) => (
              <IdTr key={domain.name}>
                <IdTd align="left">
                  <span className="text-chalk">{domain.name}</span>
                  {domain.target && (
                    <span className="mt-0.5 block font-mono text-[0.625rem] text-ash-3">
                      {shortAddr(domain.target, 10, 6)}
                    </span>
                  )}
                </IdTd>
                <IdTd>
                  <IdStatusDot
                    tone={DOMAIN_TONES[domain.status]}
                    label={domain.status}
                    pulse={domain.status === "pending"}
                    className="justify-end"
                  />
                </IdTd>
                <IdTd>{fmtDay(domain.expiresAt)}</IdTd>
                <IdTd>{domain.records}</IdTd>
                <IdTd>
                  <IdChip tone={domain.autoRenew ? "neutral" : "muted"}>
                    {domain.autoRenew ? strings.common.yes : strings.common.no}
                  </IdChip>
                </IdTd>
                <IdTd>
                  <IdButton size="sm" onClick={() => setSelected(domain)}>
                    {strings.domains.manage}
                  </IdButton>
                </IdTd>
              </IdTr>
            ))}
          </IdTable>
        )}
      </div>

      <IdDisclosure
        summary={strings.domains.register}
        meta={<IdIconPlus className="size-3.5" />}
        className="mt-4"
      >
        <div className="flex flex-wrap items-end gap-3">
          <IdField
            label={strings.domains.name}
            hint="name.lune"
            value={name}
            onChange={setName}
            placeholder="orbit"
            mono
            className="min-w-[12rem] flex-1"
          />
          <IdButton
            variant="solid"
            onClick={submit}
            disabled={name.trim().length === 0}
          >
            {strings.domains.register}
          </IdButton>
        </div>
      </IdDisclosure>

      <IdDomainDrawer
        open={selected !== null}
        onClose={() => setSelected(null)}
        domain={selected}
      />
    </IdPanel>
  );
}

/* ==================================================================
   Wallets
   ================================================================== */

export function IdWalletsPanel() {
  const strings = useIdStrings();
  const { wallets, total, unlink, setPrimary } = useWallets();
  const [open, setOpen] = useState(false);

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.wallets.title}
        note={strings.wallets.note}
        icon={<IdIconWallet className="size-4" />}
        actions={
          <IdButton size="sm" variant="solid" onClick={() => setOpen(true)}>
            {strings.wallets.link}
          </IdButton>
        }
      />

      <div className="mt-5 grid gap-2">
        {wallets.length === 0 ? (
          <IdEmpty
            action={
              <IdButton variant="solid" onClick={() => setOpen(true)}>
                {strings.wallets.link}
              </IdButton>
            }
          >
            {strings.wallets.empty}
          </IdEmpty>
        ) : (
          wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="rounded-lg border border-line bg-panel-2/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[0.875rem] text-chalk">{wallet.label}</span>
                    {wallet.primary && (
                      <IdChip tone="solid">{strings.wallets.primary}</IdChip>
                    )}
                    <IdChip tone="muted">{strings.wallets.kinds[wallet.kind]}</IdChip>
                    {!wallet.verified && (
                      <IdChip tone="warn">{strings.wallets.watch}</IdChip>
                    )}
                  </div>
                  <div className="mt-1.5 hash-clip font-mono text-[0.6875rem] text-ash-3">
                    {wallet.address}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="data-cell text-[0.9375rem] text-chalk">
                    {fmtLune(wallet.balance, 2)}
                  </div>
                  <div className="mt-0.5 label-mono text-[0.5625rem] text-ash-3">
                    {strings.wallets.balance}
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
                {!wallet.primary && wallet.verified && (
                  <IdButton size="sm" onClick={() => setPrimary(wallet.id)}>
                    {strings.wallets.makePrimary}
                  </IdButton>
                )}
                <span className="label-mono text-[0.5625rem] text-ash-3">
                  {fmtDay(wallet.linkedAt)}
                </span>
                <IdIconButton
                  onClick={() => unlink(wallet.id)}
                  ariaLabel={`${strings.wallets.unlink} — ${wallet.label}`}
                  className="ml-auto"
                >
                  <IdIconTrash className="size-3.5" />
                </IdIconButton>
              </div>
            </div>
          ))
        )}
      </div>

      {wallets.length > 0 && (
        <div className="mt-4 grid">
          <IdRow label={strings.overview.balance}>{fmtLune(total, 4)}</IdRow>
        </div>
      )}

      <IdWalletDrawer open={open} onClose={() => setOpen(false)} />
    </IdPanel>
  );
}

/* ==================================================================
   Share
   ================================================================== */

export function IdSharePanel() {
  const strings = useIdStrings();
  const { buckets, usedBytes, quotaBytes, grow, remove } = useShare();
  const [open, setOpen] = useState(false);

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.share.title}
        note={strings.share.note}
        icon={<IdIconLayers className="size-4" />}
        actions={
          <IdButton size="sm" variant="solid" onClick={() => setOpen(true)}>
            {strings.share.create}
          </IdButton>
        }
      />

      {buckets.length > 0 && (
        <IdMeter
          className="mt-5"
          value={usedBytes}
          max={quotaBytes}
          label={strings.share.usage}
          right={`${fmtBytes(usedBytes)} / ${fmtBytes(quotaBytes)}`}
        />
      )}

      <div className="mt-5 grid gap-2">
        {buckets.length === 0 ? (
          <IdEmpty
            action={
              <IdButton variant="solid" onClick={() => setOpen(true)}>
                {strings.share.create}
              </IdButton>
            }
          >
            {strings.share.empty}
          </IdEmpty>
        ) : (
          buckets.map((bucket) => {
            const ratio = bucket.quotaBytes > 0 ? bucket.usedBytes / bucket.quotaBytes : 0;
            const next = SHARE_QUOTAS.find(
              (quota) => quota.gb > bucket.quotaBytes / 1024 ** 3,
            );

            return (
              <IdDisclosure
                key={bucket.id}
                summary={
                  <span className="flex min-w-0 items-center gap-3">
                    <IdStatusDot
                      tone={BUCKET_TONES[bucket.status]}
                      pulse={bucket.status === "syncing"}
                    />
                    <span className="truncate data-cell text-chalk">{bucket.label}</span>
                    {ratio > NEARLY_FULL && (
                      <IdChip tone="warn">{fmtPct(ratio * 100, 0)}</IdChip>
                    )}
                  </span>
                }
                meta={
                  <span className="data-cell text-[0.75rem] text-ash-3">
                    {fmtBytes(bucket.usedBytes)} / {fmtBytes(bucket.quotaBytes)}
                  </span>
                }
              >
                <div className="grid gap-4">
                  <IdMeter
                    value={bucket.usedBytes}
                    max={bucket.quotaBytes}
                    label={strings.share.usage}
                    right={fmtPct(ratio * 100, 1)}
                  />
                  <div className="grid">
                    <IdRow label={strings.share.region}>
                      {regionLabel(bucket.region)}
                    </IdRow>
                    <IdRow label={strings.share.pins}>{group(String(bucket.pins))}</IdRow>
                    <IdRow label={strings.share.replicas}>{bucket.replicas}</IdRow>
                  </div>
                  <IdCopyField
                    label={strings.share.endpoint}
                    value={`https://${bucket.endpoint}`}
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    {next && (
                      <IdButton size="sm" onClick={() => grow(bucket.id, next.gb)}>
                        {strings.share.buy} ·{" "}
                        {next.gb >= 1024 ? `${next.gb / 1024} TB` : `${next.gb} GB`}
                      </IdButton>
                    )}
                    <IdIconButton
                      onClick={() => remove(bucket.id)}
                      ariaLabel={`${strings.share.remove} — ${bucket.label}`}
                      className="ml-auto"
                    >
                      <IdIconTrash className="size-3.5" />
                    </IdIconButton>
                  </div>
                </div>
              </IdDisclosure>
            );
          })
        )}
      </div>

      <IdBucketDrawer open={open} onClose={() => setOpen(false)} />
    </IdPanel>
  );
}

/* ==================================================================
   Proxy
   ================================================================== */

export function IdProxyPanel() {
  const strings = useIdStrings();
  const { proxies, usedGb, quotaGb, rotate } = useProxy();
  const [selected, setSelected] = useState<ProxyEndpoint | null>(null);
  const [buying, setBuying] = useState(false);

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.proxy.title}
        note={strings.proxy.note}
        icon={<IdIconRoute className="size-4" />}
        actions={
          <IdButton size="sm" variant="solid" onClick={() => setBuying(true)}>
            {strings.proxy.buy}
          </IdButton>
        }
      />

      {proxies.length > 0 && (
        <IdMeter
          className="mt-5"
          value={usedGb}
          max={quotaGb}
          label={strings.proxy.traffic}
          right={`${usedGb.toFixed(1)} / ${quotaGb} GB`}
        />
      )}

      <div className="mt-5 grid gap-2">
        {proxies.length === 0 ? (
          <IdEmpty
            action={
              <IdButton variant="solid" onClick={() => setBuying(true)}>
                {strings.proxy.buy}
              </IdButton>
            }
          >
            {strings.proxy.empty}
          </IdEmpty>
        ) : (
          proxies.map((proxy) => (
            <div
              key={proxy.id}
              className="rounded-lg border border-line bg-panel-2/50 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <IdStatusDot
                      tone={PROXY_TONES[proxy.status]}
                      pulse={proxy.status === "active"}
                    />
                    <span className="text-[0.875rem] text-chalk">{proxy.label}</span>
                    <IdChip tone="muted">{proxy.protocol}</IdChip>
                    <IdChip tone="outline">
                      {strings.proxy.rotations[proxy.rotation]}
                    </IdChip>
                  </div>
                  <div className="mt-1.5 font-mono text-[0.6875rem] text-ash-3">
                    {proxy.host}:{proxy.port} · {regionLabel(proxy.region)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="data-cell text-[0.875rem] text-chalk">
                    {proxy.usedGb.toFixed(1)}
                    <span className="text-ash-3"> / {proxy.quotaGb} GB</span>
                  </div>
                  <div className="mt-0.5 label-mono text-[0.5625rem] text-ash-3">
                    {strings.proxy.expires} {fmtDay(proxy.expiresAt)}
                  </div>
                </div>
              </div>

              <IdMeter
                className="mt-3.5"
                value={proxy.usedGb}
                max={proxy.quotaGb}
              />

              <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
                <IdButton size="sm" variant="solid" onClick={() => setSelected(proxy)}>
                  {strings.proxy.configure}
                </IdButton>
                <IdButton size="sm" onClick={() => rotate(proxy.id)}>
                  {strings.proxy.rotate}
                </IdButton>
                <span className="ml-auto label-mono text-[0.5625rem] text-ash-3">
                  {strings.proxy.username}: {proxy.username}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <IdNotice className="mt-4" title={strings.common.price}>
        {PROXY_TRAFFIC.map((tier) => `${tier.gb} GB — ${fmtLune(tier.price, 2)}`).join(
          " · ",
        )}{" "}
        {strings.common.perMonth}
      </IdNotice>

      {/* Configure and buy are the same modal in two modes; keeping them as two
          mounts means closing one cannot leave the other holding stale state. */}
      <IdProxyModal
        open={selected !== null}
        onClose={() => setSelected(null)}
        endpoint={selected}
      />
      <IdProxyModal open={buying} onClose={() => setBuying(false)} />
    </IdPanel>
  );
}

/* ==================================================================
   Nodes
   ================================================================== */

export function IdNodesPanel() {
  const strings = useIdStrings();
  const { nodes, online, refresh } = useNodes();

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.nodes.title}
        note={strings.nodes.note}
        icon={<IdIconNode className="size-4" />}
        actions={
          <span className="flex items-center gap-2.5">
            <IdChip tone="neutral">
              {online} {strings.common.of} {nodes.length}
            </IdChip>
            <IdIconButton onClick={refresh} ariaLabel={strings.nodes.refresh}>
              <IdIconRefresh className="size-3.5" />
            </IdIconButton>
          </span>
        }
      />

      <div className="mt-5 grid gap-2">
        {nodes.length === 0 ? (
          <IdEmpty>{strings.nodes.empty}</IdEmpty>
        ) : (
          nodes.map((node) => (
            <IdDisclosure
              key={node.id}
              defaultOpen={node.role === "validator"}
              summary={
                <span className="flex min-w-0 items-center gap-3">
                  <IdStatusDot
                    tone={NODE_TONES[node.status]}
                    pulse={node.status !== "offline"}
                  />
                  <span className="truncate data-cell text-chalk">{node.label}</span>
                  <IdChip tone="muted">{strings.nodes.roles[node.role]}</IdChip>
                </span>
              }
              meta={
                <span className="flex items-center gap-3">
                  <span className="hidden w-16 text-ash-2 sm:block">
                    <IdSparkline series={node.series} className="h-6 w-full" />
                  </span>
                  <span className="data-cell text-[0.75rem] text-ash-3">
                    {fmtPct(node.uptimePct, 2)}
                  </span>
                </span>
              }
            >
              <div className="grid gap-4">
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  <IdStat
                    label={strings.nodes.uptime}
                    value={fmtPct(node.uptimePct, 2)}
                  />
                  <IdStat label={strings.nodes.peers} value={node.peers} />
                  <IdStat
                    label={strings.nodes.height}
                    value={group(String(node.height))}
                  />
                  <IdStat
                    label={strings.nodes.missRate}
                    value={fmtPct(node.missRate, 2)}
                  />
                </div>

                <div>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="label-mono text-[0.5625rem] text-ash-3">
                      {strings.nodes.blockTime}
                    </span>
                    <span className="data-cell text-[0.75rem] text-ash">
                      {node.series[node.series.length - 1]} ms
                    </span>
                  </div>
                  <span className="block text-ash-2">
                    <IdSparkline series={node.series} className="h-10 w-full" />
                  </span>
                </div>

                <div className="grid">
                  <IdRow label={strings.nodes.node}>{node.nodeId}</IdRow>
                  <IdRow label={strings.nodes.region}>{regionLabel(node.region)}</IdRow>
                  <IdRow label={strings.nodes.version}>{node.version}</IdRow>
                  <IdRow label={strings.domains.status}>
                    {strings.nodes.statuses[node.status]}
                  </IdRow>
                </div>
              </div>
            </IdDisclosure>
          ))
        )}
      </div>
    </IdPanel>
  );
}

/* ==================================================================
   Validator
   ================================================================== */

/** One weight component, with the bar and the number side by side. */
function Component({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-panel-2/60 px-3.5 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-mono text-[0.5625rem] text-ash-3">{label}</span>
        <span className="data-cell text-[0.875rem] text-chalk">
          {value.toFixed(1)}
        </span>
      </div>
      <IdMeter className="mt-2.5" value={value} max={100} />
    </div>
  );
}

export function IdValidatorPanel() {
  const strings = useIdStrings();
  const { validator, node } = useValidator();

  if (!validator) {
    return (
      <IdPanel>
        <IdPanelHead
          title={strings.validator.title}
          note={strings.validator.note}
          icon={<IdIconShield className="size-4" />}
        />
        <div className="mt-5">
          <IdEmpty>{strings.validator.notValidator}</IdEmpty>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ash-2">
            {strings.validator.notValidatorBody}
          </p>
        </div>
      </IdPanel>
    );
  }

  return (
    <IdPanel>
      <IdPanelHead
        title={strings.validator.title}
        note={strings.validator.note}
        icon={<IdIconShield className="size-4" />}
        actions={
          <IdChip tone={validator.inCommittee ? "solid" : "outline"}>
            {validator.inCommittee
              ? strings.validator.inCommittee
              : strings.validator.outOfCommittee}
          </IdChip>
        }
      />

      <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
        <IdStat
          label={strings.validator.weight}
          value={validator.weight.toFixed(1)}
          hint={node ? node.label : undefined}
        />
        <IdStat label={strings.validator.rank} value={`#${validator.rank}`} />
        <IdStat
          label={strings.validator.epochs}
          value={group(String(validator.epochsInCommittee))}
          hint={`${strings.validator.missed}: ${validator.missedVotes}`}
        />
      </div>

      <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        <Component label={strings.validator.tbs} value={validator.tbs} />
        <Component label={strings.validator.tgw} value={validator.tgw} />
        <Component label={strings.validator.ndm} value={validator.ndm} />
        <Component label={strings.validator.cod} value={validator.cod} />
      </div>

      <div className="mt-5 grid">
        <IdRow label={strings.nodes.node}>{validator.nodeId}</IdRow>
        <IdRow label={strings.validator.bond}>{fmtLune(validator.bond, 2)}</IdRow>
        <IdRow label={strings.validator.rewards}>
          {fmtLune(validator.rewards30d, 4)}
        </IdRow>
        <IdRow label={strings.validator.committee}>
          {validator.inCommittee ? strings.common.yes : strings.common.no}
        </IdRow>
      </div>

      <IdNotice className="mt-4" title={strings.validator.bond}>
        {strings.validator.bondNote}
      </IdNotice>

      <div className="mt-5">
        <div className="label-mono mb-3 text-[0.5625rem] text-ash-3">
          {strings.validator.penalties}
        </div>
        {validator.penalties.length === 0 ? (
          <p className="label-mono text-ash-3">{strings.validator.penaltiesNone}</p>
        ) : (
          <IdTable head={[strings.validator.penalties, strings.domains.expires, ""]}>
            {validator.penalties.map((penalty) => (
              <IdTr key={`${penalty.label}-${penalty.at}`}>
                <IdTd align="left">{penalty.label}</IdTd>
                <IdTd>{fmtDay(penalty.at)}</IdTd>
                <IdTd>
                  <span className="text-ash-2">{penalty.delta}</span>
                </IdTd>
              </IdTr>
            ))}
          </IdTable>
        )}
      </div>
    </IdPanel>
  );
}
