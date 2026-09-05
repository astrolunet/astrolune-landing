import type { MetadataRoute } from "next";

import { LOCALES, LOCALE_META, localePath } from "@/lib/i18n/config";
import { DOC_ROUTES, ROUTES } from "@/lib/routes";
import { SITE } from "@/lib/site";

/** Routes worth indexing, in rough order of importance. */
const PRIORITY: Record<string, number> = {
  [ROUTES.home]: 1,
  [ROUTES.network]: 0.9,
  [ROUTES.docs]: 0.9,
  [ROUTES.scan]: 0.8,
  [ROUTES.status]: 0.8,
  [ROUTES.node]: 0.8,
  [ROUTES.id]: 0.8,
  [ROUTES.validators]: 0.7,
  [ROUTES.lune]: 0.7,
  [ROUTES.news]: 0.7,
  [ROUTES.blog]: 0.7,
  [ROUTES.about]: 0.6,
  [ROUTES.careers]: 0.6,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...Object.values(ROUTES), ...Object.values(DOC_ROUTES)];
  const lastModified = new Date();

  return paths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: `${SITE.url}${localePath(locale, path)}`,
      lastModified,
      changeFrequency: (path === ROUTES.home ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: PRIORITY[path] ?? 0.5,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [
            LOCALE_META[l].htmlLang,
            `${SITE.url}${localePath(l, path)}`,
          ]),
        ),
      },
    })),
  );
}
