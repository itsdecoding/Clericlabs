"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Flame,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  ArrowRight,
  Calendar,
  Sparkles,
  ExternalLink,
  Film,
  Compass,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";

export default function HomePage() {
  const { cards, setIsCreateModalOpen, updateCardStatus } = useContent();

  const [currentTime, setCurrentTime] = useState("");
  const [activeTab, setActiveTab] = useState<"priority" | "production" | "calendar" | "trends">("priority");

  useEffect(() => {
    function updateClock() {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
        timeZoneName: "short",
      }).format(now);
      setCurrentTime(formatted);
    }
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  const needsReviewItems = useMemo(
    () => cards.filter((c) => c.status === "For Review" || c.status === "Requires Revision"),
    [cards]
  );

  const inProductionItems = useMemo(
    () => cards.filter((c) => c.status === "Scripting" || c.status === "Filming (Approved)" || c.status === "In Editing"),
    [cards]
  );

  const totalContent = cards.length;
  const activePipeline = cards.filter((c) => c.status !== "Posted" && c.status !== "Dismissed").length;
  const postedCount = cards.filter((c) => c.status === "Posted").length;
  const radarIdeas = cards.filter((c) => c.status === "Idea").length;
  const reviewCount = needsReviewItems.length;

  const contentTypes = [
    { name: "IG Reel · Standard", count: cards.filter((c) => c.type.includes("IG Reel")).length },
    { name: "IG B-roll · Trial", count: cards.filter((c) => c.type.includes("B-roll")).length },
    { name: "IG Carousel", count: cards.filter((c) => c.type.includes("Carousel")).length },
    { name: "LinkedIn", count: cards.filter((c) => c.type.includes("LinkedIn")).length },
    { name: "X / Twitter", count: cards.filter((c) => c.type.includes("Twitter") || c.type.includes("X")).length },
    { name: "YouTube Long", count: cards.filter((c) => c.type.includes("YouTube")).length },
  ];

  const statusDefs = [
    { name: "Idea", colorDot: "#9CA3AF", pillBg: "#F3F4F6", pillText: "#4B5563" },
    { name: "Scripting", colorDot: "#60A5FA", pillBg: "#EFF6FF", pillText: "#1D4ED8" },
    { name: "Filming (Approved)", colorDot: "#F472B6", pillBg: "#FDF2F8", pillText: "#BE185D" },
    { name: "In Editing", colorDot: "#E04F2E", pillBg: "#FFF3EC", pillText: "#C43B1B" },
    { name: "For Review", colorDot: "#F59E0B", pillBg: "#FEF9EE", pillText: "#B47D14" },
    { name: "Requires Revision", colorDot: "#EF4444", pillBg: "#FEECEC", pillText: "#DC2626" },
    { name: "Approved", colorDot: "#10B981", pillBg: "#EEF9F1", pillText: "#1E8E3E" },
    { name: "Posted", colorDot: "#059669", pillBg: "#ECFDF5", pillText: "#047857" },
  ];

  const statusStats = statusDefs.map((s) => ({
    ...s,
    count: cards.filter((c) => c.status === s.name).length,
  }));

  const tabs = [
    {
      id: "priority",
      label: "Priority",
      icon: Flame,
      badge: reviewCount > 0 ? String(reviewCount) : undefined,
    },
    {
      id: "production",
      label: "In Production",
      icon: Film,
      badge: inProductionItems.length > 0 ? String(inProductionItems.length) : undefined,
    },
    {
      id: "calendar",
      label: "Editorial Schedule",
      icon: Calendar,
    },
    {
      id: "trends",
      label: "Pipeline & Trends",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6 pt-2">
        {/* ========================================================================= */}
        {/* 1. COMMAND CENTER HEADER (Agency OS Design System)                       */}
        {/* ========================================================================= */}
        <div className="pb-4 border-b border-[#ECE8E1] pt-1 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#8A8680] block font-mono">
              COMMAND CENTER
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#111110] tracking-tight mt-0.5">
              Dashboard
            </h1>
            <p suppressHydrationWarning className="text-xs font-mono text-[#6E6B66] pt-0.5">
              {currentTime || "Content Production Operations • Clericlabs"}
            </p>
          </div>

          {/* Sub-nav tabs: [Priority 🔥 1] [In Production 🎬] [Schedule] [Trends] */}
          <div className="flex items-center gap-1 p-1 bg-black/5 rounded-2xl border border-[#ECE8E1] overflow-x-auto no-scrollbar w-full md:w-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs transition-all shrink-0 whitespace-nowrap rounded-xl cursor-pointer ${
                    isActive
                      ? "font-bold text-[#111110] bg-white shadow-sm"
                      : "font-medium text-[#6E6B66] hover:text-[#111110]"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-[#8E4128] stroke-[2.2]" : "text-[#8A8680]"
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#FFF3EC] text-[#8E4128] font-bold rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. PIPELINE & EDITORIAL SNAPSHOT (Agency OS Metric Cards)                */}
        {/* ========================================================================= */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.08] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-mono font-bold tracking-wider text-[#8E4128] uppercase">
              PIPELINE & EDITORIAL SNAPSHOT
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
              {activePipeline} in play
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: In Production */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#8A8680] mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  IN PRODUCTION
                </span>
                <Film className="w-3.5 h-3.5 text-[#8E4128]" />
              </div>
              <div className="text-3xl font-black text-[#111110] font-mono leading-none">
                {activePipeline}
              </div>
              <p className="text-[11px] text-[#6E6B66] mt-2 truncate font-medium">
                Active scripts & edits in flight
              </p>
            </div>

            {/* Card 2: Needs Review */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#8A8680] mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  NEEDS REVIEW
                </span>
                <Flame className="w-3.5 h-3.5 text-[#E04F2E]" />
              </div>
              <div className="text-3xl font-black text-[#111110] font-mono leading-none">
                {reviewCount}
              </div>
              <p className="text-[11px] text-[#6E6B66] mt-2 truncate font-medium">
                Pending editorial approval
              </p>
            </div>

            {/* Card 3: Published */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#8A8680] mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  PUBLISHED
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
              </div>
              <div className="text-3xl font-black text-[#111110] font-mono leading-none">
                {postedCount}
              </div>
              <p className="text-[11px] text-[#6E6B66] mt-2 truncate font-medium">
                Total pieces live across channels
              </p>
            </div>

            {/* Card 4: Radar Ideas */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-black/[0.06] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[#8A8680] mb-2">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                  RADAR IDEAS
                </span>
                <Compass className="w-3.5 h-3.5 text-[#8A8680]" />
              </div>
              <div className="text-3xl font-black text-[#111110] font-mono leading-none">
                {radarIdeas}
              </div>
              <p className="text-[11px] text-[#6E6B66] mt-2 truncate font-medium">
                Backlog ready for scripting
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. PRIORITY / ACTION QUEUE (Agency OS Lead Card Style)                   */}
        {/* ========================================================================= */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.08] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#8E4128]" />
              <h3 className="text-sm font-bold text-[#111110]">
                Priority Editorial Queue{" "}
                <span className="text-[#8E4128] font-mono">({reviewCount})</span>
              </h3>
            </div>
            <Link
              href="/content"
              className="text-xs font-semibold text-[#8E4128] hover:text-[#6E2E1A] transition-colors flex items-center gap-1"
            >
              <span>Open Content Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {needsReviewItems.length === 0 ? (
            <div className="py-10 text-center rounded-xl bg-[#FAF8F5] border border-dashed border-black/10">
              <CheckCircle2 className="w-6 h-6 text-[#2E7D32] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#111110]">All editorial reviews clear</p>
              <p className="text-[11px] text-[#8A8680] mt-0.5">
                No drafts are currently blocked waiting for sign-off.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-3 text-xs font-semibold text-[#8E4128] hover:underline cursor-pointer"
              >
                + Create new piece
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {needsReviewItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-white border border-black/[0.08] hover:border-[#8E4128]/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#FAF8F5] text-[#6E6B66] border border-black/5">
                        {item.type}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF9EE] text-[#B47D14] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                        {item.status}
                      </span>
                    </div>
                    <Link
                      href={`/content/${item.id}`}
                      className="text-sm font-bold text-[#111110] group-hover:text-[#8E4128] transition-colors line-clamp-1"
                    >
                      {item.title}
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateCardStatus(item.id, "Approved")}
                      className="px-3 py-1.5 rounded-full bg-[#8E4128] hover:bg-[#6E2E1A] text-white text-xs font-semibold transition-all active:scale-95 cursor-pointer shadow-xs"
                    >
                      Approve
                    </button>
                    <Link
                      href={`/content/${item.id}`}
                      className="px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#111110] text-xs font-semibold border border-black/10 transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 4. BREAKDOWNS: By Channel & By Status                                     */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Channel */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.08] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A8680]">
                Volume By Channel
              </h3>
              <span className="text-xs font-mono text-[#8A8680]">Live count</span>
            </div>
            <div className="divide-y divide-[#ECE8E1]">
              {contentTypes.map((channel) => (
                <div
                  key={channel.name}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-[#FAF8F5] px-2 rounded-lg transition-colors"
                >
                  <span className="font-medium text-[#111110]">{channel.name}</span>
                  <span className="font-mono font-bold text-[#111110]">{channel.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* By Status */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-black/[0.08] p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#8A8680]">
                Production Stage Distribution
              </h3>
              <span className="text-xs font-mono text-[#8A8680]">Workflow</span>
            </div>
            <div className="divide-y divide-[#ECE8E1]">
              {statusStats.map((st) => (
                <div
                  key={st.name}
                  className="py-2.5 flex items-center justify-between text-xs hover:bg-[#FAF8F5] px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: st.colorDot }}
                    />
                    <span className="font-medium text-[#111110]">{st.name}</span>
                  </div>
                  <span className="font-mono font-bold text-[#111110]">{st.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
