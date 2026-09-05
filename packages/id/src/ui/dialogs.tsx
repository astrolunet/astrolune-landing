"use client";

/**
 * The task dialogs: proxy configuration, wallet linking, bucket creation and
 * name management.
 *
 * The split between modal and drawer is not decoration. A proxy endpoint is
 * configured in a modal because the form *is* the task and nothing behind it
 * matters. A wallet, bucket or name is edited in a drawer because the list it
 * came from is the context you are checking your input against — an address you
 * are pasting, a label you are trying not to duplicate.
 */

import { useEffect, useState } from "react";
import {
  PROXY_PROTOCOLS,
  PROXY_ROTATIONS,
  PROXY_TRAFFIC,
  REGIONS,
  SHARE_QUOTAS,
  regionLabel,
} from "../mock";
import { daysUntil, fmtDay, fmtLune, shortAddr } from "../format";
import { useIdStrings, useDomains, useNow, useProxy, useShare, useWallets } from "../react";
import type {
  Domain,
  ProxyEndpoint,
  ProxyProtocol,
  ProxyRotation,
  WalletKind,
} from "../types";
import {
  IdButton,
  IdChip,
  IdCopyField,
  IdDrawer,
  IdField,
  IdIconButton,
  IdMeter,
  IdModal,
  IdNotice,
  IdRow,
  IdSegmented,
  IdSelect,
  IdSwitch,
} from "./primitives";
import { IdIconEye, IdIconEyeOff, IdIconRefresh } from "./icons";

const REGION_OPTIONS = REGIONS.map((region) => ({
  value: region.id,
  label: region.label,
}));

/* ==================================================================
   Proxy
   ================================================================== */

/** `socks5://user:secret@host:port`, or the WireGuard endpoint line. */
function connectionString(proxy: ProxyEndpoint, secret: string): string {
  if (proxy.protocol === "wireguard") {
    return `Endpoint = ${proxy.host}:${proxy.port}\nPresharedKey = ${secret}`;
  }
  const scheme = proxy.protocol === "https" ? "https" : "socks5h";
  return `${scheme}://${proxy.username}:${secret}@${proxy.host}:${proxy.port}`;
}

function curlLine(proxy: ProxyEndpoint, secret: string): string {
  if (proxy.protocol === "wireguard") {
    return `wg-quick up ./${proxy.label}.conf`;
  }
  return `curl -x ${connectionString(proxy, secret)} https://ifconfig.astrolune.net`;
}

/**
 * One modal, two modes. With an `endpoint` it configures and rotates; without
 * one it buys. They share a shape because the fields are the same fields, and
 * splitting them into two components would mean maintaining that twice.
 */
export function IdProxyModal({
  open,
  onClose,
  endpoint,
}: {
  open: boolean;
  onClose: () => void;
  endpoint?: ProxyEndpoint | null;
}) {
  const strings = useIdStrings();
  const { buy, configure, rotate, topUp } = useProxy();

  const [protocol, setProtocol] = useState<ProxyProtocol>(endpoint?.protocol ?? "socks5");
  const [rotation, setRotation] = useState<ProxyRotation>(
    endpoint?.rotation ?? "per-request",
  );
  const [region, setRegion] = useState(endpoint?.region ?? REGIONS[0].id);
  const [quotaGb, setQuotaGb] = useState(PROXY_TRAFFIC[1].gb);
  const [label, setLabel] = useState("");
  const [shown, setShown] = useState(false);

  // Reopening on a different endpoint has to reset the form, or the previous
  // endpoint's protocol is applied to this one.
  useEffect(() => {
    if (!open) return;
    setShown(false);
    if (endpoint) {
      setProtocol(endpoint.protocol);
      setRotation(endpoint.rotation);
      setRegion(endpoint.region);
    }
  }, [open, endpoint]);

  const protocolOptions = PROXY_PROTOCOLS.map((value) => ({
    value,
    label: value.toUpperCase(),
  }));
  const rotationOptions = PROXY_ROTATIONS.map((value) => ({
    value,
    label: strings.proxy.rotations[value],
  }));
  const quotaOptions = PROXY_TRAFFIC.map((tier) => ({
    value: String(tier.gb),
    label: `${tier.gb} GB`,
  }));

  const price = PROXY_TRAFFIC.find((tier) => tier.gb === quotaGb) ?? PROXY_TRAFFIC[1];
  const secret = endpoint ? (shown ? endpoint.secret : "•".repeat(24)) : "";

  const apply = () => {
    if (!endpoint) return;
    configure(endpoint.id, { protocol, rotation });
    onClose();
  };

  const purchase = () => {
    buy({ label, region, protocol, rotation, quotaGb });
    onClose();
  };

  return (
    <IdModal
      open={open}
      onClose={onClose}
      eyebrow={`${strings.brand} · ${strings.proxy.title}`}
      title={endpoint ? endpoint.label : strings.proxy.modal.title}
      blurb={strings.proxy.modal.blurb}
      className="max-w-xl"
      footer={
        <>
          <IdButton variant="quiet" onClick={onClose}>
            {strings.common.cancel}
          </IdButton>
          {endpoint ? (
            <IdButton variant="solid" onClick={apply}>
              {strings.proxy.modal.apply}
            </IdButton>
          ) : (
            <IdButton variant="solid" onClick={purchase}>
              {strings.proxy.modal.buy} · {fmtLune(price.price, 2)}
            </IdButton>
          )}
        </>
      }
    >
      <div className="grid gap-5">
        <IdSegmented
          label={strings.proxy.modal.protocolLabel}
          value={protocol}
          onChange={setProtocol}
          options={protocolOptions}
        />
        <IdSegmented
          label={strings.proxy.modal.rotationLabel}
          value={rotation}
          onChange={setRotation}
          options={rotationOptions}
        />

        {endpoint ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <IdCopyField
                label={strings.proxy.username}
                value={endpoint.username}
              />
              <div>
                <div className="label-mono mb-2 flex items-center justify-between gap-3 text-[0.5625rem] text-ash-3">
                  <span>{strings.proxy.secret}</span>
                  <button
                    type="button"
                    onClick={() => setShown((value) => !value)}
                    className="inline-flex items-center gap-1.5 text-ash-2 transition-colors duration-200 hover:text-chalk"
                  >
                    {shown ? (
                      <IdIconEyeOff className="size-3" />
                    ) : (
                      <IdIconEye className="size-3" />
                    )}
                    {shown ? strings.proxy.hide : strings.proxy.reveal}
                  </button>
                </div>
                <div className="flex items-stretch gap-2">
                  <div className="min-w-0 flex-1 rounded-lg border border-line-2 bg-panel-2 px-3.5 py-2.5">
                    <span className="block hash-clip text-chalk">{secret}</span>
                  </div>
                  <IdIconButton
                    onClick={() => rotate(endpoint.id)}
                    ariaLabel={strings.proxy.rotate}
                    size="size-[42px]"
                    className="rounded-lg"
                  >
                    <IdIconRefresh className="size-3.5" />
                  </IdIconButton>
                </div>
              </div>
            </div>

            <IdCopyField
              label={strings.proxy.modal.curl}
              value={curlLine(endpoint, endpoint.secret)}
              display={curlLine(endpoint, shown ? endpoint.secret : "•••")}
            />

            <IdMeter
              value={endpoint.usedGb}
              max={endpoint.quotaGb}
              label={strings.proxy.traffic}
              right={`${endpoint.usedGb.toFixed(1)} / ${endpoint.quotaGb} GB`}
            />

            <div className="grid">
              <IdRow label={strings.proxy.host}>{endpoint.host}</IdRow>
              <IdRow label={strings.proxy.port}>{endpoint.port}</IdRow>
              <IdRow label={strings.proxy.region}>{regionLabel(endpoint.region)}</IdRow>
              <IdRow label={strings.proxy.expires}>{fmtDay(endpoint.expiresAt)}</IdRow>
            </div>

            <div className="border-t border-line pt-4">
              <div className="label-mono mb-3 text-[0.5625rem] text-ash-3">
                {strings.proxy.modal.quotaLabel}
              </div>
              <div className="flex flex-wrap gap-2">
                {PROXY_TRAFFIC.map((tier) => (
                  <IdButton
                    key={tier.gb}
                    size="sm"
                    onClick={() => {
                      topUp(endpoint.id, tier.gb);
                      onClose();
                    }}
                  >
                    +{tier.gb} GB · {fmtLune(tier.price, 2)}
                  </IdButton>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <IdSelect
              label={strings.proxy.modal.regionLabel}
              value={region}
              onChange={setRegion}
              options={REGION_OPTIONS}
            />
            <IdSegmented
              label={strings.proxy.modal.quotaLabel}
              value={String(quotaGb)}
              onChange={(value) => setQuotaGb(Number(value) as typeof quotaGb)}
              options={quotaOptions}
            />
            <IdField
              label={strings.share.labelLabel}
              hint={strings.wallets.drawer.labelHint}
              value={label}
              onChange={setLabel}
              placeholder={`${protocol}-${region}`}
            />
            <IdNotice title={strings.common.price}>
              {fmtLune(price.price, 2)} {strings.common.perMonth} · {quotaGb} GB ·{" "}
              {regionLabel(region)}
            </IdNotice>
          </>
        )}
      </div>
    </IdModal>
  );
}

/* ==================================================================
   Wallet
   ================================================================== */

export function IdWalletDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const strings = useIdStrings();
  const { link } = useWallets();
  const [address, setAddress] = useState("");
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<Exclude<WalletKind, "watch">>("hardware");
  const [watch, setWatch] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setAddress("");
    setLabel("");
    setKind("hardware");
    setWatch(false);
    setError(null);
  }, [open]);

  const submit = () => {
    const result = link({ address, label, kind: watch ? "watch" : kind });
    if (result.ok) {
      onClose();
      return;
    }
    setError(
      result.reason === "invalid"
        ? strings.wallets.drawer.invalid
        : strings.wallets.drawer.duplicate,
    );
  };

  return (
    <IdDrawer
      open={open}
      onClose={onClose}
      eyebrow={`${strings.brand} · ${strings.wallets.title}`}
      title={strings.wallets.drawer.title}
      blurb={strings.wallets.drawer.blurb}
      footer={
        <>
          <IdButton variant="quiet" onClick={onClose}>
            {strings.common.cancel}
          </IdButton>
          <IdButton variant="solid" onClick={submit} disabled={address.trim().length === 0}>
            {strings.wallets.drawer.submit}
          </IdButton>
        </>
      }
    >
      <div className="grid gap-5">
        <IdField
          label={strings.wallets.drawer.addressLabel}
          hint={strings.wallets.drawer.addressHint}
          error={error}
          value={address}
          onChange={(value) => {
            setAddress(value);
            setError(null);
          }}
          placeholder="al1…"
          mono
          autoFocus
        />
        <IdField
          label={strings.wallets.drawer.labelLabel}
          hint={strings.wallets.drawer.labelHint}
          value={label}
          onChange={setLabel}
          placeholder={strings.wallets.title}
        />
        <IdSegmented
          label={strings.wallets.drawer.kindLabel}
          value={kind}
          onChange={setKind}
          options={[
            { value: "hardware", label: strings.wallets.kinds.hardware },
            { value: "software", label: strings.wallets.kinds.software },
            { value: "contract", label: strings.wallets.kinds.contract },
          ]}
          className={watch ? "pointer-events-none opacity-40" : ""}
        />
        <div className="border-t border-line pt-4">
          <IdSwitch
            label={strings.wallets.drawer.watchLabel}
            hint={strings.wallets.drawer.watchHint}
            checked={watch}
            onChange={setWatch}
          />
        </div>
        <IdNotice>{strings.wallets.note}</IdNotice>
      </div>
    </IdDrawer>
  );
}

/* ==================================================================
   Share bucket
   ================================================================== */

export function IdBucketDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const strings = useIdStrings();
  const { create } = useShare();
  const [label, setLabel] = useState("");
  const [region, setRegion] = useState(REGIONS[0].id);
  const [quotaGb, setQuotaGb] = useState(SHARE_QUOTAS[1].gb);

  useEffect(() => {
    if (open) return;
    setLabel("");
    setRegion(REGIONS[0].id);
    setQuotaGb(SHARE_QUOTAS[1].gb);
  }, [open]);

  const tier = SHARE_QUOTAS.find((quota) => quota.gb === quotaGb) ?? SHARE_QUOTAS[1];

  return (
    <IdDrawer
      open={open}
      onClose={onClose}
      eyebrow={`${strings.brand} · ${strings.share.title}`}
      title={strings.share.createTitle}
      blurb={strings.share.createBlurb}
      footer={
        <>
          <IdButton variant="quiet" onClick={onClose}>
            {strings.common.cancel}
          </IdButton>
          <IdButton
            variant="solid"
            onClick={() => {
              create({ label, region, quotaGb });
              onClose();
            }}
            disabled={label.trim().length === 0}
          >
            {strings.share.submit}
          </IdButton>
        </>
      }
    >
      <div className="grid gap-5">
        <IdField
          label={strings.share.labelLabel}
          value={label}
          onChange={setLabel}
          placeholder="site-assets"
          mono
          autoFocus
        />
        <IdSelect
          label={strings.share.regionLabel}
          value={region}
          onChange={setRegion}
          options={REGION_OPTIONS}
        />
        <IdSegmented
          label={strings.share.quotaLabel}
          value={String(quotaGb)}
          onChange={(value) => setQuotaGb(Number(value) as typeof quotaGb)}
          options={SHARE_QUOTAS.map((quota) => ({
            value: String(quota.gb),
            label: quota.gb >= 1024 ? `${quota.gb / 1024} TB` : `${quota.gb} GB`,
          }))}
        />
        <IdNotice title={strings.common.price}>
          {fmtLune(tier.price, 2)} {strings.common.perMonth} · {strings.share.replicas}: 4
        </IdNotice>
      </div>
    </IdDrawer>
  );
}

/* ==================================================================
   Domain
   ================================================================== */

export function IdDomainDrawer({
  open,
  onClose,
  domain,
}: {
  open: boolean;
  onClose: () => void;
  domain: Domain | null;
}) {
  const strings = useIdStrings();
  const { setAutoRenew, setTarget, renew } = useDomains();
  const { wallets } = useWallets();
  const now = useNow(60_000, open);

  if (!domain) return null;

  const left = now === null ? null : daysUntil(domain.expiresAt, now);
  const targetOptions = [
    { value: "", label: strings.domains.unset },
    ...wallets.map((wallet) => ({
      value: wallet.address,
      label: `${wallet.label} · ${shortAddr(wallet.address, 6, 4)}`,
    })),
  ];

  return (
    <IdDrawer
      open={open}
      onClose={onClose}
      eyebrow={`${strings.brand} · ${strings.domains.detail}`}
      title={domain.name}
      footer={
        <>
          <IdButton variant="quiet" onClick={onClose}>
            {strings.common.close}
          </IdButton>
          <IdButton
            variant="solid"
            onClick={() => {
              renew(domain.name);
              onClose();
            }}
          >
            {strings.domains.renewNow}
          </IdButton>
        </>
      }
    >
      <div className="grid gap-5">
        {domain.status === "grace" && (
          <IdNotice title={strings.domains.status}>{strings.domains.inGrace}</IdNotice>
        )}
        {domain.status === "pending" && (
          <IdNotice title={strings.domains.status}>{strings.domains.pending}</IdNotice>
        )}

        <div className="grid">
          <IdRow label={strings.domains.status}>
            <IdChip tone={domain.status === "active" ? "neutral" : "warn"}>
              {domain.status}
            </IdChip>
          </IdRow>
          <IdRow label={strings.domains.expires}>
            {fmtDay(domain.expiresAt)}
            {left !== null && left > 0 && (
              <span className="ml-2 text-ash-3">
                {left} {strings.domains.daysLeft}
              </span>
            )}
          </IdRow>
          <IdRow label={strings.domains.records}>{domain.records}</IdRow>
        </div>

        <IdSelect
          label={strings.domains.setTarget}
          value={domain.target ?? ""}
          onChange={(value) => setTarget(domain.name, value === "" ? null : value)}
          options={targetOptions}
        />

        <div className="border-t border-line pt-4">
          <IdSwitch
            label={strings.domains.autoRenew}
            hint={strings.domains.note}
            checked={domain.autoRenew}
            onChange={(value) => setAutoRenew(domain.name, value)}
          />
        </div>
      </div>
    </IdDrawer>
  );
}
