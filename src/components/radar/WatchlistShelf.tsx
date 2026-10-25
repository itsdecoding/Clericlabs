"use client";

import React, { useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Flame,
  X as CloseIcon,
} from "lucide-react";
import { WatchlistAccount, RadarPlatform } from "@/data/mockData";
import { useContent } from "@/context/ContentContext";

export const getPlatformMeta = (platform: RadarPlatform) => {
  switch (platform) {
    case "threads":
      return {
        label: "Threads",
        badgeBg: "bg-zinc-800 text-zinc-200",
        icon: "@",
      };
    case "x":
      return {
        label: "X",
        badgeBg: "bg-black text-zinc-200 border border-white/10",
        icon: "𝕏",
      };
    case "instagram":
      return {
        label: "Instagram",
        badgeBg: "bg-gradient-to-tr from-amber-600 via-rose-600 to-purple-600 text-white",
        icon: "IG",
      };
    case "linkedin":
      return {
        label: "LinkedIn",
        badgeBg: "bg-[#0A66C2] text-white",
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
  const [category, setCategory] = useState("Psychology");
  const [followers, setFollowers] = useState("100K");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const maxSlots = 6;
  const slotsUsed = watchlist.length;
  const isFull = slotsUsed >= maxSlots;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      setErrorMsg("Handle is required");
      return;
    }

    const formattedHandle = handle.trim().startsWith("@")
      ? handle.trim()
      : `@${handle.trim()}`;

    const success = addWatchlistAccount({
      handle: formattedHandle,
      name: name.trim() || formattedHandle.replace("@", ""),
      platform,
      category: category.trim() || "Competitor",
      followers: followers.trim() || "50K",
      avgEngagement: 250,
    });

    if (!success) {
      setErrorMsg("Maximum of 6 accounts allowed.");
      return;
    }

    setHandle("");
    setName("");
    setErrorMsg(null);
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-[#131414] border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Clean, Direct Header without tutorial text */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Monitored Accounts
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.08] text-zinc-400">
            {slotsUsed}/{maxSlots}
          </span>
        </div>

        {!isFull && (
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-[#8E4128] hover:bg-[#A34B2F] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Account</span>
          </button>
        )}
      </div>

      {/* Grid of 6 Account Slots */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {watchlist.map((account) => {
          const meta = getPlatformMeta(account.platform);
          return (
            <div
              key={account.id}
              className="group relative bg-[#181919] hover:bg-[#1E1F1F] border border-white/[0.06] hover:border-white/[0.12] rounded-xl p-3.5 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] shrink-0 ${meta.badgeBg}`}
                  >
                    {meta.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-medium text-zinc-100 truncate">
                      {account.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate">
                      {account.handle}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeWatchlistAccount(account.id)}
                  title="Remove account"
                  className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-400 p-1 rounded-md transition-opacity cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Clean Bottom Stats */}
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-white/[0.04]">
                <span>{account.followers} followers</span>
                <span className="flex items-center gap-1 text-[#C85D3A] font-medium">
                  <Flame className="w-3 h-3 fill-current" />
                  {account.outliersThisWeek} outliers
                </span>
              </div>
            </div>
          );
        })}

        {/* Empty Slots */}
        {Array.from({ length: maxSlots - slotsUsed }).map((_, idx) => (
          <button
            key={`empty-slot-${idx}`}
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="border border-dashed border-white/[0.08] hover:border-[#8E4128]/50 bg-transparent hover:bg-white/[0.02] rounded-xl p-3 flex items-center justify-center gap-2 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer min-h-[78px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">Add Account</span>
          </button>
        ))}
      </div>

      {/* Add Account Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#141414] border border-white/[0.12] text-zinc-100 rounded-2xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <h3 className="text-sm font-semibold">Add Monitored Account</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              {errorMsg && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2 rounded-lg">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Platform
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      { id: "threads", label: "Threads" },
                      { id: "x", label: "𝕏" },
                      { id: "instagram", label: "Instagram" },
                      { id: "linkedin", label: "LinkedIn" },
                    ] as { id: RadarPlatform; label: string }[]
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPlatform(p.id)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        platform === p.id
                          ? "bg-[#8E4128] text-white border-[#8E4128]"
                          : "bg-white/[0.04] text-zinc-400 border-white/[0.08] hover:text-zinc-200"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="@handle"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#8E4128]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-zinc-400 mb-1">
                  Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Naval Ravikant"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#8E4128]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Followers
                  </label>
                  <input
                    type="text"
                    placeholder="120K"
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#8E4128]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-zinc-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="Psychology"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.1] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#8E4128]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-zinc-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-white bg-[#8E4128] hover:bg-[#A34B2F] cursor-pointer"
                >
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
