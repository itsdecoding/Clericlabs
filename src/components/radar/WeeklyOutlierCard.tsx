"use client";

import React, { useState } from "react";
import {
  Flame,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Trash2,
  CheckCircle2,
  Send,
  Heart,
  Repeat2,
  MessageSquare,
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
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Curiosity Gap":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Framework":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Warning":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div
      className={`group bg-[#131414] rounded-2xl border transition-all flex flex-col justify-between p-4 sm:p-5 shadow-sm hover:shadow-md ${
        outlier.isPromoted
          ? "border-emerald-500/30 bg-emerald-500/[0.02]"
          : "border-white/[0.08] hover:border-white/[0.16]"
      }`}
    >
      <div className="space-y-3.5">
        {/* Top Author & Anomaly Badge Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${meta.badgeBg}`}
            >
              {meta.icon}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-zinc-100 truncate">
                {outlier.authorName}
              </div>
              <div className="text-[11px] text-zinc-400 truncate">
                {outlier.authorHandle} • {outlier.postedDaysAgo}
              </div>
            </div>
          </div>

          {/* Outlier Badge */}
          <div className="shrink-0">
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#8E4128]/15 text-[#C85D3A] border border-[#8E4128]/30 flex items-center gap-1 font-mono">
              <Flame className="w-3.5 h-3.5 fill-current" />
              {outlier.outlierMultiple}x
            </span>
          </div>
        </div>

        {/* Hook Category & Main Copy */}
        <div className="space-y-2">
          <span
            className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-md border ${getHookTypeBadge(
              outlier.hookType
            )}`}
          >
            {outlier.hookType}
          </span>

          {/* Prominent Hook - Clean, Structured Typography without clumsy quotes */}
          <p className="text-[14px] sm:text-[15px] font-medium text-zinc-100 leading-snug">
            {outlier.originalHook}
          </p>

          {/* Expandable full post */}
          {isExpanded ? (
            <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap pt-2 border-t border-white/[0.06] animate-in fade-in duration-150">
              {outlier.originalBody}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="text-[11px] text-[#C85D3A] hover:underline flex items-center gap-1 cursor-pointer pt-0.5"
          >
            <span>{isExpanded ? "Hide full post" : "Show full post"}</span>
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </button>
        </div>

        {/* Engagement Metrics with Sleek SVG Icons */}
        <div className="flex items-center justify-between text-xs text-zinc-400 pt-3 border-t border-white/[0.04]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3 text-zinc-500" />
              {outlier.metrics.likes.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <Repeat2 className="w-3 h-3 text-zinc-500" />
              {outlier.metrics.reposts.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-zinc-500" />
              {outlier.metrics.comments.toLocaleString()}
            </span>
          </div>
          <span className="text-[11px] text-zinc-400">
            Avg: ~{outlier.baselineEngagement}
          </span>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3.5 mt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
        {outlier.isPromoted ? (
          <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>On Board</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onDirectPromote(outlier)}
            title="Push to Content Board without editing"
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Push</span>
          </button>
        )}

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => dismissOutlier(outlier.id)}
            title="Dismiss"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-white/[0.04] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onReword(outlier)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#8E4128] hover:bg-[#A34B2F] active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reword for Client</span>
          </button>
        </div>
      </div>
    </div>
  );
}
