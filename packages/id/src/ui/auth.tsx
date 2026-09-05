"use client";

/**
 * Authorisation surfaces: the button, the dialog, the account menu, and the
 * embeddable widget.
 *
 * The sign-in dialog is deliberately two steps. Step one picks a method; step
 * two shows the exact challenge the key is about to sign. Collapsing them into
 * one tap would be faster and would also be the pattern every wallet-drainer
 * relies on, so the nonce stays on screen.
 */

import { useEffect, useRef, useState } from "react";
import type { AuthMethod } from "../types";
import { fmtDay, fmtPct } from "../format";
import { useIdStrings, useSignIn, useIdentity, useEscape } from "../react";
import { Rng } from "../rng";
import {
  IdButton,
  IdChip,
  IdModal,
  IdNotice,
  IdRow,
} from "./primitives";
import {
  IdIconArrow,
  IdIconChevron,
  IdIconFinger,
  IdIconKey,
  IdIconMail,
  IdIconWallet,
} from "./icons";

const METHOD_ICONS: Record<AuthMethod, (props: { className?: string }) => React.JSX.Element> = {
  wallet: IdIconWallet,
  passkey: IdIconFinger,
  email: IdIconMail,
  recovery: IdIconKey,
};

/* ==================================================================
   Avatar
   ================================================================== */

/**
 * A 5×5 dot matrix derived from the account's seed.
 *
 * Deterministic, so it is stable across a server render, a reload, and a
 * screenshot — and monochrome, so it belongs to the same palette as everything
 * around it rather than becoming the one coloured thing on the page.
 */
export function IdAvatar({
  seed,
  className = "size-9",
}: {
  seed: string;
  className?: string;
}) {
  const rng = new Rng(`avatar:${seed}`);
  const cells = Array.from({ length: 25 }, () => rng.float());

  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden rounded-full border border-line-2 bg-panel-2 ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 5 5" className="size-[58%]">
        {cells.map((weight, i) =>
          weight > 0.42 ? (
            <rect
              key={i}
              x={i % 5}
              y={Math.floor(i / 5)}
              width="1"
              height="1"
              fill="currentColor"
              className="text-chalk"
              opacity={weight > 0.74 ? 0.95 : 0.45}
            />
          ) : null,
        )}
      </svg>
    </span>
  );
}

/* ==================================================================
   Sign-in dialog
   ================================================================== */

export function IdAuthModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const strings = useIdStrings();
  const { prepare, signIn, cancel, methods, challenge, status, pending, error } =
    useSignIn();
  const [step, setStep] = useState<"pick" | "sign">("pick");
  const [method, setMethod] = useState<AuthMethod | null>(null);

  const busy = status === "authenticating";

  // Close on success, and reset so reopening starts at the method list rather
  // than on a stale challenge.
  useEffect(() => {
    if (status === "authenticated" && open) {
      onClose();
      setStep("pick");
      setMethod(null);
    }
  }, [status, open, onClose]);

  useEffect(() => {
    if (!open) {
      setStep("pick");
      setMethod(null);
    }
  }, [open]);

  const choose = (next: AuthMethod) => {
    setMethod(next);
    prepare(next);
    setStep("sign");
  };

  const back = () => {
    cancel();
    setStep("pick");
    setMethod(null);
  };

  const active = method ?? pending;
  const Icon = active ? METHOD_ICONS[active] : IdIconWallet;

  return (
    <IdModal
      open={open}
      onClose={busy ? () => {} : onClose}
      eyebrow={`${strings.brand} · ${strings.auth.step} ${step === "pick" ? 1 : 2} / 2`}
      title={step === "pick" ? strings.auth.title : strings.auth.stepSign}
      blurb={step === "pick" ? strings.auth.blurb : undefined}
      footer={
        step === "sign" ? (
          <>
            <IdButton variant="quiet" onClick={back} disabled={busy}>
              {strings.auth.back}
            </IdButton>
            <IdButton
              variant="solid"
              busy={busy}
              onClick={() => active && signIn(active)}
            >
              {busy
                ? strings.auth.signingIn
                : `${strings.auth.signWith} ${active ? strings.auth.methods[active].label : ""}`}
            </IdButton>
          </>
        ) : undefined
      }
    >
      {step === "pick" ? (
        <div className="grid gap-2">
          <div className="label-mono mb-1 text-[0.5625rem] text-ash-3">
            {strings.auth.chooseMethod}
          </div>
          {methods.map((item) => {
            const MethodIcon = METHOD_ICONS[item];
            return (
              <button
                key={item}
                type="button"
                onClick={() => choose(item)}
                className="group flex items-center gap-3.5 rounded-lg border border-line bg-panel/50 px-4 py-3.5 text-left transition-all duration-300 hover:border-line-2 hover:bg-panel-2"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-2 text-ash transition-colors duration-300 group-hover:border-line-3 group-hover:text-chalk">
                  <MethodIcon className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.875rem] text-chalk">
                    {strings.auth.methods[item].label}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.6875rem] text-ash-3">
                    {strings.auth.methods[item].desc}
                  </span>
                </span>
                <IdIconArrow className="size-3.5 shrink-0 text-ash-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-chalk" />
              </button>
            );
          })}
          <IdNotice className="mt-2">{strings.auth.prototypeNote}</IdNotice>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className="flex items-center gap-3.5 rounded-lg border border-line-2 bg-panel-2/60 px-4 py-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line-2 text-chalk">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.875rem] text-chalk">
                {active ? strings.auth.methods[active].label : ""}
              </span>
              <span className="mt-0.5 block font-mono text-[0.6875rem] text-ash-3">
                {active ? strings.auth.methods[active].desc : ""}
              </span>
            </span>
          </div>

          <div>
            <div className="label-mono mb-2 text-[0.5625rem] text-ash-3">
              {strings.auth.challenge}
            </div>
            <p className="rounded-lg border border-line bg-panel-2 px-3.5 py-3 font-mono text-[0.75rem] leading-relaxed break-all text-ash">
              {challenge}
            </p>
          </div>

          {error && (
            <p className="font-mono text-[0.6875rem] text-down">{strings.auth.failed}</p>
          )}
          <IdNotice>{strings.auth.prototypeNote}</IdNotice>
        </div>
      )}
    </IdModal>
  );
}

/* ==================================================================
   Account menu
   ================================================================== */

export function IdAccountMenu({
  consoleHref,
  align = "right",
}: {
  consoleHref?: string;
  align?: "left" | "right";
}) {
  const strings = useIdStrings();
  const { identity } = useIdentity();
  const { signOut } = useSignIn();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement | null>(null);

  useEscape(() => setOpen(false), open);

  // Outside click. `pointerdown` rather than `click` so the menu closes before
  // the click lands on whatever is underneath it.
  useEffect(() => {
    if (!open) return;
    const onDown = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  if (!identity) return null;

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-full border border-line-2 bg-panel/60 py-1 pr-2.5 pl-1 transition-all duration-300 hover:border-line-3 hover:bg-panel-2"
      >
        <IdAvatar seed={identity.avatarSeed} className="size-7" />
        <span className="label-mono max-w-[9rem] truncate text-[0.5625rem] text-chalk">
          {identity.handle ?? identity.displayName}
        </span>
        <IdIconChevron
          className={`size-3 shrink-0 text-ash-3 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className={`panel-glass absolute top-[calc(100%+0.5rem)] z-50 w-[19rem] rounded-xl p-4 animate-[rise_0.3s_cubic-bezier(0.16,1,0.3,1)_both] ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <IdAvatar seed={identity.avatarSeed} className="size-10" />
            <div className="min-w-0">
              <div className="truncate text-[0.875rem] text-chalk">
                {identity.handle ?? identity.displayName}
              </div>
              <div className="mt-0.5 font-mono text-[0.6875rem] text-ash-3">
                {identity.id}
              </div>
            </div>
          </div>

          <div className="mt-4 grid">
            <IdRow label={strings.auth.tier}>
              <IdChip tone="neutral">{identity.tier}</IdChip>
            </IdRow>
            <IdRow label={strings.auth.trust}>{fmtPct(identity.trust, 0)}</IdRow>
            <IdRow label={strings.auth.member}>{fmtDay(identity.createdAt)}</IdRow>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {consoleHref && (
              <a
                href={consoleHref}
                className="inline-flex h-[33px] flex-1 items-center justify-center gap-2 rounded-full border border-transparent bg-chalk px-5 label-mono text-void transition-colors duration-300 hover:bg-white"
              >
                {strings.auth.openConsole}
              </a>
            )}
            <IdButton
              variant="ghost"
              onClick={() => {
                setOpen(false);
                signOut();
              }}
            >
              {strings.auth.signOut}
            </IdButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==================================================================
   Sign-in button — the drop-in
   ================================================================== */

/**
 * The one-line integration: renders the sign-in pill when anonymous and the
 * account menu when authenticated, and owns the dialog itself.
 *
 * While `ready` is false it renders the pill disabled rather than rendering
 * nothing. A control that appears a beat after the header would shift the
 * layout, and the server has no way to know which state to draw.
 */
export function IdSignInButton({
  consoleHref,
  size = "sm",
  className = "",
}: {
  consoleHref?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const strings = useIdStrings();
  const { isAuthenticated, ready } = useSignIn();
  const [open, setOpen] = useState(false);

  if (isAuthenticated) {
    return <IdAccountMenu consoleHref={consoleHref} />;
  }

  return (
    <>
      <IdButton
        variant="solid"
        size={size}
        disabled={!ready}
        onClick={() => setOpen(true)}
        className={className}
      >
        {strings.auth.signIn}
      </IdButton>
      <IdAuthModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/* ==================================================================
   Widget
   ================================================================== */

/**
 * The embeddable card: a pitch and a sign-in when anonymous, an account
 * summary when not. Sized to sit in a page column, unlike `IdSignInButton`
 * which is sized for a header.
 */
export function IdAuthWidget({
  consoleHref,
  className = "",
}: {
  consoleHref?: string;
  className?: string;
}) {
  const strings = useIdStrings();
  const { identity, isAuthenticated, ready } = useIdentity();
  const { methods, signOut } = useSignIn();
  const [open, setOpen] = useState(false);

  return (
    <div className={`panel rounded-xl p-5 sm:p-6 ${className}`}>
      {isAuthenticated && identity ? (
        <>
          <div className="flex items-center gap-3.5">
            <IdAvatar seed={identity.avatarSeed} className="size-11" />
            <div className="min-w-0 flex-1">
              <div className="label-mono text-[0.5625rem] text-ash-3">
                {strings.auth.signedInAs}
              </div>
              <div className="mt-1.5 truncate text-[1rem] text-chalk">
                {identity.handle ?? identity.displayName}
              </div>
            </div>
            {identity.isValidator && (
              <IdChip tone="neutral">{strings.nav.validator}</IdChip>
            )}
          </div>

          <div className="mt-5 grid">
            <IdRow label={strings.auth.account}>{identity.id}</IdRow>
            <IdRow label={strings.auth.tier}>{identity.tier}</IdRow>
            <IdRow label={strings.auth.trust}>{fmtPct(identity.trust, 0)}</IdRow>
            <IdRow label={strings.auth.methodsTitle}>
              {identity.methods
                .map((method) => strings.auth.methods[method].label)
                .join(" · ")}
            </IdRow>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {consoleHref && (
              <a
                href={consoleHref}
                className="group inline-flex h-[39px] items-center justify-center gap-2.5 rounded-full border border-transparent bg-chalk px-6 label-mono text-void transition-colors duration-300 hover:bg-white"
              >
                {strings.auth.openConsole}
                <IdIconArrow className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </a>
            )}
            <IdButton variant="ghost" size="lg" onClick={signOut}>
              {strings.auth.signOut}
            </IdButton>
          </div>
        </>
      ) : (
        <>
          <div className="label-mono text-[0.5625rem] text-ash-3">{strings.brand}</div>
          <h3 className="mt-3 display text-[1.25rem] text-chalk">
            {strings.auth.title}
          </h3>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ash-2">
            {strings.auth.blurb}
          </p>

          <ul className="mt-5 grid gap-2">
            {methods.map((method) => {
              const Icon = METHOD_ICONS[method];
              return (
                <li
                  key={method}
                  className="flex items-center gap-3 rounded-lg border border-line bg-panel-2/50 px-3.5 py-2.5"
                >
                  <Icon className="size-3.5 shrink-0 text-ash-3" />
                  <span className="text-[0.8125rem] text-ash">
                    {strings.auth.methods[method].label}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5">
            <IdButton
              variant="solid"
              size="lg"
              disabled={!ready}
              onClick={() => setOpen(true)}
              className="w-full"
            >
              {strings.auth.signIn}
            </IdButton>
          </div>
          <p className="mt-3 font-mono text-[0.6875rem] leading-relaxed text-ash-3">
            {strings.auth.prototypeNote}
          </p>
          <IdAuthModal open={open} onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  );
}
