"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Search,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { WeeklyOutlier, RadarPlatform } from "@/data/mockData";
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
  } = useContent();

  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>("all");
  const [sortMode, setSortMode] = useState<SortMode>("highest_multiple");
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer state for "Reword for Client"
  const [selectedOutlier, setSelectedOutlier] = useState<WeeklyOutlier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenReword = (outlier: WeeklyOutlier) => {
    setSelectedOutlier(outlier);
    setIsDrawerOpen(true);
  };

  const handleDirectPromote = (outlier: WeeklyOutlier) => {
    pushOutlierToBoard(outlier.id);
    setToastMessage(`Pushed "${outlier.originalHook.slice(0, 36)}..." to Content Board`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handlePushedFromDrawer = (cardTitle: string) => {
    setToastMessage(`Pushed "${cardTitle.slice(0, 36)}..." to Content Board`);
    setTimeout(() => setToastMessage(null), 4000);
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

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#0E0E0E] text-zinc-100">
      {/* Top Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 space-y-6">
        {/* Promotion Toast */}
        {toastMessage && (
          <div className="bg-[#8E4128] text-white p-3 rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <Link
              href="/content"
              className="text-xs underline font-medium hover:text-white/80 transition-colors"
            >
              View on Content Board →
            </Link>
          </div>
        )}

        {/* Clean, Non-bloated Page Title */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
            Radar
          </h1>
          <p className="text-xs text-zinc-400">
            {watchlist.length}/6 Monitored Accounts • {outliers.length} Weekly Outliers
          </p>
        </div>

        {/* Pillar 1: Monitored Accounts Shelf */}
        <section>
          <WatchlistShelf />
        </section>

        {/* Pillar 2: Weekly Outliers Grid */}
        <section className="space-y-3.5">
          {/* Controls Bar without redundant sentences */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <h2 className="text-sm font-semibold text-zinc-100">
              Weekly Outliers
            </h2>

            {/* Filter Tabs, Sort, and Search */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Platform Selector Tabs */}
              <div className="flex items-center bg-[#131414] p-1 rounded-xl border border-white/[0.08]">
                {(
                  [
                    { id: "all", label: "All" },
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
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      platformFilter === tab.id
                        ? "bg-[#8E4128] text-white"
                        : "text-zinc-400 hover:text-zinc-200"
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
                className="bg-[#131414] border border-white/[0.08] rounded-xl px-2.5 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
              >
                <option value="highest_multiple">Highest Multiple</option>
                <option value="most_recent">Most Recent</option>
              </select>

              {/* Search Bar */}
              <div className="relative min-w-[160px]">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search outliers..."
                  className="w-full bg-[#131414] border border-white/[0.08] rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 outline-none focus:border-[#8E4128]"
                />
              </div>
            </div>
          </div>

          {/* Outliers Cards Grid */}
          {filteredOutliers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
            <div className="bg-[#131414] border border-dashed border-white/[0.08] rounded-2xl p-10 text-center space-y-1">
              <div className="text-xs font-medium text-zinc-400">
                No weekly outliers match this filter
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Pillar 3: Reword for Client Studio Drawer */}
      <RewordDrawer
        outlier={selectedOutlier}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onPushedToBoard={handlePushedFromDrawer}
      />
    </div>
  );
}
