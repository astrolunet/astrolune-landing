import { Coin } from "@/components/home/coin";
import { Explore } from "@/components/home/explore";
import { Hero } from "@/components/home/hero";
import { Layers } from "@/components/home/layers";
import { Network, Ticker } from "@/components/home/network";
import { CtaBand, Faq, Roadmap } from "@/components/home/roadmap-faq-cta";
import { Stack } from "@/components/home/stack";

/**
 * 01 HERO → 02 TICKER → 03 NETWORK → 04 LAYERS → 05 STACK → 06 COIN →
 * 07 EXPLORE → 08 ROADMAP → 09 FAQ → 10 CTA.
 *
 * The page reads as a tour of the whole network rather than of consensus alone.
 * The layer bento names each part of the system and hands off to the page that
 * covers it; the PoTB deep-dive — weight components, committees, the weight
 * calculator, rewards, slashing and the honest limitations — lives at
 * `/network`. Every section is a client component because they all read the
 * dictionary through `useI18n`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker />
      <Network />
      <Layers />
      <Stack />
      <Coin />
      <Explore />
      <Roadmap />
      <Faq />
      <CtaBand />
    </>
  );
}
