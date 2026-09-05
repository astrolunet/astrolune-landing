import Image from "next/image";

import { Callout, mdxComponents } from "@/components/docs/mdx";

/**
 * The MDX component map for authored posts — news and blog.
 *
 * It extends the documentation map with what long-form articles need and the
 * spec never uses: figures. Authors get two tools:
 *
 * - A plain markdown image `![alt](…)` renders as a framed figure at article
 *   width — never full-bleed, which is how a post used to swallow the page.
 * - `<PostImage small caption>` is the explicit form: a narrower, centered
 *   figure with an optional mono caption.
 *
 * Everything else inherits from `components/docs/mdx.tsx`, so tables, links
 * and code blocks look identical across docs, news and blog.
 */

const FIGURE_SIZES =
  "(min-width: 64rem) 48rem, (min-width: 40rem) 40rem, 100vw";

/** Markdown-image override: framed, article-width, never blown up. */
function Img({ src, alt = "", ...rest }: { src?: string; alt?: string }) {
  return (
    <Image
      src={src ?? ""}
      alt={alt}
      width={1280}
      height={720}
      sizes={FIGURE_SIZES}
      className="my-8 h-auto w-full rounded-xl border border-line bg-panel"
      {...rest}
    />
  );
}

export function PostImage({
  src,
  alt = "",
  caption,
  small = false,
}: {
  src: string;
  alt?: string;
  /** Mono caption under the frame, as on chart tiles elsewhere. */
  caption?: string;
  /** Constrains the figure to roughly half the column, centered. */
  small?: boolean;
}) {
  return (
    <figure className={`my-8 ${small ? "mx-auto w-full max-w-md" : ""}`}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-xl border border-line bg-panel">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={FIGURE_SIZES}
          className="object-cover"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-center label-mono text-ash-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export const postMdxComponents = {
  ...mdxComponents,
  img: Img,
  PostImage,
};
