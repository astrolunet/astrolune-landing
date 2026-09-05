import type { Locale } from "@/lib/i18n/config";

/**
 * Open roles for the careers page.
 *
 * Kept as data rather than dictionary entries so a new posting is one array
 * element — the page renders whatever is here, and an empty array collapses
 * into the "nothing that fits" notice. Team names are translated because they
 * appear next to localized copy; everything else about compensation and
 * process stays in the dictionary.
 */
export type CareerRole = {
  id: string;
  team: Record<Locale, string>;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
  skills: Record<Locale, string[]>;
};

export const CAREER_ROLES: CareerRole[] = [
  {
    id: "core-engineer-c",
    team: { en: "Consensus core", ru: "Ядро консенсуса" },
    title: { en: "Core Engineer — C", ru: "Инженер ядра — C" },
    summary: {
      en: "Own the hot path: block execution, committee selection and the Q32.32 arithmetic underneath them. Pure functions, hard latency budgets, no clock reads anywhere.",
      ru: "Горячий путь: исполнение блоков, выбор комитета и арифметика Q32.32 под ними. Чистые функции, жёсткие бюджеты задержек и ни одного чтения часов.",
    },
    skills: {
      en: ["C23 and the C ABI", "Fixed-point arithmetic", "Property-based testing"],
      ru: ["C23 и C ABI", "Фиксированная точка", "Тестирование свойств"],
    },
  },
  {
    id: "tooling-engineer-cpp",
    team: { en: "Tooling", ru: "Инструментарий" },
    title: { en: "Tooling Engineer — C++23", ru: "Инженер инструментария — C++23" },
    summary: {
      en: "Build the Trocto → Regol compiler pipeline, the assembler and the deploy-time validator. The boundary between you and the C core is pinned by static_assert, not by hope.",
      ru: "Конвейер компилятора Trocto → Regol, ассемблер и валидатор на деплое. Границу между вами и ядром на C закрепляет static_assert, а не надежда.",
    },
    skills: {
      en: ["Modern C++ (20/23)", "Compilers and IR design", "CMake / Ninja build systems"],
      ru: ["Современный C++ (20/23)", "Компиляторы и IR", "Сборка CMake / Ninja"],
    },
  },
  {
    id: "protocol-researcher",
    team: { en: "Research", ru: "Исследования" },
    title: { en: "Protocol Researcher", ru: "Исследователь протоколов" },
    summary: {
      en: "Attack the trust graph for a living, then write down what you found. Sybil resilience, dispersion windows and the economics of the operational bond are all open problems here.",
      ru: "Ваша работа — атаковать граф доверия, а затем записать найденное. Устойчивость к Сибилам, окна дисперсии и экономика операционного залога здесь открыты.",
    },
    skills: {
      en: ["Graph algorithms", "Game-theoretic analysis", "Writing that survives review"],
      ru: ["Графовые алгоритмы", "Теоретико-игровой анализ", "Тексты, переживающие ревью"],
    },
  },
  {
    id: "devrel-engineer",
    team: { en: "Developer experience", ru: "Опыт разработчиков" },
    title: { en: "DevRel Engineer", ru: "DevRel-инженер" },
    summary: {
      en: "Turn the specification into examples, guides and tools other developers can lean on. You will be the first external user of everything — including the parts that do not exist yet.",
      ru: "Превратить спецификацию в примеры, гайды и инструменты, на которые другие разработчики могут опереться. Вы — первый внешний пользователь всего, включая то, чего ещё нет.",
    },
    skills: {
      en: ["Technical writing (EN/RU)", "Rust or TypeScript", "Patience with pre-mainnet reality"],
      ru: ["Технический текст (EN/RU)", "Rust или TypeScript", "Терпение к реальности до mainnet"],
    },
  },
];
