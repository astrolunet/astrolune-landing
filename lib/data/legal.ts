import type { Locale } from "@/lib/i18n/config";

/**
 * Legal copy.
 *
 * Written specifically for a pre-mainnet, open-source protocol rather than
 * copied from a SaaS template. That distinction matters: this site has no
 * accounts, no analytics and no wallet connection, so a privacy policy that
 * claimed to describe cookie consent and data processing would be false. Each
 * document says what is actually true of this deployment.
 *
 * Not legal advice, and the disclaimer says so.
 */

export type LegalSection = { heading: string; body: string[] };

export type LegalDoc = {
  /** Route key under `ROUTES.legal*`. */
  key: "privacy" | "terms" | "disclaimer" | "cookies";
  slug: string;
  updated: string;
  title: Record<Locale, string>;
  intro: Record<Locale, string>;
  sections: Record<Locale, LegalSection[]>;
};

const UPDATED = "2026-01-15";

export const LEGAL: LegalDoc[] = [
  {
    key: "privacy",
    slug: "privacy",
    updated: UPDATED,
    title: { en: "Privacy", ru: "Конфиденциальность" },
    intro: {
      en: "What this site collects, which is close to nothing, and what the network records, which is permanent and public.",
      ru: "Что собирает этот сайт — почти ничего — и что записывает сеть: постоянно и публично.",
    },
    sections: {
      en: [
        {
          heading: "This website",
          body: [
            "This site has no accounts, no login, no advertising and no third-party analytics. It sets no tracking cookies and embeds no social widgets that would set them on our behalf.",
            "Pages are prerendered as static files. A request reaches the hosting provider, which necessarily processes your IP address and user agent in order to serve a response and to keep operational logs. That processing is the hosting provider's, and it is the minimum required for a web server to function.",
            "The language preference is expressed in the URL — `/en/…` or `/ru/…` — rather than stored in a cookie, so switching language leaves nothing behind on your device.",
          ],
        },
        {
          heading: "Data you send us",
          body: [
            "If you contact the project through a public channel such as the repository issue tracker or a group chat, that platform's own privacy policy applies to the message and to your account there.",
            "There is no contact form on this site and no endpoint that accepts personal data.",
          ],
        },
        {
          heading: "The blockchain is not private",
          body: [
            "This is the part that a conventional privacy policy would omit. A public ledger is designed to be permanent and universally readable. Addresses, balances, transaction amounts and timing are visible to anyone, forever, and cannot be deleted, corrected or withdrawn by us or by anyone else.",
            "Addresses are pseudonymous, not anonymous. Analysis of transaction patterns, timing and amounts can link addresses to each other and, in combination with information from outside the chain, to a person.",
            "Because on-chain records cannot be altered, rights that assume a controller can erase or rectify data — such as those under the GDPR — cannot be exercised against the ledger itself. Consider this before putting anything on any chain.",
          ],
        },
        {
          heading: "Node operators",
          body: [
            "Running a node means participating in a peer-to-peer network. Peers observe your IP address, and the consensus model additionally observes the autonomous system a node announces from, because network diversity is one input to node weight.",
            "Operators who want to reduce that exposure should treat it as an infrastructure decision, made before joining rather than after.",
          ],
        },
        {
          heading: "Changes",
          body: [
            "This document changes when the deployment changes. The date above is the date of the last revision.",
          ],
        },
      ],
      ru: [
        {
          heading: "Этот сайт",
          body: [
            "На сайте нет аккаунтов, входа, рекламы и сторонней аналитики. Он не ставит отслеживающих cookies и не встраивает социальные виджеты, которые сделали бы это за нас.",
            "Страницы отдаются как статические файлы. Запрос доходит до хостинг-провайдера, который неизбежно обрабатывает ваш IP-адрес и user agent, чтобы отдать ответ и вести операционные логи. Это обработка со стороны хостинга и минимум, необходимый для работы веб-сервера.",
            "Языковое предпочтение выражено в URL — `/en/…` или `/ru/…` — а не в cookie, поэтому переключение языка ничего не оставляет на вашем устройстве.",
          ],
        },
        {
          heading: "Данные, которые вы присылаете",
          body: [
            "Если вы связываетесь с проектом через публичный канал — трекер задач в репозитории или групповой чат — к сообщению и вашему аккаунту там применяется политика конфиденциальности этой платформы.",
            "На сайте нет формы обратной связи и нет эндпоинта, принимающего персональные данные.",
          ],
        },
        {
          heading: "Блокчейн не приватен",
          body: [
            "Это та часть, которую обычная политика конфиденциальности опустила бы. Публичный реестр спроектирован быть постоянным и всеобще читаемым. Адреса, балансы, суммы и время транзакций видны любому и навсегда; их нельзя удалить, исправить или отозвать — ни нами, ни кем-либо ещё.",
            "Адреса псевдонимны, а не анонимны. Анализ паттернов, времени и сумм транзакций позволяет связать адреса между собой, а в сочетании со сведениями вне цепочки — и с человеком.",
            "Поскольку записи в цепочке неизменяемы, права, предполагающие, что оператор может стереть или исправить данные — например, по GDPR — к самому реестру применить нельзя. Учитывайте это, прежде чем размещать что-либо в любой цепочке.",
          ],
        },
        {
          heading: "Операторы узлов",
          body: [
            "Запуск узла — это участие в одноранговой сети. Пиры видят ваш IP-адрес, а модель консенсуса дополнительно учитывает автономную систему, из которой узел анонсируется, потому что сетевое разнообразие — один из входов веса узла.",
            "Операторам, желающим снизить эту раскрываемость, стоит считать это инфраструктурным решением, принимаемым до входа в сеть, а не после.",
          ],
        },
        {
          heading: "Изменения",
          body: [
            "Этот документ меняется, когда меняется развёртывание. Дата выше — дата последней редакции.",
          ],
        },
      ],
    },
  },
  {
    key: "terms",
    slug: "terms",
    updated: UPDATED,
    title: { en: "Terms", ru: "Условия" },
    intro: {
      en: "The terms on which this site and the Astrolune software are made available.",
      ru: "Условия, на которых предоставляются этот сайт и программное обеспечение Astrolune.",
    },
    sections: {
      en: [
        {
          heading: "What is offered",
          body: [
            "This site is documentation and a block explorer interface for an open-source protocol. It is informational. Nothing here is an offer, a solicitation, or an invitation to invest, and no part of it forms a contract for a service.",
            "The Astrolune software is provided under its own licence in the source repository. That licence governs the software; these terms govern this website.",
          ],
        },
        {
          heading: "No warranty",
          body: [
            "The software and this site are provided as is, without warranty of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose and non-infringement.",
            "The network is pre-mainnet. The signature layer currently compiled into the core is a deliberate development stub and signatures are trivially forgeable. Do not place value on any Astrolune network at this stage.",
          ],
        },
        {
          heading: "Your responsibility",
          body: [
            "You are solely responsible for your keys. A private key that is lost cannot be recovered by anyone, and a key that is disclosed cannot be revoked. There is no administrator, no password reset and no support channel that can reverse a transaction.",
            "You are responsible for determining whether operating a node or transacting is lawful in your jurisdiction, and for any tax consequences that follow.",
          ],
        },
        {
          heading: "Data on this site is illustrative",
          body: [
            "Because the network has not launched, the figures shown in the explorer, the status page and the validator set are generated from a local fixture. They are present so the interface can be built and reviewed. They are not telemetry and must not be relied upon as fact.",
            "Pages that show fixture data say so on the page itself.",
          ],
        },
        {
          heading: "Limitation of liability",
          body: [
            "To the maximum extent permitted by applicable law, the contributors to this project are not liable for any loss or damage arising from use of the software, the network or this site, including loss of keys, loss of funds, or losses arising from a defect in the protocol.",
          ],
        },
        {
          heading: "Third-party links",
          body: [
            "This site links to external services such as the source repository and public chat channels. Those services have their own terms, and we do not control their content.",
          ],
        },
      ],
      ru: [
        {
          heading: "Что предоставляется",
          body: [
            "Этот сайт — документация и интерфейс обозревателя блоков для протокола с открытым исходным кодом. Он информационный. Ничто здесь не является предложением, побуждением или приглашением к инвестированию, и никакая его часть не образует договор об услуге.",
            "Программное обеспечение Astrolune предоставляется по собственной лицензии в репозитории. Та лицензия регулирует ПО; эти условия регулируют сайт.",
          ],
        },
        {
          heading: "Без гарантий",
          body: [
            "Программное обеспечение и сайт предоставляются «как есть», без каких-либо гарантий, прямых или подразумеваемых, включая, помимо прочего, гарантии товарной пригодности, пригодности для конкретной цели и отсутствия нарушения прав.",
            "Сеть находится до запуска mainnet. Слой подписи, скомпилированный в ядро сейчас, — намеренная отладочная заглушка, и подписи подделываются тривиально. Не размещайте ценность ни в одной сети Astrolune на этом этапе.",
          ],
        },
        {
          heading: "Ваша ответственность",
          body: [
            "Вы единолично отвечаете за свои ключи. Утерянный приватный ключ не может восстановить никто, а раскрытый — нельзя отозвать. Здесь нет администратора, сброса пароля и канала поддержки, способного отменить транзакцию.",
            "Вы отвечаете за определение того, законны ли эксплуатация узла и совершение транзакций в вашей юрисдикции, а также за любые налоговые последствия.",
          ],
        },
        {
          heading: "Данные на сайте иллюстративны",
          body: [
            "Поскольку сеть не запущена, значения в обозревателе, на странице состояния и в наборе валидаторов генерируются из локальной фикстуры. Они существуют, чтобы интерфейс можно было построить и оценить. Это не телеметрия, и на них нельзя опираться как на факт.",
            "Страницы, показывающие данные фикстуры, сообщают об этом на самой странице.",
          ],
        },
        {
          heading: "Ограничение ответственности",
          body: [
            "В максимальной степени, допускаемой применимым правом, участники проекта не несут ответственности за любые убытки или ущерб, возникшие из использования программного обеспечения, сети или сайта, включая утрату ключей, утрату средств или убытки из-за дефекта протокола.",
          ],
        },
        {
          heading: "Сторонние ссылки",
          body: [
            "Сайт ссылается на внешние сервисы — репозиторий исходного кода и публичные чаты. У них свои условия, и мы не контролируем их содержимое.",
          ],
        },
      ],
    },
  },
  {
    key: "disclaimer",
    slug: "disclaimer",
    updated: UPDATED,
    title: { en: "Disclosures", ru: "Раскрытие информации" },
    intro: {
      en: "Risk disclosures, and an explicit statement of what is not yet built.",
      ru: "Раскрытие рисков и прямое указание на то, что ещё не построено.",
    },
    sections: {
      en: [
        {
          heading: "Not financial advice",
          body: [
            "Nothing on this site is financial, investment, legal or tax advice. Lune is a protocol utility used to pay for computation and storage and to post an operational bond. It is not offered as an investment and no return of any kind is promised.",
          ],
        },
        {
          heading: "Current state of the software",
          body: [
            "The consensus arithmetic is implemented and tested. The virtual machine, state and transaction layers exist but are thinly tested. The networking layer has not been started. There is no genesis block, no public RPC endpoint and no mainnet.",
            "The signature, VRF and VDF implementations compiled into the core today are development stubs. `al_crypto_is_secure()` returns false, and that is the correct value for the current backend.",
          ],
        },
        {
          heading: "Known open problems",
          body: [
            "The consensus model records its own limitations rather than describing them away. Non-domination is not mathematically proven. The trust graph and the correlation dampener are heuristics. Time as a barrier can be bought in advance by starting a node farm early and waiting. Network diversity is evadable with a budget for residential proxies.",
            "These are stated in the specification and repeated here so that no reader has to find them.",
          ],
        },
        {
          heading: "Forward-looking statements",
          body: [
            "The roadmap describes intent, not commitment. Items are blocked on unresolved technical questions — notably the account-versus-resource state model and the virtual machine word size — and answers to those questions may change the plan or invalidate parts of it.",
          ],
        },
        {
          heading: "Illustrative figures",
          body: [
            "Supply, throughput, validator and explorer figures shown anywhere on this site are fixtures. Emission parameters belong in a genesis block, and no genesis block exists.",
          ],
        },
      ],
      ru: [
        {
          heading: "Не финансовый совет",
          body: [
            "Ничто на сайте не является финансовым, инвестиционным, юридическим или налоговым советом. Lune — утилита протокола для оплаты вычислений и хранения и для внесения операционного залога. Она не предлагается как инвестиция, и никакая доходность не обещается.",
          ],
        },
        {
          heading: "Текущее состояние ПО",
          body: [
            "Арифметика консенсуса реализована и покрыта тестами. Слои виртуальной машины, состояния и транзакций существуют, но протестированы тонко. Сетевой слой не начат. Нет genesis-блока, нет публичного RPC-эндпоинта и нет mainnet.",
            "Реализации подписи, VRF и VDF, скомпилированные в ядро сегодня, — отладочные заглушки. `al_crypto_is_secure()` возвращает false, и это правильное значение для текущего бэкенда.",
          ],
        },
        {
          heading: "Известные открытые проблемы",
          body: [
            "Модель консенсуса фиксирует свои ограничения, а не заговаривает их. Отсутствие доминирования математически не доказано. Граф доверия и подавление корреляции — эвристики. Время как барьер можно купить заранее, подняв ферму узлов пораньше и подождав. Сетевое разнообразие обходится бюджетом на резидентные прокси.",
            "Это указано в спецификации и повторено здесь, чтобы читателю не приходилось это искать.",
          ],
        },
        {
          heading: "Заявления о будущем",
          body: [
            "Дорожная карта описывает намерение, а не обязательство. Пункты заблокированы нерешёнными техническими вопросами — прежде всего моделью состояния «аккаунт против ресурса» и размером машинного слова VM — и ответы на них могут изменить план или обесценить его части.",
          ],
        },
        {
          heading: "Иллюстративные значения",
          body: [
            "Показатели эмиссии, пропускной способности, валидаторов и обозревателя в любом месте сайта — фикстуры. Параметры эмиссии принадлежат genesis-блоку, а genesis-блока не существует.",
          ],
        },
      ],
    },
  },
  {
    key: "cookies",
    slug: "cookies",
    updated: UPDATED,
    title: { en: "Cookies", ru: "Cookies" },
    intro: {
      en: "This site sets no cookies. The short explanation of why, and what it uses instead.",
      ru: "Этот сайт не ставит cookies. Коротко о том, почему и что используется вместо них.",
    },
    sections: {
      en: [
        {
          heading: "No cookies are set",
          body: [
            "This deployment sets no cookies of any kind — not analytics, not advertising, and not preference cookies. There is consequently no consent banner, because there is nothing to consent to.",
          ],
        },
        {
          heading: "How the language preference works instead",
          body: [
            "The active language is part of the URL rather than a stored preference. `/en/network` and `/ru/network` are different addresses for the same page.",
            "On a first visit to a path without a language prefix, the server reads the standard `Accept-Language` request header to choose which prefix to redirect to. That header is sent by your browser with every request and is not stored by us.",
          ],
        },
        {
          heading: "Local storage",
          body: [
            "No data is written to `localStorage` or `sessionStorage`. Interactive elements — the weight calculator, the address inspector, the name lookup — hold their state in memory for the duration of the page view and discard it on navigation.",
          ],
        },
        {
          heading: "Third parties",
          body: [
            "Fonts are served from Google Fonts and are requested by your browser when a page loads, which discloses your IP address to that provider. No other third-party resource is embedded, and there are no external scripts, pixels or iframes.",
          ],
        },
      ],
      ru: [
        {
          heading: "Cookies не устанавливаются",
          body: [
            "Это развёртывание не ставит никаких cookies — ни аналитических, ни рекламных, ни для настроек. Соответственно, нет и баннера согласия, потому что соглашаться не на что.",
          ],
        },
        {
          heading: "Как вместо них работает выбор языка",
          body: [
            "Активный язык — часть URL, а не сохранённая настройка. `/en/network` и `/ru/network` — разные адреса одной страницы.",
            "При первом визите на путь без языкового префикса сервер читает стандартный заголовок запроса `Accept-Language`, чтобы выбрать префикс для перенаправления. Этот заголовок браузер отправляет с каждым запросом, и мы его не храним.",
          ],
        },
        {
          heading: "Локальное хранилище",
          body: [
            "В `localStorage` и `sessionStorage` ничего не записывается. Интерактивные элементы — калькулятор веса, инспектор адреса, поиск имени — держат состояние в памяти на время просмотра страницы и сбрасывают его при переходе.",
          ],
        },
        {
          heading: "Третьи стороны",
          body: [
            "Шрифты отдаются Google Fonts и запрашиваются вашим браузером при загрузке страницы, что раскрывает ваш IP-адрес этому провайдеру. Никаких других сторонних ресурсов не встроено; внешних скриптов, пикселей и iframe нет.",
          ],
        },
      ],
    },
  },
];

const BY_SLUG = new Map(LEGAL.map((doc) => [doc.slug, doc]));

export function legalBySlug(slug: string): LegalDoc | null {
  return BY_SLUG.get(slug) ?? null;
}
