"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  SlidersHorizontal,
  CheckSquare,
  Calendar,
  BarChart3,
  Plus,
  Bell,
  LogOut,
} from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function Sidebar() {
  const pathname = usePathname();
  const { setIsCreateModalOpen, cards, tasks } = useContent();

  const isHomeActive = pathname === "/home" || pathname === "/";
  const isContentActive = pathname.startsWith("/content");
  const isTasksActive = pathname.startsWith("/tasks");
  const isCalendarActive = pathname.startsWith("/calendar");

  const pendingReviewCount = cards.filter((c) => c.status === "For Review").length;
  const scheduledCount = cards.filter((c) => Boolean(c.scheduledDate)).length;
  const openTasksCount = (tasks || []).filter((t) => t.status !== "done").length;

  const navItems = [
    {
      label: "Dashboard",
      href: "/home",
      icon: LayoutDashboard,
      isActive: isHomeActive,
    },
    {
      label: "Content Board",
      href: "/content",
      icon: SlidersHorizontal,
      isActive: isContentActive,
      badge: cards.length > 0 ? String(cards.length) : undefined,
    },
    {
      label: "Tasks",
      href: "/tasks",
      icon: CheckSquare,
      isActive: isTasksActive,
      badge: openTasksCount > 0 ? String(openTasksCount) : undefined,
    },
    {
      label: "Calendar",
      href: "/calendar",
      icon: Calendar,
      isActive: isCalendarActive,
      badge: scheduledCount > 0 ? String(scheduledCount) : undefined,
    },
    {
      label: "Insights",
      href: "/content",
      icon: BarChart3,
      isActive: false,
    },
  ];

  return (
    <aside className="hidden md:flex fixed top-4 left-4 bottom-4 w-60 z-50 rounded-3xl bg-white/75 dark:bg-white/[0.04] backdrop-blur-2xl border border-black/[0.08] dark:border-white/[0.14] shadow-[0_20px_50px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.4)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] flex-col justify-between p-4 transition-all overflow-hidden group select-none">
      {/* Specular glass reflection at top */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-white/[0.12] dark:from-white/[0.06] to-transparent" />

      {/* Internal ambient aura */}
      <div className="pointer-events-none absolute -top-10 -left-10 w-36 h-36 bg-[#8E4128]/10 dark:bg-[#8E4128]/20 rounded-full blur-2xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-36 h-36 bg-[#8E4128]/10 dark:bg-[#8E4128]/20 rounded-full blur-2xl" />

      {/* Top Section */}
      <div className="space-y-4 relative z-10">
        {/* Workspace Brand Pill */}
        <div className="flex items-center gap-2.5 px-1 py-1">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-zinc-900 border border-black/10 dark:border-white/10 shrink-0 flex items-center justify-center shadow-sm p-1">
            <img
              src="/avatar.webp"
              alt="Clericlabs"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs font-bold text-[#111110] dark:text-[#F5F3EF] truncate tracking-tight uppercase font-mono">
              CLERICLABS
            </h2>
            <p className="text-[10px] text-[#6E6B66] dark:text-[#8A8680] truncate font-medium">
              Content OS
            </p>
          </div>
        </div>

        {/* Primary Action Button (Agency OS Terracotta Gradient Pill) */}
        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="relative w-full py-2.5 px-3 bg-gradient-to-b from-[#8E4128]/95 to-[#6E2E1A]/95 hover:from-[#9E4A2F] hover:to-[#7E351F] border border-[#D97755]/50 text-white rounded-full font-semibold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_14px_rgba(127,57,34,0.35)] flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] overflow-hidden cursor-pointer"
        >
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
          <Plus className="w-3.5 h-3.5 stroke-[2.5] relative z-10" />
          <span className="relative z-10 font-semibold tracking-wide">Create Content</span>
        </button>

        {/* Vertical Nav Stack */}
        <nav className="space-y-1 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.isActive;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all overflow-hidden ${
                  isActive
                    ? "bg-gradient-to-b from-[#8E4128]/90 to-[#6E2E1A]/90 border border-[#D97755]/50 text-white font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(127,57,34,0.3)]"
                    : "text-[#6E6B66] dark:text-[#8A8680] hover:text-[#111110] dark:hover:text-[#F5F3EF] hover:bg-black/5 dark:hover:bg-white/[0.05] font-medium"
                }`}
              >
                {isActive && (
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/15 to-transparent rounded-t-xl" />
                )}
                <div className="flex items-center gap-3 relative z-10">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? "text-white stroke-[2.2]" : "text-[#6E6B66] dark:text-[#8A8680]"
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full relative z-10 ${
                      isActive
                        ? "bg-white/20 text-white font-bold"
                        : "bg-black/5 dark:bg-white/10 text-[#6E6B66] dark:text-[#8A8680]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Controls (Matching Agency OS Footer) */}
      <div className="pt-3 border-t border-[#ECE8E1] dark:border-white/10 relative z-10">
        <div className="flex items-center justify-between px-2">
          {/* Real Next-Themes Theme Toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          <button
            type="button"
            title="Notifications"
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-[#6E6B66] dark:text-[#8A8680] hover:text-[#111110] dark:hover:text-[#F5F3EF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {pendingReviewCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E04F2E] ring-2 ring-white dark:ring-[#131414]" />
            )}
          </button>

          {/* Settings / Sign-out icon */}
          <button
            type="button"
            title="Sign out / Settings"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6E6B66] dark:text-[#8A8680] hover:text-[#111110] dark:hover:text-[#F5F3EF] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
