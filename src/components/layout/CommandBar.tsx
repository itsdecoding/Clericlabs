"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Command,
  Plus,
  SlidersHorizontal,
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Radar,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useContent } from "@/context/ContentContext";

export function CommandBar() {
  const router = useRouter();
  const { cards, setIsCreateModalOpen, searchQuery } = useContent();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const staticActions = [
    {
      label: "Create new content piece",
      icon: Plus,
      category: "Action",
      action: () => {
        setIsCreateModalOpen(true);
        setIsOpen(false);
      },
    },
    {
      label: "Go to Operations Dashboard",
      icon: LayoutDashboard,
      category: "Navigation",
      action: () => {
        router.push("/home");
        setIsOpen(false);
      },
    },
    {
      label: "Open Content Board (Kanban)",
      icon: SlidersHorizontal,
      category: "Navigation",
      action: () => {
        router.push("/content");
        setIsOpen(false);
      },
    },
    {
      label: "Open Operational Tasks",
      icon: CheckSquare,
      category: "Navigation",
      action: () => {
        router.push("/tasks");
        setIsOpen(false);
      },
    },
    {
      label: "Open Editorial Calendar",
      icon: Calendar,
      category: "Navigation",
      action: () => {
        router.push("/calendar");
        setIsOpen(false);
      },
    },
    {
      label: "Open Content Radar & Viral Signals",
      icon: Radar,
      category: "Navigation",
      action: () => {
        router.push("/radar");
        setIsOpen(false);
      },
    },
  ];

  const matchingCards = query.trim()
    ? cards.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.type.toLowerCase().includes(query.toLowerCase()) ||
          c.status.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="relative max-w-md w-full mx-auto">
      {/* Floating Pill Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="relative w-full flex items-center justify-between px-4 py-2.5 rounded-full bg-white/70 dark:bg-white/[0.04] backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.14] shadow-[0_4px_20px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:border-[#D97755]/50 text-xs text-[#6E6B66] dark:text-[#8A8680] transition-all overflow-hidden group cursor-pointer"
      >
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/30 dark:from-white/10 to-transparent rounded-t-full" />
        <div className="flex items-center gap-2.5 relative z-10">
          <Search className="w-3.5 h-3.5 text-[#8E4128]" />
          <span className="font-medium text-[#7A7570] dark:text-[#8A8680] group-hover:text-[#111110] dark:group-hover:text-[#F5F3EF] transition-colors">
            {searchQuery ? `Searching: "${searchQuery}"` : "Search or run a command..."}
          </span>
        </div>
        <kbd className="relative z-10 px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[10px] text-[#6E6B66] dark:text-[#8A8680] flex items-center gap-0.5 border border-black/5 dark:border-white/10">
          <Command className="w-2.5 h-2.5" /> K
        </kbd>
      </button>

      {/* Modal Dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[300] bg-black/50 backdrop-blur-md flex items-start justify-center pt-24 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white/95 dark:bg-[#131414]/95 backdrop-blur-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Box */}
            <div className="p-3.5 border-b border-[#ECE8E1] dark:border-white/10 flex items-center gap-2.5">
              <Search className="w-4 h-4 text-[#8E4128] shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, search card titles, or platforms..."
                className="w-full bg-transparent border-none outline-none text-xs text-[#111110] dark:text-[#F5F3EF] placeholder-[#8A8680]"
              />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#8A8680] hover:text-[#111110] dark:hover:text-[#F5F3EF] p-1 rounded-md cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Suggestions & Results List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {matchingCards.length > 0 && (
                <div className="px-2 py-1 text-[10px] font-bold text-[#8A8680] uppercase tracking-wider font-mono">
                  Matching Content Cards ({matchingCards.length})
                </div>
              )}
              {matchingCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    router.push(`/content/${card.id}`);
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs hover:bg-[#FAF8F5] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer"
                >
                  <div className="min-w-0 pr-2">
                    <div className="font-semibold text-[#111110] dark:text-[#F5F3EF] group-hover:text-[#8E4128] truncate">
                      {card.title}
                    </div>
                    <div className="text-[10px] text-[#8A8680]">{card.type}</div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FFF3EC] dark:bg-[#8E4128]/20 text-[#8E4128] font-medium shrink-0">
                    {card.status}
                  </span>
                </button>
              ))}

              <div className="px-2 py-1 text-[10px] font-bold text-[#8A8680] uppercase tracking-wider font-mono pt-1">
                Quick Commands
              </div>
              {staticActions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={item.action}
                    className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-[#111110] dark:text-[#F5F3EF] hover:bg-[#FAF8F5] dark:hover:bg-white/[0.04] transition-colors font-medium group cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#8E4128]" />
                    <span className="flex-1 group-hover:text-[#8E4128]">{item.label}</span>
                    <span className="text-[10px] text-[#8A8680] font-mono">{item.category}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
