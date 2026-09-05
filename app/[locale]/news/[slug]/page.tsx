import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { Breadcrumbs, Notice, PrevNext, Section } from "@/components/site/chrome";
import { postMdxComponents } from "@/components/site/post-mdx";
import { ButtonGhost, Chip, IconTelegram } from "@/components/ui";
import * as news from "@/lib/api/news";
import { fmtDate } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";
import { LINKS } from "@/lib/site";

export async function generateStaticParams() {
  const slugs = await news.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const post = await news.getPost(slug);
  if (!post) return {};

  const path = PATHS.newsPost(slug);
  return {
    title: post.title[locale],
    description: post.excerpt[locale],
    alternates: {
      canonical: localePath(locale, path),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, path)]),
      ),
    },
    openGraph: {
      type: "article",
      title: post.title[locale],
      description: post.excerpt[locale],
      publishedTime: post.date,
    },
  };
}

export default async function NewsPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const active: Locale = locale;

  const post = await news.getPost(slug);
  if (!post) notFound();

  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);
  const { prev, next } = await news.getPostNeighbours(slug);

  // A locale without its own file falls back to the English original — same
  // honesty rule the docs follow, stated instead of silently mixed.
  const body = post.body[active] ?? post.body.en;
  const isFallback = active !== "en" && post.body[active] === null;

  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-line pt-[68px]">
        <div
          aria-hidden
          className="grid-lattice pointer-events-none absolute inset-0 opacity-40 mask-fade-b"
        />
        <div aria-hidden className="vignette pointer-events-none absolute inset-0" />

        <div className="container-rail relative py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: dict.news.title, href: at(ROUTES.news) },
              { label: post.tag },
            ]}
          />

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Chip tone="muted">{dict.news.categories[post.category]}</Chip>
            <span className="label-mono text-ash-3">
              {fmtDate(post.date, active)}
            </span>
            <span className="label-mono text-ash-3">
              {post.readingMinutes} {dict.common.minRead}
            </span>
          </div>

          <h1 className="display mt-6 max-w-4xl text-graphite text-[clamp(1.8rem,4.2vw,3.2rem)]">
            {post.title[active]}
          </h1>
          <p className="mt-6 max-w-2xl text-[1rem] leading-relaxed text-ash">
            {post.excerpt[active]}
          </p>
          <p className="mt-6 label-mono text-ash-3">{dict.news.byline}</p>

          {/* The cover stays an illustration, not a banner: article width,
              not container width. */}
          <div className="relative mt-10 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-xl border border-line bg-panel">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(min-width: 64rem) 48rem, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <Section>
        <article className="max-w-3xl">
          {isFallback && (
            <div className="mb-8">
              <Notice>{dict.docs.fallbackNotice}</Notice>
            </div>
          )}

          <div className="prose-astro max-w-none">
            <MDXRemote
              source={body ?? ""}
              components={postMdxComponents}
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

          <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <ButtonGhost href={LINKS.telegram} size="sm" external>
              <span className="flex items-center gap-2">
                <IconTelegram className="size-3.5" />
                {dict.news.share}
              </span>
            </ButtonGhost>
            <ButtonGhost href={at(ROUTES.news)} size="sm">
              {dict.news.backToNews}
            </ButtonGhost>
          </div>

          <div className="mt-10">
            <PrevNext
              prev={
                prev
                  ? {
                      label: dict.news.prevPost,
                      title: prev.title[active],
                      href: at(PATHS.newsPost(prev.slug)),
                    }
                  : null
              }
              next={
                next
                  ? {
                      label: dict.news.nextPost,
                      title: next.title[active],
                      href: at(PATHS.newsPost(next.slug)),
                    }
                  : null
              }
            />
          </div>
        </article>
      </Section>
    </>
  );
}
