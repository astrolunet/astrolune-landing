/**
 * English dictionary — the canonical one. `lib/i18n/ru.ts` mirrors this shape
 * and is type-checked against it, so a missing translation is a build error
 * rather than a blank string in production.
 */
export const en = {
  meta: {
    title: "Astrolune — consensus earned, not purchased",
    description:
      "Astrolune is a network built on Proof of Trusted Behavior: a node's weight comes from time spent behaving honestly and its position in the trust graph — not from hashrate or stake.",
  },

  common: {
    skipToContent: "Skip to content",
    readDocs: "Read the docs",
    runNode: "Run a node",
    becomeValidator: "Become a validator",
    viewOnGithub: "View on GitHub",
    github: "GitHub",
    telegram: "Telegram",
    openScan: "Open SCAN",
    viewAll: "View all",
    back: "Back",
    copy: "Copy",
    copied: "Copied",
    search: "Search",
    searchPlaceholder: "Search",
    loading: "Loading",
    empty: "Nothing here yet",
    more: "More",
    less: "Less",
    live: "Live",
    devnet: "Devnet",
    testnet: "Testnet",
    mainnet: "Mainnet",
    planned: "Planned",
    inProgress: "In progress",
    shipped: "Shipped",
    deferred: "Deferred",
    notStarted: "Not started",
    status: "Status",
    updated: "Updated",
    readMore: "Read more",
    onThisPage: "On this page",
    previous: "Previous",
    next: "Next",
    minRead: "min read",
    page: "Page",
    of: "of",
    noResults: "No results",
    justNow: "just now",
    editOnGithub: "Edit on GitHub",
    expand: "Expand",
    collapse: "Collapse",
    filter: "Filter",
    reset: "Reset",
    total: "Total",
    comingSoon: "Coming soon",
    learnMore: "Learn more",
    overview: "Overview",
    details: "Details",
    raw: "Raw",
    decoded: "Decoded",
    notAvailable: "n/a",
    mockNotice:
      "Illustrative figures served from a local fixture. Swap `lib/api` for a live endpoint and every number on this page becomes real.",
    preLaunchNotice:
      "Astrolune has not launched. Every figure below is a fixture for interface work, not network telemetry.",
    insecureCrypto:
      "The signature layer currently compiled into the core is a deliberate stub. Signatures are trivially forgeable. Do not put value on any Astrolune network yet.",
  },

  nav: {
    menu: "Menu",
    close: "Close",
    language: "Language",
    account: "Account",
    groups: {
      network: {
        label: "Network",
        title: "Proof of Trusted Behavior",
        blurb:
          "Weight comes from uptime, observed behaviour and the trust graph. Never from a resource money can buy.",
        cta: "How consensus works",
        items: {
          potb: {
            label: "PoTB consensus",
            desc: "TBS, TGW, NDM and COD in one formula",
          },
          architecture: {
            label: "Architecture",
            desc: "The C hot path and the C++ tooling split",
          },
          validators: {
            label: "Validator set",
            desc: "Committee members, levels and weights",
          },
          status: {
            label: "Network status",
            desc: "Block time, throughput and service health",
          },
          roadmap: {
            label: "Roadmap",
            desc: "Five steps, and the real state of each",
          },
        },
      },
      scan: {
        label: "SCAN",
        title: "Astrolune SCAN",
        blurb:
          "Blocks, transactions, accounts and contracts — read straight off the chain.",
        cta: "Open the explorer",
        items: {
          overview: { label: "Explorer", desc: "Search any block, hash or address" },
          blocks: { label: "Blocks", desc: "Height, committee, quorum, state root" },
          txs: { label: "Transactions", desc: "Transfers, deploys, calls, PoTB types" },
          accounts: { label: "Accounts", desc: "Balances, nonces and code" },
          contracts: { label: "Contracts", desc: "Deployed code and system registry" },
          names: { label: ".lune names", desc: "Resolve a name to an address" },
        },
      },
      build: {
        label: "Build",
        title: "Trocto and Regol",
        blurb:
          "A safe-by-default high-level language that compiles into the low-level tier you can also write by hand.",
        cta: "Language reference",
        items: {
          docs: { label: "Documentation", desc: "The full technical specification" },
          languages: { label: "Contract languages", desc: "Trocto (.tc) → Regol (.rg)" },
          vm: { label: "Virtual machine", desc: "ISA, gas model, determinism" },
          coreApi: { label: "Core API", desc: "The public C ABI, header by header" },
          buildTest: { label: "Build & test", desc: "Presets, sanitizers, suites" },
          github: { label: "Source code", desc: "The C core and the C++ tooling" },
        },
      },
      use: {
        label: "Use",
        title: "Lune",
        blurb:
          "The network coin. Nine decimals, unsigned 64-bit amounts, no floating point anywhere near it.",
        cta: "About Lune",
        items: {
          id: {
            label: "Astrolune ID",
            desc: "One account: wallets, names, share, proxy",
          },
          wallets: { label: "Wallets", desc: "Keys, addresses and signing" },
          lune: { label: "Lune coin", desc: "Supply, denominations, rewards" },
          dns: { label: ".lune DNS", desc: "Names owned on-chain" },
          contracts: { label: "Contracts", desc: "System and verified contracts" },
          bond: { label: "Operational bond", desc: "Infrastructure proof, not stake" },
        },
      },
      discover: {
        label: "Discover",
        title: "Explore Astrolune",
        blurb: "Explore the Astrolune ecosystem — from core technology to community updates.",
        cta: "Start Exploring",
        items: {
          about: { 
            label: "About", 
            desc: "The vision, mission and story behind Astrolune" 
          },
          news: { 
            label: "News", 
            desc: "Latest updates and announcements" 
          },
          blog: { 
            label: "Blog", 
            desc: "Deep dives, guides and insights" 
          },
          docs: { 
            label: "Docs", 
            desc: "Technical documentation and APIs" 
          },
          careers: { 
            label: "Careers", 
            desc: "Join the team — we're hiring" 
          },
        },
      },
    },
    cta: {
      label: "Run a node",
      title: "Join the network",
      items: {
        node: { label: "Run a node", desc: "Build the client and start relaying" },
        validator: { label: "Become a validator", desc: "Earn TBS, join a committee" },
        github: { label: "GitHub", desc: "Read and build the source" },
      },
    },
  },

  home: {
    hero: {
      eyebrow: "PoTB consensus · own VM · Trocto & Regol · Lune",
      title1: "A whole network,",
      title2: "earned not purchased",
      body: "Astrolune is a network with its own consensus, virtual machine, two-tier contract language system and coin. A node's standing comes from uptime and observable behaviour — there is no hashrate to buy and no stake to outbid.",
      promoLabel: "Introducing Lune",
      promoBody: "Nine decimals, no floating point, no hidden stake.",
      stage:
        "Pre-mainnet — the consensus core is written and tested; the networking layer has not been started.",
      scroll: "Scroll",
      cards: {
        tbs: { status: "Time-behavior score", value: "ln(1 + d × c)" },
        committee: { status: "Committee", value: "100 · 10% / block" },
        quorum: { status: "Quorum", value: "⌊2n/3⌋ + 1" },
      },
    },
    ticker: {
      a: "PROOF OF TRUSTED BEHAVIOR",
      b: "COMMITTEE OF 100",
      c: "10% ROTATION PER BLOCK",
      d: "400 MS – 1 S BLOCKS",
      e: "TROCTO → REGOL → BYTECODE",
      f: "DETERMINISTIC EXECUTION",
      g: "NO FLOATING POINT",
      h: "TRUST GRAPH RECOMPUTED EACH EPOCH",
    },
    network: {
      label: "Network",
      title1: "Measured in milliseconds,",
      title2: "earned in days",
      badge: "Core arithmetic complete",
      stats: {
        blockTime: "BLOCK TIME",
        committee: "COMMITTEE SIZE",
        epoch: "EPOCH LENGTH",
        quorum: "QUORUM",
      },
      subs: {
        blockTime: "…up to 1 s with a real VDF",
        committee: "10% rotated every block",
        epoch: "Trust graph recomputed",
        quorum: "⌊2n/3⌋ + 1 signatures",
      },
      units: { ms: "ms", day: "day", ofCommittee: "/ 100" },
      note: "Block time is an honest range, not a promise: the light-randomness branch lands near 400 ms, a proper VDF nearer a second. Which one ships is decided by measurement.",
    },
    features: {
      label: "The network",
      title1: "One system,",
      title2: "built in layers",
      body: "Astrolune is not a single idea but a stack: a consensus that cannot be bought, a deterministic virtual machine, a two-tier language system, and a coin with no floating point anywhere near it. Each layer is documented — including where the specification admits a hole.",
      cta: "Read the consensus model",
      items: {
        consensus: {
          tag: "CONSENSUS",
          title: "Proof of Trusted Behavior",
          body: "Node weight is the product of four factors — time, trust graph, network diversity and cluster dampening — none of which is a resource money can buy. The full model, with its honest limitations, has its own page.",
        },
        vm: {
          tag: "EXECUTION",
          title: "Deterministic virtual machine",
          body: "Integer-only, no floating point, no clock, no platform-dependent behaviour. The same block executes to the same state root on every node, or it is not a valid block.",
        },
        languages: {
          tag: "LANGUAGES",
          title: "Trocto and Regol",
          body: "A safe-by-default high-level language that compiles into a low-level tier you can also write by hand. Two tiers of one system — the same relationship Solidity has with Yul.",
        },
        coin: {
          tag: "COIN",
          title: "Lune",
          body: "Unsigned 64-bit amounts with nine decimals. Balances need no wide arithmetic, and two honest nodes can never disagree in the last bit.",
        },
      },
    },
    stack: {
      label: "Execution",
      title1: "Two language tiers,",
      title2: "one bytecode",
      body: "Trocto closes the common contract vulnerability classes at the compiler level and compiles into Regol. Regol is both the low-level tier and the intermediate representation, so nothing is hidden from an author who needs control.",
      steps: {
        tc: { name: "Trocto", ext: ".tc", desc: "Safe by default, Rust-like" },
        rg: { name: "Regol", ext: ".rg", desc: "Full control, also the IR" },
        bc: { name: "Bytecode", ext: "", desc: "Deterministic on every node" },
      },
      sample: "A fungible token in Trocto",
    },
    coin: {
      label: "Coin",
      title1: "Lune pays for",
      title2: "block space",
      body: "Amounts are unsigned 64-bit integers with nine decimals — balances need no wide arithmetic and no floating point exists anywhere in execution or accounting.",
      facts: {
        ticker: "TICKER",
        decimals: "DECIMALS",
        unit: "BASE UNIT",
        type: "AMOUNT TYPE",
      },
      rewardTitle: "Block reward split",
      rewardNote:
        "The operational bond buys a share of one bucket and nothing else. It carries no consensus weight — that is the line that keeps PoTB from quietly becoming Proof of Stake.",
      rewards: {
        flat: "Split equally across the committee",
        weighted: "Proportional to TBS / TGW weight",
        bonded: "Proportional to the operational bond",
      },
      cta: "Lune in detail",
    },
    levels: {
      label: "Participation",
      title1: "Three levels,",
      title2: "one ladder",
      body: "Every level is reached by running the client and behaving well. None of them is reached by paying.",
      items: {
        relay: {
          name: "Full / relay node",
          entry: "Immediately",
          desc: "Store the chain, validate locally, relay to peers.",
        },
        candidate: {
          name: "Committee candidate",
          entry: "Weeks of operation",
          desc: "Drawn by VRF into a trial committee at low weight once TBS clears the floor.",
        },
        validator: {
          name: "Full validator",
          entry: "TBS + TGW thresholds",
          desc: "Full weight in the formula and a vote in finalisation, with no penalty in history.",
        },
      },
      calcTitle: "Weight calculator",
      calcNote:
        "The real formula, driven live. Every scoring function in the core is pure and clock-free, which is exactly why it can be driven from a slider.",
      calcUptime: "Uptime",
      calcDays: "days",
      calcCorrect: "Correctness rate",
      calcTgw: "Trust graph weight",
      calcNdm: "Network diversity",
      calcCod: "Cluster dampening",
      calcTbs: "TBS",
      calcLoyalty: "Loyalty bonus",
      calcLevel: "Level reached",
      calcWeight: "Consensus weight",
      calcCap: "cap",
      calcCapped: "Capped",
    },
    roadmap: {
      label: "Roadmap",
      title1: "Five steps,",
      title2: "honestly stated",
      body: "The plan of record, with each step's real state rather than its intended one.",
      items: {
        s1: {
          phase: "STEP 01",
          period: "In progress",
          title: "PoTB consensus core in C",
          body: "The complete weight formula, committee selection with partial rotation, commit-reveal seeds, slashing relative to the network median, rewards. Pure functions, no clock read, ~29,800 assertions over the arithmetic.",
        },
        s2: {
          phase: "STEP 02",
          period: "Blocked",
          title: "VM, state and transaction layers",
          body: "Present and plausible rather than verified: 16 opcodes, gas metering, accounts, state root, encode/decode/apply. The word size is still open, and an interpreter written before it is settled gets rewritten.",
        },
        s3: {
          phase: "STEP 03",
          period: "Blocked",
          title: "C++23 tooling — the Trocto compiler",
          body: "The C/C++ boundary check landed first: eleven public headers compiled as C++23, 172 symbols pinned, the layout contract asserted in both languages.",
        },
        s4: {
          phase: "STEP 04",
          period: "Partly done",
          title: "Build system, tests and CI",
          body: "CMake with six presets, layering enforced as link edges, ten suites. CI does not exist yet, and coverage for the VM and state layers is thin — the tree says so out loud.",
        },
        s5: {
          phase: "STEP 05",
          period: "Partly done",
          title: "Documentation and the language spec",
          body: "Everything that exists is documented, including seven code-versus-spec divergences. The Trocto specification is the remaining piece.",
        },
      },
    },
    faq: {
      label: "FAQ",
      title1: "Questions,",
      title2: "answered plainly",
      body: "Written to match the specification, including where the specification admits a hole.",
      items: {
        q1: {
          q: "How is PoTB different from Proof of Stake?",
          a: "Weight is not purchasable. Stake buys consensus weight in PoS; in PoTB the only inputs are uptime, correctness, the trust graph, ASN diversity and a correlation penalty. A voluntary operational bond exists, and it deliberately affects one reward bucket while carrying no weight at all.",
        },
        q2: {
          q: "Is Astrolune EVM compatible?",
          a: "No, by design. The network has its own virtual machine and its own two-tier language system. EVM compatibility would import both the 256-bit word and the EVM gas schedule, and neither fits a core built on 64-bit amounts and integer-only arithmetic.",
        },
        q3: {
          q: "Can I stake Lune for rewards?",
          a: "Not in the sense that phrase usually means. There is no delegation market and no APY on capital. Rewards go to committee members: 60% split equally, 25% by earned weight, 15% by operational bond. The bond is evidence of infrastructure spend, not a claim on consensus.",
        },
        q4: {
          q: "What is genuinely unsolved?",
          a: "Four things, recorded as open in the specification: non-domination is not mathematically proven; the trust graph and the correlation dampener are heuristics; time as a barrier can be bought in advance by starting a farm early and waiting; and network diversity is evadable with a proxy budget.",
        },
        q5: {
          q: "Is the network live?",
          a: "No. The consensus arithmetic is implemented and tested, the VM and state layers exist and are thinly tested, and the networking layer has not been started. The signature backend compiled in today is an insecure stub and reports itself as one.",
        },
        q6: {
          q: "Where does the specification live?",
          a: "In this docs section, generated from the same source the core is built against. Where a header and a document disagree, the header is correct — and every known disagreement is listed rather than quietly fixed.",
        },
      },
    },
    cta: {
      eyebrow: "RUN A NODE",
      title1: "Weight is earned.",
      title2: "Start earning it.",
      body: "Build the client, start relaying, and let the trust graph do the rest. No capital required at any level.",
      rpcLabel: "RPC",
    },
    explore: {
      label: "Surface",
      title1: "What the network",
      title2: "gives you",
      body: "Every entry below is a working page, served from a local fixture until an RPC endpoint exists to serve it for real.",
      items: {
        scan: {
          name: "SCAN",
          desc: "Blocks, transactions, accounts, contracts and names — searchable.",
        },
        validators: {
          name: "Validator set",
          desc: "Every node ranked by final weight, with the components behind it.",
        },
        status: {
          name: "Network status",
          desc: "Block time, throughput, committee spread and per-module state.",
        },
        wallets: {
          name: "Wallets",
          desc: "How keys, addresses and signatures work — and what exists to hold them.",
        },
        dns: {
          name: ".lune names",
          desc: "Human-readable names with ownership recorded on-chain.",
        },
        contracts: {
          name: "Contracts",
          desc: "System contracts, the deploy pipeline and what validation rejects.",
        },
      },
    },
  },

  consensus: {
    title: "Proof of Trusted Behavior",
    subtitle:
      "A consensus model without energy and without capital dominance. Weight comes from time spent behaving correctly and from a trust graph built out of facts — never from a resource that money can buy.",
    formulaLabel: "WEIGHT",
    formula: "min(TBS, 10) × min(TGW, 1) × NDM × COD",
    version: "v2 — revised after a critical review",
    idea: {
      label: "The idea",
      title1: "Four factors,",
      title2: "multiplied",
      body: "A node's weight is the product of four numbers. Because they multiply rather than add, collapsing any single factor collapses the whole weight — which is what makes each one a barrier rather than a bonus. Every factor below is computed by a pure function that never reads a clock.",
      note: "The protocol day is derived from block height. That is why every score here is reproducible by any node, and why the calculator further down this page runs the same arithmetic a validator does.",
    },
    compare: {
      label: "Comparison",
      title1: "What the other",
      title2: "models cost",
      body: "Proof of Work prices identity in hardware. Proof of Stake prices it in capital. Both are purchasable, which is the property PoTB is built to remove.",
      head: {
        model: "MODEL",
        basis: "ANTI-SYBIL BASIS",
        cost: "COST OF MORE INFLUENCE",
        energy: "ENERGY",
      },
      rows: {
        pow: {
          model: "Proof of Work",
          basis: "Hashrate",
          cost: "Buy more hardware",
          energy: "Enormous",
        },
        pos: {
          model: "Proof of Stake",
          basis: "Capital at stake",
          cost: "Outbid the stake",
          energy: "Negligible",
        },
        potb: {
          model: "Proof of Trusted Behavior",
          basis: "Time, behaviour, trust graph",
          cost: "Only time and honesty",
          energy: "Negligible",
        },
      },
      note: "The claim is narrow on purpose: PoTB removes the purchasable resource. It does not claim that domination is impossible, and the limitations further down say so in writing.",
    },
    barriers: {
      label: "Weight components",
      title1: "Four barriers,",
      title2: "one honest claim",
      body: "Each component raises the cost of an attack. None of them is presented as a proof — the model says so in writing.",
      items: {
        tbs: {
          tag: "TIME",
          title: "Time-Behavior Score",
          formula: "ln(1 + d × c) + loyalty(d)",
          body: "The logarithm of uptime × correctness, plus a loyalty term past one year. A freshly minted identity earns none of it, and the score is derived from a protocol day computed from block height — never from a local clock.",
          weakness: "Time can be bought in advance by starting a farm early and waiting.",
        },
        tgw: {
          tag: "TRUST",
          title: "Trust Graph Weight",
          formula: "SybilRank × dispersion",
          body: "SybilRank over attestations, discounted by temporal dispersion so a farm launched in one window is priced for it, and probed once per epoch by a challenge from a node you have no edge to.",
          weakness: "A heuristic, not a proof. A patient, well-spread graph still scores well.",
        },
        ndm: {
          tag: "DIVERSITY",
          title: "Network Diversity",
          formula: "f(ASN spread)",
          body: "A soft multiplier over autonomous-system spread, so a hundred nodes in one datacenter are priced as what they are.",
          weakness: "Documented as evadable with residential proxies — one layer, not the defence.",
        },
        cod: {
          tag: "CORRELATION",
          title: "Cluster Dampening",
          formula: "1 / (1 + correlation)",
          body: "Weak statistical signals of common ownership — similar uptime rhythms, nearby registration windows, partial ASN overlap — suppress the joint weight of the whole group rather than each node the cap happens to catch.",
          weakness: "Correlation-group detection is specified but not yet implemented in the core.",
        },
      },
      weaknessLabel: "Known weakness",
    },
    committee: {
      label: "Committees",
      title1: "A hundred seats,",
      title2: "turning over constantly",
      body: "Finality comes from a committee, not from whoever produced the block. It is redrawn continuously so that capturing it would mean capturing the weight distribution itself.",
      items: {
        selection: {
          k: "Selection",
          v: "Weighted sampling without replacement, driven by a hash chain from the epoch seed — so every node performs the identical draw and no coordination is needed.",
        },
        rotation: {
          k: "Rotation",
          v: "About a tenth of the seats are replaced every block, so the whole committee turns over in roughly ten blocks without ever paying for a full reshuffle.",
        },
        quorum: {
          k: "Quorum",
          v: "⌊2n/3⌋ + 1 signatures finalise a block — the standard Byzantine fault tolerance threshold, computed from the seats actually filled.",
        },
        seed: {
          k: "Epoch seed",
          v: "Commit, then reveal, then order-independent mixing — so a participant who reveals last cannot bias the draw by choosing whether to reveal at all.",
        },
      },
      rotationTitle: "Partial rotation, per block",
      rotationNote:
        "Rotation exists to bound network load as much as to resist capture: replacing the entire committee every block would multiply the vote traffic for no additional safety.",
      seatLabel: "seats",
      rotatingLabel: "rotating",
      holdingLabel: "holding",
    },
    rewards: {
      label: "Rewards",
      title1: "Three buckets,",
      title2: "one hard ceiling",
      body: "A block reward splits three ways. Only the third involves money, and it deliberately buys a share of that bucket and nothing else.",
      note: "Plus a ceiling: no member takes more than three times a newcomer's base share. The remainder of the flat bucket's integer division is burned — at most one base unit per member per block, identical on every node.",
      bondTitle: "Why the bond is not stake",
      bondBody:
        "The operational bond is public evidence that an operator's infrastructure spend is serious. It affects the 15% bucket and does not enter the weight formula at any point. That single boundary is what keeps PoTB from quietly becoming Proof of Stake under another name.",
    },
    slashing: {
      label: "Penalties",
      title1: "Judged against",
      title2: "the network, not a rule",
      body: "A missed vote during a regional outage is noise, not misbehaviour. Penalties are measured against the network median for the same period, so a shared incident does not single out the innocent. Double-signing is the exception — it cannot happen by accident.",
    },
    limits: {
      label: "Limitations",
      title1: "What is fixed,",
      title2: "and what is not",
      body: "This section is load-bearing. Anything below that reads as an admission of weakness is information, not an unfinished draft — the specification records open problems as open rather than describing them away.",
      fixedTitle: "Fixed in this version",
      openTitle: "Open risks, stated without embellishment",
      fixed: {
        a: "The logarithm no longer strangles long-term operators — a loyalty term past one year restores the incentive to keep running.",
        b: "Trust graph edges are discounted by temporal dispersion, and probed by an external challenge once per epoch.",
        c: "Cluster ownership dampening prices hidden common ownership across a group rather than per node.",
        d: "Partial rotation replaced full rotation, and the block-time claim became an honest range instead of a single number.",
      },
      open: {
        a: "“Nobody dominates” is not mathematically proven. It is a design intent supported by argument, not a theorem.",
        b: "The trust graph and the correlation dampener are heuristics. A sufficiently patient and well-distributed adversary is not excluded by either.",
        c: "Time as a barrier can be bought in advance: start a farm early, behave correctly, and wait.",
        d: "Network diversity is evadable with a budget for residential proxies, which is exactly the resource the model tries not to price.",
      },
      docsCta: "The full model, with formulas",
    },
  },

  scan: {
    title: "SCAN",
    subtitle: "Astrolune block explorer",
    searchPlaceholder: "Block height, transaction hash, address or .lune name",
    searchHint: "Try a height, a 64-character hash, an al1… address or name.lune",
    notFound: "Nothing matched that query.",
    latestBlocks: "Latest blocks",
    latestTxs: "Latest transactions",
    namesTitle: ".lune names",
    contractsTitle: "Contracts",
    accountsTitle: "Accounts",
    resultsFor: "Results for",
    tabs: {
      blocks: "Blocks",
      txs: "Transactions",
      accounts: "Accounts",
      contracts: "Contracts",
    },
    stats: {
      height: "LATEST BLOCK",
      tps: "TX / SECOND",
      blockTime: "AVG BLOCK TIME",
      validators: "COMMITTEE",
      accounts: "ACCOUNTS",
      supply: "CIRCULATING",
    },
    charts: {
      activity: "Activity",
      window: "Last 60 blocks",
      txPerBlock: "Transactions per block",
      txPerBlockNote:
        "Read straight off each block in the window — the bar for a height is the same count its row prints.",
      gasPerBlock: "Gas used per block",
      gasPerBlockNote:
        "Against a fixed 30M block limit, so the curve is also the utilisation curve.",
      typeMix: "Transaction mix",
      typeMixNote:
        "Share of each type across the indexed window. Consensus maintenance — votes, attestations, seeds — is most of the traffic a working chain carries.",
      utilisation: "Utilisation",
      perBlock: "per block",
      empty: "No transactions in this window.",
    },
    block: {
      title: "Block",
      height: "Height",
      hash: "Block hash",
      parent: "Parent hash",
      stateRoot: "State root",
      txRoot: "Transaction root",
      proposer: "Proposer",
      committee: "Committee",
      quorum: "Quorum",
      votes: "Votes",
      timestamp: "Timestamp",
      protocolDay: "Protocol day",
      epoch: "Epoch",
      seed: "Epoch seed",
      size: "Size",
      gasUsed: "Gas used",
      txCount: "Transactions",
      finality: "Finality",
      finalized: "Finalised",
      prevBlock: "Previous block",
      nextBlock: "Next block",
      noTxs: "This block carries no transactions.",
    },
    tx: {
      title: "Transaction",
      hash: "Transaction hash",
      signingHash: "Signing hash",
      type: "Type",
      status: "Status",
      block: "Block",
      from: "From",
      to: "To",
      amount: "Amount",
      fee: "Fee",
      gasLimit: "Gas limit",
      gasUsed: "Gas used",
      nonce: "Nonce",
      chainId: "Chain ID",
      payload: "Payload",
      signature: "Signature",
      publicKey: "Public key",
      success: "Success",
      failed: "Failed",
      pending: "Pending",
      reverted: "Reverted",
      types: {
        transfer: "Transfer",
        deploy: "Deploy",
        call: "Contract call",
        register: "Node registration",
        attest: "Trust attestation",
        challenge: "External challenge",
        evidence: "Offence evidence",
        bond: "Operational bond",
        commit: "Epoch seed commit",
        reveal: "Epoch seed reveal",
        vote: "Committee vote",
        name: "Name registration",
      },
      tagNote:
        "The transaction identifier and the signed message are hashed under different domain tags on purpose, so a signature over one can never be mistaken for a signature over the other.",
    },
    account: {
      title: "Account",
      address: "Address",
      type: "Type",
      external: "External",
      contract: "Contract",
      balance: "Balance",
      nonce: "Nonce",
      codeHash: "Code hash",
      storageRoot: "Storage root",
      firstSeen: "First seen",
      txCount: "Transactions",
      node: "PoTB record",
      names: "Names owned",
      history: "Transaction history",
      noHistory: "No transactions for this account.",
    },
    validator: {
      title: "Validator",
      nodeId: "Node ID",
      level: "Level",
      weight: "Weight",
      tbs: "TBS",
      tgw: "TGW",
      ndm: "NDM",
      cod: "COD",
      uptime: "Uptime",
      correctness: "Correctness",
      asn: "ASN",
      region: "Region",
      committeeSince: "In committee since",
      blocksProposed: "Blocks proposed",
      votes: "Votes cast",
      missed: "Missed votes",
      slashes: "Slashing history",
      noSlashes: "No penalties on record.",
      bond: "Operational bond",
    },
    table: {
      height: "Height",
      hash: "Hash",
      age: "Age",
      txs: "Txs",
      proposer: "Proposer",
      gas: "Gas",
      type: "Type",
      from: "From",
      to: "To",
      amount: "Amount",
      fee: "Fee",
      status: "Status",
      address: "Address",
      balance: "Balance",
      nonce: "Nonce",
      name: "Name",
      owner: "Owner",
      expires: "Expires",
      rank: "#",
      node: "Node",
      level: "Level",
      weight: "Weight",
      uptime: "Uptime",
    },
    ago: {
      s: "s ago",
      m: "m ago",
      h: "h ago",
      d: "d ago",
    },
  },

  status: {
    title: "Network status",
    subtitle: "Block production, throughput and service health",
    allNominal: "All systems nominal",
    degraded: "Degraded performance",
    outage: "Partial outage",
    uptime90: "90-day uptime",
    charts: {
      blockTime: "Block time",
      blockTimeNote: "Rolling mean per 10-minute bucket, last 24 hours",
      tps: "Throughput",
      tpsNote: "Transactions per second, last 24 hours",
      committee: "Committee weight distribution",
      committeeNote: "Top members by final weight",
      asn: "ASN diversity",
      asnNote: "Share of committee members per autonomous system",
      finality: "Time to finality",
      finalityNote: "Distribution across the last 5,000 blocks",
      participation: "Vote participation",
      participationNote: "Share of committee voting per epoch",
      ms: "ms",
      tx: "tx/s",
      share: "share",
      blocks: "blocks",
    },
    epoch: {
      title: "Current epoch",
      progress: "Progress",
      blocks: "Blocks this epoch",
      rotations: "Committee rotations",
      nextRecompute: "Trust graph recompute",
      seedStatus: "Epoch seed",
      committed: "Committed",
      revealed: "Revealed",
      mixed: "Mixed",
    },
    services: {
      title: "Services",
      note: "Module state mirrors the implementation status document rather than a monitoring probe.",
      consensus: "Consensus (PoTB)",
      vm: "Virtual machine",
      state: "State and accounts",
      tx: "Transactions",
      block: "Block header",
      crypto: "Cryptography",
      net: "Networking / P2P",
      rpc: "RPC endpoint",
      scan: "SCAN indexer",
      dns: ".lune resolver",
      storage: "Storage layer",
      proxy: "Proxy layer",
      complete: "Complete",
      thin: "Thinly tested",
      stub: "Insecure stub",
      absent: "Not started",
      operational: "Operational",
    },
    incidents: {
      title: "Recent events",
      none: "No events in the selected window.",
    },
    rangeLabel: "Window",
    ranges: { h24: "24H", d7: "7D", d30: "30D" },
  },

  news: {
    title: "News",
    subtitle: "Protocol releases, engineering notes and decisions on record",
    empty: "No posts yet.",
    featured: "Featured",
    all: "All posts",
    categories: {
      all: "All",
      release: "Release",
      engineering: "Engineering",
      consensus: "Consensus",
      research: "Research",
      ecosystem: "Ecosystem",
    },
    byline: "Astrolune Core",
    share: "Share",
    backToNews: "All news",
    nextPost: "Next post",
    prevPost: "Previous post",
  },

  blog: {
    title: "Blog",
    subtitle:
      "Longer reads from the core team — consensus arithmetic, fixed point, the trust graph and protocol design, written while it is being built.",
    empty: "No posts yet.",
    featured: "Featured",
    all: "All posts",
    categories: {
      all: "All",
      engineering: "Engineering",
      research: "Research",
      guides: "Guides",
      protocol: "Protocol",
    },
    byline: "Astrolune Core",
    share: "Share",
    backToBlog: "All posts",
    nextPost: "Next post",
    prevPost: "Previous post",
  },

  about: {
    title: "About",
    subtitle:
      "What Astrolune is, who builds it, and the rules the project holds itself to — stated where they can be checked.",
    badge: "Open source · pre-mainnet",
    missionLabel: "Mission",
    missionTitle1: "A network nobody",
    missionTitle2: "must trust blindly",
    missionBody:
      "The two dominant ways to secure a chain both sell influence — Proof of Work prices it in hardware, Proof of Stake in capital. Astrolune exists to remove that market entirely: weight comes from time spent behaving honestly and from a trust graph built out of recorded facts. Nothing on the input list is purchasable, which is the whole point.",
    missionNote:
      "That claim is kept narrow on purpose. What is proven is labelled proven; what is argued is labelled argued; what is open stays open in writing. A consensus that oversells itself is just marketing with a ledger.",
    statsTitle: "The project, in four numbers",
    stats: {
      source: {
        k: "OPEN SOURCE",
        v: "100%",
        sub: "Consensus core, tooling and this site — one public tree.",
      },
      assertions: {
        k: "TEST ASSERTIONS",
        v: "~29,800",
        sub: "Over the consensus arithmetic alone, all clock-free.",
      },
      documents: {
        k: "SPEC DOCUMENTS",
        v: "24",
        sub: "Every layer documented; gaps recorded as gaps.",
      },
      purchasable: {
        k: "PURCHASABLE WEIGHT",
        v: "0",
        sub: "No hashrate, no stake, no delegation market.",
      },
    },
    principles: {
      label: "Principles",
      title1: "Four rules,",
      title2: "held in public",
      body: "These are not values on a wall — each one changes what the repository accepts and rejects.",
      items: {
        honesty: {
          tag: "HONESTY",
          title: "On the record, even when it hurts",
          body: "Roadmap steps carry their real status rather than their intended one. Seven code-versus-spec divergences are listed instead of quietly patched. An admission of weakness is treated as information.",
        },
        openness: {
          tag: "OPENNESS",
          title: "Everything readable, nothing hidden",
          body: "The specification is generated from the same tree the core builds against. Decisions land in writing where they can be linked, quoted and disagreed with.",
        },
        craft: {
          tag: "CRAFT",
          title: "Mechanics over discipline",
          body: "Rules that depend on memory get broken. Layering is enforced as link edges, boundary rules as compile errors — the build rejects what a tired reviewer would miss.",
        },
        access: {
          tag: "ACCESS",
          title: "No capital gate",
          body: "Every level of participation is reached by running the client and behaving well. There is nothing to buy at any step, and the design treats that as a requirement rather than a discount.",
        },
      },
    },
    work: {
      label: "How we work",
      title1: "Small team,",
      title2: "long horizons",
      body: "Astrolune is built by a small distributed group of engineers who would rather ship less and document it than ship more and explain later. The pace follows from the constraint that every layer must stay reproducible — a speed-up that costs determinism is a regression here.",
      facts: {
        model: {
          k: "Development model",
          v: "Public code, public specification, decisions recorded in the open. The roadmap carries real statuses because pretending otherwise helps nobody.",
        },
        review: {
          k: "Review",
          v: "Every change is read by someone who did not write it — and the rules most often forgotten are enforced by the compiler, so some reviews cannot be slept through.",
        },
        testing: {
          k: "Testing",
          v: "Pure functions exercised by ~29,800 assertions over the consensus arithmetic. Where coverage is thin, the documentation says so out loud.",
        },
        docs: {
          k: "Documentation",
          v: "Generated against the same source the core builds with. Where a header and a document disagree, the header wins and the divergence is listed.",
        },
      },
    },
    people: {
      label: "People",
      title1: "Three habits",
      title2: "that define the work",
      body: "No headcount page with stock photos. The culture is easier to describe as habits the repository enforces:",
      items: {
        docsFirst: {
          name: "Docs land with code",
          desc: "A merge without its documentation update is not done. The spec travels with the tree, so it cannot rot quietly in a wiki.",
        },
        adversarial: {
          name: "Review like an adversary",
          desc: "Reviewers are expected to attack a change, not to be polite about it. The trust graph gets the same treatment from research.",
        },
        reproducible: {
          name: "Reproducible or it did not happen",
          desc: "Numbers come from height-derived protocol days, not wall clocks. If a result cannot be re-derived by a stranger, it does not go in the docs.",
        },
      },
    },
    ctaEyebrow: "GET INVOLVED",
    ctaTitle1: "Read the source.",
    ctaTitle2: "Then change it.",
    ctaBody:
      "The fastest way in is the issue tracker and the dev chat. Good first contributions are documentation fixes — they teach the tree faster than any tour.",
  },

  careers: {
    title: "Careers",
    subtitle:
      "Build a chain where influence cannot be bought — and where the documentation is not allowed to lie to you.",
    badge: "Remote · pre-mainnet",
    values: {
      label: "Why here",
      title1: "Hard problems,",
      title2: "honest constraints",
      body: "This is unglamorous systems work with an unusual property: the constraints are published. You will know exactly why a design is the way it is, including where its authors admit it is not settled.",
      items: {
        depth: {
          name: "Depth over breadth",
          desc: "One chain, taken seriously end to end — consensus, VM, languages, coin. No pivoting to whatever raised last quarter.",
        },
        honesty: {
          name: "Honesty is structural",
          desc: "Statuses, benchmarks and limitations are written down where anyone can check them. Nobody here has ever had to pretend a milestone shipped.",
        },
        ownership: {
          name: "End-to-end ownership",
          desc: "You take a layer — arithmetic, compiler, research — and carry it from design through tests to the documentation that keeps it honest.",
        },
        leverage: {
          name: "Small team, high leverage",
          desc: "Every commit lands in a tree other engineers actually read. Nothing is thrown away after launch because there is no launch theatre.",
        },
      },
    },
    roles: {
      label: "Open roles",
      title1: "Four seats,",
      title2: "all remote",
      body: "Hiring is slow and deliberate: pre-mainnet means the wrong hire costs a quarter, not a feature. All roles are full-time and remote-first across timezones.",
      teamLabel: "Team",
      typeLabel: "Type",
      locationLabel: "Location",
      type: "Full-time",
      location: "Remote",
      skillsLabel: "We are looking for",
      apply: "Apply",
      applySubject: "Application: {role}",
    },
    process: {
      label: "Process",
      title1: "Four conversations,",
      title2: "no puzzles",
      body: "No whiteboard riddles and no trick questions. Each stage exists because something needs to be learned that the previous stage could not show.",
      steps: {
        s1: {
          name: "Intro call",
          desc: "Thirty minutes about what you have built and what went wrong in it. We care more about the wreckage than the demo.",
        },
        s2: {
          name: "Technical deep-dive",
          desc: "A working session on real code from the tree — reading it, attacking it, extending a test for it. No abstract puzzles.",
        },
        s3: {
          name: "Paid trial",
          desc: "About a week on an actual backlog item, paid at contract rate. You see the tree from inside; we see how you work when nobody watches.",
        },
        s4: {
          name: "Offer",
          desc: "A written offer with scope, compensation and the first quarter of work. Onboarding starts with the specification, because everything else sits on it.",
        },
      },
    },
    none: {
      title: "Nothing that fits?",
      note: "The tree is the real front door: substantial open-source contributions are read first when a role opens. Fix a doc, break a test, argue with the spec.",
    },
    ctaEyebrow: "TALK TO US",
    ctaTitle1: "Write us",
    ctaTitle2: "a plain letter",
    ctaBody:
      "Skip the cover letter. Tell us the thing you understand better than most people, and link something you made.",
  },

  docs: {
    title: "Documentation",
    subtitle:
      "The technical specification of the network — consensus, architecture, virtual machine, state, languages and services.",
    searchPlaceholder: "Search the docs",
    noResults: "No page matched.",
    sections: {
      overview: "Overview",
      consensus: "Consensus",
      architecture: "Architecture",
      vm: "Virtual machine",
      state: "State & transactions",
      languages: "Languages",
      services: "Services",
      roadmap: "Roadmap",
      implementation: "Implementation",
      id: "Astrolune ID",
    },
    statusLegend: {
      title: "Status legend",
      stable: "Designed and agreed; changes rarely.",
      draft: "Working version; details still being settled.",
      skeleton:
        "A frame with the open questions fixed in writing. It records what existing code already constrains and what is genuinely undecided — it does not invent a specification to look finished.",
      current: "Describes the tree as it is now, and goes stale when the code changes.",
    },
    conventions: {
      title: "Two conventions worth knowing first",
      headerWins: {
        title: "Where a header and a document disagree, the header is correct.",
        body: "It is what nodes actually run, so the document is the bug. Every known case is listed in the implementation status.",
      },
      openIsOpen: {
        title: "Open problems are recorded as open.",
        body: "Anything that reads as an admission of weakness is load-bearing information, not an unfinished draft.",
      },
    },
    fallbackNotice:
      "This page is the English original. It is a deep technical specification where a translation would risk changing what the protocol claims.",
    sourceLabel: "Source",
    startHere: "Where to start",
    startItems: {
      project: { q: "understand the project", a: "Overview — vision" },
      consensus: { q: "understand the consensus model", a: "PoTB" },
      built: { q: "know what is actually implemented", a: "Implementation status" },
      run: { q: "build and run it", a: "Build and test" },
      code: { q: "write code against the core", a: "Core API" },
      next: { q: "know what to work on next", a: "Roadmap" },
    },
    warning:
      "Before running anything: the signature layer is an insecure stub and signatures are trivially forgeable.",
  },

  wallets: {
    title: "Wallets",
    subtitle:
      "How keys, addresses and signatures work on Astrolune — and what exists to hold them today.",
    addressTitle: "Address format",
    addressBody:
      "An address is 32 bytes derived from a public key under a dedicated domain tag, so an address digest can never collide with any other structural hash in the protocol.",
    fields: {
      length: "LENGTH",
      derivation: "DERIVATION",
      encoding: "ENCODING",
      checksum: "CHECKSUM",
    },
    tryTitle: "Address inspector",
    tryNote:
      "Decodes locally in your browser. Nothing is sent anywhere — there is no endpoint to send it to yet.",
    tryPlaceholder: "al1… address",
    tryValid: "Well-formed address",
    tryInvalid: "Not a well-formed Astrolune address",
    listTitle: "Wallet software",
    listNote:
      "Nothing on this list is production software. The signature backend it would sign with is a stub.",
    items: {
      cli: {
        name: "alc — reference CLI",
        desc: "Key generation, address derivation, transaction construction and signing from the terminal.",
        status: "notStarted",
      },
      keystore: {
        name: "Encrypted keystore",
        desc: "A file format for keys at rest, derived with HKDF over the existing hash layer.",
        status: "planned",
      },
      extension: {
        name: "Browser extension",
        desc: "Account management and transaction approval for dApps, once an RPC surface exists to talk to.",
        status: "planned",
      },
      mobile: {
        name: "Mobile wallet",
        desc: "Balances, transfers and name resolution on a phone.",
        status: "planned",
      },
      hardware: {
        name: "Hardware signing",
        desc: "Blocked on the real signature scheme — a device cannot implement a stub.",
        status: "deferred",
      },
    },
    securityTitle: "Before you generate a key",
    securityBody:
      "The core compiles a deterministic development backend for signatures, VRF and VDF. The verified half of a signature is a hash of the public key and the message, so anyone can produce one for any key. `al_crypto_is_secure()` returns false, and that is the correct value.",
  },

  dns: {
    title: ".lune DNS",
    subtitle:
      "Human-readable names resolving to Astrolune addresses, with ownership recorded on-chain rather than in a registrar's database.",
    statusBadge: "Deferred by decision",
    statusBody:
      "Nothing is implemented, and nothing should be until the virtual machine, state and transaction layers exist. A naming service is a contract plus a resolver, and neither can be written without them.",
    lookupTitle: "Name lookup",
    lookupPlaceholder: "name.lune",
    lookupNote: "Resolving against a local fixture set.",
    lookupTaken: "Registered",
    lookupFree: "Available",
    lookupInvalid: "Not a valid .lune name",
    recordsTitle: "Records",
    recordTypes: {
      address: "Address the name resolves to",
      content: "Content hash",
      text: "Free-form text records",
      dns: "A / AAAA / TXT for conventional DNS interoperability",
    },
    openTitle: "Open questions",
    openNote:
      "The interesting questions here have been answered badly several times in public. These are recorded rather than guessed at.",
    open: {
      allocation: {
        q: "Name allocation",
        a: "First-come-first-served invites squatting; auctions price it but exclude; rent prevents permanent squatting on dead names but adds an expiry that must be timed off block height, never wall-clock time.",
      },
      reserved: {
        q: "Reserved names",
        a: "Whether trademarks, or names matching real DNS TLDs, are blocked. Every project that did not decide this early regretted it.",
      },
      resolution: {
        q: "Resolution outside the chain",
        a: "The genuinely hard part. A browser extension, a local DNS proxy, a DoH endpoint, or a gateway domain — the last of which reintroduces a central point and defeats the purpose. No decentralised naming system has solved this well.",
      },
      subdomains: {
        q: "Subdomains and delegation",
        a: "Whether a name owner can issue subdomains, and whether those live on-chain or are delegated off it.",
      },
      privacy: {
        q: "Surveillance surface",
        a: "Resolution reveals what a user is looking up. DNS-over-HTTPS exists because plaintext DNS was a surveillance surface; a naming service is one too.",
      },
    },
    dependsTitle: "What must exist first",
    dependsBody:
      "The VM, the state layer, the transaction layer, a working Trocto compiler, and a settled answer to whether a name is an account entry or an owned object. A name is the textbook example of a thing you want to be non-duplicable.",
  },

  contracts: {
    title: "Contracts",
    subtitle:
      "System contracts, the deployment pipeline, and what the registry will hold once the VM is unblocked.",
    systemTitle: "System contracts",
    systemNote:
      "Fixture addresses for interface work. The genesis format that would fix them does not exist yet.",
    verifiedTitle: "Verified contracts",
    verifiedNote: "Source-verified deployments, newest first.",
    pipelineTitle: "Deployment pipeline",
    pipelineBody:
      "A contract is written in Trocto, compiled to Regol, assembled to bytecode, validated at deploy time, then addressed by a tagged hash of its deployer and nonce.",
    steps: {
      write: { name: "Write", desc: "Trocto (.tc) or Regol (.rg) by hand" },
      compile: { name: "Compile", desc: "altc lowers .tc into .rg" },
      assemble: { name: "Assemble", desc: "Regol becomes VM bytecode" },
      validate: {
        name: "Validate",
        desc: "Deploy-time jump-target and opcode validation — the single most important check in the ISA",
      },
      deploy: { name: "Deploy", desc: "A deploy transaction fixes the address" },
    },
    validationTitle: "What deploy-time validation rejects",
    validation: {
      opcode: "Any opcode outside the ISA",
      jump: "A jump whose target is not an instruction boundary",
      float: "Any floating-point operation — none exists in the ISA at all",
      clock: "Any read of a clock, a random source or anything platform-dependent",
      size: "Code above the container limit",
    },
    table: {
      name: "Name",
      address: "Address",
      language: "Language",
      deployed: "Deployed",
      verified: "Verified",
      calls: "Calls",
      size: "Size",
    },
    system: {
      registry: { name: "Node registry", desc: "Creates and holds every PoTB record" },
      attestation: { name: "Attestation", desc: "Trust graph edges and their arrival times" },
      challenge: { name: "External challenge", desc: "Epoch pairings and their results" },
      bond: { name: "Operational bond", desc: "Deposits and withdrawals for the 15% bucket" },
      evidence: { name: "Offence evidence", desc: "Double-signature proofs and slashing" },
      seed: { name: "Epoch seed", desc: "Commit, reveal and order-independent mixing" },
      names: { name: "Name registry", desc: "The .lune zone, once it exists" },
    },
  },

  id: {
    title: "Astrolune ID",
    subtitle:
      "One account for the whole network. Bind wallets, hold .lune names, buy share and proxy, watch your own nodes — and if you validate, see the weight behind it.",
    prototypeNotice:
      "Prototype. The console below runs entirely in your browser on fixture data: the session, the links and the purchases live in localStorage and never leave this device. There is no backend, and no signature is verified.",
    accountTitle: "What sits on one account",
    accountBody:
      "An ID is not a wallet. It is the record that binds the things you already own on the network to each other, so a name, a bucket and a node stop being three unrelated logins.",
    capabilities: {
      identity: {
        name: "Identity",
        desc: "A handle, a tier and a trust figure — the same trust the consensus reads.",
      },
      wallets: {
        name: "Wallets",
        desc: "Bind as many as you hold. A watch-only key counts towards the balance and never towards signing.",
      },
      domains: {
        name: ".lune names",
        desc: "Every name you own, with its records, its expiry and its renewal in one list.",
      },
      share: {
        name: "Share",
        desc: "Storage buckets: quota, replication, region, and what is actually pinned.",
      },
      proxy: {
        name: "Proxy",
        desc: "Egress endpoints with their own credentials, traffic quota and rotation policy.",
      },
      nodes: {
        name: "Nodes",
        desc: "Height, peers, uptime and version for every node you run.",
      },
      validator: {
        name: "Validator",
        desc: "TBS, TGW, NDM and COD, the bond behind them, and every penalty scored against you.",
      },
      payment: {
        name: "Payment",
        desc: "Share and proxy are bought in Lune, from a wallet already bound to the account.",
      },
    },
    signInTitle: "Sign in",
    signInBody:
      "Four methods, one account. The wallet signature is the one that will matter; the rest are conveniences layered over it.",
    sessionTitle: "How the prototype session behaves",
    session: {
      storage: { label: "Storage", value: "localStorage, this device only" },
      backend: { label: "Backend", value: "None — fixtures from a fixed seed" },
      signature: { label: "Signature", value: "Not verified; the challenge is decorative" },
      reset: { label: "Reset", value: "Sign out, or clear site data" },
    },
    consoleTitle: "The console",
    consoleBody:
      "Seven panels behind one gate. Everything below is the component the package exports — this page mounts it and adds nothing.",
    sdkTitle: "Drop it into your own app",
    sdkBody:
      "The package ships the store, the hooks and the whole UI kit. A sign-in button is one import and one prop; the console is one element.",
    sdkNote:
      "The package is a prerelease and its store is deliberately local. When the backend lands the hooks keep their signatures and only the transport underneath them changes.",
    installLabel: "Install",
    docsCta: "Read the ID docs",
    docLinks: {
      overview: {
        label: "Astrolune ID",
        desc: "What the account holds, and what it does not",
      },
      sdk: { label: "ID SDK", desc: "Provider, hooks, store, actions" },
      ui: { label: "UI kit", desc: "Every component, with live demos" },
    },
  },

  node: {
    title: "Run a node",
    subtitle:
      "Every level of participation starts the same way: build the client and start it. There is nothing to buy.",
    reqTitle: "Requirements",
    req: {
      cpu: { k: "CPU", v: "4 cores — the hot path is C and single-thread latency matters more than core count" },
      ram: { k: "Memory", v: "8 GB, with block execution allocating from an arena reclaimed per block" },
      disk: { k: "Disk", v: "NVMe SSD. The storage engine controls its own I/O and assumes low latency" },
      net: { k: "Network", v: "A stable connection with a static route. Uptime is the currency here" },
      os: { k: "OS", v: "Linux, macOS or Windows. MSVC is a supported toolchain, not an afterthought" },
      toolchain: { k: "Toolchain", v: "CMake 3.25+, Ninja, a C23 compiler and a C++23 compiler for the tooling" },
    },
    buildTitle: "Build it",
    buildNote:
      "Six configure presets ship with the tree. Layering is enforced as link edges, so a dependency violation is a link error rather than a review finding.",
    stepsTitle: "From relay to validator",
    steps: {
      s1: {
        name: "Start relaying",
        desc: "Run the client. You are a full node from the first block you validate, and your uptime clock starts on a protocol day derived from block height.",
      },
      s2: {
        name: "Earn TBS",
        desc: "Correctness over a trailing 30-day window, compounded with uptime. A single missed vote costs nothing while your miss rate stays within twice the network median.",
      },
      s3: {
        name: "Grow trust",
        desc: "Attestations arrive from other operators. Scattered arrival times read as organic; bunched ones are discounted. Once per epoch the protocol pairs you with a node you have no edge to.",
      },
      s4: {
        name: "Clear the floor",
        desc: "Past the minimum TBS you become a committee candidate and can be drawn by VRF at low weight.",
      },
      s5: {
        name: "Full validator",
        desc: "With TBS and TGW above their thresholds and no penalty in history, you carry full weight in the formula and vote in finalisation.",
      },
    },
    slashTitle: "Penalties",
    slashNote:
      "Judged relative to network noise in the same period, so a general incident does not single out the innocent. Double-signing is the exception — it cannot happen by accident.",
    slashTable: { offence: "Offence", penalty: "Penalty" },
    slash: {
      miss: { o: "A single missed vote", p: "None, while within 2× the network median" },
      systematic: { o: "Systematic misses above the median", p: "−5% TBS per episode" },
      wrong: { o: "Incorrect response, isolated", p: "−10% TBS" },
      wrongSys: { o: "Incorrect responses, systematic", p: "−20% TBS" },
      double: { o: "Double-signing", p: "−90% TBS + 14-day committee ban" },
      repeat: { o: "Repeat double-signing", p: "Permanent ban of the identity" },
    },
    rewardTitle: "What a committee member earns",
    bondTitle: "The operational bond",
    bondBody:
      "A node may stake funds as public evidence that its infrastructure spend is serious. The bond does not increase consensus weight — it affects only the 15% bucket. That is what keeps this from being Proof of Stake wearing a different name.",
  },

  validators: {
    title: "Validator set",
    subtitle: "Committee members ranked by final weight, with the components that produced it.",
    note: "A committee lives roughly ten blocks with about a tenth of its membership replaced each block, so the full set turns over continuously.",
    filterAll: "All levels",
    total: "Nodes",
    committee: "In committee",
    candidates: "Candidates",
    relays: "Relay nodes",
    avgUptime: "Median uptime",
    formula: "Weight formula",
    formulaNote:
      "Both caps are hard ceilings. The share-of-network limit the specification describes is enforced above this layer — and is one of the recorded gaps.",
  },

  lune: {
    title: "Lune",
    subtitle:
      "The network coin. Nine decimals, unsigned 64-bit amounts, and no floating point anywhere near consensus.",
    unitsTitle: "Denominations",
    unitsNote:
      "One Lune is 10⁹ base units. Amounts are integers end to end, so two nodes cannot disagree in the last bit.",
    units: { nano: "nano", micro: "micro", milli: "milli", lune: "Lune" },
    supplyTitle: "Supply",
    supplyNote:
      "Emission parameters belong in the genesis block rather than a config file, and there is no genesis block yet. These figures are illustrative.",
    supply: {
      total: "TOTAL SUPPLY",
      circulating: "CIRCULATING",
      bonded: "BONDED",
      burned: "FEES BURNED",
    },
    rewardTitle: "Where a block reward goes",
    rewardNote:
      "Plus a hard ceiling: no member takes more than three times a newcomer's base share. The remainder of the flat bucket's integer division is burned — at most one base unit per member per block, identical on every node.",
    feeTitle: "Fees",
    feeBody:
      "The relationship between transaction fees and the 60/25/15 reward split is undefined in the specification and is recorded as needing to be defined. This page will not pretend otherwise.",
    useTitle: "What Lune is for",
    uses: {
      gas: { k: "Gas", v: "Paying for computation and storage during contract execution" },
      transfer: { k: "Transfer", v: "Moving value between accounts" },
      bond: { k: "Bond", v: "Public evidence of infrastructure spend — no consensus weight" },
      names: { k: "Names", v: "Registering and renewing a .lune name, once the zone exists" },
    },
  },

  legal: {
    title: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    disclaimer: "Disclosures",
    cookies: "Cookies",
    lastUpdated: "Last updated",
  },

  footer: {
    blurb:
      "An open-source network on Proof of Trusted Behavior. Consensus core in C, tooling in C++, and every open problem recorded as open.",
    cols: {
      protocol: {
        heading: "PROTOCOL",
        items: {
          potb: "PoTB consensus",
          architecture: "Architecture",
          vm: "Virtual machine",
          state: "State model",
          crypto: "Cryptography",
        },
      },
      build: {
        heading: "BUILD",
        items: {
          docs: "Documentation",
          languages: "Trocto & Regol",
          coreApi: "Core API",
          buildTest: "Build & test",
          github: "GitHub",
        },
      },
      network: {
        heading: "NETWORK",
        items: {
          scan: "SCAN",
          status: "Status",
          validators: "Validators",
          node: "Run a node",
          contracts: "Contracts",
        },
      },
      use: {
        heading: "USE",
        items: {
          id: "Astrolune ID",
          wallets: "Wallets",
          lune: "Lune",
          dns: ".lune DNS",
          roadmap: "Roadmap",
        },
      },
      project: {
        heading: "PROJECT",
        items: {
          about: "About",
          careers: "Careers",
          blog: "Blog",
          news: "News",
        },
      },
    },
    rights: "Astrolune — open source, no rights reserved beyond the licence",
    networkLabel: "Pre-mainnet",
  },

  notFound: {
    title: "Not found",
    body: "That page does not exist. It may have moved, or it may never have been written — this tree is honest about what is missing.",
    home: "Back home",
  },
} as const;

/**
 * Recursively widens string literals, so a translation file can be checked
 * against the *shape* of `en` without having to match its exact wording.
 * A missing or misspelled key in `ru.ts` becomes a type error.
 */
type Widen<T> = T extends string ? string : { [K in keyof T]: Widen<T[K]> };

export type Dict = Widen<typeof en>;
