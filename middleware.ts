import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

/**
 * Every page lives under `/[locale]/…`, so an unprefixed request is redirected
 * to the locale the browser asked for — falling back to `DEFAULT_LOCALE`.
 */
function negotiate(header: string | null) {
  if (!header) return DEFAULT_LOCALE;

  // "ru-RU,ru;q=0.9,en;q=0.8" → [["ru-ru", 1], ["ru", 0.9], ["en", 0.8]]
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="))
        ?.slice(2);
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .filter((entry) => entry.tag && Number.isFinite(entry.q))
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (isLocale(first)) return NextResponse.next();

  const locale = negotiate(request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Skip Next internals, the metadata routes and anything with a file
   * extension — a request for `/logo.png` must not become `/en/logo.png`.
   */
  matcher: [
    "/((?!_next/|api/|.*\\.[a-zA-Z0-9]+$|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
