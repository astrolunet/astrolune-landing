"use client";

import { useState } from "react";

import { useI18n } from "@/components/i18n-provider";
import { IconCheck, IconCopy } from "@/components/ui";

/**
 * Copy-to-clipboard control. Two forms:
 *
 * - `<CopyButton value>` — a bare round icon, for placing after a hash.
 * - `<CopyInline>` — the value itself is the button, for detail rows.
 *
 * Both fall back silently if the Clipboard API is unavailable (insecure
 * origins), because a copy button that throws is worse than one that no-ops.
 */
function useCopy() {
  const [copied, setCopied] = useState(false);

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* no clipboard on insecure origins — leave the value selectable */
    }
  };

  return { copied, copy };
}

export function CopyButton({
  value,
  className = "",
}: {
  value: string;
  className?: string;
}) {
  const { dict } = useI18n();
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      aria-label={copied ? dict.common.copied : dict.common.copy}
      className={`grid size-7 shrink-0 place-items-center rounded-full border border-line-2 bg-panel/60 text-ash-2 transition-all duration-300 hover:border-line-3 hover:bg-panel-2 hover:text-chalk ${className}`}
    >
      {copied ? (
        <IconCheck className="size-3.5 text-live" />
      ) : (
        <IconCopy className="size-3.5" />
      )}
    </button>
  );
}

export function CopyInline({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { dict } = useI18n();
  const { copied, copy } = useCopy();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      title={copied ? dict.common.copied : dict.common.copy}
      className={`group inline-flex max-w-full items-center gap-2 text-left transition-colors duration-200 hover:text-chalk ${className}`}
    >
      <span className="min-w-0 truncate">{children}</span>
      <span aria-hidden className="shrink-0 text-ash-3 group-hover:text-ash">
        {copied ? (
          <IconCheck className="size-3.5 text-live" />
        ) : (
          <IconCopy className="size-3.5" />
        )}
      </span>
    </button>
  );
}
