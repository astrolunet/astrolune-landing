import { readFile } from "node:fs/promises";
import path from "node:path";

import GithubSlugger from "github-slugger";

/**
 * Loader for the technical specification in `public/docs`.
 *
 * The markdown files are the single source of truth — the same tree the core is
 * built against. Nothing here rewrites their content beyond three mechanical
 * transforms:
 *
 * 1. The `# H1` is removed, because the page chrome renders the title itself.
 * 2. Relative `*.md` links become locale-prefixed app routes, so the internal
 *    cross-references in the specification actually navigate.
 * 3. Headings are collected into a table of contents.
 *
 * Every transform skips fenced code, so an ASCII diagram containing `](` or a
 * shell comment starting with `#` is never mistaken for markup.
 */

const DOCS_ROOT = path.join(process.cwd(), "public", "docs");

export type TocItem = { depth: 2 | 3; text: string; id: string };

export type LoadedDoc = {
  slug: string;
  /** Read from the first `# ` heading, falling back to the registry title. */
  title: string;
  /** Markdown with the H1 stripped and cross-references rewritten. */
  body: string;
  toc: TocItem[];
  /** Path under `public/docs`, surfaced as the "source" link. */
  sourcePath: string;
};

/* ------------------------------------------------------------------
   Fence-aware traversal
   ------------------------------------------------------------------ */

/**
 * Applies `fn` to every line that is *not* inside a fenced code block.
 *
 * The specification is full of ASCII pipelines and shell transcripts. Treating
 * their contents as markdown is how a loader quietly corrupts a document, so
 * fence state is tracked explicitly rather than hoped about.
 */
function eachLine(
  source: string,
  fn: (line: string, inFence: boolean) => string | null,
): string[] {
  const out: string[] = [];
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    // ``` or ~~~ toggles, and the closing marker itself is still "in fence".
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    const next = fn(line, inFence);
    out.push(next === null ? line : next);
  }

  return out;
}

/** Strips inline markdown so a heading slug matches what rehype-slug produces. */
function plainText(markdown: string): string {
  return markdown
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+#+\s*$/, "")
    .trim();
}

/* ------------------------------------------------------------------
   MDX safety
   ------------------------------------------------------------------ */

/**
 * Escapes bare `<` that MDX would try to read as a JSX tag.
 *
 * The specification is prose, not MDX, and occasionally writes mathematical
 * comparisons like `a group of <50 nodes`. MDX sees `<5` and expects a tag
 * name, which is a compile error. A `<` only opens a tag when the next
 * character could start one — a letter, `/`, `!`, `$` or `_` — so anything else
 * (a digit, a space, `=`) is neutralised to the HTML entity. Real inline code
 * and fenced blocks are already excluded by the caller.
 *
 * Curly braces get the same treatment: MDX reads `{` as the start of an
 * expression. The source happens to contain none outside code today, but a
 * future edit to the spec should not be able to break the build.
 */
function escapeMdx(line: string): string {
  return line
    .replace(/<(?![a-zA-Z/!$_])/g, "&lt;")
    .replace(/[{}]/g, (brace) => (brace === "{" ? "&#123;" : "&#125;"));
}

/**
 * Applies `escapeMdx` to the parts of a line that are not inline code.
 *
 * `` `<stdatomic.h>` `` must survive verbatim — MDX already protects code spans,
 * so escaping inside one would render the entity literally instead of the angle
 * bracket. Splitting on the backtick runs keeps them out of reach.
 */
function escapeOutsideCode(line: string): string {
  return line
    .split(/(`+[^`]*`+)/g)
    .map((part) => (part.startsWith("`") ? part : escapeMdx(part)))
    .join("");
}

/* ------------------------------------------------------------------
   Cross-reference rewriting
   ------------------------------------------------------------------ */

const MD_LINK = /\]\(\s*([^)\s]+?\.md)(#[^)\s]*)?\s*\)/gi;

/**
 * `[potb.md](../01-consensus/potb.md#7-limits)` →
 * `[potb.md](/en/docs/01-consensus/potb#7-limits)`
 *
 * Resolution is relative to the directory of the document being read, which is
 * what makes both the README-style root-relative links and the sibling links
 * inside a section land on the same target. The same pass escapes the handful
 * of characters MDX would otherwise treat as syntax.
 */
function prepareBody(source: string, slug: string, locale: string): string {
  const dir = path.posix.dirname(slug);

  return eachLine(source, (line, inFence) => {
    if (inFence) return null;

    const linked = line.replace(MD_LINK, (_match, target: string, hash = "") => {
      const raw = target.replace(/^\.\//, "");
      const resolved = raw.startsWith("/")
        ? raw.slice(1)
        : path.posix.normalize(path.posix.join(dir === "." ? "" : dir, raw));

      const withoutExt = resolved.replace(/\.md$/i, "");
      // The source README is an index; the site has its own docs landing page.
      const isIndex = /(^|\/)README$/i.test(withoutExt);
      const href = isIndex
        ? `/${locale}/docs`
        : `/${locale}/docs/${withoutExt}`;

      return `](${href}${hash})`;
    });

    return escapeOutsideCode(linked);
  }).join("\n");
}

/* ------------------------------------------------------------------
   Reading
   ------------------------------------------------------------------ */

function extractToc(source: string): TocItem[] {
  const slugger = new GithubSlugger();
  const toc: TocItem[] = [];

  eachLine(source, (line, inFence) => {
    if (inFence) return null;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) return null;

    const text = plainText(match[2]);
    if (!text) return null;

    toc.push({
      depth: match[1].length as 2 | 3,
      text,
      // Must match rehype-slug, which slugs the rendered text content.
      id: slugger.slug(text),
    });
    return null;
  });

  return toc;
}

/** Pulls the first H1 out and returns it alongside the remaining body. */
function splitTitle(source: string): { title: string | null; body: string } {
  const lines = source.split(/\r?\n/);
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^#\s+(.+?)\s*$/.exec(lines[i]);
    if (match) {
      lines.splice(i, 1);
      // Drop the blank line the heading left behind.
      if (lines[i]?.trim() === "") lines.splice(i, 1);
      return { title: plainText(match[1]), body: lines.join("\n") };
    }
  }

  return { title: null, body: source };
}

/**
 * Reads and prepares one document. Returns `null` when the slug does not map to
 * a file, which is what lets the route render `notFound()` instead of throwing.
 */
export async function loadDoc(
  slug: string,
  locale: string,
  fallbackTitle: string,
): Promise<LoadedDoc | null> {
  // Refuse anything that could climb out of the docs directory.
  const normalised = path.posix.normalize(slug);
  if (normalised.startsWith("..") || path.posix.isAbsolute(normalised)) {
    return null;
  }

  const file = path.join(DOCS_ROOT, `${normalised}.md`);
  if (!file.startsWith(DOCS_ROOT)) return null;

  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    return null;
  }

  const { title, body } = splitTitle(raw);

  return {
    slug: normalised,
    title: title ?? fallbackTitle,
    body: prepareBody(body, normalised, locale),
    toc: extractToc(body),
    sourcePath: `${normalised}.md`,
  };
}
