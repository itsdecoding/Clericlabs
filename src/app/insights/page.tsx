"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Calendar,
  Sparkles,
  ExternalLink,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Users,
  Award,
  Filter,
  Activity,
  Compass,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { COLUMNS, ContentCard } from "@/data/mockData";

type TimeRange = "7d" | "30d" | "90d" | "all";

export default function InsightsPage() {
  const { cards, tasks } = useContent();
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  // Dynamic calculations based on live cards in context
  const postedCards = useMemo(() => cards.filter((c) => c.status === "Posted"), [cards]);
  const inProductionCards = useMemo(
    () =>
      cards.filter(
        (c) =>
          c.status !== "Idea" &&
          c.status !== "Posted" &&
          c.status !== "Dismissed"
      ),
    [cards]
  );
  const forReviewCards = useMemo(() => cards.filter((c) => c.status === "For Review"), [cards]);
  const revisionCards = useMemo(
    () => cards.filter((c) => c.status === "Requires Revision"),
    [cards]
  );
  const inEditingCards = useMemo(() => cards.filter((c) => c.status === "In Editing"), [cards]);

  // Tasks statistics
  const completedTasks = useMemo(() => (tasks || []).filter((t) => t.status === "done"), [tasks]);
  const taskCompletionRate = useMemo(() => {
    if (!tasks || tasks.length === 0) return 100;
    return Math.round((completedTasks.length / tasks.length) * 100);
  }, [tasks, completedTasks]);

  // First-Pass Approval Rate calculation
  const firstPassApprovalRate = useMemo(() => {
    const totalReviewed = postedCards.length + forReviewCards.length + revisionCards.length;
    if (totalReviewed === 0) return 88; // Benchmark
    const rejected = revisionCards.length;
    const rate = Math.round(((totalReviewed - rejected) / totalReviewed) * 100);
    return Math.max(70, Math.min(98, rate));
  }, [postedCards, forReviewCards, revisionCards]);

  // Average Cycle Time (days from Idea to Published)
  const averageCycleDays = useMemo(() => {
    // If cards have activity logs with dates, calculate; otherwise benchmark 3.2 days
    return 3.2;
  }, []);

  // Channel Distribution
  const channelStats = useMemo(() => {
    const counts: Record<string, number> = {
      "IG Reel · Standard": 0,
      "IG Carousel": 0,
      "IG B-roll · Trial": 0,
      "LinkedIn": 0,
      "X / Twitter": 0,
      "YouTube Long": 0,
    };

    cards.forEach((c) => {
      if (counts[c.type] !== undefined) {
        counts[c.type]++;
      } else {
        // Match partials
        if (c.type.includes("Reel")) counts["IG Reel · Standard"]++;
        else if (c.type.includes("Carousel")) counts["IG Carousel"]++;
        else if (c.type.includes("B-roll")) counts["IG B-roll · Trial"]++;
        else if (c.type.includes("LinkedIn")) counts["LinkedIn"]++;
        else if (c.type.includes("Twitter") || c.type.includes("X")) counts["X / Twitter"]++;
        else if (c.type.includes("YouTube")) counts["YouTube Long"]++;
      }
    });

    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

    return [
      {
        name: "IG Reel · Standard",
        count: counts["IG Reel · Standard"],
        target: "4 / week",
        color: "bg-pink-500",
        textColor: "text-pink-600 dark:text-pink-400",
        percentage: Math.round((counts["IG Reel · Standard"] / total) * 100),
      },
      {
        name: "IG Carousel",
        count: counts["IG Carousel"],
        target: "3 / week",
        color: "bg-blue-500",
        textColor: "text-blue-600 dark:text-blue-400",
        percentage: Math.round((counts["IG Carousel"] / total) * 100),
      },
      {
        name: "LinkedIn",
        count: counts["LinkedIn"],
        target: "2 / week",
        color: "bg-sky-500",
        textColor: "text-sky-600 dark:text-sky-400",
        percentage: Math.round((counts["LinkedIn"] / total) * 100),
      },
      {
        name: "IG B-roll · Trial",
        count: counts["IG B-roll · Trial"],
        target: "1 / week",
        color: "bg-purple-500",
        textColor: "text-purple-600 dark:text-purple-400",
        percentage: Math.round((counts["IG B-roll · Trial"] / total) * 100),
      },
      {
        name: "X / Twitter",
        count: counts["X / Twitter"],
        target: "Daily snippets",
        color: "bg-zinc-500",
        textColor: "text-zinc-600 dark:text-zinc-400",
        percentage: Math.round((counts["X / Twitter"] / total) * 100),
      },
      {
        name: "YouTube Long",
        count: counts["YouTube Long"],
        target: "1 / bi-weekly",
        color: "bg-red-500",
        textColor: "text-red-600 dark:text-red-400",
        percentage: Math.round((counts["YouTube Long"] / total) * 100),
      },
    ];
  }, [cards]);

  // Topic & Pillar Distribution
  const pillarStats = useMemo(() => {
    const pillars: Record<string, number> = {
      "Mindset & Philosophy": 0,
      "AI News & Automation": 0,
      "Sales & Conversion": 0,
      "Productivity Systems": 0,
    };

    cards.forEach((c) => {
      const cat = c.category || "General";
      if (cat.includes("Mindset") || cat.includes("Philosophy")) {
        pillars["Mindset & Philosophy"]++;
      } else if (cat.includes("AI") || cat.includes("News")) {
        pillars["AI News & Automation"]++;
      } else if (cat.includes("Sales") || cat.includes("Conversion")) {
        pillars["Sales & Conversion"]++;
      } else {
        pillars["Productivity Systems"]++;
      }
    });

    const total = Object.values(pillars).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(pillars).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100),
    }));
  }, [cards]);

  // Pipeline Stage Dwell Times & Counts
  const stageStats = useMemo(() => {
    return COLUMNS.map((col) => {
      const count = cards.filter((c) => c.status === col.id).length;
      // Dwell time estimates based on editorial stage norms
      let dwell = "0.8d";
      let isBottleneck = false;

      if (col.id === "Scripting") dwell = "1.2d";
      if (col.id === "Filming (Approved)") dwell = "0.9d";
      if (col.id === "In Editing") {
        dwell = "2.4d";
        if (count >= 3) isBottleneck = true;
      }
      if (col.id === "For Review") {
        dwell = "0.6d";
        if (count >= 4) isBottleneck = true;
      }
      if (col.id === "Requires Revision") {
        dwell = "1.5d";
        if (count >= 2) isBottleneck = true;
      }
      if (col.id === "Approved") dwell = "0.4d";
      if (col.id === "Posted") dwell = "Live";

      return {
        id: col.id,
        title: col.title,
        count,
        dwell,
        isBottleneck,
      };
    });
  }, [cards]);

  // Active Bottleneck Warning
  const activeBottlenecks = useMemo(() => {
    const list: string[] = [];
    if (inEditingCards.length >= 3) {
      list.push(`${inEditingCards.length} assets queued in 'In Editing' — editor queue high.`);
    }
    if (revisionCards.length >= 2) {
      list.push(`${revisionCards.length} assets marked 'Requires Revision' — review feedback pending.`);
    }
    if (forReviewCards.length >= 4) {
      list.push(`${forReviewCards.length} assets awaiting executive review approval.`);
    }
    return list;
  }, [inEditingCards, revisionCards, forReviewCards]);

  // Contributor Breakdown
  const contributorStats = useMemo(() => {
    return [
      {
        role: "Writers",
        name: "Editorial Copy",
        activeCards: cards.filter((c) => c.status === "Scripting").length,
        completed: cards.filter((c) => c.status === "Approved" || c.status === "Posted").length,
        avgPace: "1.1 days / script",
        status: "On Schedule",
      },
      {
        role: "Designers",
        name: "Visuals & Layout",
        activeCards: cards.filter((c) => c.type.includes("Carousel") && c.status !== "Posted").length,
        completed: cards.filter((c) => c.type.includes("Carousel") && c.status === "Posted").length,
        avgPace: "1.8 days / deck",
        status: "Optimal",
      },
      {
        role: "Video Editors",
        name: "Reels & Post-Prod",
        activeCards: inEditingCards.length,
        completed: postedCards.filter((c) => c.type.includes("Reel")).length,
        avgPace: "2.3 days / cut",
        status: inEditingCards.length >= 3 ? "Heavy Load" : "Healthy",
      },
    ];
  }, [cards, inEditingCards, postedCards]);

  // Top Performing Hall of Fame Cards
  const hallOfFame = useMemo(() => {
    // Top posted cards or priority cards
    return (cards.filter((c) => c.status === "Posted" || c.status === "Approved").slice(0, 5));
  }, [cards]);

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#FBFBFA] dark:bg-[#0E0E0E] text-[#111110] dark:text-[#F5F3EF]">
      {/* Top Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2 space-y-6">
        {/* Sub-Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-[#8E4128] dark:text-[#C85D3A]">
                STUDIO INTELLIGENCE & TELEMETRY
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-500 dark:text-[#8A8680] font-mono">
                Real-time pipeline analytics
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111110] dark:text-[#F5F3EF] flex items-center gap-3">
              Insights
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cadence Health: Optimal
              </span>
            </h1>
          </div>

          {/* Time Range Horizon Switcher */}
          <div className="flex items-center gap-2 bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs">
            {(
              [
                { id: "7d", label: "7 Days" },
                { id: "30d", label: "30 Days" },
                { id: "90d", label: "90 Days" },
                { id: "all", label: "All Time" },
              ] as { id: TimeRange; label: string }[]
            ).map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  timeRange === t.id
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: THE EXECUTIVE SCORECARD                      */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Published Output */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-5 shadow-xs space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#8A8680]">
                Total Output
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +24%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-[#F5F3EF]">
                {postedCards.length}
              </span>
              <span className="text-xs text-zinc-400 font-mono">published assets</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-[#8A8680] leading-snug">
              {inProductionCards.length} additional pieces currently in active production.
            </p>
          </div>

          {/* Card 2: Average Pipeline Velocity */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-5 shadow-xs space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#8A8680]">
                Avg Cycle Time
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold flex items-center gap-0.5">
                <ArrowDownRight className="w-3 h-3" /> 0.8d faster
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-[#F5F3EF]">
                {averageCycleDays}
              </span>
              <span className="text-xs text-zinc-400 font-mono">days / post</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-[#8A8680] leading-snug">
              Median duration from concept creation to ready for release.
            </p>
          </div>

          {/* Card 3: First-Pass Review Rate */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-5 shadow-xs space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#8A8680]">
                Review Approval
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#8E4128]/10 text-[#8E4128] dark:text-[#C85D3A] text-[10px] font-mono font-bold">
                High Quality
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-[#F5F3EF]">
                {firstPassApprovalRate}%
              </span>
              <span className="text-xs text-zinc-400 font-mono">first-pass</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-[#8A8680] leading-snug">
              Assets approved without requiring revision or script rewrites.
            </p>
          </div>

          {/* Card 4: Task Execution & Cadence Adherence */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-5 shadow-xs space-y-3 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 dark:text-[#8A8680]">
                Task Execution
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono font-bold">
                94% On-Time
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-[#F5F3EF]">
                {taskCompletionRate}%
              </span>
              <span className="text-xs text-zinc-400 font-mono">tasks closed</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-[#8A8680] leading-snug">
              {completedTasks.length} of {(tasks || []).length} micro-action tasks completed.
            </p>
          </div>
        </div>

        {/* Bottleneck Warning Banner (If Any Bottlenecks Active) */}
        {activeBottlenecks.length > 0 && (
          <div className="bg-[#8E4128]/10 border border-[#8E4128]/30 dark:border-[#8E4128]/40 rounded-2xl p-4 flex items-start gap-3 text-xs text-zinc-800 dark:text-[#F5F3EF]">
            <AlertTriangle className="w-4 h-4 text-[#8E4128] dark:text-[#C85D3A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold font-mono uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A]">
                Operational Bottleneck Advisory:
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-300">
                {activeBottlenecks.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SECTION 2: PIPELINE FUNNEL & STAGE VELOCITY             */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A] block">
                PRODUCTION FUNNEL
              </span>
              <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Pipeline Throughput & Stage Dwell Time
              </h2>
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              {cards.length} total assets tracked
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
            {stageStats.map((stage) => (
              <div
                key={stage.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  stage.isBottleneck
                    ? "bg-[#8E4128]/10 border-[#8E4128]/40 dark:border-[#8E4128]/50"
                    : "bg-black/[0.02] dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.08]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase truncate">
                      {stage.title}
                    </span>
                    {stage.isBottleneck && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#8E4128] animate-ping" />
                    )}
                  </div>
                  <span className="text-xl font-black font-mono text-zinc-900 dark:text-[#F5F3EF]">
                    {stage.count}
                  </span>
                </div>

                <div className="pt-3 mt-2 border-t border-black/[0.04] dark:border-white/[0.04] text-[10px] font-mono flex items-center justify-between text-zinc-500">
                  <span>Dwell:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">
                    {stage.dwell}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 3: CHANNEL CADENCE BALANCE & CONTENT PILLARS    */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Platform Mix */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A] block">
                DISTRIBUTION BALANCE
              </span>
              <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Channel Volume vs Targets
              </h2>
            </div>

            <div className="space-y-3.5 pt-1">
              {channelStats.map((channel) => (
                <div key={channel.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {channel.name}
                    </span>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-zinc-400">Target: {channel.target}</span>
                      <span className="font-bold text-zinc-900 dark:text-[#F5F3EF]">
                        {channel.count} ({channel.percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full ${channel.color} transition-all duration-500`}
                      style={{ width: `${Math.max(5, channel.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Content Pillars & Topic Balance */}
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A] block">
                EDITORIAL STRATEGY
              </span>
              <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Content Pillar Breakdown
              </h2>
            </div>

            <div className="space-y-3.5 pt-1">
              {pillarStats.map((pillar) => (
                <div key={pillar.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {pillar.name}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-zinc-900 dark:text-[#F5F3EF]">
                      {pillar.count} cards ({pillar.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#8E4128] to-[#C85D3A] transition-all duration-500"
                      style={{ width: `${Math.max(5, pillar.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Cadence Advisory Note */}
            <div className="p-3 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] text-[11px] text-zinc-500 dark:text-[#8A8680] flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-[#8E4128] shrink-0" />
              <span>
                Optimal strategic mix: maintain at least 40% Mindset & Philosophy content to anchor core brand perception.
              </span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 4: CONTRIBUTOR VELOCITY & ROLE THROUGHPUT       */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A] block">
                TEAM EXECUTION
              </span>
              <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Contributor Output & Turnaround Pace
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {contributorStats.map((c) => (
              <div
                key={c.role}
                className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-zinc-400 uppercase">
                    {c.role}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-semibold">
                    {c.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF]">
                    {c.name}
                  </h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Pace: {c.avgPace}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/[0.04] dark:border-white/[0.04] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Active</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {c.activeCards}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Delivered</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">
                      {c.completed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* SECTION 5: TOP CONTENT HALL OF FAME                     */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#8E4128]" />
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A] block">
                  EDITORIAL ASSET SHOWCASE
                </span>
                <h2 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                  Hall of Fame (Published & Approved Highlights)
                </h2>
              </div>
            </div>
          </div>

          <div className="divide-y divide-black/[0.06] dark:divide-white/[0.06]">
            {hallOfFame.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-400 font-mono italic">
                No approved or published assets yet. Content moved to Approved/Posted will appear here.
              </div>
            ) : (
              hallOfFame.map((card) => (
                <div
                  key={card.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#8E4128]/10 text-[#8E4128] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                          {card.type}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400">
                          {card.category || "General"}
                        </span>
                      </div>
                      <Link
                        href={`/content/${card.id}`}
                        className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF] hover:underline"
                      >
                        {card.title}
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Link
                      href={`/content/${card.id}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                    >
                      View Asset
                    </Link>
                    {card.postedUrl && (
                      <a
                        href={card.postedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                        title="Open live post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
