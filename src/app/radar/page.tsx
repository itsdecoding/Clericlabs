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
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { RadarSignal } from "@/data/mockData";

type SignalFilter = "All" | "High" | "Viral Hook" | "Competitor Watch" | "Trend / News";

export default function RadarPage() {
  const { signals, addSignal, deleteSignal, promoteSignalToCard } = useContent();

  const [activeFilter, setActiveFilter] = useState<SignalFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Quick Capture State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickSource, setQuickSource] = useState("X / Twitter");
  const [quickType, setQuickType] = useState<RadarSignal["signalType"]>("Viral Hook");
  const [quickConviction, setQuickConviction] = useState<"High" | "Medium" | "Seed">("High");
  const [quickNotes, setQuickNotes] = useState("");
  const [quickTags, setQuickTags] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Success toast state
  const [promotedMessage, setPromotedMessage] = useState<string | null>(null);

  const handleCaptureSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickTitle.trim()) {
      setIsExpanded(true);
      inputRef.current?.focus();
      return;
    }

    addSignal({
      title: quickTitle.trim(),
      source: quickSource,
      signalType: quickType,
      conviction: quickConviction,
      notes: quickNotes.trim() || undefined,
      tags: quickTags.trim() || undefined,
    });

    setQuickTitle("");
    setQuickNotes("");
    setQuickTags("");
    setIsExpanded(false);
  };

  const handlePromote = (signalId: string, title: string) => {
    promoteSignalToCard(signalId, "IG Carousel");
    setPromotedMessage(`Promoted "${title.slice(0, 32)}..." to Content Board!`);
    setTimeout(() => setPromotedMessage(null), 4000);
  };

  // Filtered signals
  const filteredSignals = useMemo(() => {
    return (signals || []).filter((s) => {
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = s.title.toLowerCase().includes(q);
        const matchNotes = (s.notes || "").toLowerCase().includes(q);
        const matchTags = (s.tags || "").toLowerCase().includes(q);
        if (!matchTitle && !matchNotes && !matchTags) return false;
      }

      // Filter tabs
      if (activeFilter === "High") return s.conviction === "High";
      if (activeFilter === "Viral Hook") return s.signalType === "Viral Hook";
      if (activeFilter === "Competitor Watch") return s.signalType === "Competitor Watch";
      if (activeFilter === "Trend / News") return s.signalType === "Trend / News";

      return true;
    });
  }, [signals, activeFilter, searchQuery]);

  const activeCount = useMemo(
    () => (signals || []).filter((s) => !s.isPromoted).length,
    [signals]
  );
  const highConvictionCount = useMemo(
    () => (signals || []).filter((s) => s.conviction === "High" && !s.isPromoted).length,
    [signals]
  );

  const getConvictionBadge = (conviction: "High" | "Medium" | "Seed") => {
    switch (conviction) {
      case "High":
        return "bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border-[#8E4128]/30 font-bold";
      case "Medium":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "Seed":
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#FBFBFA] dark:bg-[#0E0E0E] text-[#111110] dark:text-[#F5F3EF]">
      {/* Top Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 space-y-6">
        {/* Promotion Toast */}
        {promotedMessage && (
          <div className="bg-[#8E4128] text-white p-3 rounded-2xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center gap-2.5 text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>{promotedMessage}</span>
            </div>
            <Link
              href="/content"
              className="text-xs underline font-mono font-bold hover:text-white/80"
            >
              View on Content Board →
            </Link>
          </div>
        )}

        {/* Sub-Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-[#8E4128] dark:text-[#C85D3A]">
                IDEA DISCOVERY & VIRAL SCOUTING
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-500 dark:text-[#8A8680] font-mono">
                {activeCount} active signals • {highConvictionCount} high conviction
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111110] dark:text-[#F5F3EF] flex items-center gap-3">
              Radar
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#8E4128]/10 text-[#8E4128] dark:text-[#C85D3A] border border-[#8E4128]/20 font-mono flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#8E4128] animate-pulse" />
                Live Scouting Engine
              </span>
            </h1>
          </div>

          {/* Quick Filter Tabs & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs overflow-x-auto">
              {(
                [
                  { id: "All", label: "All Signals" },
                  { id: "High", label: "🔥 High Conviction" },
                  { id: "Viral Hook", label: "Viral Hooks" },
                  { id: "Competitor Watch", label: "Competitor Watch" },
                  { id: "Trend / News", label: "Trend / News" },
                ] as { id: SignalFilter; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === tab.id
                      ? "bg-[#8E4128] text-white shadow-xs"
                      : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search signals..."
                className="w-full bg-white/80 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl pl-8 pr-3 py-1.5 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
              />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* QUICK CAPTURE: DROP INTO RADAR                          */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-4 space-y-3 focus-within:border-[#8E4128]/50 transition-all">
          <form onSubmit={handleCaptureSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5 text-[#8E4128] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={quickTitle}
                onChange={(e) => {
                  setQuickTitle(e.target.value);
                  if (!isExpanded) setIsExpanded(true);
                }}
                onFocus={() => setIsExpanded(true)}
                placeholder="Drop a new signal into Radar... (e.g. 7 cognitive biases behind irrational founder decisions)"
                className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-[#F5F3EF] outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium"
              />

              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-95 rounded-full transition-all cursor-pointer shadow-xs shrink-0 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Drop into Radar</span>
              </button>
            </div>

            {/* Expanded Options */}
            {isExpanded && (
              <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Source */}
                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-500 uppercase mb-1">
                      Signal Source
                    </label>
                    <select
                      value={quickSource}
                      onChange={(e) => setQuickSource(e.target.value)}
                      className="w-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                    >
                      <option value="X / Twitter">X / Twitter</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Substack">Substack</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Competitor">Competitor Watch</option>
                      <option value="Podcast / Book">Podcast / Book</option>
                    </select>
                  </div>

                  {/* Signal Type */}
                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-500 uppercase mb-1">
                      Signal Type
                    </label>
                    <select
                      value={quickType}
                      onChange={(e) => setQuickType(e.target.value as any)}
                      className="w-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                    >
                      <option value="Viral Hook">Viral Hook</option>
                      <option value="Content Angle">Content Angle</option>
                      <option value="Competitor Watch">Competitor Watch</option>
                      <option value="Trend / News">Trend / News</option>
                    </select>
                  </div>

                  {/* Conviction */}
                  <div>
                    <label className="block text-[10.5px] font-mono text-zinc-500 uppercase mb-1">
                      Conviction Level
                    </label>
                    <div className="flex gap-1.5">
                      {(["High", "Medium", "Seed"] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setQuickConviction(c)}
                          className={`flex-1 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            quickConviction === c
                              ? getConvictionBadge(c)
                              : "border-black/5 dark:border-white/10 text-zinc-400"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes & Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    placeholder="Angle notes / key takeaway / why this works..."
                    className="w-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                  />
                  <input
                    type="text"
                    value={quickTags}
                    onChange={(e) => setQuickTags(e.target.value)}
                    placeholder="Tags (e.g. mindset, psychology, systems)..."
                    className="w-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ======================================================== */}
        {/* SIGNALS STREAM GRID                                     */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSignals.length === 0 ? (
            <div className="col-span-full py-20 text-center text-zinc-400 dark:text-zinc-600 font-mono text-xs bg-white/40 dark:bg-white/[0.02] rounded-3xl border border-dashed border-black/10 dark:border-white/10">
              No signals found in Radar. Drop your first idea spark or viral hook above.
            </div>
          ) : (
            filteredSignals.map((signal) => (
              <div
                key={signal.id}
                className={`p-5 rounded-3xl backdrop-blur-xl border transition-all space-y-4 flex flex-col justify-between shadow-xs hover:border-[#8E4128]/40 ${
                  signal.isPromoted
                    ? "bg-white/40 dark:bg-white/[0.02] border-black/[0.04] dark:border-white/[0.06] opacity-75"
                    : "bg-white/80 dark:bg-[#131414]/90 border-black/[0.08] dark:border-white/[0.12]"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Source + Conviction Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                      {signal.source}
                    </span>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getConvictionBadge(
                        signal.conviction
                      )}`}
                    >
                      {signal.conviction} Conviction
                    </span>
                  </div>

                  {/* Title & Core Hook */}
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF] leading-snug">
                    {signal.title}
                  </h3>

                  {/* Notes / Angle Context */}
                  {signal.notes && (
                    <p className="text-xs text-zinc-600 dark:text-[#8A8680] leading-relaxed line-clamp-3 bg-black/[0.02] dark:bg-white/[0.03] p-2.5 rounded-xl border border-black/[0.04] dark:border-white/[0.06]">
                      {signal.notes}
                    </p>
                  )}

                  {/* Tags */}
                  {signal.tags && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {signal.tags.split(",").map((t) => (
                        <span
                          key={t}
                          className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500"
                        >
                          #{t.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions: Promote to Pipeline vs Delete */}
                <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between gap-2">
                  {signal.isPromoted ? (
                    <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Production Pipeline
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlePromote(signal.id, signal.title)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-95 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Promote to Board</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteSignal(signal.id)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete signal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
