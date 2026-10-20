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
  postedAt?: string;
  tags?: string;
  activityLog?: { text: string; time: string }[];
}

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
  { name: "Idea", count: 15, colorDot: "#9CA3AF", pillBg: "#F3F4F6", pillText: "#4B5563" },
  { name: "Scripting", count: 22, colorDot: "#60A5FA", pillBg: "#EFF6FF", pillText: "#1D4ED8" },
  { name: "Filming (Approved)", count: 3, colorDot: "#F472B6", pillBg: "#FDF2F8", pillText: "#BE185D" },
  { name: "In Editing", count: 18, colorDot: "#FF5A1F", pillBg: "#FFF3EC", pillText: "#D9531E" },
  { name: "For Review", count: 7, colorDot: "#F59E0B", pillBg: "#FEF9EE", pillText: "#B47D14" },
  { name: "Requires Revision", count: 11, colorDot: "#EF4444", pillBg: "#FEECEC", pillText: "#DC2626" },
  { name: "Approved", count: 1, colorDot: "#10B981", pillBg: "#EEF9F1", pillText: "#1E8E3E" },
  { name: "Posted", count: 169, colorDot: "#059669", pillBg: "#ECFDF5", pillText: "#047857" },
];

export const COLUMNS = [
  { id: "Idea", title: "Idea", colorDot: "#6B7280" },
  { id: "Scripting", title: "Scripting", colorDot: "#6B7280" },
  { id: "Filming (Approved)", title: "Filming (Approved)", colorDot: "#6B7280" },
  { id: "In Editing", title: "In Editing", colorDot: "#FF5A1F", isOrange: true },
  { id: "For Review", title: "For Review", colorDot: "#B47D14", isYellow: true },
  { id: "Requires Revision", title: "Requires Revision", colorDot: "#DC2626", isRed: true },
  { id: "Approved", title: "Approved", colorDot: "#10B981", isGreen: true },
  { id: "Posted", title: "Posted", colorDot: "#059669", isMint: true },
];
