"use client";

import React, { useState, useMemo } from "react";
import {
  Globe,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Send,
  Trash2,
  CheckCircle2,
  Search,
  Cpu,
  Bot,
  Zap,
} from "lucide-react";
import { NicheTrend, NicheCategory } from "@/data/mockData";
import { useContent } from "@/context/ContentContext";
import { TrendDraftDrawer } from "./TrendDraftDrawer";

type TrendFilter = "all" | NicheCategory;

export function NicheTrendHunter({
  onNotification,
}: {
  onNotification?: (msg: string) => void;
}) {
  const { nicheTrends, scanNicheTrends, isScanningTrends, pushTrendToBoard } =
    useContent();

  const [activeCategory, setActiveCategory] = useState<TrendFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrend, setSelectedTrend] = useState<NicheTrend | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleScan = async () => {
    const res = await scanNicheTrends();
    if (res.success && onNotification) {
      onNotification(`Scanned internet • Found ${res.count} active AI trends & launches`);
    }
  };

  const handleOpenDraft = (trend: NicheTrend) => {
    setSelectedTrend(trend);
    setIsDrawerOpen(true);
  };

  const handleDirectPush = (trend: NicheTrend) => {
    pushTrendToBoard(trend.id);
    if (onNotification) {
      onNotification(`Pushed "${trend.title.slice(0, 32)}..." to Content Board`);
    }
  };

  const getTagBadge = (tag: NicheTrend["tag"]) => {
    switch (tag) {
      case "Breaking Launch":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Agent Workflow":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Industry Shift":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Contrarian Debate":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
  };

  const filteredTrends = useMemo(() => {
    return (nicheTrends || []).filter((t) => {
      if (activeCategory !== "all" && t.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchSummary = t.summary.toLowerCase().includes(q);
        const matchSource = t.sourceName.toLowerCase().includes(q);
        if (!matchTitle && !matchSummary && !matchSource) return false;
      }
      return true;
    });
  }, [nicheTrends, activeCategory, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Sensor Control Bar */}
      <div className="bg-[#131414] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#C85D3A]" />
                Internet Niche Trend Hunter
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-400">
                AI Automation & AI News
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Live crawler monitoring Hacker News, Reddit AI communities, and lab release feeds.
            </p>
          </div>

          <button
            type="button"
            onClick={handleScan}
            disabled={isScanningTrends}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#8E4128] hover:bg-[#A34B2F] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanningTrends ? "animate-spin" : ""}`} />
            <span>{isScanningTrends ? "Scanning Internet..." : "Scan Internet Now"}</span>
          </button>
        </div>

        {/* Filter Pills and Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-white/[0.04]">
          <div className="flex items-center bg-[#181919] p-1 rounded-xl border border-white/[0.06] overflow-x-auto">
            {(
              [
                { id: "all", label: "All Niches" },
                { id: "AI News", label: "AI News & Model Launches", icon: Cpu },
                { id: "AI Automation", label: "AI Automation & Workflows", icon: Bot },
              ] as { id: TrendFilter; label: string; icon?: any }[]
            ).map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    activeCategory === tab.id
                      ? "bg-[#8E4128] text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trends..."
              className="w-full bg-[#181919] border border-white/[0.06] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#8E4128]"
            />
          </div>
        </div>
      </div>

      {/* Trend Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredTrends.map((trend) => (
          <div
            key={trend.id}
            className={`group bg-[#131414] rounded-2xl border transition-all flex flex-col justify-between p-4 sm:p-5 shadow-sm hover:shadow-md ${
              trend.isPromoted
                ? "border-emerald-500/30 bg-emerald-500/[0.02]"
                : "border-white/[0.08] hover:border-white/[0.16]"
            }`}
          >
            <div className="space-y-3">
              {/* Category, Tag, and Time */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${getTagBadge(
                      trend.tag
                    )}`}
                  >
                    {trend.tag}
                  </span>
                  <span className="text-zinc-400 font-medium">{trend.category}</span>
                </div>
                <span className="text-[11px] text-zinc-500">{trend.detectedAgo}</span>
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-semibold text-zinc-100 leading-snug">
                {trend.title}
              </h3>

              {/* Summary */}
              <p className="text-xs text-zinc-300 leading-relaxed">
                {trend.summary}
              </p>

              {/* The Clericlabs Angle */}
              <div className="bg-[#8E4128]/10 border border-[#8E4128]/25 rounded-xl p-3 space-y-1">
                <div className="text-[11px] font-semibold text-[#C85D3A] flex items-center gap-1.5">
                  <Zap className="w-3 h-3 fill-current" />
                  <span>The High-Leverage Angle</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {trend.clericlabsAngle}
                </p>
              </div>

              {/* Source & Velocity info */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/[0.04]">
                <span>{trend.velocity}</span>
                <a
                  href={trend.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C85D3A] hover:underline flex items-center gap-1"
                >
                  <span>{trend.sourceName}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-3 mt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
              {trend.isPromoted ? (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>On Board</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleDirectPush(trend)}
                  className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Push to Board</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleOpenDraft(trend)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#8E4128] hover:bg-[#A34B2F] active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Draft Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Drawer */}
      <TrendDraftDrawer
        trend={selectedTrend}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onPushedToBoard={(t) => {
          if (onNotification) onNotification(`Pushed "${t.slice(0, 32)}..." to Content Board`);
        }}
      />
    </div>
  );
}
