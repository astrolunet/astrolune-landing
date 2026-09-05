import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/motion";
import { Notice, PageHero, Section } from "@/components/site/chrome";
import { FilterChips } from "@/components/site/tabs";
import { Chip, IconArrow } from "@/components/ui";
import * as blog from "@/lib/api/blog";
import type { BlogCategory } from "@/lib/api/blog";
import { fmtDate } from "@/lib/format";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { PATHS, ROUTES } from "@/lib/routes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.blog),
      languages: Object.fromEntries(
        LOCALES.map((l) => [LOCALE_META[l].htmlLang, localePath(l, ROUTES.blog)]),
      ),
    },
  };
}

const CATEGORIES: (BlogCategory | "all")[] = [
  "all",
  "engineering",
  "research",
  "guides",
  "protocol",
];

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category } = await searchParams;
  const active = isLocale(locale) ? locale : "en";
  const dict = await getDict(active);
  const at = (path: string) => localePath(active, path);

  const filter = CATEGORIES.includes(category as BlogCategory)
    ? (category as BlogCategory)
    : undefined;

  const [posts, featured] = await Promise.all([
    blog.getPosts(filter),
    blog.getFeaturedPost(),
  ]);

  // Same rule as the news index: the featured post leads only the unfiltered
  // view; inside a category the newest post of that category leads.
  const lead = filter ? null : featured;
  const rest = lead ? posts.filter((post) => post.slug !== lead.slug) : posts;

  const chips = CATEGORIES.map((key) => ({
    key,
    label: dict.blog.categories[key],
    href:
      key === "all" ? at(ROUTES.blog) : `${at(ROUTES.blog)}?category=${key}`,
  }));

  return (
    <>
      <PageHero
        crumbs={[{ label: dict.blog.title }]}
        title={dict.blog.title}
        subtitle={dict.blog.subtitle}
      >
        <FilterChips items={chips} active={filter ?? "all"} />
      </PageHero>

      <Section>
        {/* featured */}
        {lead && (
          <Reveal>
            <Link
              href={at(PATHS.blogPost(lead.slug))}
              className="group relative mb-12 grid overflow-hidden panel rounded-xl transition-colors duration-500 hover:border-line-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-transform duration-700 group-hover:scale-x-100"
              />
              <div className="flex flex-col p-7 md:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <Chip tone="solid">{dict.blog.featured}</Chip>
                  <Chip tone="muted">
                    {dict.blog.categories[lead.category]}
                  </Chip>
                  <span className="label-mono text-ash-3">
                    {fmtDate(lead.date, active)}
                  </span>
                </div>

                <h2 className="display mt-7 max-w-3xl text-graphite text-[clamp(1.5rem,3.4vw,2.5rem)]">
                  {lead.title[active]}
                </h2>
                <p className="mt-5 max-w-2xl text-[0.9375rem] leading-relaxed text-ash">
                  {lead.excerpt[active]}
                </p>

                <span className="mt-8 flex items-center gap-2.5 label-mono text-ash-3 transition-colors duration-300 group-hover:text-chalk">
                  <span className="h-px w-6 bg-line-3 transition-all duration-400 group-hover:w-10 group-hover:bg-chalk" />
                  {dict.common.readMore}
                  <IconArrow className="size-3.5 transition-transform duration-400 group-hover:translate-x-1" />
                </span>
              </div>

              <div className="relative min-h-[220px] border-t border-line lg:min-h-0 lg:border-t-0 lg:border-l">
                <Image
                  src={lead.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 44rem, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </div>
            </Link>
          </Reveal>
        )}

        {/* the rest */}
        {rest.length === 0 ? (
          <Notice>{dict.blog.empty}</Notice>
        ) : (
          <div className="grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={i * 60}>
                <Link
                  href={at(PATHS.blogPost(post.slug))}
                  className="group relative flex h-full flex-col bg-panel px-6 py-7 transition-colors duration-400 hover:bg-panel-2"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-chalk/45 transition-transform duration-700 group-hover:scale-x-100"
                  />
                  <div className="relative mb-6 aspect-[16/9] overflow-hidden rounded-lg border border-line">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 28rem, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <Chip tone="muted">
                      {dict.blog.categories[post.category]}
                    </Chip>
                    <span className="label-mono text-ash-3">
                      {post.readingMinutes} {dict.common.minRead}
                    </span>
                  </div>

                  <h3 className="mt-6 text-[1.0625rem] leading-snug font-medium tracking-tight text-chalk">
                    {post.title[active]}
                  </h3>
                  <p className="mt-3 flex-1 text-[0.8125rem] leading-relaxed text-ash">
                    {post.excerpt[active]}
                  </p>

                  <span className="mt-6 label-mono text-ash-3">
                    {fmtDate(post.date, active)}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
