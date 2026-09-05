import { GridBackdrop } from "@/components/grid-backdrop";
import { ButtonGhost, ButtonSolid } from "@/components/ui";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

/**
 * The 404 inside the locale tree.
 *
 * `notFound()` unwinds past the route segment, so the `locale` param is not
 * available here — Next renders this without the params that produced it. The
 * copy therefore falls back to the default locale rather than guessing, and the
 * links are locale-relative through the default prefix. A visitor who was on
 * `/ru/…` keeps their language via the header switch, which is still rendered by
 * the layout above this component.
 */
export default async function NotFound() {
  const dict = await getDict(DEFAULT_LOCALE);
  const at = (path: string) => `/${DEFAULT_LOCALE}${path === "/" ? "" : path}`;

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-[68px]">
      <GridBackdrop />

      <div className="container-rail relative">
        <div className="max-w-2xl">
          <p className="display text-graphite text-[clamp(4rem,16vw,11rem)] leading-none">
            404
          </p>

          <h1 className="display mt-8 text-fade-b text-[clamp(1.5rem,3.4vw,2.4rem)]">
            {dict.notFound.title}
          </h1>

          <p className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-ash">
            {dict.notFound.body}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonSolid href={at(ROUTES.home)} arrow>
              {dict.notFound.home}
            </ButtonSolid>
            <ButtonGhost href={at(ROUTES.docs)}>
              {dict.common.readDocs}
            </ButtonGhost>
          </div>
        </div>
      </div>
    </section>
  );
}
