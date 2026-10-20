"use client";

import React from "react";
import Link from "next/link";
import {
  Layers,
  Clock,
  CheckCircle2,
  Compass,
  Boxes,
  ArrowRight,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";


export default function HomePage() {
  const { cards, setIsCreateModalOpen } = useContent();

  const continueCreatingItems = cards.filter(
    (c) => c.status === "Scripting" || c.status === "In Editing" || c.status === "For Review"
  ).slice(0, 4);

  const needsReviewItems = cards.filter((c) => c.status === "For Review").slice(0, 4);

  const totalContent = cards.length;
  const activePipeline = cards.filter((c) => c.status !== "Posted" && c.status !== "Dismissed").length;
  const postedCount = cards.filter((c) => c.status === "Posted").length;
  const radarIdeas = cards.filter((c) => c.status === "Idea").length;
  const reviewCount = cards.filter((c) => c.status === "For Review").length;

  const contentTypes = [
    { name: "IG Reel · Standard", icon: "🎬" },
    { name: "IG B-roll · Trial", icon: "🎞️" },
    { name: "IG Carousel", icon: "🎴" },
    { name: "LinkedIn", icon: "💼" },
    { name: "X / Twitter", icon: "𝕏" },
    { name: "YouTube Long", icon: "▶️" },
  ];

  const contentTypeStats = contentTypes.map((t) => ({
    name: t.name,
    icon: t.icon,
    count: cards.filter((c) => c.type.includes(t.name.split(" · ")[0])).length,
  }));

  const statusDefs = [
    { name: "Idea", colorDot: "#9CA3AF", pillBg: "#F3F4F6", pillText: "#4B5563" },
    { name: "Scripting", colorDot: "#60A5FA", pillBg: "#EFF6FF", pillText: "#1D4ED8" },
    { name: "Filming (Approved)", colorDot: "#F472B6", pillBg: "#FDF2F8", pillText: "#BE185D" },
    { name: "In Editing", colorDot: "#FF5A1F", pillBg: "#FFF3EC", pillText: "#D9531E" },
    { name: "For Review", colorDot: "#F59E0B", pillBg: "#FEF9EE", pillText: "#B47D14" },
    { name: "Requires Revision", colorDot: "#EF4444", pillBg: "#FEECEC", pillText: "#DC2626" },
    { name: "Approved", colorDot: "#10B981", pillBg: "#EEF9F1", pillText: "#1E8E3E" },
    { name: "Posted", colorDot: "#059669", pillBg: "#ECFDF5", pillText: "#047857" },
  ];

  const statusStats = statusDefs.map((s) => ({
    ...s,
    count: cards.filter((c) => c.status === s.name).length,
  }));

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-6">
        {/* Hero Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 pb-2">
          <div>
            <span className="block text-[10.5px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-2">
              OVERVIEW
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-[34px] font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
              Make something worth sharing.
            </h1>
            <p className="text-[13px] sm:text-[13.5px] text-gray-500 font-normal mt-1">
              Pick up a draft, clear a review, or start your next piece.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto justify-center bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-[0.98] transition-all text-white font-semibold text-[13.5px] py-2.5 px-5 rounded-xl shadow-[0_2px_8px_rgba(255,90,31,0.25)] flex items-center gap-2 cursor-pointer"
          >
            <span>Create content</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Top 2-Column Row: Continue Creating & Needs Your Attention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Continue creating */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-gray-400" />
                <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                  Continue creating
                </h3>
              </div>
              <Link
                href="/content"
                className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            {continueCreatingItems.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-[13px] text-gray-400">No active in-progress drafts.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="mt-2 text-[12.5px] font-semibold text-[#FF5A1F] hover:underline"
                >
                  + Create content
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {continueCreatingItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/content/${item.id}`}
                    className="block p-3 rounded-xl border border-gray-100/90 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
                  >
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A] group-hover:text-[#FF5A1F] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 bg-[#EEF2FF] text-[#4F46E5]">
                        {item.type}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5 bg-[#FFF3EC] text-[#D9531E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                        {item.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right: Needs your attention */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                    Needs your attention
                  </h3>
                </div>
                <Link
                  href="/content"
                  className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  View all &rarr;
                </Link>
              </div>

              {/* Highlight Review Shortlist Banner */}
              <Link
                href="/content"
                className="block bg-[#FFF5ED] border border-[#FFE7D3] rounded-xl p-3.5 mb-5 hover:bg-[#FFEFE2] transition-colors"
              >
                <div className="text-[13px] font-medium text-gray-900">
                  {reviewCount} items in the review shortlist &rarr;
                </div>
              </Link>

              {/* Deadlines text row */}
              <div className="space-y-1 mb-2">
                <Link
                  href="/content"
                  className="text-[13px] font-medium text-gray-800 hover:text-gray-900 block"
                >
                  0 past editorial deadlines · 0 failed publishing attempts &rarr;
                </Link>
                <p className="text-[11.5px] text-gray-400">
                  Editorial deadlines are separate from confirmed publishing times.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Row (5 Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg text-[#FF5A1F] flex items-center justify-center mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-[24px] sm:text-[26px] font-bold text-[#1A1A1A] leading-tight">
              {totalContent}
            </div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">
              Total Content
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg text-[#FF5A1F] flex items-center justify-center mb-2">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-[24px] sm:text-[26px] font-bold text-[#1A1A1A] leading-tight">
              {activePipeline}
            </div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">
              Active Pipeline
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg text-[#FF5A1F] flex items-center justify-center mb-2">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-[24px] sm:text-[26px] font-bold text-[#1A1A1A] leading-tight">
              {postedCount}
            </div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">
              Posted / Month
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg text-[#FF5A1F] flex items-center justify-center mb-2">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-[24px] sm:text-[26px] font-bold text-[#1A1A1A] leading-tight">
              {radarIdeas}
            </div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">
              Radar Ideas
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
            <div className="w-6 h-6 rounded-lg text-[#FF5A1F] flex items-center justify-center mb-2">
              <Boxes className="w-4 h-4" />
            </div>
            <div className="text-[24px] sm:text-[26px] font-bold text-[#1A1A1A] leading-tight">
              {totalContent}
            </div>
            <div className="text-[11px] font-medium text-gray-400 mt-0.5">
              Assets
            </div>
          </div>
        </div>

        {/* Bottom Section 1: By Content Type & By Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* By Content Type (2 cols span) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <h3 className="text-[14px] font-bold text-[#1A1A1A]">
              By Content Type
            </h3>

            <div className="space-y-4 pt-1">
              {contentTypeStats.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className="text-[13px]">{item.icon}</span>
                      {item.name}
                    </span>
                    <span className="font-bold text-gray-900">{item.count}</span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FF5A1F] rounded-full transition-all duration-500"
                      style={{
                        width: `${totalContent > 0 ? (item.count / totalContent) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Status (1 col span) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
            <h3 className="text-[14px] font-bold text-[#1A1A1A]">
              By Status
            </h3>

            <div className="space-y-2 pt-1">
              {statusStats.map((status) => (
                <div
                  key={status.name}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-[11.5px] font-medium px-2.5 py-0.5 rounded-md flex items-center gap-1.5"
                    style={{ backgroundColor: status.pillBg, color: status.pillText }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: status.colorDot }}
                    />
                    {status.name}
                  </span>
                  <span className="text-[13px] font-bold text-gray-800">
                    {status.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section 2: Needs Review & Upcoming editorial deadlines */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Needs Review */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                  Needs Review
                </h3>
              </div>
              <Link
                href="/content"
                className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            {needsReviewItems.length === 0 ? (
              <div className="py-8 text-center text-[13px] text-gray-400">
                No items pending review.
              </div>
            ) : (
              <div className="space-y-2.5">
                {needsReviewItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/content/${item.id}`}
                    className="block p-3 rounded-xl border border-gray-100/90 hover:border-gray-200 hover:bg-gray-50/50 transition-all group"
                  >
                    <h4 className="text-[13.5px] font-bold text-[#1A1A1A] group-hover:text-[#FF5A1F] transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1 bg-[#EEF2FF] text-[#4F46E5]">
                        {item.type}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md flex items-center gap-1.5 bg-[#FFF3EC] text-[#D9531E]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A1F]" />
                        {item.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming editorial deadlines */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <h3 className="text-[14px] font-bold text-[#1A1A1A]">
                  Upcoming editorial deadlines
                </h3>
              </div>
              <Link
                href="/content"
                className="text-[12px] font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-center py-12 text-center">
              <p className="text-[13px] text-gray-400 font-normal">
                No scheduled content yet.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
