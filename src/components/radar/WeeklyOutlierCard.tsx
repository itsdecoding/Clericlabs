"use client";

import React, { useState } from "react";
import {
  Flame,
  Sparkles,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Share2,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Zap,
} from "lucide-react";
import { WeeklyOutlier } from "@/data/mockData";
import { getPlatformMeta } from "./WatchlistShelf";
import { useContent } from "@/context/ContentContext";

interface WeeklyOutlierCardProps {
  outlier: WeeklyOutlier;
  onReword: (outlier: WeeklyOutlier) => void;
  onDirectPromote: (outlier: WeeklyOutlier) => void;
}

export function WeeklyOutlierCard({
  outlier,
  onReword,
  onDirectPromote,
}: WeeklyOutlierCardProps) {
  const { dismissOutlier } = useContent();
  const [isExpanded, setIsExpanded] = useState(false);

  const meta = getPlatformMeta(outlier.platform);

  const getHookTypeBadge = (type: WeeklyOutlier["hookType"]) => {
    switch (type) {
      case "Contrarian":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      case "Curiosity Gap":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "Framework":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
      case "Warning":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div
      className={`group bg-white/90 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border transition-all flex flex-col justify-between p-5 shadow-sm hover:shadow-md ${
        outlier.isPromoted
          ? "border-emerald-500/30 bg-emerald-500/[0.02]"
          : "border-black/[0.08] dark:border-white/[0.12] hover:border-[#8E4128]/50"
      }`}
    >
      <div className="space-y-4">
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-2xs ${meta.badgeBg}`}
            >
              {meta.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-zinc-900 dark:text-[#F5F3EF] truncate flex items-center gap-1.5">
                <span>{outlier.authorName}</span>
                <span className="text-[10px] font-mono text-zinc-400 dark:text-[#8A8680]">
                  {outlier.authorHandle}
                </span>
              </div>
              <div className="text-[10.5px] font-mono text-zinc-400 dark:text-zinc-500">
                Posted {outlier.postedDaysAgo}
              </div>
            </div>
          </div>

          {/* Outlier Multiple Anomaly Badge */}
          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border border-[#8E4128]/30 flex items-center gap-1 shadow-2xs">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {outlier.outlierMultiple}x Outlier
            </span>
          </div>
        </div>

        {/* Hook Highlight & Body */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getHookTypeBadge(
                outlier.hookType
              )}`}
            >
              {outlier.hookType}
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-[#8A8680]">
              Past 7 Days Spike
            </span>
          </div>

          {/* Prominent Hook line */}
          <p className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF] leading-snug tracking-tight">
            &ldquo;{outlier.originalHook}&rdquo;
          </p>

          {/* Expandable full post */}
          {isExpanded ? (
            <p className="text-xs text-zinc-600 dark:text-[#8A8680] leading-relaxed whitespace-pre-wrap pt-2 border-t border-black/[0.04] dark:border-white/[0.06] animate-in fade-in duration-150">
              {outlier.originalBody}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setIsExpanded(true)}
              className="text-[11px] font-mono text-[#8E4128] dark:text-[#C85D3A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Read full original post</span>
              <ChevronDown className="w-3 h-3" />
            </button>
          )}

          {isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="text-[11px] font-mono text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Show less</span>
              <ChevronUp className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Engagement Numbers Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-3 border-t border-black/[0.06] dark:border-white/[0.06] text-zinc-500 dark:text-[#8A8680]">
          <div className="flex items-center gap-3">
            <span>❤️ {outlier.metrics.likes.toLocaleString()}</span>
            <span>🔁 {outlier.metrics.reposts.toLocaleString()}</span>
            <span>💬 {outlier.metrics.comments.toLocaleString()}</span>
          </div>
          <span className="text-[#8E4128] dark:text-[#C85D3A] font-semibold">
            Baseline: ~{outlier.baselineEngagement}
          </span>
        </div>
      </div>

      {/* Card Action Footers */}
      <div className="pt-4 mt-4 border-t border-black/[0.06] dark:border-white/[0.06] flex items-center justify-between gap-2">
        {outlier.isPromoted ? (
          <div className="text-[11px] font-mono text-emerald-500 flex items-center gap-1.5 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pushed to Content Board</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onDirectPromote(outlier)}
            className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Direct Push →
          </button>
        )}

        <div className="flex items-center gap-2">
          {/* Dismiss button */}
          <button
            type="button"
            onClick={() => dismissOutlier(outlier.id)}
            title="Dismiss outlier"
            className="p-1.5 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          {/* Primary Action: Reword for Client */}
          <button
            type="button"
            onClick={() => onReword(outlier)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-95 shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reword for Client</span>
          </button>
        </div>
      </div>
    </div>
  );
}
