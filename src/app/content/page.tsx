"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Plus, ExternalLink, Trash2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { COLUMNS, ContentCard } from "@/data/mockData";

export default function ContentBoardPage() {
  const {
    cards,
    updateCardStatus,
    deleteCard,
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    selectedWriter,
    setSelectedWriter,
    setIsCreateModalOpen,
  } = useContent();

  const [activeColumnTab, setActiveColumnTab] = useState<string>("Radar");
  const [viewMode, setViewMode] = useState<"Board" | "List">("Board");
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);

  // Filter cards based on active filter, search query, and writer
  const filteredCards = cards.filter((card) => {
    // Filter by Platform / Type
    if (activeFilter !== "All" && activeFilter !== "All Types") {
      if (activeFilter === "IG Reel" && !card.type.includes("IG Reel")) return false;
      if (activeFilter === "IG B-roll" && !card.type.includes("IG B-roll")) return false;
      if (activeFilter === "IG Carousel" && !card.type.includes("IG Carousel")) return false;
      if (activeFilter === "LinkedIn" && !card.type.includes("LinkedIn")) return false;
      if (activeFilter === "X / Twitter" && !card.type.includes("X / Twitter") && !card.type.includes("Twitter") && !card.type.includes("X")) return false;
      if (activeFilter === "YouTube Long" && !card.type.includes("YouTube")) return false;
      if (!card.type.toLowerCase().includes(activeFilter.toLowerCase())) return false;
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchCategory = (card.category || "").toLowerCase().includes(q);
      const matchTags = (card.tags || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchTags) return false;
    }

    // Filter by writer
    if (selectedWriter !== "All Writers") {
      if (card.writer !== selectedWriter) return false;
    }

    return true;
  });

  const handleDragStart = (cardId: string) => {
    setDraggedCardId(cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (columnId: string) => {
    if (draggedCardId) {
      updateCardStatus(draggedCardId, columnId);
      setDraggedCardId(null);
    }
  };

  const mobileColumnCards = filteredCards.filter((c) => {
    if (activeColumnTab === "Radar") return c.status === "Radar" || c.status === "Idea";
    return c.status === activeColumnTab;
  });

  return (
    <div className="min-h-screen flex flex-col pb-20 md:pb-8">
      {/* Top Header with Command Bar and Desktop Board Controls */}
      <Header showBoardFilters={true} />

      {/* ========================================================= */}
      {/* MOBILE VIEW                                               */}
      {/* ========================================================= */}
      <main className="md:hidden flex-1 px-4 pt-3 flex flex-col">
        {/* Workflow Title */}
        <div>
          <span className="block text-[11px] font-bold text-gray-400 dark:text-[#8A8680] tracking-[0.16em] uppercase mb-1 font-mono">
            WORKFLOW
          </span>
          <h1 className="text-[34px] font-black text-[#1A1A1A] dark:text-[#F5F3EF] tracking-tight leading-none mb-4">
            Board
          </h1>
        </div>

        {/* Row 1: [ Board | List ] Segmented Toggle & Search input */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex bg-[#ECEAE5]/80 dark:bg-white/[0.06] p-1 rounded-xl shrink-0">
            <button
              onClick={() => setViewMode("Board")}
              className={`text-[13px] font-semibold px-3.5 py-1 rounded-lg transition-all ${
                viewMode === "Board"
                  ? "bg-white dark:bg-[#181818] text-gray-900 dark:text-[#F5F3EF] shadow-xs"
                  : "text-gray-500 dark:text-[#8A8680] hover:text-gray-900 dark:hover:text-[#F5F3EF]"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setViewMode("List")}
              className={`text-[13px] font-medium px-3.5 py-1 rounded-lg transition-all ${
                viewMode === "List"
                  ? "bg-white dark:bg-[#181818] text-gray-900 dark:text-[#F5F3EF] shadow-xs font-semibold"
                  : "text-gray-500 dark:text-[#8A8680] hover:text-gray-900 dark:hover:text-[#F5F3EF]"
              }`}
            >
              List
            </button>
          </div>

          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="mobile-card-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards..."
              className="w-full bg-white dark:bg-[#131414] border border-gray-200/90 dark:border-white/10 rounded-2xl pl-9 pr-3.5 py-2 text-[13px] text-gray-800 dark:text-[#F5F3EF] placeholder-gray-400 dark:placeholder-[#8A8680] shadow-xs outline-none focus:border-[#8E4128]"
            />
          </div>
        </div>

        {/* Row 2: Dropdowns (Content Type & Writers) */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <div className="relative">
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-[#131414] border border-gray-200/90 dark:border-white/10 rounded-2xl px-3.5 py-2 text-[13px] font-medium text-gray-800 dark:text-[#F5F3EF] outline-none shadow-xs pr-8 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option value="IG Carousel">IG Carousel</option>
              <option value="IG Reel">IG Reel · Standard</option>
              <option value="IG B-roll">IG B-roll · Trial</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X / Twitter">X / Twitter</option>
              <option value="YouTube Long">YouTube Long</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedWriter}
              onChange={(e) => setSelectedWriter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-[#131414] border border-gray-200/90 dark:border-white/10 rounded-2xl px-3.5 py-2 text-[13px] font-medium text-gray-800 dark:text-[#F5F3EF] outline-none shadow-xs pr-8 cursor-pointer"
            >
              <option value="All Writers">All Writers</option>
              <option value="Nick">Nick</option>
              <option value="Writer B">Writer B</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 3: + New Button */}
        <div className="mb-4">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gradient-to-b from-[#8E4128]/95 to-[#6E2E1A]/95 hover:from-[#9E4A2F] hover:to-[#7E351F] border border-[#D97755]/50 active:scale-95 text-white font-bold text-[13px] px-5 py-2 rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New</span>
          </button>
        </div>

        {/* Horizontal Column Tabs Bar */}
        <div className="w-full border-t border-b border-[#ECEAE5] dark:border-white/10 py-2.5 overflow-x-auto no-scrollbar flex items-center gap-2 mb-4">
          {COLUMNS.map((col) => {
            const count = filteredCards.filter((c) => c.status === col.id).length;
            const isActive = activeColumnTab === col.id;

            return (
              <button
                key={col.id}
                onClick={() => setActiveColumnTab(col.id)}
                className={`flex items-center gap-2 text-[12.5px] shrink-0 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#ECEAE5] dark:bg-white/15 text-[#1A1A1A] dark:text-[#F5F3EF] font-bold px-3.5 py-1.5 shadow-xs"
                    : "text-gray-500 dark:text-[#8A8680] hover:text-gray-800 dark:hover:text-[#F5F3EF] px-2.5 py-1.5 font-medium"
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: col.colorDot }}
                />
                <span>{col.title}</span>
                <span className="text-[11px] text-gray-400 dark:text-[#8A8680] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Stack for Active Column */}
        <div className="space-y-3 pb-8">
          {mobileColumnCards.length === 0 ? (
            <div className="py-16 text-center text-gray-400 dark:text-[#8A8680] text-[13px] font-medium bg-white/40 dark:bg-white/[0.02] rounded-2xl border border-dashed border-gray-200 dark:border-white/10">
              No content cards in {activeColumnTab}
            </div>
          ) : (
            mobileColumnCards.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-[#131414] rounded-2xl border border-gray-200/80 dark:border-white/10 p-4 shadow-sm hover:shadow-md transition-all space-y-3 relative group"
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-[#FAF8F5] dark:bg-white/[0.06] text-[#6E6B66] dark:text-[#8A8680] text-[11px] font-semibold px-2.5 py-0.5 rounded-lg border border-black/5 dark:border-white/5 font-mono">
                    {card.type}
                  </span>

                  {card.category && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#D4D2D0]">
                      {card.category}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Delete this card?")) {
                        deleteCard(card.id);
                      }
                    }}
                    className="ml-auto text-gray-400 hover:text-red-500 p-1 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Link href={`/content/${card.id}`} className="block">
                  <h3 className="text-[14.5px] font-bold text-[#1A1A1A] dark:text-[#F5F3EF] leading-snug line-clamp-3 hover:text-[#8E4128] transition-colors">
                    {card.title}
                  </h3>
                </Link>

                <div className="flex justify-end pt-1">
                  <div className="relative">
                    <select
                      value={card.status}
                      onChange={(e) => updateCardStatus(card.id, e.target.value)}
                      className="appearance-none bg-white dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl pl-3 pr-7 py-1 text-[12px] font-medium text-gray-700 dark:text-[#D4D2D0] outline-none shadow-xs hover:bg-gray-50 dark:hover:bg-[#202020] cursor-pointer"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* ========================================================= */}
      {/* DESKTOP VIEW (FULL KANBAN BOARD WITH DARK STYLING)        */}
      {/* ========================================================= */}
      <main className="hidden md:flex flex-1 px-8 pb-8 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4 items-start">
          {COLUMNS.map((col) => {
            const columnCards = filteredCards.filter((c) => {
              if (col.id === "Radar") return c.status === "Radar" || c.status === "Idea";
              return c.status === col.id;
            });

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
                className="w-[280px] flex-shrink-0 flex flex-col bg-gray-100/50 dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded-2xl p-2.5 transition-colors"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-2 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: col.colorDot }}
                    />
                    <h3 className="text-[13px] font-bold text-gray-700 dark:text-[#F5F3EF]">
                      {col.title}
                    </h3>
                  </div>

                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full bg-white/80 dark:bg-white/10 text-gray-500 dark:text-[#8A8680] shadow-xs font-mono">
                    {columnCards.length}
                  </span>
                </div>

                {/* Cards List or Drop Here Placeholder */}
                <div className="space-y-3 min-h-[350px] flex flex-col">
                  {columnCards.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center py-16 text-center">
                      <span className="text-[12.5px] font-medium text-gray-400 dark:text-[#8A8680]/60 select-none">
                        Drop here
                      </span>
                    </div>
                  ) : (
                    columnCards.map((card) => (
                      <div
                        key={card.id}
                        draggable
                        onDragStart={() => handleDragStart(card.id)}
                        className="bg-white dark:bg-[#131414] rounded-xl border border-gray-100/90 dark:border-white/10 p-3.5 shadow-sm hover:shadow-md dark:shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all space-y-3 select-none group relative cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-[#FAF8F5] dark:bg-white/[0.06] text-[#6E6B66] dark:text-[#8A8680] border border-black/5 dark:border-white/5 font-mono">
                              {card.type}
                            </span>

                            {card.category && (
                              <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-[#D4D2D0]">
                                {card.category}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/content/${card.id}`}
                              className="text-gray-400 hover:text-[#8E4128] p-1 rounded-lg hover:bg-orange-50 dark:hover:bg-white/5 transition-colors"
                              title="Open card"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              type="button"
                              title="Delete card"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm("Delete this card?")) {
                                  deleteCard(card.id);
                                }
                              }}
                              className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-white/5 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <Link href={`/content/${card.id}`} className="block">
                          <h4 className="text-[13.5px] font-bold text-[#1A1A1A] dark:text-[#F5F3EF] hover:text-[#8E4128] transition-colors leading-snug line-clamp-3">
                            {card.title}
                          </h4>
                        </Link>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-black/10 dark:border-white/20 text-white font-mono text-[9px] flex items-center justify-center font-bold">
                              {card.assignee || "C"}
                            </span>
                          </div>

                          <div className="relative">
                            <select
                              value={card.status}
                              onChange={(e) => updateCardStatus(card.id, e.target.value)}
                              className="appearance-none bg-gray-50/80 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200/80 dark:border-white/10 rounded-lg pl-2 pr-6 py-1 text-[11.5px] font-medium text-gray-700 dark:text-[#D4D2D0] outline-none cursor-pointer transition-colors"
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id} className="dark:bg-[#131414] dark:text-white">
                                  {c.title}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
