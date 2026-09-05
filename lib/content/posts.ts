import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Loader for authored MDX posts — news and blog.
 *
 * A post is a pair of files next to each other:
 *
 *   content/<dir>/<slug>.en.mdx
 *   content/<dir>/<slug>.ru.mdx
 *
 * Frontmatter carries the metadata (title, excerpt, date, category, cover);
 * the body is plain MDX, rendered through the same component map the docs use.
 * Writing a post is creating a file — no registry to edit, no typed block list
 * to satisfy. Each locale's frontmatter repeats the shared fields so a file is
 * self-describing; the loader keeps the canonical (English) values and lets a
 * locale override only its title and excerpt.
 */

const CONTENT_ROOT = path.join(process.cwd(), "content");

export type NewsCategory =
  | "release"
  | "engineering"
  | "consensus"
  | "research"
  | "ecosystem";

export type BlogCategory = "engineering" | "research" | "guides" | "protocol";

type Frontmatter = {
  title?: unknown;
  excerpt?: unknown;
  date?: unknown;
  category?: unknown;
  tag?: unknown;
  readingMinutes?: unknown;
  featured?: unknown;
  image?: unknown;
};

export type PostMeta<C extends string> = {
  slug: string;
  category: C;
  /** ISO date, fixed so server and client agree. */
  date: string;
  readingMinutes: number;
  featured: boolean;
  tag: string;
  /** Cover artwork, served from `/public`. */
  image: string;
  title: Record<Locale, string>;
  excerpt: Record<Locale, string>;
};

export type Post<C extends string> = PostMeta<C> & {
  /**
   * MDX source per locale. `null` when that locale has no file yet, in which
   * case callers fall back to the English body and may show a notice.
   */
  body: Record<Locale, string | null>;
};

function str(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/* ------------------------------------------------------------------
    Reading one directory
    ------------------------------------------------------------------ */

async function readDir(dir: string): Promise<Post<string>[]> {
  const root = path.join(CONTENT_ROOT, dir);

  let entries: string[];
  try {
    entries = await readdir(root);
  } catch {
    return [];
  }

  // `<slug>.<locale>.mdx`, grouped by slug.
  const bySlug = new Map<string, Map<Locale, { frontmatter: Frontmatter; body: string }>>();

  for (const entry of entries) {
    const match = /^(.+)\.(en|ru)\.mdx$/.exec(entry);
    if (!match) continue;

    const raw = await readFile(path.join(root, entry), "utf8");
    const parsed = matter(raw);
    const locale = match[2] as Locale;

    const locales = bySlug.get(match[1]) ?? new Map();
    locales.set(locale, {
      frontmatter: parsed.data as Frontmatter,
      body: parsed.content.trim(),
    });
    bySlug.set(match[1], locales);
  }

  const posts: Post<string>[] = [];

  for (const [slug, locales] of bySlug) {
    const base = locales.get(DEFAULT_LOCALE) ?? [...locales.values()][0];
    if (!base) continue;

    const fm = base.frontmatter;
    const title = str(fm.title);
    const excerpt = str(fm.excerpt);
    const date = str(fm.date);
    if (!title || !excerpt || !date) {
      throw new Error(
        `content/${dir}/${slug}: frontmatter must define title, excerpt and date`,
      );
    }

    const perLocale = (field: "title" | "excerpt"): Record<Locale, string> =>
      Object.fromEntries(
        LOCALES.map((l) => [
          l,
          str(locales.get(l)?.frontmatter[field]) ?? (field === "title" ? title : excerpt),
        ]),
      ) as Record<Locale, string>;

    posts.push({
      slug,
      category: str(fm.category) ?? "engineering",
      date,
      readingMinutes:
        typeof fm.readingMinutes === "number" && fm.readingMinutes > 0
          ? fm.readingMinutes
          : 4,
      featured: fm.featured === true,
      tag: str(fm.tag) ?? "Astrolune",
      image: str(fm.image) ?? "/news/placeholder.svg",
      title: perLocale("title"),
      excerpt: perLocale("excerpt"),
      body: Object.fromEntries(
        LOCALES.map((l) => [l, locales.get(l)?.body ?? null]),
      ) as Record<Locale, string | null>,
    });
  }

  // Newest first — how both indexes and prev/next read.
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

async function readOne(dir: string, slug: string): Promise<Post<string> | null> {
  if (!/^[\w-]+$/.test(slug)) return null;
  const posts = await readDir(dir);
  return posts.find((post) => post.slug === slug) ?? null;
}

/* ------------------------------------------------------------------
    Typed facades
    ------------------------------------------------------------------ */

/**
 * Builds the accessor set for one content directory. Every function is async so
 * a swap to a CMS or a remote git fetch stays a change to this file alone.
 */
export function postApi<C extends string>(dir: string) {
  return {
    async getPosts(category?: C): Promise<Post<C>[]> {
      const posts = (await readDir(dir)) as Post<C>[];
      return category ? posts.filter((post) => post.category === category) : posts;
    },

    async getFeaturedPost(): Promise<Post<C>> {
      const posts = (await readDir(dir)) as Post<C>[];
      return posts.find((post) => post.featured) ?? posts[0];
    },

    async getPost(slug: string): Promise<Post<C> | null> {
      return ((await readOne(dir, slug)) as Post<C>) ?? null;
    },

    /** Neighbours in publication order, for the prev/next rail on an article. */
    async getPostNeighbours(
      slug: string,
    ): Promise<{ prev: Post<C> | null; next: Post<C> | null }> {
      const posts = (await readDir(dir)) as Post<C>[];
      const index = posts.findIndex((post) => post.slug === slug);
      if (index === -1) return { prev: null, next: null };
      return {
        prev: posts[index + 1] ?? null,
        next: posts[index - 1] ?? null,
      };
    },

    async getAllSlugs(): Promise<string[]> {
      return (await readDir(dir)).map((post) => post.slug);
    },
  };
}
