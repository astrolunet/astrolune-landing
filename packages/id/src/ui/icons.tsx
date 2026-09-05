"use client";

/**
 * Icons for the packaged UI.
 *
 * A local copy of the hairline set rather than an import from the host
 * application, for the same reason `format.ts` and `strings.ts` are local: this
 * package is published on its own. Same 24×24 box and same ~1.2 stroke weight,
 * so a consumer mixing package and host icons on one screen sees one set.
 */

type IconProps = { className?: string };

export function IdIconArrow({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M5 12h13m0 0-5.2-5.2M18 12l-5.2 5.2"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconChevron({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m7.5 10 4.5 4.5L16.5 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconCheck({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m5 12.6 4.4 4.4L19 7.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconClose({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6.4 6.4l11.2 11.2M17.6 6.4 6.4 17.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconPlus({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 5.5v13M5.5 12h13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconCopy({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="9"
        y="9"
        width="10.5"
        height="10.5"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M15 6.2A1.7 1.7 0 0 0 13.3 4.5H6.2A1.7 1.7 0 0 0 4.5 6.2v7.1A1.7 1.7 0 0 0 6.2 15"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Progress that has not resolved. Pair with `animate-spin-slow` or `animate-spin`. */
export function IdIconSpinner({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2a8.8 8.8 0 1 0 8.8 8.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconRefresh({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M20 12a8 8 0 1 1-2.6-5.9M20 4.5V10h-5.4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconWallet({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.2"
        y="6"
        width="17.6"
        height="12.6"
        rx="2.2"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path d="M3.2 10.4h17.6" stroke="currentColor" strokeWidth="1.15" />
      <circle cx="16.6" cy="14.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function IdIconGlobe({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.6" stroke="currentColor" strokeWidth="1.15" />
      <path
        d="M3.4 12h17.2M12 3.4c2.3 2.3 3.4 5.2 3.4 8.6S14.3 18.3 12 20.6c-2.3-2.3-3.4-5.2-3.4-8.6S9.7 5.7 12 3.4Z"
        stroke="currentColor"
        strokeWidth="1.15"
      />
    </svg>
  );
}

export function IdIconLayers({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="m12 3.4 8.4 4.3-8.4 4.3-8.4-4.3 8.4-4.3Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="m4.5 12 7.5 3.8 7.5-3.8M4.5 16.2l7.5 3.8 7.5-3.8"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconNode({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.4" cy="5.4" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.6" cy="5.4" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4.4" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="19.6" cy="18.6" r="1.9" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="m6 6.8 3.9 3.6M18 6.8l-3.9 3.6M6 17.2l3.9-3.6M18 17.2l-3.9-3.6"
        stroke="currentColor"
        strokeWidth="1.05"
      />
    </svg>
  );
}

export function IdIconShield({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.2 19 5.8v5.5c0 4-2.8 7.4-7 9.5-4.2-2.1-7-5.5-7-9.5V5.8L12 3.2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="m8.9 12.1 2.2 2.2 4-4.4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconRoute({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="5.6" cy="6.2" r="2.3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="18.4" cy="17.8" r="2.3" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M5.6 8.6v3.6a3 3 0 0 0 3 3h6.4"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconKey({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="8.4" cy="8.4" r="4.4" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="m11.6 11.6 7.4 7.4M16.4 16.4l1.8-1.8M19 19l1.6-1.6"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconMail({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect
        x="3.2"
        y="5.4"
        width="17.6"
        height="13.2"
        rx="2.1"
        stroke="currentColor"
        strokeWidth="1.15"
      />
      <path
        d="m4.4 7 7.6 5.4L19.6 7"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconFinger({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 3.6a8.4 8.4 0 0 1 8.4 8.4M12 6.8a5.2 5.2 0 0 1 5.2 5.2v2M12 10a2 2 0 0 1 2 2v4.4M8.8 12a3.2 3.2 0 0 1 .9-2.2M6.6 14.6A8.4 8.4 0 0 1 6.4 12"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconEye({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2.6 12S6.2 6 12 6s9.4 6 9.4 6-3.6 6-9.4 6-9.4-6-9.4-6Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}

export function IdIconEyeOff({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.6 8.4C3.3 9.8 2.6 12 2.6 12s3.6 6 9.4 6c1.3 0 2.5-.3 3.5-.8M9.2 6.4A8.9 8.9 0 0 1 12 6c5.8 0 9.4 6 9.4 6s-.8 1.3-2.2 2.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IdIconTrash({ className = "size-3.5" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4.8 7.4h14.4M9.4 7.4V5.6a1.2 1.2 0 0 1 1.2-1.2h2.8a1.2 1.2 0 0 1 1.2 1.2v1.8M6.6 7.4l.8 11a1.5 1.5 0 0 0 1.5 1.4h6.2a1.5 1.5 0 0 0 1.5-1.4l.8-11"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IdIconGauge({ className = "size-4" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M3.6 17.4a9 9 0 1 1 16.8 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="m12 13.4 4.2-4"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
      <circle cx="12" cy="14.4" r="1.3" fill="currentColor" />
    </svg>
  );
}
