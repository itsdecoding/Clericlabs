"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  SlidersHorizontal,
  Plus,
  Calendar,
  CheckSquare,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

export function MobileTabBar() {
  const pathname = usePathname();
  const { setIsCreateModalOpen } = useContent();

  const isHomeActive = pathname === "/home" || pathname === "/";
  const isContentActive = pathname.startsWith("/content");
  const isCalendarActive = pathname.startsWith("/calendar");
  const isTasksActive = pathname.startsWith("/tasks");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 left-3 right-3 max-w-md mx-auto z-50 select-none pointer-events-auto"
    >
      {/* Floating Glassmorphism Tab Bar */}
      <div className="bg-white/85 dark:bg-[#131414]/90 backdrop-blur-2xl border border-white/70 dark:border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.6)] rounded-full px-3 py-1.5 flex items-center justify-between">
        {/* 1. Home Tab */}
        <Link
          href="/home"
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
        >
          <div
            className={`transition-colors ${
              isHomeActive ? "text-[#8E4128]" : "text-gray-400 dark:text-[#8A8680] group-hover:text-gray-600 dark:group-hover:text-[#F5F3EF]"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isHomeActive ? "text-[#8E4128] font-bold" : "text-gray-400 dark:text-[#8A8680]"
            }`}
          >
            Home
          </span>
        </Link>

        {/* 2. Content Tab */}
        <Link
          href="/content"
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
        >
          <div
            className={`transition-colors ${
              isContentActive ? "text-[#8E4128]" : "text-gray-400 dark:text-[#8A8680] group-hover:text-gray-600 dark:group-hover:text-[#F5F3EF]"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isContentActive ? "text-[#8E4128] font-bold" : "text-gray-400 dark:text-[#8A8680]"
            }`}
          >
            Content
          </span>
        </Link>

        {/* 3. Center Elevated Action Button (+ New) */}
        <div className="flex-1 flex flex-col items-center justify-center -mt-5">
          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            aria-label="Create content"
            className="w-12 h-12 rounded-full bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-90 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(142,65,40,0.45)] border-[3px] border-white dark:border-[#131414] transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </button>
          <span className="text-[9.5px] font-bold text-gray-500 dark:text-[#8A8680] mt-0.5 leading-none font-mono">
            New
          </span>
        </div>

        {/* 4. Calendar Tab */}
        <Link
          href="/calendar"
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
        >
          <div
            className={`transition-colors ${
              isCalendarActive
                ? "text-[#8E4128]"
                : "text-gray-400 dark:text-[#8A8680] group-hover:text-gray-600 dark:group-hover:text-[#F5F3EF]"
            }`}
          >
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isCalendarActive
                ? "text-[#8E4128] font-bold"
                : "text-gray-400 dark:text-[#8A8680]"
            }`}
          >
            Calendar
          </span>
        </Link>

        {/* 5. Tasks Tab */}
        <Link
          href="/tasks"
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
        >
          <div
            className={`transition-colors ${
              isTasksActive
                ? "text-[#8E4128]"
                : "text-gray-400 dark:text-[#8A8680] group-hover:text-gray-600 dark:group-hover:text-[#F5F3EF]"
            }`}
          >
            <CheckSquare className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isTasksActive
                ? "text-[#8E4128] font-bold"
                : "text-gray-400 dark:text-[#8A8680]"
            }`}
          >
            Tasks
          </span>
        </Link>
      </div>
    </nav>
  );
}
