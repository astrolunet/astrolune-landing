import type { Metadata } from "next";

import { Barriers } from "@/components/consensus/barriers";
import { Committee } from "@/components/consensus/committee";
import { Compare } from "@/components/consensus/compare";
import { ConsensusHero, Idea } from "@/components/consensus/hero";
import { Levels } from "@/components/consensus/levels";
import { Limits } from "@/components/consensus/limits";
import { Rewards } from "@/components/consensus/rewards";
import { Slashing } from "@/components/consensus/slashing";
import { CtaBand } from "@/components/home/roadmap-faq-cta";
import { isLocale, localePath, LOCALES, LOCALE_META } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/dict";
import { ROUTES } from "@/lib/routes";

/**
 * The consensus deep-dive.
 *
 * 01 IDEA → 02 COMPARE → 03 BARRIERS → 04 COMMITTEE → 05 LEVELS →
 * 06 REWARDS → 07 SLASHING → 08 LIMITS → CTA.
 *
 * The home page names PoTB as one layer among several and links here; this page
 * is where the model is actually argued — including the four open risks the
 * specification refuses to describe away.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDict(locale);

  return {
    title: dict.consensus.title,
    description: dict.consensus.subtitle,
    alternates: {
      canonical: localePath(locale, ROUTES.network),
      languages: Object.fromEntries(
        LOCALES.map((l) => [
          LOCALE_META[l].htmlLang,
          localePath(l, ROUTES.network),
        ]),
      ),
    },
    openGraph: {
      title: dict.consensus.title,
      description: dict.consensus.subtitle,
      url: localePath(locale, ROUTES.network),
    },
  };
}

export default function NetworkPage() {
  return (
    <>
      <ConsensusHero />
      <Idea />
      <Compare />
      <Barriers />
      <Committee />
      <Levels />
      <Rewards />
      <Slashing />
      <Limits />
      <CtaBand />
    </>
  );
}
