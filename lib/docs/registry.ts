import type { Dict } from "@/lib/i18n/en";

/**
 * The documentation table of contents.
 *
 * Slugs are the path under `public/docs` without the extension, so
 * `00-overview/vision` is `public/docs/00-overview/vision.md`. Ordering,
 * grouping and per-document status are editorial and live here rather than
 * being inferred from the filesystem — the reading order in the source README
 * is deliberate and a directory listing would lose it.
 *
 * `status` mirrors the source README's legend: stable · draft · skeleton ·
 * current. It is rendered as a chip so a reader knows how much to trust a page
 * before reading it — the specification's own convention.
 */

export type DocStatus = "stable" | "draft" | "skeleton" | "current";

export type DocEntry = {
  slug: string;
  status: DocStatus;
  /** Fallback title, used until the MDX heading is read. */
  title: string;
};

export type DocSection = {
  /** Key into `dict.docs.sections`. */
  key: keyof Dict["docs"]["sections"];
  entries: DocEntry[];
};

export const DOC_SECTIONS: DocSection[] = [
  {
    key: "overview",
    entries: [
      { slug: "00-overview/vision", status: "draft", title: "Project overview" },
      { slug: "00-overview/glossary", status: "draft", title: "Glossary" },
    ],
  },
  {
    key: "consensus",
    entries: [
      { slug: "01-consensus/potb", status: "stable", title: "Proof of Trusted Behavior" },
    ],
  },
  {
    key: "architecture",
    entries: [
      { slug: "02-architecture/system-architecture", status: "stable", title: "Network architecture" },
      { slug: "02-architecture/component-map", status: "stable", title: "Component map" },
      { slug: "02-architecture/c-cpp-boundary", status: "stable", title: "The C / C++ boundary" },
      { slug: "02-architecture/cryptography", status: "stable", title: "Cryptography" },
      { slug: "02-architecture/data-flow", status: "skeleton", title: "Data flow" },
      { slug: "02-architecture/networking-p2p", status: "skeleton", title: "Networking and P2P" },
    ],
  },
  {
    key: "vm",
    entries: [
      { slug: "03-vm/vm-spec", status: "skeleton", title: "Virtual machine specification" },
      { slug: "03-vm/bytecode-isa", status: "skeleton", title: "Bytecode and instruction set" },
      { slug: "03-vm/gas-model", status: "skeleton", title: "Gas and resource accounting" },
    ],
  },
  {
    key: "state",
    entries: [
      { slug: "04-state/transactions", status: "skeleton", title: "Transactions" },
      { slug: "04-state/state-model", status: "skeleton", title: "State model" },
    ],
  },
  {
    key: "languages",
    entries: [
      { slug: "05-languages/contract-languages", status: "stable", title: "Smart contract languages" },
    ],
  },
  {
    key: "services",
    entries: [
      { slug: "06-services/dns-lune", status: "skeleton", title: ".lune DNS zone" },
      { slug: "06-services/storage", status: "skeleton", title: "Storage layer" },
      { slug: "06-services/proxy", status: "skeleton", title: "Proxy layer" },
    ],
  },
  {
    key: "roadmap",
    entries: [
      { slug: "07-roadmap/roadmap", status: "current", title: "Roadmap" },
      { slug: "07-roadmap/open-questions", status: "current", title: "Open questions" },
    ],
  },
  {
    key: "implementation",
    entries: [
      { slug: "08-implementation/implementation-status", status: "current", title: "Implementation status" },
      { slug: "08-implementation/core-api", status: "current", title: "Core API reference" },
      { slug: "08-implementation/build-and-test", status: "current", title: "Building and testing" },
    ],
  },
  {
    key: "id",
    entries: [
      { slug: "09-id/astrolune-id", status: "draft", title: "Astrolune ID" },
      { slug: "09-id/id-sdk", status: "draft", title: "ID SDK — hooks and store" },
      { slug: "09-id/id-ui-kit", status: "draft", title: "ID UI kit" },
    ],
  },
];

/** Flat reading order, for prev/next and static params. */
export const DOC_ORDER: DocEntry[] = DOC_SECTIONS.flatMap((s) => s.entries);

const BY_SLUG = new Map(DOC_ORDER.map((entry) => [entry.slug, entry]));

export function docEntry(slug: string): DocEntry | null {
  return BY_SLUG.get(slug) ?? null;
}

export function docNeighbours(slug: string): {
  prev: DocEntry | null;
  next: DocEntry | null;
} {
  const index = DOC_ORDER.findIndex((entry) => entry.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: DOC_ORDER[index - 1] ?? null,
    next: DOC_ORDER[index + 1] ?? null,
  };
}

export function sectionOf(slug: string): DocSection | null {
  return DOC_SECTIONS.find((s) => s.entries.some((e) => e.slug === slug)) ?? null;
}

const STATUS_TONE: Record<DocStatus, "neutral" | "muted" | "solid" | "warn"> = {
  stable: "solid",
  current: "neutral",
  draft: "muted",
  skeleton: "warn",
};

export function statusTone(status: DocStatus) {
  return STATUS_TONE[status];
}
