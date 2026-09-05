"use client";

/**
 * The crypto payment modal.
 *
 * One invoice at a time, held in the store, so any panel can start a purchase
 * by dispatching an action and this component picks it up. Mount it once,
 * high in the tree — `IdConsole` does, and a host embedding individual panels
 * should too.
 *
 * The window is the interesting part. An invoice quotes an amount for fifteen
 * minutes; past that the deposit address stays valid but the quote does not, so
 * the countdown flips the invoice to `expired` and the user gets a fresh one
 * rather than a stale price. Confirmations keep counting after expiry — a
 * transfer that was already in flight is honoured, which is what a real deposit
 * watcher has to do.
 */

import { fmtCountdown, fmtLune, shortAddr } from "../format";
import { INVOICE_WINDOW_MS } from "../mock";
import { useCheckout, useIdStrings, useWallets } from "../react";
import type { InvoiceStatus } from "../types";
import {
  IdButton,
  IdChip,
  IdCopyField,
  IdMeter,
  IdModal,
  IdNotice,
  IdQr,
  IdRow,
  IdStatusDot,
  type IdTone,
} from "./primitives";
import { IdIconWallet } from "./icons";

const STATUS_TONES: Record<InvoiceStatus, IdTone> = {
  awaiting: "idle",
  confirming: "warn",
  paid: "live",
  expired: "down",
  failed: "down",
};

export function IdPayModal() {
  const strings = useIdStrings();
  const { invoice, remaining, simulate, close } = useCheckout();
  const { primary } = useWallets();

  if (!invoice) return null;

  const label = strings.pay[invoice.status];
  const settled = invoice.status === "paid";
  const dead = invoice.status === "expired" || invoice.status === "failed";
  const open = invoice.status === "awaiting";

  return (
    <IdModal
      open
      onClose={close}
      eyebrow={`${strings.brand} · ${strings.pay.summary}`}
      title={strings.pay.title}
      className="max-w-xl"
      footer={
        <>
          <IdButton variant="quiet" onClick={close}>
            {settled ? strings.pay.done : strings.pay.close}
          </IdButton>
          {open && (
            <IdButton variant="solid" onClick={simulate}>
              {primary ? strings.pay.payFromWallet : strings.pay.simulate}
            </IdButton>
          )}
        </>
      }
    >
      <div className="grid gap-5">
        {/* Order line */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[0.9375rem] text-chalk">{invoice.label}</div>
            <div className="mt-1 font-mono text-[0.6875rem] text-ash-3">{invoice.sku}</div>
          </div>
          <div className="shrink-0 text-right">
            <div className="data-cell text-[1rem] text-chalk">
              {fmtLune(invoice.amount)}
            </div>
            <div className="mt-1 label-mono text-[0.5625rem] text-ash-3">
              {strings.pay.amount}
            </div>
          </div>
        </div>

        {/* Status band */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line-2 bg-panel-2/60 px-4 py-3">
          <IdStatusDot
            tone={STATUS_TONES[invoice.status]}
            label={label}
            pulse={!settled && !dead}
          />
          {open && (
            <span className="data-cell text-[0.8125rem] text-ash">
              {strings.pay.expiresIn}{" "}
              <span className="text-chalk">
                {remaining === null ? "—:—" : fmtCountdown(remaining)}
              </span>
            </span>
          )}
          {invoice.status === "confirming" && (
            <span className="data-cell text-[0.8125rem] text-ash">
              {invoice.confirmations} {strings.common.of} {invoice.requiredConfirmations}
            </span>
          )}
        </div>

        {invoice.status === "confirming" && (
          <IdMeter
            value={invoice.confirmations}
            max={invoice.requiredConfirmations}
            label={strings.pay.confirmations}
          />
        )}

        {settled ? (
          <>
            <IdNotice title={strings.pay.appliedTo}>
              {invoice.label} — {fmtLune(invoice.amount)}
            </IdNotice>
            {invoice.txHash && (
              <IdCopyField
                label={strings.pay.txHash}
                value={invoice.txHash}
                display={shortAddr(invoice.txHash, 12, 10)}
              />
            )}
          </>
        ) : dead ? (
          <IdNotice title={label}>{strings.pay.memoWarning}</IdNotice>
        ) : (
          <>
            {/* Deposit details */}
            <div className="grid gap-5 sm:grid-cols-[9.5rem_1fr]">
              <figure className="grid gap-2">
                <IdQr
                  value={`${invoice.address}?memo=${invoice.memo}`}
                  className="w-full rounded-lg border border-line-2"
                />
                <figcaption className="font-mono text-[0.625rem] leading-relaxed text-ash-3">
                  {strings.pay.qrCaption}
                </figcaption>
              </figure>

              <div className="grid content-start gap-4">
                <IdCopyField
                  label={strings.pay.address}
                  value={invoice.address}
                  display={shortAddr(invoice.address, 14, 10)}
                />
                <IdCopyField label={strings.pay.memo} value={invoice.memo} />
              </div>
            </div>

            <IdNotice title={strings.pay.memo}>{strings.pay.memoWarning}</IdNotice>
          </>
        )}

        {/* Provenance */}
        <div className="grid">
          <IdRow label={strings.pay.network}>
            <IdChip tone="muted">{invoice.network}</IdChip>
          </IdRow>
          <IdRow label={strings.pay.window}>
            {Math.round(INVOICE_WINDOW_MS / 60_000)} min
          </IdRow>
          {primary && open && (
            <IdRow label={strings.pay.payFromWallet}>
              <span className="inline-flex items-center gap-2">
                <IdIconWallet className="size-3.5 text-ash-3" />
                {shortAddr(primary.address)}
              </span>
            </IdRow>
          )}
        </div>

        {open && (
          <div className="border-t border-line pt-4">
            <button
              type="button"
              onClick={simulate}
              className="label-mono text-[0.5625rem] text-ash-2 underline decoration-line-3 underline-offset-4 transition-colors duration-200 hover:text-chalk"
            >
              {strings.pay.simulate}
            </button>
            <p className="mt-2 font-mono text-[0.6875rem] leading-relaxed text-ash-3">
              {strings.pay.simulateHint}
            </p>
          </div>
        )}
      </div>
    </IdModal>
  );
}
