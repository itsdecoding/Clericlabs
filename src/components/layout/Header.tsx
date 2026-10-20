"use client";

import React from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { CommandBar } from "./CommandBar";

interface HeaderProps {
  showBoardFilters?: boolean;
}

export function Header({ showBoardFilters = false }: HeaderProps) {
  const {
    activeFilter,
    setActiveFilter,
    searchQuery,
    setSearchQuery,
    selectedWriter,
    setSelectedWriter,
    setIsCreateModalOpen,
  } = useContent();

  const filterTabs = [
    { id: "All", label: "All" },
    { id: "IG Reel", label: "IG Reel · Standard" },
    { id: "IG B-roll", label: "IG B-roll · Trial" },
    { id: "IG Carousel", label: "IG Carousel" },
    { id: "LinkedIn", label: "LinkedIn" },
    { id: "X / Twitter", label: "X / Twitter" },
    { id: "YouTube Long", label: "YouTube Long" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mobile Floating Top Bar */}
      <div className="md:hidden w-full px-3.5 pt-3 pb-1">
        <div className="w-full bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/10 shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 border border-black/10 dark:border-white/10 flex-shrink-0 p-1">
              <img
                src="/avatar.webp"
                alt="Clericlabs"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <span className="text-[13px] font-bold text-[#111110] dark:text-[#F5F3EF] block leading-none font-mono">
                CLERICLABS
              </span>
              <span className="text-[10px] text-[#8A8680] font-medium leading-none">
                Content OS
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 bg-[#8E4128] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus className="w-3 h-3 stroke-[2.5]" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Desktop Search / Command Bar (Matching Agency OS Floating Search Pill) */}
      <div className="hidden md:flex w-full justify-center pt-4 pb-2 px-6">
        <CommandBar />
      </div>

      {/* Desktop Board View Sub-bar (Kanban Controls) */}
      {showBoardFilters && (
        <div className="hidden md:block w-full px-8 pb-4 pt-1">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[10px] font-bold text-[#8A8680] uppercase tracking-[0.15em] leading-none mb-1 font-mono">
                  WORKFLOW
                </span>
                <h1 className="text-2xl font-black text-[#111110] dark:text-[#F5F3EF] tracking-tight">
                  Board
                </h1>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="relative py-1.5 px-3.5 bg-gradient-to-b from-[#8E4128]/95 to-[#6E2E1A]/95 hover:from-[#9E4A2F] hover:to-[#7E351F] border border-[#D97755]/50 text-white rounded-full font-semibold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_3px_10px_rgba(127,57,34,0.3)] flex items-center gap-1.5 transition-all active:scale-[0.98] overflow-hidden cursor-pointer ml-1"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
                <Plus className="w-3.5 h-3.5 stroke-[2.5] relative z-10" />
                <span className="relative z-10 font-semibold">New</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap flex-1 justify-end">
              <div className="relative min-w-[170px] max-w-[210px]">
                <Search className="w-3.5 h-3.5 text-[#8A8680] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter cards..."
                  className="w-full bg-white/80 dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#111110] dark:text-[#F5F3EF] placeholder-[#8A8680] outline-none focus:border-[#8E4128]/40 shadow-xs backdrop-blur-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveFilter(tab.id)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                        isActive
                          ? "bg-[#8E4128] text-white font-semibold shadow-xs"
                          : "bg-white/80 dark:bg-white/[0.04] text-[#6E6B66] dark:text-[#8A8680] border border-black/[0.08] dark:border-white/10 hover:bg-white dark:hover:bg-white/[0.08] hover:text-[#111110] dark:hover:text-[#F5F3EF]"
                      }`}
                    >
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <select
                  value={selectedWriter}
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  className="appearance-none bg-white/80 dark:bg-[#131414] border border-black/[0.08] dark:border-white/10 rounded-xl pl-3 pr-7 py-1.5 text-xs font-medium text-[#111110] dark:text-[#F5F3EF] outline-none hover:bg-white dark:hover:bg-[#1a1a1a] cursor-pointer shadow-xs"
                >
                  <option value="All Writers">All Writers</option>
                  <option value="Nick">Nick</option>
                  <option value="Writer B">Writer B</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8680] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
