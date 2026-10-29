export interface ContentCard {
  id: string;
  title: string;
  type: string; // 'IG Carousel' | 'IG Reel · Standard' | 'IG B-roll · Trial' | 'LinkedIn' | 'X / Twitter' | 'YouTube Long'
  status: string; // 'Idea' | 'Scripting' | 'Filming (Approved)' | 'In Editing' | 'For Review' | 'Requires Revision' | 'Approved' | 'Posted' | 'Dismissed'
  category?: string; // 'AI News' | 'Sales/Conversion' | etc.
  priority?: string; // 'Low' | 'Medium' | 'High'
  assignee?: string; // e.g. 'B'
  slidesCount?: number;
  slideCopy?: string;
  caption?: string;
  hashtags?: string;
  briefUrl?: string;
  finalFilesUrl?: string;
  coverImageUrl?: string;
  supportingAssetsUrl?: string;
  postedUrl?: string;
  owner?: string;
  pm?: string;
  designer?: string;
  writer?: string;
  dueDate?: string;
  scheduledDate?: string;
  postedAt?: string;
  tags?: string;
  activityLog?: { text: string; time: string }[];
}

export interface TaskItem {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  priority: "High" | "Medium" | "Low";
  contentCardId?: string;
  contentCardTitle?: string;
  contentType?: string;
  assignee?: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface RadarSignal {
  id: string;
  title: string;
  source: string; // 'X / Twitter' | 'Instagram' | 'Substack' | 'YouTube' | 'Reddit' | 'Competitor'
  sourceUrl?: string;
  signalType: "Viral Hook" | "Content Angle" | "Competitor Watch" | "Trend / News";
  conviction: "High" | "Medium" | "Seed";
  notes?: string;
  tags?: string;
  createdAt: string;
  isPromoted?: boolean;
}

export type RadarPlatform = "threads" | "x" | "instagram" | "linkedin";

export interface WatchlistAccount {
  id: string;
  handle: string;
  name: string;
  platform: RadarPlatform;
  avatarUrl?: string;
  followers: string;
  avgEngagement: number;
  outliersThisWeek: number;
  lastScouted: string;
  category: string;
}

export interface WeeklyOutlier {
  id: string;
  accountId: string;
  authorHandle: string;
  authorName: string;
  platform: RadarPlatform;
  postedDaysAgo: string;
  originalHook: string;
  originalBody: string;
  hookType: "Contrarian" | "Curiosity Gap" | "Framework" | "Relatable" | "Warning";
  metrics: {
    likes: number;
    reposts: number;
    comments: number;
    views?: number;
  };
  baselineEngagement: number;
  outlierMultiple: number; // e.g. 8.4 = 8.4x median weekly baseline
  originalUrl?: string;
  suggestedHooks: { label: string; text: string }[];
  rewordedDraft: {
    title: string;
    body: string;
    angle: string;
  };
  isPromoted?: boolean;
}

export type NicheCategory = "AI News" | "AI Automation";

export interface NicheTrend {
  id: string;
  category: NicheCategory;
  title: string;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  velocity: string; // e.g. "1.9k points • 420 comments" or "+580% surge"
  tag: "Breaking Launch" | "Agent Workflow" | "Contrarian Debate" | "Industry Shift";
  detectedAgo: string;
  clericlabsAngle: string;
  suggestedHooks: { label: string; text: string }[];
  rewordedDraft: {
    title: string;
    body: string;
    angle: string;
  };
  isPromoted?: boolean;
}

export const INITIAL_NICHE_TRENDS: NicheTrend[] = [
  {
    id: "trend-1",
    category: "AI News",
    title: "Anthropic Releases Claude 3.7 Sonnet with Hybrid Reasoning",
    summary:
      "Anthropic rolled out Claude 3.7 Sonnet, introducing hybrid reasoning architecture where users can dynamically toggle between instantaneous token responses and deep multi-step contemplation. Benchmark tests show significant leaps in multi-file codebase refactoring and autonomous debugging.",
    sourceName: "Hacker News / Anthropic",
    sourceUrl: "https://news.ycombinator.com",
    velocity: "2.4k points • 680 comments",
    tag: "Breaking Launch",
    detectedAgo: "3 hours ago",
    clericlabsAngle:
      "Everyone is obsessing over the benchmark graphs. The real business moat is hybrid thinking: fast answers for customer ops, deep reasoning for complex code and strategy.",
    suggestedHooks: [
      {
        label: "Contrarian Angle",
        text: "Why benchmark scores lie: The real reason Claude's new hybrid reasoning changes B2B economics.",
      },
      {
        label: "Direct Observation",
        text: "Anthropic just solved the single biggest complaint about reasoning models: latency.",
      },
      {
        label: "Agency Systems",
        text: "How we're deploying Claude 3.7 into our agency pipeline to cut production cycles in half.",
      },
    ],
    rewordedDraft: {
      title: "The Death of the Static Prompt: Why Hybrid Reasoning Changes Agency Leverage",
      body:
        "Anthropic just released Claude 3.7 Sonnet with hybrid reasoning.\n\nMost founders will look at the benchmark charts, nod politely, and move on. That is a mistake.\n\nThe breakthrough isn't just higher accuracy—it is variable compute cost. You no longer choose between a dumb, fast model and an expensive, slow reasoning model. You control the cognitive depth per API call.\n\nHow high-leverage agencies are applying this:\n1. Instant tier: Routing customer emails, drafting social hooks, sorting tickets (0 seconds thinking).\n2. Deep tier: Architectural code audit, contract analysis, multi-step market intelligence (60 seconds deep thinking).\n\nDon't build wrappers. Build workflows that dynamically allocate intelligence based on problem complexity.",
      angle: "Clericlabs Operational Architecture & AI Systems",
    },
  },
  {
    id: "trend-2",
    category: "AI Automation",
    title: "Why Agencies Are Replacing Zapier with Autonomous Browser Agents",
    summary:
      "A massive shift is underway as agencies abandon rigid API-only automation tools (Zapier, Make) in favor of headless browser agents (Browser-Use, Playwright AI, Stagehand). These agents can interact with legacy client software, fill web portals, and extract real-time competitor data without waiting for official API integrations.",
    sourceName: "r/automations • Reddit",
    sourceUrl: "https://reddit.com/r/automations",
    velocity: "1.2k upvotes • 310 comments",
    tag: "Agent Workflow",
    detectedAgo: "6 hours ago",
    clericlabsAngle:
      "APIs are brittle; browser agents are resilient. When a client uses a clunky legacy CRM with no API, you don't say no—you deploy an agent that clicks and types like a human.",
    suggestedHooks: [
      {
        label: "System Warning",
        text: "If your automation agency relies 100% on Zapier, your margins will hit zero by Q4.",
      },
      {
        label: "The Moat Shift",
        text: "The new automation hierarchy: APIs for commodities, browser agents for proprietary moats.",
      },
      {
        label: "Framework",
        text: "How we automated a 4-hour daily manual data entry task without touching an API key.",
      },
    ],
    rewordedDraft: {
      title: "Beyond Zapier: The Rise of Autonomous Browser-Level Automation",
      body:
        "For 8 years, 'automation agency' meant stringing together Zapier zaps and charging a markup.\n\nThat era is officially over. When APIs don't exist—or when enterprise software charges $10k/mo for API access—autonomous browser agents take over.\n\nInstead of waiting for an integration, an agent opens the portal, navigates the UI, downloads the telemetry, and updates your internal system.\n\nThe winners of the 2026 agency economy won't be prompt wrappers. They will be the architects who connect messy human interfaces with structured LLM logic.",
      angle: "Agency Leverage & Automation Moats",
    },
  },
  {
    id: "trend-3",
    category: "AI News",
    title: "DeepSeek Model Releases Accelerate Local AI Infrastructure Boom",
    summary:
      "The release of open-weights reasoning architectures has triggered an unprecedented surge in on-premise and local private AI setups. Companies are realizing they can run 95% frontier performance on private local clusters for a fraction of closed-API token costs.",
    sourceName: "r/LocalLLaMA • Hacker News",
    sourceUrl: "https://news.ycombinator.com",
    velocity: "3.1k points • 890 comments",
    tag: "Industry Shift",
    detectedAgo: "14 hours ago",
    clericlabsAngle:
      "Data privacy and zero ongoing API costs are turning local models into the enterprise darling. Smart agencies are packaging private local LLM deployments as premium retainers.",
    suggestedHooks: [
      {
        label: "Market Reality",
        text: "Why enterprise clients are suddenly terrified of sending their data to closed API endpoints.",
      },
      {
        label: "Cost Asymmetry",
        text: "How one agency cut their $6,000/mo OpenAI bill to $240 using local open weights.",
      },
      {
        label: "Contrarian View",
        text: "The frontier model moat is evaporating. Your proprietary workflow is the only thing left.",
      },
    ],
    rewordedDraft: {
      title: "The Token Cost Squeeze: Why Local Models Are Winning Enterprise Trust",
      body:
        "Every board of directors has the same two fears regarding AI adoption:\n1. Where does our proprietary client data go?\n2. Why is our API token bill compounding exponentially every month?\n\nThe rise of ultra-efficient open reasoning models completely neutralizes both objections.\n\nWhen you can run high-grade intelligence directly on isolated local infrastructure, AI stops being a variable operational cost and becomes a capitalized permanent asset.\n\nIf you sell services to businesses, stop pitching AI features. Pitch data sovereign automation.",
      angle: "Enterprise Strategy & AI Sovereignty",
    },
  },
  {
    id: "trend-4",
    category: "AI Automation",
    title: "The Multi-Agent Routing Protocol: Replacing Single Prompts with Teams",
    summary:
      "Developers and agencies are moving away from monolithic 'megaprompts' toward lightweight orchestrators with specialized subagents (Researcher, Fact-Checker, Style Editor, Auditor). Testing reveals a 70% decrease in hallucinations and 3x higher code consistency.",
    sourceName: "GitHub Trending / Tech Community",
    sourceUrl: "https://github.com",
    velocity: "+490% star velocity • 1.5k stars",
    tag: "Contrarian Debate",
    detectedAgo: "1 day ago",
    clericlabsAngle:
      "Never ask one model to do everything. Treat models like junior team members with single distinct responsibilities and an automated review loop.",
    suggestedHooks: [
      {
        label: "Counter-Intuitive Truth",
        text: "Why a 2,000-word prompt is the worst way to get reliable output from an LLM.",
      },
      {
        label: "System Design",
        text: "The 3-Agent Assembly Line: How we structure autonomous content quality control.",
      },
      {
        label: "Operator Stance",
        text: "Single prompts hallucinate; multi-agent review chains compound accuracy.",
      },
    ],
    rewordedDraft: {
      title: "The End of the Megaprompt: Why Multi-Agent Teams Win Every Time",
      body:
        "If your system prompt is 8 pages long and handles context, guidelines, edge cases, and output formatting in one single call, failure is guaranteed.\n\nHumans don't work like that, and neither do neural networks.\n\nWhen we decomposed our content pipeline into 3 distinct micro-agents—one for raw research, one for hook architecture, and one for editorial tone compliance—hallucinations dropped to zero.\n\nQuality in AI automation isn't about finding the magic prompt. It's about designing the handoff between specialized roles.",
      angle: "Clericlabs Autonomous Workflow Architecture",
    },
  },
];

export const INITIAL_WATCHLIST: WatchlistAccount[] = [
  {
    id: "acc-1",
    handle: "@behavioral_models",
    name: "Behavioral Models",
    platform: "threads",
    followers: "142K",
    avgEngagement: 320,
    outliersThisWeek: 2,
    lastScouted: "18m ago",
    category: "Psychology & Decision Making",
  },
  {
    id: "acc-2",
    handle: "@growth_instincts",
    name: "Growth Instincts",
    platform: "x",
    followers: "89K",
    avgEngagement: 190,
    outliersThisWeek: 3,
    lastScouted: "42m ago",
    category: "Agency OS & High Leverage",
  },
  {
    id: "acc-3",
    handle: "@rewrite_minds",
    name: "Rewrite Minds",
    platform: "threads",
    followers: "310K",
    avgEngagement: 840,
    outliersThisWeek: 2,
    lastScouted: "1h ago",
    category: "Mental Models & Cognitive Reframing",
  },
  {
    id: "acc-4",
    handle: "@stoic_clarity",
    name: "Stoic Clarity",
    platform: "instagram",
    followers: "520K",
    avgEngagement: 1400,
    outliersThisWeek: 1,
    lastScouted: "2h ago",
    category: "Applied Philosophy & Focus",
  },
  {
    id: "acc-5",
    handle: "@founder_protocols",
    name: "Founder Protocols",
    platform: "linkedin",
    followers: "64K",
    avgEngagement: 210,
    outliersThisWeek: 2,
    lastScouted: "3h ago",
    category: "Systems & Leadership",
  },
];

export const INITIAL_WEEKLY_OUTLIERS: WeeklyOutlier[] = [
  {
    id: "outlier-1",
    accountId: "acc-1",
    authorHandle: "@behavioral_models",
    authorName: "Behavioral Models",
    platform: "threads",
    postedDaysAgo: "2 days ago",
    originalHook: "Most people think procrastination is a time-management flaw. It isn't.",
    originalBody:
      "Most people think procrastination is a time-management flaw. It isn't. It's an emotional regulation failure.\n\nYou aren't avoiding the task because you're lazy or unorganized. You are avoiding the negative emotion (inadequacy, boredom, anxiety of judgment) that the task triggers.\n\nThe fix is never a new Pomodoro timer. The fix is lowering the emotional threshold of starting to zero: commit to working for 120 seconds, or write the worst first paragraph possible.",
    hookType: "Contrarian",
    metrics: { likes: 3680, reposts: 820, comments: 240 },
    baselineEngagement: 320,
    outlierMultiple: 11.5,
    originalUrl: "https://threads.net",
    suggestedHooks: [
      {
        label: "Contrarian Truth",
        text: "You don't have a focus problem. You have an emotional avoidance problem.",
      },
      {
        label: "Question Hook",
        text: "Ever wondered why no to-do list app has ever permanently cured your procrastination?",
      },
      {
        label: "Direct Rule",
        text: "The 120-Second Deconditioning Rule: How to start hard work without relying on willpower.",
      },
    ],
    rewordedDraft: {
      title: "The Emotional Avoidance Paradox: Why Willpower Never Cures Procrastination",
      body:
        "We spend thousands on calendars, planners, and productivity apps trying to solve what we label a 'scheduling failure.'\n\nIt isn't a scheduling problem. It's a psychological threat reflex.\n\nWhen you open a hard document, your nervous system registers impending judgment. The urge to check your phone isn't distraction—it's emergency relief seeking.\n\nHow high-agency thinkers break the loop:\n1. Separate the outcome from your identity.\n2. Apply the 'Zero Quality' rule for the first 3 minutes.\n3. Make starting smaller than your pride.\n\nOnce motion begins, the threat dissolves.",
      angle: "Rewrite Minds / Cognitive Reframing",
    },
  },
  {
    id: "outlier-2",
    accountId: "acc-2",
    authorHandle: "@growth_instincts",
    authorName: "Growth Instincts",
    platform: "x",
    postedDaysAgo: "3 days ago",
    originalHook: "The single biggest leverage in 2026 isn't AI wrappers. It's proprietary distribution.",
    originalBody:
      "The single biggest leverage in 2026 isn't AI wrappers. It's proprietary distribution.\n\nEveryone has access to the exact same frontier models. Tech commoditization is happening in weeks, not decades.\n\nIf your agency doesn't own an audience or an automated outbound intelligence loop, you are competing on price until margin hits zero.\n\nBuild the media engine before you build the tool.",
    hookType: "Warning",
    metrics: { likes: 1620, reposts: 390, comments: 115 },
    baselineEngagement: 190,
    outlierMultiple: 8.5,
    originalUrl: "https://x.com",
    suggestedHooks: [
      {
        label: "Market Warning",
        text: "If your moat is 'we use AI', you don't have a business. You have a ticking clock.",
      },
      {
        label: "Asymmetric Take",
        text: "Why media agencies with their own distribution will acquire SaaS companies in 2026.",
      },
      {
        label: "Framework",
        text: "The 3 Moats of the 2026 Agency OS: Attention, Custom Data, and Zero-Friction Operations.",
      },
    ],
    rewordedDraft: {
      title: "The Death of the Feature Moat: Why Distribution Is The Only Defense",
      body:
        "Frontier models are now table stakes. Anyone with an API key can replicate your core service in a weekend.\n\nSo what separates agencies charging $25k/mo retainers from those begging for $1k gigs?\n\nProprietary attention and upstream intelligence.\n\nWhen you build an inbound media machine, you stop pitching and start selecting. Distribution isn't marketing—it is the entire economic engine.",
      angle: "Clericlabs Agency Systems & Leverage",
    },
  },
  {
    id: "outlier-3",
    accountId: "acc-3",
    authorHandle: "@rewrite_minds",
    authorName: "Rewrite Minds",
    platform: "threads",
    postedDaysAgo: "1 day ago",
    originalHook: "High conviction isn't born from confidence. It's born from eliminating consensus.",
    originalBody:
      "High conviction isn't born from confidence. It's born from eliminating consensus.\n\nThe moment you ask 5 people for their opinion on your next move, you average out your intuition to whatever is socially acceptable.\n\nGreat work comes from asymmetric bets that look irresponsible to the median observer until they succeed.",
    hookType: "Contrarian",
    metrics: { likes: 5890, reposts: 1410, comments: 310 },
    baselineEngagement: 840,
    outlierMultiple: 7.0,
    originalUrl: "https://threads.net",
    suggestedHooks: [
      {
        label: "Contrarian Principle",
        text: "Seeking consensus is just fear disguised as thoroughness.",
      },
      {
        label: "Observation Hook",
        text: "Notice how every piece of advice you get from a committee averages out to mediocrity?",
      },
      {
        label: "Bold Rule",
        text: "The Rule of Asymmetric Silence: Never ask for feedback from people who don't bear the downside.",
      },
    ],
    rewordedDraft: {
      title: "The Consensus Trap: Why Asking for Opinions Destroys Great Work",
      body:
        "Asking for validation feels responsible. In reality, it is a subtle defense mechanism to diffuse the pain of potential failure.\n\nWhen you poll a room, you don't get truth. You get the lowest common denominator of comfort.\n\nIf an idea requires unanimous approval to launch, it is already too safe to matter.\n\nProtect your initial conviction until you test it against reality, not social opinion.",
      angle: "Cognitive Autonomy & Unshakeable Conviction",
    },
  },
  {
    id: "outlier-4",
    accountId: "acc-4",
    authorHandle: "@stoic_clarity",
    authorName: "Stoic Clarity",
    platform: "instagram",
    postedDaysAgo: "4 days ago",
    originalHook: "Seneca wrote this 2,000 years ago, and modern neuroscience just confirmed it:",
    originalBody:
      "Seneca wrote this 2,000 years ago, and modern neuroscience just confirmed it:\n\n'We suffer more often in imagination than in reality.'\n\nYour amygdala does not distinguish between a real predator and a simulated catastrophic scenario in your head. It dumps the exact same cortisol.\n\nStop paying the emotional interest on debts you might never owe.",
    hookType: "Curiosity Gap",
    metrics: { likes: 9800, reposts: 2900, comments: 420 },
    baselineEngagement: 1400,
    outlierMultiple: 7.0,
    originalUrl: "https://instagram.com",
    suggestedHooks: [
      {
        label: "Ancient vs Modern",
        text: "Why your brain treats imaginary embarrassment the same as physical danger.",
      },
      {
        label: "Direct Punch",
        text: "You are exhausting yourself fighting battles that only exist in your head.",
      },
      {
        label: "Stoic Lens",
        text: "The Cost of Pre-Suffering: How to stop rehearsing disasters.",
      },
    ],
    rewordedDraft: {
      title: "Pre-Suffering: The Heavy Tax on Simulated Catastrophes",
      body:
        "Before a tough conversation or client review, how many hours do you spend rehearsing the worst possible outcome?\n\nEvery rehearsal releases the same neurochemical exhaustion as living through the real event.\n\nMost people live through tragedies twenty times before breakfast—nineteen of which never materialize.\n\nPrepare for what is in your control. Dismiss the imaginary theatre.",
      angle: "Stoic Psychology & Energy Preservation",
    },
  },
  {
    id: "outlier-5",
    accountId: "acc-5",
    authorHandle: "@founder_protocols",
    authorName: "Founder Protocols",
    platform: "linkedin",
    postedDaysAgo: "5 days ago",
    originalHook: "Stop asking your team for updates. Implement asynchronous signal logs instead.",
    originalBody:
      "Stop asking your team for updates. Implement asynchronous signal logs instead.\n\nDaily standups steal 30 minutes of deep focus from every single engineer and designer.\n\nWe replaced all daily syncs with a 3-line end-of-day bullet:\n1. Shipped today\n2. Blocked by\n3. Priority tomorrow\n\nResult: 40% increase in weekly output and zero meeting fatigue.",
    hookType: "Framework",
    metrics: { likes: 1350, reposts: 280, comments: 195 },
    baselineEngagement: 210,
    outlierMultiple: 6.4,
    originalUrl: "https://linkedin.com",
    suggestedHooks: [
      {
        label: "Counter-Intuitive Rule",
        text: "The fastest way to kill agency momentum is a 30-minute daily standup.",
      },
      {
        label: "System Design",
        text: "How we killed 15 hours of meetings a week with a 3-line asynchronous protocol.",
      },
      {
        label: "Operator Take",
        text: "If you need a meeting to know what your team is doing, your dashboard is broken.",
      },
    ],
    rewordedDraft: {
      title: "The Zero-Meeting Operating Cadence: Eliminating Daily Standup Drag",
      body:
        "Meetings are often treated as work. In truth, they are the tax you pay for lack of clear asynchronous signals.\n\nWhen an agency switches from verbal syncs to structured daily telemetry, two things happen:\n1. Accountability becomes visible in writing.\n2. Makers gain 4 uninterrupted hours of deep creative flow.\n\nBuild systems that report status automatically so your people can focus on craftsmanship.",
      angle: "Clericlabs Operational Architecture",
    },
  },
];

export const INITIAL_SIGNALS: RadarSignal[] = [
  {
    id: "sig-1",
    title: "The Architecture of Unshakeable Conviction: Why high agency founders ignore consensus",
    source: "X / Twitter",
    signalType: "Viral Hook",
    conviction: "High",
    notes: "Angle: High conviction isn't arrogance; it's asymmetrical information. Structure as 7 slides breaking down cognitive autonomy.",
    tags: "philosophy, agency, mindset",
    createdAt: "2026-10-21",
  },
  {
    id: "sig-2",
    title: "Why 90% of AI automation agencies will consolidate by Q4",
    source: "Substack",
    signalType: "Trend / News",
    conviction: "High",
    notes: "Core premise: Prompt wrappers die, vertical workflows win. Great hook for a multi-slide B2B breakdown.",
    tags: "ai, business, systems",
    createdAt: "2026-10-20",
  },
  {
    id: "sig-3",
    title: "The 4 Silent Scripts of People-Pleasing (And how to delete them)",
    source: "Instagram",
    signalType: "Content Angle",
    conviction: "Medium",
    notes: "Psychological breakdown. 4-step framework targeting emotional autonomy. Reel voiceover candidate.",
    tags: "psychology, mindset",
    createdAt: "2026-10-19",
  },
];

export const INITIAL_TASKS: TaskItem[] = [];

export const INITIAL_CARDS: ContentCard[] = [];

export const CONTENT_TYPE_STATS = [
  { name: "IG Reel · Standard", count: 100, max: 100 },
  { name: "IG B-roll · Trial", count: 21, max: 100 },
  { name: "IG Carousel", count: 73, max: 100 },
  { name: "LinkedIn", count: 45, max: 100 },
  { name: "X / Twitter", count: 12, max: 100 },
  { name: "YouTube Long", count: 11, max: 100 },
];

export const STATUS_STATS = [
  { name: "Radar", count: 15, colorDot: "#8E4128", pillBg: "#FFF3EC", pillText: "#C43B1B" },
  { name: "Scripting", count: 22, colorDot: "#60A5FA", pillBg: "#EFF6FF", pillText: "#1D4ED8" },
  { name: "Filming (Approved)", count: 3, colorDot: "#F472B6", pillBg: "#FDF2F8", pillText: "#BE185D" },
  { name: "In Editing", count: 18, colorDot: "#8E4128", pillBg: "#FFF3EC", pillText: "#C43B1B" },
  { name: "For Review", count: 7, colorDot: "#F59E0B", pillBg: "#FEF9EE", pillText: "#B47D14" },
  { name: "Requires Revision", count: 11, colorDot: "#EF4444", pillBg: "#FEECEC", pillText: "#DC2626" },
  { name: "Approved", count: 1, colorDot: "#10B981", pillBg: "#EEF9F1", pillText: "#1E8E3E" },
  { name: "Posted", count: 169, colorDot: "#059669", pillBg: "#ECFDF5", pillText: "#047857" },
];

export const COLUMNS = [
  { id: "Radar", title: "Radar", colorDot: "#8E4128", isOrange: true },
  { id: "Scripting", title: "Scripting", colorDot: "#6B7280" },
  { id: "Filming (Approved)", title: "Filming (Approved)", colorDot: "#6B7280" },
  { id: "In Editing", title: "In Editing", colorDot: "#8E4128", isOrange: true },
  { id: "For Review", title: "For Review", colorDot: "#B47D14", isYellow: true },
  { id: "Requires Revision", title: "Requires Revision", colorDot: "#DC2626", isRed: true },
  { id: "Approved", title: "Approved", colorDot: "#10B981", isGreen: true },
  { id: "Posted", title: "Posted", colorDot: "#059669", isMint: true },
];
