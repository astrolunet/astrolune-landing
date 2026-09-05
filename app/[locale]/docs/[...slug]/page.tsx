import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { mdxComponents } from "@/components/docs/mdx";
import { DocsToc } from "@/components/docs/toc";
import { Breadcrumbs, Notice, PrevNext } from "@/components/site/chrome";
import { ButtonGhost, Chip, IconGithub } from "@/components/ui";
import { loadDoc } from "@/lib/docs/load";
import {
  DOC_ORDER,
  docEntry,
  docNeighbours,
  sectionOf,
  statusTone,
} from "@/lib/docs/registry";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";
import { LINKS } from "@/lib/site";

/**
 * One specification page.
 *
 * The markdown in `public/docs` is compiled as MDX so that a document can grow
 * a component when it needs one, without the other 23 having to change. Every
 * page is prerendered — `generateStaticParams` enumerates the registry — so the
 * filesystem reads and the MDX compile happen at build time, not per request.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return DOC_ORDER.map((entry) => ({ slug: entry.slug.split("/") }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const joined = slug.join("/");
  const entry = docEntry(joined);
  if (!entry) return {};

  const dict = await getDict(locale);
  const doc = await loadDoc(joined, locale, entry.title);
  const path = PATHS.doc(joined);

  return {
    title: doc?.title ?? entry.title,
    description: dict.docs.subtitle,
    alternates: {
      canonical: localePath(locale, path),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, path)]),
      ),
    },
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string[] }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const joined = slug.join("/");
  const entry = docEntry(joined);
  if (!entry) notFound();

  const dict = await getDict(locale);
  const doc = await loadDoc(joined, locale, entry.title);
  if (!doc) notFound();

  const at = (path: string) => localePath(locale, path);
  const section = sectionOf(joined);
  const { prev, next } = docNeighbours(joined);

  return (
    <div className="grid gap-12 pb-20 xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12">
      <article className="min-w-0">
        <header className="border-b border-line py-10 md:py-12">
          <Breadcrumbs
            items={[
              { label: dict.docs.title, href: at(ROUTES.docs) },
              ...(section
                ? [{ label: dict.docs.sections[section.key] }]
                : []),
            ]}
          />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <h1 className="display max-w-3xl text-graphite text-[clamp(1.7rem,3.8vw,2.9rem)]">
              {doc.title}
            </h1>
            <Chip tone={statusTone(entry.status)} className="mt-2 shrink-0">
              {entry.status}
            </Chip>
          </div>

          {/* The status legend, inlined for the status this page actually has. */}
          <p className="mt-5 max-w-2xl text-[0.8125rem] leading-relaxed text-ash-2">
            {dict.docs.statusLegend[entry.status]}
          </p>

          {locale !== "en" && (
            <div className="mt-6">
              <Notice>{dict.docs.fallbackNotice}</Notice>
            </div>
          )}
        </header>

        {/* the specification itself */}
        <div className="prose-astro mt-10 max-w-none">
          <MDXRemote
            source={doc.body}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                  rehypeSlug,
                  [
                    rehypeAutolinkHeadings,
                    {
                      behavior: "wrap",
                      properties: { className: "no-underline" },
                    },
                  ],
                ],
              },
            }}
          />
        </div>

        {/* source + prev/next */}
        <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
          <ButtonGhost
            href={`${LINKS.githubDocs}/blob/main/${doc.sourcePath}`}
            size="sm"
            external
          >
            <span className="flex items-center gap-2">
              <IconGithub className="size-3.5" />
              {dict.common.editOnGithub}
            </span>
          </ButtonGhost>
          <span className="font-mono text-[0.6875rem] text-ash-3">
            {dict.docs.sourceLabel}: {doc.sourcePath}
          </span>
        </div>

        <div className="mt-10">
          <PrevNext
            prev={
              prev
                ? {
                    label: dict.common.previous,
                    title: prev.title,
                    href: at(PATHS.doc(prev.slug)),
                  }
                : null
            }
            next={
              next
                ? {
                    label: dict.common.next,
                    title: next.title,
                    href: at(PATHS.doc(next.slug)),
                  }
                : null
            }
          />
        </div>
      </article>

      {/* on this page */}
      <aside className="hidden xl:block xl:pt-12">
        <DocsToc items={doc.toc} />
      </aside>
    </div>
  );
}
