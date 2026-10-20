"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";
import { useContent } from "@/context/ContentContext";

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
    { id: "IG Reel", label: "IG Reel · Standard", icon: "🎬" },
    { id: "IG B-roll", label: "IG B-roll · Trial", icon: "🎞️" },
    { id: "IG Carousel", label: "IG Carousel", icon: "🎴" },
    { id: "LinkedIn", label: "LinkedIn", icon: "💼" },
    { id: "X / Twitter", label: "X / Twitter", icon: "𝕏" },
    { id: "YouTube Long", label: "YouTube Long", icon: "▶️" },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Mobile Floating Top Bar (Matching Reference Image 1 Exactly) */}
      <div className="md:hidden w-full px-3.5 pt-3 pb-1">
        <div className="w-full bg-white rounded-2xl border border-gray-200/80 shadow-[0_1px_4px_rgba(0,0,0,0.02)] p-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 border border-gray-200 flex-shrink-0">
              <img
                src="/avatar.webp"
                alt="Content OS"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <span className="text-[15px] font-bold text-[#1A1A1A]">
              Content OS
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById("mobile-card-search");
              if (el) el.focus();
            }}
            className="flex items-center gap-1.5 bg-gray-100/90 hover:bg-gray-200/80 text-gray-400 text-[12.5px] font-normal px-3 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Search</span>
          </button>
        </div>
      </div>

      {/* Desktop Search Bar */}
      <div className="hidden md:flex w-full justify-center py-4 px-6">
        <div className="relative w-full max-w-[500px]">
          <div className="flex items-center w-full bg-white/90 backdrop-blur-md border border-gray-200/70 shadow-sm rounded-full px-4 py-2 text-sm transition-all focus-within:border-gray-400 focus-within:shadow">
            <Search className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cards, topics, tags..."
              className="w-full bg-transparent border-none outline-none text-[13px] text-gray-800 placeholder-gray-400"
            />
            <div className="flex flex-shrink-0 ml-2 items-center bg-gray-100/90 text-gray-400 text-[11px] font-medium px-1.5 py-0.5 rounded border border-gray-200/60">
              ⌘K
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Board View Sub-bar */}
      {showBoardFilters && (
        <div className="hidden md:block w-full px-8 pb-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div>
                <span className="block text-[10.5px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                  WORKFLOW
                </span>
                <h1 className="text-2xl font-extrabold text-[#1A1A1A] tracking-tight">
                  Board
                </h1>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-[0.98] text-[#1A1A1A] font-bold text-[13px] px-4 py-1.5 rounded-xl shadow-[0_2px_6px_rgba(255,90,31,0.25)] flex items-center gap-1.5 transition-all ml-1"
              >
                <span>+ New</span>
              </button>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap flex-1 justify-end">
              <div className="relative min-w-[170px] max-w-[210px]">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search cards..."
                  className="w-full bg-white border border-gray-200/80 rounded-xl pl-8 pr-3 py-1.5 text-[12.5px] text-gray-800 placeholder-gray-400 outline-none focus:border-gray-400 shadow-sm"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {filterTabs.map((tab) => {
                  const isActive = activeFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`text-[12px] font-medium px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-[#FFF0E8] text-[#FF5A1F] border border-[#FFD2BE] font-semibold shadow-xs"
                          : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-50/80 hover:text-gray-900"
                      }`}
                    >
                      {tab.icon && <span className="text-[12px]">{tab.icon}</span>}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <select
                  value={selectedWriter}
                  onChange={(e) => setSelectedWriter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200/80 rounded-xl pl-3 pr-7 py-1.5 text-[12.5px] font-medium text-gray-700 outline-none hover:bg-gray-50 cursor-pointer shadow-sm"
                >
                  <option value="All Writers">All Writers</option>
                  <option value="Nick">Nick</option>
                  <option value="Writer B">Writer B</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
