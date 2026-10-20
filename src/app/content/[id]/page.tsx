"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Shuffle,
  MoreHorizontal,
  Save,
  ChevronDown,
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  Layers,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { ContentCard } from "@/data/mockData";

export default function ContentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { cards, getCardById, updateCard } = useContent();

  const cardId = (params?.id as string) || "";
  const [card, setCard] = useState<ContentCard | null>(() => {
    if (!cardId) return null;
    return getCardById(cardId) || cards.find((c) => c.id === cardId || c.id === decodeURIComponent(cardId)) || null;
  });
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSavedMessage, setIsSavedMessage] = useState(false);

  useEffect(() => {
    if (!cardId) return;
    const found =
      getCardById(cardId) ||
      cards.find((c) => c.id === cardId || c.id === decodeURIComponent(cardId));
    if (found) {
      setCard(found);
    }
  }, [cardId, cards, getCardById]);

  if (!card) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-6 h-6 border-2 border-[#FF5A1F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading card...</p>
          <Link
            href="/content"
            className="text-[#FF5A1F] font-semibold text-xs hover:underline block pt-2"
          >
            &larr; Back to Board
          </Link>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateCard(card);
    setIsSavedMessage(true);
    setTimeout(() => setIsSavedMessage(false), 2000);
  };

  return (
    <div className="min-h-screen pb-16">
      <Header />

      <main className="px-4 sm:px-6 md:px-8 max-w-[1440px] mx-auto space-y-4 sm:space-y-5">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Left Actions: Back button + Saved */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/content"
              className="bg-white hover:bg-gray-50 active:scale-95 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12.5px] font-medium text-gray-700 flex items-center gap-1.5 shadow-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>

            <span className="text-[12px] font-medium text-gray-400">
              {isSavedMessage ? (
                <span className="text-emerald-600 font-semibold animate-pulse">✓ Saved</span>
              ) : (
                "Saved"
              )}
            </span>

            <button className="hidden sm:inline-flex bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1 text-[12px] font-medium text-gray-700 shadow-sm transition-all">
              Version history
            </button>
          </div>

          {/* Right Actions: Create, Repurpose, Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                alert("AI Copilot activated: Generating creative angle...");
              }}
              className="hidden sm:flex bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 items-center gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
              <span>Create</span>
            </button>

            <button
              onClick={() => {
                alert("Repurposing draft across Reels, Carousels, and Threads!");
              }}
              className="hidden sm:flex bg-white hover:bg-gray-50 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] font-semibold text-gray-700 items-center gap-1.5 shadow-sm transition-all"
            >
              <Shuffle className="w-3.5 h-3.5 text-gray-500" />
              <span>Repurpose</span>
            </button>

            <button
              onClick={handleSave}
              className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-95 text-white rounded-xl px-4 py-1.5 text-[13px] font-semibold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(255,90,31,0.3)] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* 2-Column Main Layout: Main Form (Left) & Sidebar (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* LEFT 2-COLUMNS: MAIN EDIT FORM */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* 1. Header Card: Title & Meta Dropdowns */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm space-y-4">
              <input
                type="text"
                value={card.title}
                onChange={(e) => setCard({ ...card, title: e.target.value })}
                className="w-full text-xl sm:text-[26px] font-extrabold text-[#1A1A1A] outline-none border-b border-transparent focus:border-gray-200 pb-1 tracking-tight"
                placeholder="Title..."
              />

              {/* Meta dropdowns row */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Content Type */}
                <div className="relative">
                  <select
                    value={card.type}
                    onChange={(e) => setCard({ ...card, type: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="IG Carousel">🎴 IG Carousel</option>
                    <option value="IG Reel · Standard">🎬 IG Reel · Standard</option>
                    <option value="IG B-roll · Trial">🎞️ IG B-roll · Trial</option>
                    <option value="LinkedIn">💼 LinkedIn</option>
                    <option value="X / Twitter">𝕏 X / Twitter</option>
                    <option value="YouTube Long">▶️ YouTube Long</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Status */}
                <div className="relative">
                  <select
                    value={card.status}
                    onChange={(e) => setCard({ ...card, status: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Scripting">Scripting</option>
                    <option value="Filming (Approved)">Filming (Approved)</option>
                    <option value="In Editing">In Editing</option>
                    <option value="For Review">For Review</option>
                    <option value="Requires Revision">Requires Revision</option>
                    <option value="Approved">Approved</option>
                    <option value="Posted">Posted</option>
                    <option value="Dismissed">Dismissed</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Priority */}
                <div className="relative">
                  <select
                    value={card.priority || "Medium"}
                    onChange={(e) => setCard({ ...card, priority: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Category dropdown */}
              <div className="pt-1">
                <div className="relative inline-block">
                  <select
                    value={card.category || "AI News"}
                    onChange={(e) => setCard({ ...card, category: e.target.value })}
                    className="appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-100 cursor-pointer shadow-xs"
                  >
                    <option value="AI News">AI News</option>
                    <option value="Sales/Conversion">Sales/Conversion</option>
                    <option value="Mindset & Philosophy">Mindset & Philosophy</option>
                    <option value="Productivity Systems">Productivity Systems</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 2. Copy Card: SLIDE-BY-SLIDE COPY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-3">
              <div>
                <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                  COPY
                </span>
                <span className="block text-[10px] font-mono font-bold text-gray-400 uppercase tracking-widest">
                  SLIDE-BY-SLIDE COPY
                </span>
              </div>

              <textarea
                rows={10}
                value={card.slideCopy || ""}
                onChange={(e) => setCard({ ...card, slideCopy: e.target.value })}
                placeholder="Slide 1 (cover): ...&#10;Slide 2: ..."
                className="w-full bg-transparent border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-800 outline-none focus:border-gray-300 font-mono leading-relaxed"
              />
            </div>

            {/* 3. Details Card: Number of slides, Caption, Hashtags */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                DETAILS
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Number of Slides
                  </label>
                  <input
                    type="number"
                    value={card.slidesCount || 8}
                    onChange={(e) =>
                      setCard({ ...card, slidesCount: parseInt(e.target.value) || 0 })
                    }
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[13px] text-gray-800 outline-none focus:border-gray-300"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Hashtags
                  </label>
                  <input
                    type="text"
                    value={card.hashtags || ""}
                    onChange={(e) => setCard({ ...card, hashtags: e.target.value })}
                    placeholder="#AI #Automation #Productivity"
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[13px] text-gray-800 outline-none focus:border-gray-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={card.caption || ""}
                  onChange={(e) => setCard({ ...card, caption: e.target.value })}
                  placeholder="Post caption..."
                  className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl p-3 text-[13px] text-gray-800 outline-none focus:border-gray-300"
                />
              </div>
            </div>

            {/* 4. Assets Card: URLs Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
              <span className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-none">
                ASSETS
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Brief / Source Doc
                  </label>
                  <input
                    type="url"
                    value={card.briefUrl || ""}
                    onChange={(e) => setCard({ ...card, briefUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Final Files
                  </label>
                  <input
                    type="url"
                    value={card.finalFilesUrl || ""}
                    onChange={(e) => setCard({ ...card, finalFilesUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Cover Slide Image
                  </label>
                  <input
                    type="url"
                    value={card.coverImageUrl || ""}
                    onChange={(e) => setCard({ ...card, coverImageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                    Supporting Assets
                  </label>
                  <input
                    type="url"
                    value={card.supportingAssetsUrl || ""}
                    onChange={(e) =>
                      setCard({ ...card, supportingAssetsUrl: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-gray-50/70 border border-gray-200/80 rounded-xl px-3 py-1.5 text-[12px] text-gray-800 outline-none focus:border-gray-300 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1-COLUMN: SIDEBAR PANELS */}
          <div className="space-y-5">
            {/* Panel 1: ASSIGNED TEAM */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                ASSIGNED TEAM
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    OWNER
                  </label>
                  <div className="relative">
                    <select
                      value={card.owner || "Unassigned"}
                      onChange={(e) => setCard({ ...card, owner: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Muzammil">Muzammil</option>
                      <option value="Nick">Nick</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    PROJECT MANAGER / REVIEWER
                  </label>
                  <div className="relative">
                    <select
                      value={card.pm || "Unassigned"}
                      onChange={(e) => setCard({ ...card, pm: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Muzammil">Muzammil</option>
                      <option value="Reviewer 1">Reviewer 1</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    CAROUSEL DESIGNER
                  </label>
                  <div className="relative">
                    <select
                      value={card.designer || "Unassigned"}
                      onChange={(e) => setCard({ ...card, designer: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Designer A">Designer A</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    CONTENT / WRITER
                  </label>
                  <div className="relative">
                    <select
                      value={card.writer || "Unassigned"}
                      onChange={(e) => setCard({ ...card, writer: e.target.value })}
                      className="w-full appearance-none bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    >
                      <option value="Unassigned">Unassigned</option>
                      <option value="Writer 1">Writer 1</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: SCHEDULE */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                SCHEDULE
              </span>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    EDITORIAL DUE DATE
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd / mm / yyyy"
                      value={card.dueDate || ""}
                      onChange={(e) => setCard({ ...card, dueDate: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-8 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    />
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    POSTED AT
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="dd / mm / yyyy"
                      value={card.postedAt || ""}
                      onChange={(e) => setCard({ ...card, postedAt: e.target.value })}
                      className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl pl-3 pr-8 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                    />
                    <CalendarIcon className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    TAGS
                  </label>
                  <input
                    type="text"
                    placeholder="ai, automation"
                    value={card.tags || ""}
                    onChange={(e) => setCard({ ...card, tags: e.target.value })}
                    className="w-full bg-gray-50/80 border border-gray-200/80 rounded-xl px-3 py-2 text-[12.5px] font-medium text-gray-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Panel 3: METRICS */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                METRICS
              </span>
              <p className="text-[12px] text-gray-400 py-3">
                No post-publish metrics yet...
              </p>
            </div>

            {/* Panel 4: ACTIVITY */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-3">
              <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest">
                ACTIVITY
              </span>
              <div className="space-y-2.5 pt-1">
                {(card.activityLog || [
                  { text: "idea -> dismissed (via Claude MCP)", time: "Yesterday at 4:12 PM" },
                  { text: "Created as carousel", time: "Oct 6, 2026" },
                ]).map((act, idx) => (
                  <div key={idx} className="text-[12px] space-y-0.5">
                    <p className="text-gray-800 font-medium">{act.text}</p>
                    <span className="text-[11px] text-gray-400">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
