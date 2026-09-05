/**
 * Strings for the packaged UI.
 *
 * The package ships its own copy rather than reading the host application's
 * dictionary: it is published on npm and mounted inside applications that have
 * no dictionary at all. `<AstroluneIdProvider locale>` selects a bundled
 * language, and `strings` lets an integrator override any leaf.
 *
 * `en` is canonical. `ru` is checked against its *shape*, so a missing key is a
 * type error rather than an empty label in production.
 */

export const en = {
  brand: "Astrolune ID",

  auth: {
    signIn: "Sign in",
    signOut: "Sign out",
    signingIn: "Signing in",
    title: "One account for the whole network",
    blurb:
      "Link wallets, .lune names, Share buckets, proxy endpoints and nodes to a single identity. Nothing custodial — the account references keys it never holds.",
    chooseMethod: "Choose how to prove control",
    methods: {
      wallet: { label: "Connect a wallet", desc: "Sign a challenge with a linked key" },
      passkey: { label: "Passkey", desc: "Device biometrics, no password stored" },
      email: { label: "Email link", desc: "One-time link, for recovery only" },
      recovery: { label: "Recovery phrase", desc: "24 words, last resort" },
    },
    step: "Step",
    stepPick: "Pick a wallet",
    stepSign: "Sign the challenge",
    challenge: "Challenge",
    signWith: "Sign with",
    cancel: "Cancel",
    back: "Back",
    prototypeNote:
      "Prototype: no request leaves the browser. The session is a local fixture.",
    account: "Account",
    trust: "Trust",
    tier: "Tier",
    member: "Member since",
    methodsTitle: "Registered methods",
    openConsole: "Open console",
    signedInAs: "Signed in as",
    failed: "Could not complete sign-in. Try another method.",
  },

  nav: {
    overview: "Overview",
    domains: "Domains",
    wallets: "Wallets",
    share: "Share",
    proxy: "Proxy",
    nodes: "Nodes",
    validator: "Validator",
  },

  overview: {
    title: "Overview",
    linked: "Linked assets",
    domains: "Names",
    wallets: "Wallets",
    storage: "Storage used",
    traffic: "Proxy traffic",
    nodes: "Nodes online",
    balance: "Primary balance",
    expiring: "Expiring soon",
    expiringNone: "Nothing expires in the next 30 days",
    quickBuy: "Add capacity",
  },

  domains: {
    title: "Names",
    note: "A .lune name is owned on-chain. This panel edits the records the ID resolves through.",
    name: "Name",
    status: "Status",
    expires: "Expires",
    records: "Records",
    target: "Resolves to",
    autoRenew: "Auto-renew",
    manage: "Manage",
    register: "Register a name",
    empty: "No names linked yet",
    detail: "Name detail",
    setTarget: "Set ADDR target",
    unset: "Not set",
    renewNow: "Renew now",
    daysLeft: "days left",
    inGrace: "In grace — renew to keep the name",
    pending: "Registration pending inclusion",
  },

  wallets: {
    title: "Wallets",
    note: "The ID stores addresses and a signature proving control. It never sees a private key.",
    address: "Address",
    kind: "Kind",
    balance: "Balance",
    primary: "Primary",
    makePrimary: "Make primary",
    unlink: "Unlink",
    link: "Link a wallet",
    empty: "No wallets linked yet",
    verified: "Verified",
    watch: "Watch-only",
    kinds: {
      hardware: "Hardware",
      software: "Software",
      contract: "Contract",
      watch: "Watch-only",
    },
    drawer: {
      title: "Link a wallet",
      blurb:
        "Paste an address, or connect a signer. A watch-only link needs no signature but cannot spend.",
      addressLabel: "Address",
      addressHint: "al1 followed by 40 hex characters",
      labelLabel: "Label",
      labelHint: "Only you see this",
      kindLabel: "Kind",
      watchLabel: "Link watch-only",
      watchHint: "Skip the signature. Balances read, nothing spends.",
      submit: "Link wallet",
      invalid: "That is not a valid Astrolune address.",
      duplicate: "That address is already linked.",
    },
  },

  share: {
    title: "Share",
    note: "Share is the storage layer. Buckets are content-addressed and replicated across the storage set.",
    bucket: "Bucket",
    region: "Region",
    usage: "Usage",
    pins: "Pins",
    replicas: "Replicas",
    endpoint: "Gateway",
    create: "New bucket",
    buy: "Add storage",
    empty: "No buckets yet",
    remove: "Delete",
    quota: "Quota",
    createTitle: "New bucket",
    createBlurb:
      "A bucket is billed on its quota, not its usage. Quota can be raised later without moving data.",
    labelLabel: "Label",
    regionLabel: "Region",
    quotaLabel: "Quota",
    submit: "Create bucket",
  },

  proxy: {
    title: "Proxy",
    note: "Egress through the relay set. Credentials are per endpoint and rotate on demand.",
    endpoint: "Endpoint",
    protocol: "Protocol",
    region: "Region",
    rotation: "Rotation",
    traffic: "Traffic",
    expires: "Renews",
    configure: "Configure",
    rotate: "Rotate credentials",
    buy: "Buy an endpoint",
    empty: "No endpoints yet",
    reveal: "Reveal",
    hide: "Hide",
    secret: "Password",
    username: "Username",
    host: "Host",
    port: "Port",
    connectionString: "Connection string",
    rotations: {
      static: "Static",
      "per-request": "Per request",
      hourly: "Hourly",
    },
    modal: {
      title: "Proxy endpoint",
      blurb:
        "Pick a protocol and a rotation policy. Both apply to the next connection — existing sessions are not cut.",
      protocolLabel: "Protocol",
      rotationLabel: "Rotation",
      regionLabel: "Region",
      quotaLabel: "Monthly traffic",
      apply: "Apply",
      buy: "Buy endpoint",
      curl: "Test it",
    },
  },

  nodes: {
    title: "Nodes",
    note: "Every node the ID is attested on, with the metrics its operator is judged by.",
    node: "Node",
    role: "Role",
    region: "Region",
    version: "Version",
    uptime: "Uptime",
    peers: "Peers",
    height: "Height",
    missRate: "Miss rate",
    blockTime: "Block time",
    empty: "No nodes attested to this ID",
    refresh: "Refresh",
    roles: { relay: "Relay", candidate: "Candidate", validator: "Validator" },
    statuses: { online: "Online", syncing: "Syncing", offline: "Offline" },
  },

  validator: {
    title: "Validator",
    note: "Weight comes from behaviour over time. None of these components can be bought.",
    tbs: "TBS · time-behaviour",
    tgw: "TGW · trust graph",
    ndm: "NDM · node diversity",
    cod: "COD · cost of dishonesty",
    weight: "Final weight",
    rank: "Rank",
    committee: "Committee",
    inCommittee: "Seated",
    outOfCommittee: "Candidate",
    epochs: "Epochs seated",
    missed: "Missed votes",
    bond: "Operational bond",
    bondNote:
      "The bond is public evidence of infrastructure spend. It feeds the 15% bucket and nothing else.",
    rewards: "Rewards · 30 days",
    penalties: "Penalty history",
    penaltiesNone: "No penalties recorded",
    notValidator: "This ID has no validator node yet.",
    notValidatorBody:
      "Clear the minimum TBS on any attested node and this panel fills in.",
  },

  pay: {
    title: "Pay with Lune",
    summary: "Order",
    amount: "Amount",
    address: "Send to",
    memo: "Memo",
    network: "Network",
    window: "Window",
    expiresIn: "Expires in",
    awaiting: "Awaiting payment",
    confirming: "Confirming",
    paid: "Paid",
    expired: "Window expired",
    failed: "Payment failed",
    confirmations: "Confirmations",
    txHash: "Transaction",
    memoWarning:
      "Include the memo. A transfer without it is not matched to this invoice and has to be recovered by hand.",
    payFromWallet: "Pay from linked wallet",
    simulate: "Simulate an incoming transfer",
    simulateHint: "Prototype only — stands in for a watched deposit address.",
    close: "Close",
    done: "Done",
    newWindow: "New window",
    qrCaption: "Mock pattern — not scannable in the prototype",
    appliedTo: "Applied to your account",
  },

  common: {
    copy: "Copy",
    copied: "Copied",
    close: "Close",
    cancel: "Cancel",
    save: "Save",
    loading: "Loading",
    of: "of",
    prototype: "Prototype",
    prototypeBody:
      "No backend. Every figure is a local fixture and the session lives in this browser only.",
    buy: "Buy",
    price: "Price",
    perMonth: "/ month",
    perYear: "/ year",
    once: "one-off",
    select: "Select",
    more: "More",
    none: "None",
    yes: "Yes",
    no: "No",
    region: "Region",
    all: "All",
  },
} as const;

/** Widens string literals so `ru` is checked on shape, not on wording. */
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

export type Strings = Widen<typeof en>;

/** A partial override tree, for integrators replacing a handful of labels. */
export type StringsOverride = DeepPartial<Strings>;

type DeepPartial<T> = T extends string
  ? T
  : { [K in keyof T]?: DeepPartial<T[K]> };

export const ru: Strings = {
  brand: "Astrolune ID",

  auth: {
    signIn: "Войти",
    signOut: "Выйти",
    signingIn: "Вход",
    title: "Один аккаунт на всю сеть",
    blurb:
      "Кошельки, имена .lune, бакеты Share, прокси-эндпоинты и ноды — на одной личности. Ничего кастодиального: аккаунт ссылается на ключи, но не хранит их.",
    chooseMethod: "Выберите способ подтверждения",
    methods: {
      wallet: { label: "Подключить кошелёк", desc: "Подписать челлендж ключом" },
      passkey: { label: "Passkey", desc: "Биометрия устройства, без пароля" },
      email: { label: "Ссылка на почту", desc: "Одноразовая ссылка, для восстановления" },
      recovery: { label: "Фраза восстановления", desc: "24 слова, крайний случай" },
    },
    step: "Шаг",
    stepPick: "Выберите кошелёк",
    stepSign: "Подпишите челлендж",
    challenge: "Челлендж",
    signWith: "Подписать через",
    cancel: "Отмена",
    back: "Назад",
    prototypeNote:
      "Прототип: ни один запрос не уходит из браузера. Сессия — локальная фикстура.",
    account: "Аккаунт",
    trust: "Доверие",
    tier: "Тариф",
    member: "В сети с",
    methodsTitle: "Привязанные способы",
    openConsole: "Открыть консоль",
    signedInAs: "Вы вошли как",
    failed: "Не удалось войти. Попробуйте другой способ.",
  },

  nav: {
    overview: "Обзор",
    domains: "Домены",
    wallets: "Кошельки",
    share: "Share",
    proxy: "Прокси",
    nodes: "Ноды",
    validator: "Валидатор",
  },

  overview: {
    title: "Обзор",
    linked: "Привязанные ресурсы",
    domains: "Имена",
    wallets: "Кошельки",
    storage: "Занято в Share",
    traffic: "Трафик прокси",
    nodes: "Ноды онлайн",
    balance: "Баланс основного",
    expiring: "Скоро истекает",
    expiringNone: "В ближайшие 30 дней ничего не истекает",
    quickBuy: "Докупить ресурсы",
  },

  domains: {
    title: "Имена",
    note: "Имя .lune принадлежит вам на уровне цепочки. Здесь редактируются записи, через которые ID разрешается.",
    name: "Имя",
    status: "Статус",
    expires: "Истекает",
    records: "Записи",
    target: "Указывает на",
    autoRenew: "Автопродление",
    manage: "Управлять",
    register: "Зарегистрировать имя",
    empty: "Имён пока нет",
    detail: "Карточка имени",
    setTarget: "Задать ADDR",
    unset: "Не задано",
    renewNow: "Продлить",
    daysLeft: "дн. осталось",
    inGrace: "Льготный период — продлите, чтобы сохранить имя",
    pending: "Регистрация ждёт включения в блок",
  },

  wallets: {
    title: "Кошельки",
    note: "ID хранит адрес и подпись, доказывающую владение. Приватный ключ он не видит никогда.",
    address: "Адрес",
    kind: "Тип",
    balance: "Баланс",
    primary: "Основной",
    makePrimary: "Сделать основным",
    unlink: "Отвязать",
    link: "Привязать кошелёк",
    empty: "Кошельков пока нет",
    verified: "Подтверждён",
    watch: "Только просмотр",
    kinds: {
      hardware: "Аппаратный",
      software: "Программный",
      contract: "Контракт",
      watch: "Просмотр",
    },
    drawer: {
      title: "Привязка кошелька",
      blurb:
        "Вставьте адрес или подключите подписанта. Режим «только просмотр» не требует подписи, но и не может тратить.",
      addressLabel: "Адрес",
      addressHint: "al1 и 40 hex-символов",
      labelLabel: "Название",
      labelHint: "Видно только вам",
      kindLabel: "Тип",
      watchLabel: "Только просмотр",
      watchHint: "Без подписи. Балансы читаются, траты запрещены.",
      submit: "Привязать",
      invalid: "Это не похоже на адрес Astrolune.",
      duplicate: "Такой адрес уже привязан.",
    },
  },

  share: {
    title: "Share",
    note: "Share — слой хранения. Бакеты адресуются по содержимому и репликуются по набору хранителей.",
    bucket: "Бакет",
    region: "Регион",
    usage: "Заполнение",
    pins: "Пины",
    replicas: "Реплики",
    endpoint: "Шлюз",
    create: "Новый бакет",
    buy: "Докупить место",
    empty: "Бакетов пока нет",
    remove: "Удалить",
    quota: "Квота",
    createTitle: "Новый бакет",
    createBlurb:
      "Бакет тарифицируется по квоте, а не по занятому месту. Квоту можно поднять позже без переноса данных.",
    labelLabel: "Название",
    regionLabel: "Регион",
    quotaLabel: "Квота",
    submit: "Создать бакет",
  },

  proxy: {
    title: "Прокси",
    note: "Исходящий трафик через набор релеев. Реквизиты у каждого эндпоинта свои и ротируются по требованию.",
    endpoint: "Эндпоинт",
    protocol: "Протокол",
    region: "Регион",
    rotation: "Ротация",
    traffic: "Трафик",
    expires: "Продление",
    configure: "Настроить",
    rotate: "Сменить реквизиты",
    buy: "Купить эндпоинт",
    empty: "Эндпоинтов пока нет",
    reveal: "Показать",
    hide: "Скрыть",
    secret: "Пароль",
    username: "Логин",
    host: "Хост",
    port: "Порт",
    connectionString: "Строка подключения",
    rotations: {
      static: "Статичная",
      "per-request": "На запрос",
      hourly: "Каждый час",
    },
    modal: {
      title: "Прокси-эндпоинт",
      blurb:
        "Выберите протокол и политику ротации. Оба применяются к следующему соединению — активные сессии не рвутся.",
      protocolLabel: "Протокол",
      rotationLabel: "Ротация",
      regionLabel: "Регион",
      quotaLabel: "Трафик в месяц",
      apply: "Применить",
      buy: "Купить эндпоинт",
      curl: "Проверить",
    },
  },

  nodes: {
    title: "Ноды",
    note: "Все ноды, на которых заявлен этот ID, с метриками, по которым судят оператора.",
    node: "Нода",
    role: "Роль",
    region: "Регион",
    version: "Версия",
    uptime: "Аптайм",
    peers: "Пиры",
    height: "Высота",
    missRate: "Пропуски",
    blockTime: "Время блока",
    empty: "К этому ID не привязано ни одной ноды",
    refresh: "Обновить",
    roles: { relay: "Релей", candidate: "Кандидат", validator: "Валидатор" },
    statuses: { online: "Онлайн", syncing: "Синхронизация", offline: "Офлайн" },
  },

  validator: {
    title: "Валидатор",
    note: "Вес складывается из поведения во времени. Ни один компонент нельзя купить.",
    tbs: "TBS · поведение во времени",
    tgw: "TGW · граф доверия",
    ndm: "NDM · разнесённость",
    cod: "COD · цена нечестности",
    weight: "Итоговый вес",
    rank: "Место",
    committee: "Комитет",
    inCommittee: "В комитете",
    outOfCommittee: "Кандидат",
    epochs: "Эпох в комитете",
    missed: "Пропущено голосов",
    bond: "Операционный залог",
    bondNote:
      "Залог — публичное свидетельство расходов на инфраструктуру. Он влияет только на 15%-ю корзину.",
    rewards: "Награды · 30 дней",
    penalties: "История наказаний",
    penaltiesNone: "Наказаний не зафиксировано",
    notValidator: "У этого ID пока нет валидаторской ноды.",
    notValidatorBody:
      "Пройдите минимальный TBS на любой заявленной ноде — и панель заполнится.",
  },

  pay: {
    title: "Оплата в Lune",
    summary: "Заказ",
    amount: "Сумма",
    address: "Адрес перевода",
    memo: "Memo",
    network: "Сеть",
    window: "Окно",
    expiresIn: "Истекает через",
    awaiting: "Ожидание платежа",
    confirming: "Подтверждение",
    paid: "Оплачено",
    expired: "Окно истекло",
    failed: "Платёж не прошёл",
    confirmations: "Подтверждений",
    txHash: "Транзакция",
    memoWarning:
      "Обязательно укажите memo. Перевод без него не свяжется с этим счётом, и его придётся искать руками.",
    payFromWallet: "Оплатить с привязанного кошелька",
    simulate: "Смоделировать входящий перевод",
    simulateHint: "Только для прототипа — заменяет отслеживание адреса.",
    close: "Закрыть",
    done: "Готово",
    newWindow: "Новое окно",
    qrCaption: "Условный узор — в прототипе не сканируется",
    appliedTo: "Начислено на аккаунт",
  },

  common: {
    copy: "Копировать",
    copied: "Скопировано",
    close: "Закрыть",
    cancel: "Отмена",
    save: "Сохранить",
    loading: "Загрузка",
    of: "из",
    prototype: "Прототип",
    prototypeBody:
      "Бэкенда нет. Все значения — локальная фикстура, сессия живёт только в этом браузере.",
    buy: "Купить",
    price: "Цена",
    perMonth: "/ мес",
    perYear: "/ год",
    once: "разово",
    select: "Выбрать",
    more: "Ещё",
    none: "Нет",
    yes: "Да",
    no: "Нет",
    region: "Регион",
    all: "Все",
  },
};

export const LOCALES = { en, ru } as const;
export type IdLocale = keyof typeof LOCALES;

/** Deep-merges an override tree onto a bundled language. */
export function resolveStrings(
  locale: IdLocale,
  override?: StringsOverride,
): Strings {
  const base = LOCALES[locale] ?? en;
  return override ? (merge(base as Strings, override) as Strings) : (base as Strings);
}

function merge<T>(base: T, patch: DeepPartial<T>): T {
  if (typeof base === "string" || base === null) {
    return (patch as T) ?? base;
  }
  const out = { ...(base as object) } as Record<string, unknown>;
  for (const [key, value] of Object.entries(patch as object)) {
    if (value === undefined) continue;
    const current = out[key];
    out[key] =
      typeof current === "object" && current !== null && typeof value === "object"
        ? merge(current, value as DeepPartial<typeof current>)
        : value;
  }
  return out as T;
}
