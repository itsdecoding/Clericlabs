"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Radar,
  Flame,
  Zap,
  Plus,
  ExternalLink,
  Trash2,
  Filter,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
  Search,
  Radio,
  Share2,
  SlidersHorizontal,
  Layers,
  Users,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { WeeklyOutlier, RadarPlatform, RadarSignal } from "@/data/mockData";
import { WatchlistShelf } from "@/components/radar/WatchlistShelf";
import { WeeklyOutlierCard } from "@/components/radar/WeeklyOutlierCard";
import { RewordDrawer } from "@/components/radar/RewordDrawer";

type PlatformFilter = "all" | RadarPlatform;
type SortMode = "highest_multiple" | "most_recent";

export default function RadarPage() {
  const {
    watchlist,
    outliers,
    pushOutlierToBoard,
    signals,
    addSignal,
  } = useContent();

  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("highest_multiple");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer state for "Reword for Client"
  const [selectedOutlier, setSelectedOutlier] = useState<WeeklyOutlier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Manual Quick Signal Drop state (optional drop-in bar)
  const [isDropBarOpen, setIsDropBarOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickSource, setQuickSource] = useState("Threads");
  const [quickNotes, setQuickNotes] = useState("");

  const handleOpenReword = (outlier: WeeklyOutlier) => {
    setSelectedOutlier(outlier);
    setIsDrawerOpen(true);
  };

  const handleDirectPromote = (outlier: WeeklyOutlier) => {
    pushOutlierToBoard(outlier.id);
    setToastMessage(`Pushed "${outlier.originalHook.slice(0, 36)}..." to Content Board!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handlePushedFromDrawer = (cardTitle: string) => {
    setToastMessage(`Pushed "${cardTitle.slice(0, 36)}..." to Content Board!`);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleManualDrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    addSignal({
      title: quickTitle.trim(),
      source: quickSource,
      signalType: "Viral Hook",
      conviction: "High",
      notes: quickNotes.trim() || undefined,
      tags: "manual-drop, radar",
    });

    setQuickTitle("");
    setQuickNotes("");
    setIsDropBarOpen(false);
    setToastMessage(`Signal saved to Radar!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter & sort outliers
  const filteredOutliers = useMemo(() => {
    let result = (outliers || []).filter((o) => {
      // Platform filter
      if (platformFilter !== "all" && o.platform !== platformFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchHook = o.originalHook.toLowerCase().includes(q);
        const matchBody = o.originalBody.toLowerCase().includes(q);
        const matchHandle = o.authorHandle.toLowerCase().includes(q);
        const matchName = o.authorName.toLowerCase().includes(q);
        if (!matchHook && !matchBody && !matchHandle && !matchName) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortMode === "highest_multiple") {
        return b.outlierMultiple - a.outlierMultiple;
      } else {
        // most recent: extract number from "X days ago"
        const getDays = (str: string) => {
          if (str.includes("Yesterday")) return 1;
          const match = str.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        return getDays(a.postedDaysAgo) - getDays(b.postedDaysAgo);
      }
    });

    return result;
  }, [outliers, platformFilter, sortMode, searchQuery]);

  const maxOutlierMultiple = useMemo(() => {
    if (!outliers || outliers.length === 0) return 0;
    return Math.max(...outliers.map((o) => o.outlierMultiple));
  }, [outliers]);

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#FBFBFA] dark:bg-[#0E0E0E] text-[#111110] dark:text-[#F5F3EF]">
      {/* Top Navigation Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 space-y-6">
        {/* Promotion Toast */}
        {toastMessage && (
          <div className="bg-[#8E4128] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <Link
              href="/content"
              className="text-xs underline font-mono font-bold hover:text-white/80 transition-colors"
            >
              View in Radar Column on Board →
            </Link>
          </div>
        )}

        {/* Page Hero Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-[#8E4128] dark:text-[#C85D3A]">
                UPSTREAM COMPETITOR INTELLIGENCE
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-500 dark:text-[#8A8680] font-mono">
                {watchlist.length}/6 Monitored Accounts • {outliers.length} Weekly Outliers
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111110] dark:text-[#F5F3EF] flex items-center gap-3">
              Radar
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8E4128]/10 text-[#8E4128] dark:text-[#C85D3A] border border-[#8E4128]/20 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#8E4128] animate-pulse" />
                7-Day Outlier Radar
              </span>
            </h1>
          </div>

          {/* Quick Action: Manual Drop or Scan */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDropBarOpen((prev) => !prev)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-black/[0.08] dark:border-white/[0.12] bg-white/80 dark:bg-white/[0.04] text-zinc-700 dark:text-zinc-200 hover:border-[#8E4128]/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-[#8E4128]" />
              <span>{isDropBarOpen ? "Hide Manual Drop" : "Manual Drop"}</span>
            </button>
          </div>
        </div>

        {/* Manual Signal Drop Bar (Collapsible) */}
        {isDropBarOpen && (
          <form
            onSubmit={handleManualDrop}
            className="bg-white/90 dark:bg-[#131414]/90 border border-[#8E4128]/30 rounded-3xl p-4 shadow-sm space-y-3 animate-in fade-in duration-150"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-900 dark:text-[#F5F3EF] flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#8E4128]" />
                Drop a Signal into Radar
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Deposits directly into your pipeline
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                required
                value={quickTitle}
                onChange={(e) => setQuickTitle(e.target.value)}
                placeholder="Hook or core idea (e.g. Why high agency founders ignore consensus)..."
                className="sm:col-span-6 bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none focus:border-[#8E4128]"
              />
              <select
                value={quickSource}
                onChange={(e) => setQuickSource(e.target.value)}
                className="sm:col-span-3 bg-black/[0.02] dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] rounded-xl px-3 py-2 text-xs text-zinc-900 dark:text-white outline-none"
              >
                <option value="Threads">Threads</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="Instagram">Instagram</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Substack">Substack</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-3 px-4 py-2 text-xs font-bold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Save to Radar</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* PILLAR 1: MONITORED ACCOUNTS WATCHLIST SHELF (5-6 Slots) */}
        {/* ======================================================== */}
        <section>
          <WatchlistShelf />
        </section>

        {/* ======================================================== */}
        {/* PILLAR 2: WEEKLY OUTLIERS FEED (7-DAY BREAKOUT ANOMALIES)*/}
        {/* ======================================================== */}
        <section className="space-y-4">
          {/* Section Sub-Header & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                  Outliers of the Week
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border border-[#8E4128]/30 font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-current" />
                  Up to {maxOutlierMultiple}x Baseline
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-[#8A8680]">
                Posts from the past 7 days that dramatically outperformed the creator&apos;s weekly median.
              </p>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Platform Selector Tabs */}
              <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-2xs overflow-x-auto">
                {(
                  [
                    { id: "all", label: "All Platforms" },
                    { id: "threads", label: "Threads" },
                    { id: "x", label: "𝕏" },
                    { id: "instagram", label: "Instagram" },
                    { id: "linkedin", label: "LinkedIn" },
                  ] as { id: PlatformFilter; label: string }[]
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPlatformFilter(tab.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                      platformFilter === tab.id
                        ? "bg-[#8E4128] text-white shadow-xs"
                        : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Sort Mode Dropdown */}
              <select
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value as SortMode)}
                className="bg-white/80 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl px-3 py-1.5 text-xs font-medium text-zinc-800 dark:text-[#F5F3EF] outline-none cursor-pointer"
              >
                <option value="highest_multiple">Sort: Highest Outlier Multiple</option>
                <option value="most_recent">Sort: Most Recent (Past 7 Days)</option>
              </select>

              {/* Search input */}
              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hooks or authors..."
                  className="w-full bg-white/80 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl pl-8 pr-3 py-1.5 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Outliers Cards Grid */}
          {filteredOutliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOutliers.map((outlier) => (
                <WeeklyOutlierCard
                  key={outlier.id}
                  outlier={outlier}
                  onReword={handleOpenReword}
                  onDirectPromote={handleDirectPromote}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/60 dark:bg-[#131414]/60 border border-dashed border-black/[0.12] dark:border-white/[0.12] rounded-3xl p-12 text-center space-y-2">
              <Flame className="w-6 h-6 text-zinc-400 mx-auto" />
              <div className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                No weekly outliers match this filter
              </div>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Try selecting &ldquo;All Platforms&rdquo; or adjusting your search query.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* ======================================================== */}
      {/* PILLAR 3: REWORD FOR CLIENT SLIDE-OVER DRAWER           */}
      {/* ======================================================== */}
      <RewordDrawer
        outlier={selectedOutlier}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onPushedToBoard={handlePushedFromDrawer}
      />
    </div>
  );
}
