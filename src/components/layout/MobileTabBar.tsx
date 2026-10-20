"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  SlidersHorizontal,
  Plus,
  Calendar,
  PieChart,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";

export function MobileTabBar() {
  const pathname = usePathname();
  const { setIsCreateModalOpen } = useContent();

  const isHomeActive = pathname === "/home" || pathname === "/";
  const isContentActive = pathname.startsWith("/content");

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-4 left-3 right-3 max-w-md mx-auto z-50 select-none pointer-events-auto"
    >
      {/* Floating Glassmorphism Tab Bar */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)] rounded-full px-3 py-1.5 flex items-center justify-between">
        {/* 1. Home Tab */}
        <Link
          href="/home"
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform"
        >
          <div
            className={`transition-colors ${
              isHomeActive ? "text-[#FF5A1F]" : "text-gray-400 group-hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isHomeActive ? "text-[#FF5A1F] font-bold" : "text-gray-400"
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
              isContentActive ? "text-[#FF5A1F]" : "text-gray-400 group-hover:text-gray-600"
            }`}
          >
            <SlidersHorizontal className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span
            className={`text-[10px] font-medium tracking-tight mt-0.5 leading-none transition-colors ${
              isContentActive ? "text-[#FF5A1F] font-bold" : "text-gray-400"
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
            className="w-12 h-12 rounded-full bg-[#FF5A1F] hover:bg-[#E84C12] active:scale-90 text-white flex items-center justify-center shadow-[0_6px_20px_rgba(255,90,31,0.45)] border-[3px] border-white transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </button>
          <span className="text-[9.5px] font-bold text-gray-500 mt-0.5 leading-none">
            New
          </span>
        </div>

        {/* 4. Calendar Tab */}
        <button
          type="button"
          onClick={() => {}}
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
            <Calendar className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none text-gray-400">
            Calendar
          </span>
        </button>

        {/* 5. Insights Tab */}
        <button
          type="button"
          onClick={() => {}}
          className="flex-1 flex flex-col items-center justify-center py-1 group active:scale-95 transition-transform cursor-pointer"
        >
          <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
            <PieChart className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[10px] font-medium tracking-tight mt-0.5 leading-none text-gray-400">
            Insights
          </span>
        </button>
      </div>
    </nav>
  );
}
