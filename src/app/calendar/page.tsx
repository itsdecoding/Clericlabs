"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  X,
  Search,
  Sparkles,
  CalendarDays,
  CalendarRange,
  ListFilter,
  Archive,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { ContentCard } from "@/data/mockData";

type ViewMode = "Month" | "Week" | "Agenda";

export default function CalendarPage() {
  const {
    cards,
    scheduleCard,
    updateCardStatus,
    addCard,
    setIsCreateModalOpen,
  } = useContent();

  // Navigation State: Year & Month
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("Month");
  const [selectedChannel, setSelectedChannel] = useState<string>("All");
  const [isBacklogOpen, setIsBacklogOpen] = useState<boolean>(false);
  const [scheduleModalDate, setScheduleModalDate] = useState<string | null>(null);
  const [modalTab, setModalTab] = useState<"existing" | "new">("existing");
  const [selectedExistingCardId, setSelectedExistingCardId] = useState<string>("");

  // New quick card fields
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("IG Carousel");
  const [newStatus, setNewStatus] = useState("Idea");

  // Date math
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-indexed

  // Go to today
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Month Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Format helper: YYYY-MM-DD
  const formatDateStr = (year: number, month: number, day: number) => {
    const y = year.toString();
    const m = (month + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Today's YYYY-MM-DD
  const todayStr = useMemo(() => {
    const now = new Date();
    return formatDateStr(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);

  // Filter cards by channel
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (selectedChannel === "All") return true;
      if (selectedChannel === "IG Reel" && card.type.includes("IG Reel")) return true;
      if (selectedChannel === "IG B-roll" && card.type.includes("IG B-roll")) return true;
      if (selectedChannel === "IG Carousel" && card.type.includes("IG Carousel")) return true;
      if (selectedChannel === "LinkedIn" && card.type.includes("LinkedIn")) return true;
      if (selectedChannel === "X / Twitter" && (card.type.includes("Twitter") || card.type.includes("X"))) return true;
      if (selectedChannel === "YouTube Long" && card.type.includes("YouTube")) return true;
      return card.type.toLowerCase().includes(selectedChannel.toLowerCase());
    });
  }, [cards, selectedChannel]);

  // Unscheduled cards backlog
  const unscheduledCards = useMemo(() => {
    return cards.filter((c) => !c.scheduledDate && c.status !== "Dismissed");
  }, [cards]);

  // Map of scheduled cards grouped by YYYY-MM-DD
  const scheduledMap = useMemo(() => {
    const map = new Map<string, ContentCard[]>();
    filteredCards.forEach((c) => {
      // Use scheduledDate, fallback to dueDate if in YYYY-MM-DD
      const dateKey = c.scheduledDate || (c.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(c.dueDate) ? c.dueDate : null);
      if (dateKey) {
        const existing = map.get(dateKey) || [];
        existing.push(c);
        map.set(dateKey, existing);
      }
    });
    return map;
  }, [filteredCards]);

  // Monthly stats
  const scheduledThisMonthCount = useMemo(() => {
    let count = 0;
    scheduledMap.forEach((items, dateKey) => {
      const [y, m] = dateKey.split("-").map(Number);
      if (y === currentYear && m === currentMonth + 1) {
        count += items.length;
      }
    });
    return count;
  }, [scheduledMap, currentYear, currentMonth]);

  // Generate Month Grid cells (Monday start)
  const monthGridDays = useMemo(() => {
    const days: {
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      cards: ContentCard[];
    }[] = [];

    // First day of month (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    // Shift so Monday is 0
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;

    // Total days in current month
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    // Days in previous month
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    // 1. Previous month trailing days
    for (let i = startOffset - 1; i >= 0; i--) {
      const prevDay = daysInPrevMonth - i;
      const prevDate = new Date(currentYear, currentMonth - 1, prevDay);
      const dateStr = formatDateStr(prevDate.getFullYear(), prevDate.getMonth(), prevDay);
      days.push({
        dateStr,
        dayNumber: prevDay,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        cards: scheduledMap.get(dateStr) || [],
      });
    }

    // 2. Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = formatDateStr(currentYear, currentMonth, d);
      days.push({
        dateStr,
        dayNumber: d,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        cards: scheduledMap.get(dateStr) || [],
      });
    }

    // 3. Next month leading days to complete grid (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let nextDay = 1; nextDay <= remaining; nextDay++) {
      const nextDate = new Date(currentYear, currentMonth + 1, nextDay);
      const dateStr = formatDateStr(nextDate.getFullYear(), nextDate.getMonth(), nextDay);
      days.push({
        dateStr,
        dayNumber: nextDay,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        cards: scheduledMap.get(dateStr) || [],
      });
    }

    return days;
  }, [currentYear, currentMonth, scheduledMap, todayStr]);

  // Current month string header (e.g. "October 2026")
  const monthName = currentDate.toLocaleString("default", { month: "long" });

  // Quick schedule action
  const handleQuickSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalDate) return;

    if (modalTab === "existing" && selectedExistingCardId) {
      scheduleCard(selectedExistingCardId, scheduleModalDate);
      setSelectedExistingCardId("");
      setScheduleModalDate(null);
    } else if (modalTab === "new" && newTitle.trim()) {
      addCard({
        title: newTitle,
        type: newType,
        status: newStatus,
        scheduledDate: scheduleModalDate,
      });
      setNewTitle("");
      setScheduleModalDate(null);
    }
  };

  // Helper for platform badge colors
  const getPlatformChipStyle = (type: string) => {
    if (type.includes("IG Reel")) {
      return "bg-pink-500/10 text-pink-700 dark:text-pink-300 border-pink-500/30";
    }
    if (type.includes("IG Carousel")) {
      return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30";
    }
    if (type.includes("IG B-roll")) {
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30";
    }
    if (type.includes("LinkedIn")) {
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30";
    }
    if (type.includes("YouTube")) {
      return "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/30";
    }
    return "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300 border-zinc-500/30";
  };

  // Helper for status dot
  const getStatusDotColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-500";
      case "Posted":
        return "bg-emerald-600";
      case "In Editing":
        return "bg-[#8E4128]";
      case "For Review":
        return "bg-amber-500";
      case "Scripting":
        return "bg-blue-500";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#FBFBFA] dark:bg-[#0E0E0E] text-[#111110] dark:text-[#F5F3EF]">
      {/* Top Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Sub-Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Title & Stats */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-[#8E4128] dark:text-[#C85D3A]">
                EDITORIAL CADENCE
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-500 dark:text-[#8A8680] font-mono">
                {scheduledThisMonthCount} scheduled in {monthName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111110] dark:text-[#F5F3EF] flex items-center gap-3">
              Calendar
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/10 font-mono">
                {monthName} {currentYear}
              </span>
            </h1>
          </div>

          {/* Action Row: Month Switcher + View Toggles + Backlog Drawer Trigger */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prev / Today / Next Date Navigator */}
            <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Previous month"
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="px-3 py-1 text-xs font-semibold font-mono hover:text-[#8E4128] dark:hover:text-[#C85D3A] transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Next month"
                className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* View Mode Switcher [ Month | Week | Agenda ] */}
            <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs">
              {(["Month", "Week", "Agenda"] as ViewMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === mode
                      ? "bg-[#8E4128] text-white shadow-xs"
                      : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Channel Filter Pill */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-white/80 dark:bg-[#131414] border border-black/[0.08] dark:border-white/[0.12] rounded-2xl px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-[#F5F3EF] outline-none cursor-pointer shadow-xs"
            >
              <option value="All">All Channels</option>
              <option value="IG Reel">IG Reel</option>
              <option value="IG Carousel">IG Carousel</option>
              <option value="IG B-roll">IG B-roll</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="X / Twitter">X / Twitter</option>
              <option value="YouTube Long">YouTube</option>
            </select>

            {/* Unscheduled Backlog Trigger Button */}
            <button
              type="button"
              onClick={() => setIsBacklogOpen(!isBacklogOpen)}
              className={`relative px-3.5 py-1.5 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
                isBacklogOpen
                  ? "bg-[#8E4128]/15 border-[#8E4128] text-[#8E4128] dark:text-[#C85D3A]"
                  : "bg-white/80 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.12] text-zinc-700 dark:text-[#F5F3EF] hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Unscheduled</span>
              {unscheduledCards.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#8E4128] text-white text-[10px] font-bold font-mono flex items-center justify-center">
                  {unscheduledCards.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: MONTH GRID VIEW                                 */}
        {/* ======================================================== */}
        {viewMode === "Month" && (
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm overflow-hidden">
            {/* Days of week header */}
            <div className="grid grid-cols-7 border-b border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] text-center py-2.5">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((dayName) => (
                <span
                  key={dayName}
                  className="text-[11px] font-bold tracking-wider text-zinc-400 dark:text-[#8A8680] font-mono"
                >
                  {dayName}
                </span>
              ))}
            </div>

            {/* Calendar Cells Grid */}
            <div className="grid grid-cols-7 divide-x divide-y divide-black/[0.06] dark:divide-white/[0.08]">
              {monthGridDays.map((cell) => {
                return (
                  <div
                    key={cell.dateStr}
                    className={`min-h-[110px] sm:min-h-[135px] p-2 flex flex-col justify-between transition-colors group relative ${
                      cell.isCurrentMonth
                        ? "bg-transparent"
                        : "bg-black/[0.015] dark:bg-white/[0.01] opacity-45"
                    } hover:bg-black/[0.02] dark:hover:bg-white/[0.02]`}
                  >
                    {/* Cell Top Bar: Date Number + Quick Schedule '+' Button */}
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-mono font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          cell.isToday
                            ? "bg-[#8E4128] text-white shadow-xs"
                            : cell.isCurrentMonth
                            ? "text-zinc-800 dark:text-[#F5F3EF]"
                            : "text-zinc-400 dark:text-zinc-600"
                        }`}
                      >
                        {cell.dayNumber}
                      </span>

                      {/* Quick Add icon visible on cell hover */}
                      <button
                        type="button"
                        onClick={() => {
                          setScheduleModalDate(cell.dateStr);
                          setModalTab("existing");
                        }}
                        title={`Schedule post for ${cell.dateStr}`}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 hover:text-[#8E4128] dark:hover:text-[#C85D3A] transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Scheduled Content Pills inside day cell */}
                    <div className="flex-1 space-y-1.5 overflow-hidden">
                      {cell.cards.slice(0, 3).map((card) => (
                        <Link
                          key={card.id}
                          href={`/content/${card.id}`}
                          className={`block p-1.5 rounded-lg border text-left transition-all hover:scale-[1.01] active:scale-[0.99] group/card ${getPlatformChipStyle(
                            card.type
                          )}`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-1.5 h-1.5 rounded-full shrink-0 ${getStatusDotColor(
                                card.status
                              )}`}
                            />
                            <span className="text-[10px] font-semibold tracking-tight truncate block flex-1">
                              {card.title}
                            </span>
                          </div>
                        </Link>
                      ))}

                      {cell.cards.length > 3 && (
                        <div className="text-[9.5px] font-mono text-zinc-500 dark:text-zinc-400 font-semibold px-1">
                          +{cell.cards.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: WEEK CADENCE VIEW                               */}
        {/* ======================================================== */}
        {viewMode === "Week" && (
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-4 overflow-x-auto">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 min-w-[700px]">
              {monthGridDays.slice(0, 7).map((dayCell) => (
                <div
                  key={dayCell.dateStr}
                  className="bg-black/[0.02] dark:bg-white/[0.02] rounded-2xl p-3 border border-black/[0.04] dark:border-white/[0.06] flex flex-col min-h-[360px]"
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/[0.06] dark:border-white/[0.06]">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase block">
                        Day {dayCell.dayNumber}
                      </span>
                      <span className="text-sm font-bold text-zinc-800 dark:text-[#F5F3EF]">
                        {dayCell.dateStr}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setScheduleModalDate(dayCell.dateStr)}
                      className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Cards */}
                  <div className="flex-1 space-y-2">
                    {dayCell.cards.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-zinc-400 dark:text-zinc-600 font-mono italic">
                        No posts scheduled
                      </div>
                    ) : (
                      dayCell.cards.map((c) => (
                        <div
                          key={c.id}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#181818] border border-black/[0.08] dark:border-white/10 shadow-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="font-semibold text-[#8E4128]">
                              {c.type}
                            </span>
                            <span className="text-zinc-400">{c.status}</span>
                          </div>
                          <Link
                            href={`/content/${c.id}`}
                            className="text-xs font-semibold text-zinc-900 dark:text-[#F5F3EF] hover:underline block leading-snug line-clamp-2"
                          >
                            {c.title}
                          </Link>
                          <div className="flex items-center justify-between pt-1 text-[10px] text-zinc-400">
                            <span>{c.writer || "No author"}</span>
                            <button
                              type="button"
                              onClick={() => scheduleCard(c.id, null)}
                              title="Unschedule card"
                              className="text-red-500 hover:text-red-600 text-[10px] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: AGENDA TIMELINE VIEW                            */}
        {/* ======================================================== */}
        {viewMode === "Agenda" && (
          <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-zinc-400 dark:text-[#8A8680] uppercase tracking-wider font-mono">
              Chronological Publishing Agenda
            </h2>

            {filteredCards.filter((c) => !!c.scheduledDate).length === 0 ? (
              <div className="text-center py-16 text-zinc-400 dark:text-zinc-600 font-mono text-sm">
                No content scheduled. Pick an unscheduled post from the backlog to schedule.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCards
                  .filter((c) => !!c.scheduledDate)
                  .sort((a, b) => (a.scheduledDate! > b.scheduledDate! ? 1 : -1))
                  .map((card) => (
                    <div
                      key={card.id}
                      className="p-4 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-black/20 dark:hover:border-white/20 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-[#8E4128]/10 text-[#8E4128] dark:text-[#C85D3A] shrink-0">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-mono font-bold text-[#8E4128] dark:text-[#C85D3A]">
                              {card.scheduledDate}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-semibold text-zinc-700 dark:text-zinc-300">
                              {card.type}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                              {card.status}
                            </span>
                          </div>
                          <Link
                            href={`/content/${card.id}`}
                            className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF] hover:underline"
                          >
                            {card.title}
                          </Link>
                          <p className="text-xs text-zinc-500 dark:text-[#8A8680] mt-0.5">
                            Author: {card.writer || "Unassigned"} • Category: {card.category || "General"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Link
                          href={`/content/${card.id}`}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-colors"
                        >
                          View Details
                        </Link>
                        <button
                          type="button"
                          onClick={() => scheduleCard(card.id, null)}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                        >
                          Unschedule
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* DRAWER: UNSCHEDULED CONTENT BACKLOG                     */}
      {/* ======================================================== */}
      {isBacklogOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-[#131414] border-l border-black/10 dark:border-white/15 shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-black/[0.08] dark:border-white/10">
            <div className="flex items-center gap-2">
              <Archive className="w-5 h-5 text-[#8E4128]" />
              <h3 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Unscheduled Backlog
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsBacklogOpen(false)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-400 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs text-zinc-500 dark:text-[#8A8680] py-3">
            {unscheduledCards.length} cards in production awaiting release dates
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {unscheduledCards.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center text-zinc-400 font-mono text-xs">
                All production cards are scheduled!
              </div>
            ) : (
              unscheduledCards.map((card) => (
                <div
                  key={card.id}
                  className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="font-bold text-[#8E4128]">{card.type}</span>
                    <span className="text-zinc-500">{card.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-[#F5F3EF] leading-snug">
                    {card.title}
                  </h4>
                  <div className="flex items-center justify-between pt-1">
                    <input
                      type="date"
                      onChange={(e) => {
                        if (e.target.value) {
                          scheduleCard(card.id, e.target.value);
                        }
                      }}
                      className="text-[11px] bg-white dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 outline-none text-zinc-800 dark:text-zinc-200"
                    />
                    <button
                      type="button"
                      onClick={() => scheduleCard(card.id, todayStr)}
                      className="text-[11px] font-semibold text-[#8E4128] hover:underline cursor-pointer"
                    >
                      Post Today
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: QUICK SCHEDULE / ASSIGN TO DATE                  */}
      {/* ======================================================== */}
      {scheduleModalDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#131414] rounded-3xl border border-black/10 dark:border-white/15 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8E4128] font-mono tracking-wider uppercase">
                  SCHEDULE FOR
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F5F3EF]">
                  {scheduleModalDate}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setScheduleModalDate(null)}
                className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-400 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs: Pick Existing vs Create New */}
            <div className="flex bg-black/[0.04] dark:bg-white/[0.04] p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setModalTab("existing")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  modalTab === "existing"
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                Pick from Pipeline ({unscheduledCards.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab("new")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  modalTab === "new"
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                Create New
              </button>
            </div>

            <form onSubmit={handleQuickSchedule} className="space-y-4 pt-1">
              {modalTab === "existing" ? (
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                    Select an unscheduled card:
                  </label>
                  {unscheduledCards.length === 0 ? (
                    <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] text-xs text-zinc-400 font-mono text-center">
                      No unscheduled cards in backlog. Switch to "Create New" to draft one.
                    </div>
                  ) : (
                    <select
                      value={selectedExistingCardId}
                      onChange={(e) => setSelectedExistingCardId(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                    >
                      <option value="">-- Choose Card --</option>
                      {unscheduledCards.map((c) => (
                        <option key={c.id} value={c.id}>
                          [{c.type}] {c.title} ({c.status})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. 5 Mental Models for Autonomous Systems..."
                      className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1">
                        Type
                      </label>
                      <select
                        value={newType}
                        onChange={(e) => setNewType(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                      >
                        <option value="IG Carousel">IG Carousel</option>
                        <option value="IG Reel · Standard">IG Reel</option>
                        <option value="IG B-roll · Trial">IG B-roll</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="X / Twitter">X / Twitter</option>
                        <option value="YouTube Long">YouTube</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1">
                        Initial Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-2.5 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                      >
                        <option value="Idea">Idea</option>
                        <option value="Scripting">Scripting</option>
                        <option value="In Editing">In Editing</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalDate(null)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalTab === "existing" && !selectedExistingCardId}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#8E4128] hover:bg-[#9E4A2F] disabled:opacity-50 rounded-xl cursor-pointer shadow-xs transition-all"
                >
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
