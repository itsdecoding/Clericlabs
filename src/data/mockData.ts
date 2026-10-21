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
