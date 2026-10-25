"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Radio,
  Sparkles,
  Check,
  X as CloseIcon,
  Flame,
  ShieldCheck,
} from "lucide-react";
import { WatchlistAccount, RadarPlatform } from "@/data/mockData";
import { useContent } from "@/context/ContentContext";

// Platform Icon & Styling Helper
export const getPlatformMeta = (platform: RadarPlatform) => {
  switch (platform) {
    case "threads":
      return {
        label: "Threads",
        badgeBg: "bg-zinc-900 text-white dark:bg-white dark:text-black",
        border: "border-zinc-800 dark:border-zinc-300",
        icon: "@",
      };
    case "x":
      return {
        label: "X / Twitter",
        badgeBg: "bg-black text-white dark:bg-zinc-800 dark:text-zinc-100",
        border: "border-black/20 dark:border-white/20",
        icon: "𝕏",
      };
    case "instagram":
      return {
        label: "Instagram",
        badgeBg: "bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white",
        border: "border-rose-500/30",
        icon: "IG",
      };
    case "linkedin":
      return {
        label: "LinkedIn",
        badgeBg: "bg-[#0A66C2] text-white",
        border: "border-[#0A66C2]/30",
        icon: "in",
      };
  }
};

export function WatchlistShelf() {
  const { watchlist, addWatchlistAccount, removeWatchlistAccount } = useContent();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [handle, setHandle] = useState("");
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState<RadarPlatform>("threads");
  const [category, setCategory] = useState("Psychology & High Agency");
  const [followers, setFollowers] = useState("120K");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const maxSlots = 6;
  const slotsUsed = watchlist.length;
  const isFull = slotsUsed >= maxSlots;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      setErrorMsg("Handle cannot be empty");
      return;
    }

    const formattedHandle = handle.trim().startsWith("@")
      ? handle.trim()
      : `@${handle.trim()}`;

    const success = addWatchlistAccount({
      handle: formattedHandle,
      name: name.trim() || formattedHandle.replace("@", ""),
      platform,
      category: category.trim() || "Creator / Competitor",
      followers: followers.trim() || "50K",
      avgEngagement: 250,
    });

    if (!success) {
      setErrorMsg("Maximum of 6 accounts allowed. Remove one to add another.");
      return;
    }

    setHandle("");
    setName("");
    setErrorMsg(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] p-5 shadow-sm space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-[#8E4128]/10 dark:bg-[#8E4128]/20 border border-[#8E4128]/30 flex items-center justify-center text-[#8E4128] dark:text-[#C85D3A]">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF]">
                Monitored Accounts Watchlist
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.08] border border-black/[0.08] dark:border-white/[0.1] text-zinc-600 dark:text-[#8A8680]">
                {slotsUsed}/{maxSlots} Slots
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-[#8A8680]">
              The autonomous scraper monitors these 5–6 accounts daily and extracts only weekly outliers.
            </p>
          </div>
        </div>

        {/* Action Button */}
        {!isFull ? (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Account</span>
          </button>
        ) : (
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8E4128]" />
            6/6 Max Slots Active
          </span>
        )}
      </div>

      {/* Grid of 6 Account Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {watchlist.map((account) => {
          const meta = getPlatformMeta(account.platform);
          return (
            <div
              key={account.id}
              className="group relative bg-black/[0.02] dark:bg-white/[0.02] hover:bg-black/[0.04] dark:hover:bg-white/[0.05] border border-black/[0.06] dark:border-white/[0.08] hover:border-[#8E4128]/40 rounded-2xl p-3.5 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 shadow-xs ${meta.badgeBg}`}
                  >
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-zinc-900 dark:text-[#F5F3EF] truncate">
                      {account.name}
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500 dark:text-[#8A8680] truncate">
                      {account.handle}
                    </div>
                  </div>
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removeWatchlistAccount(account.id)}
                  title="Remove account from watchlist"
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-opacity p-1 rounded-lg hover:bg-red-500/10 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Account Stats & Category */}
              <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-black/[0.04] dark:border-white/[0.06] text-zinc-500 dark:text-[#8A8680]">
                <span>{account.followers} followers</span>
                <span className="flex items-center gap-1 text-[#8E4128] dark:text-[#C85D3A] font-semibold">
                  <Flame className="w-3 h-3" />
                  {account.outliersThisWeek} Outliers this week
                </span>
              </div>
            </div>
          );
        })}

        {/* Empty placeholder slots up to 6 */}
        {Array.from({ length: maxSlots - slotsUsed }).map((_, idx) => (
          <button
            key={`empty-slot-${idx}`}
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="border border-dashed border-black/[0.12] dark:border-white/[0.12] hover:border-[#8E4128]/60 bg-transparent hover:bg-[#8E4128]/5 rounded-2xl p-4 flex flex-col items-center justify-center text-center transition-all cursor-pointer group min-h-[92px]"
          >
            <Plus className="w-4 h-4 text-zinc-400 dark:text-zinc-600 group-hover:text-[#8E4128] transition-colors mb-1" />
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-500 group-hover:text-zinc-800 dark:group-hover:text-[#F5F3EF]">
              + Add Monitored Account
            </span>
            <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600">
              Slot {slotsUsed + idx + 1} of 6
            </span>
          </button>
        ))}
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#111110] border border-white/[0.15] text-[#F5F3EF] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8E4128]" />
                <h3 className="text-sm font-bold">Add Account to Weekly Watchlist</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                  {errorMsg}
                </div>
              )}

              {/* Platform Selector */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8680] mb-1.5">
                  Platform
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: "threads", label: "Threads" },
                      { id: "x", label: "X / Twitter" },
                      { id: "instagram", label: "Instagram" },
                      { id: "linkedin", label: "LinkedIn" },
                    ] as { id: RadarPlatform; label: string }[]
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`px-2.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        platform === p.id
                          ? "bg-[#8E4128] text-white border-[#8E4128]"
                          : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-white"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Creator Handle */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8680] mb-1">
                  Creator Handle (@)
                </label>
                <input
                  type="text"
                  required
                  placeholder="@naval, @hubermanlab, @growth_instincts"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#8E4128]"
                />
              </div>

              {/* Display Name */}
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#8A8680] mb-1">
                  Account Name / Focus
                </label>
                <input
                  type="text"
                  placeholder="e.g. Naval Ravikant, Behavioral Economics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#8E4128]"
                />
              </div>

              {/* Followers & Category */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#8A8680] mb-1">
                    Est. Audience
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 150K"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#8E4128]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono uppercase text-[#8A8680] mb-1">
                    Niche / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Psychology"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.06] border border-white/[0.12] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#8E4128]"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] shadow-md transition-all cursor-pointer"
                >
                  Save to Watchlist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
