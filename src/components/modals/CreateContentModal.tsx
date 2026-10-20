"use client";

import React, { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useContent } from "@/context/ContentContext";
import { useRouter } from "next/navigation";

export function CreateContentModal() {
  const { isCreateModalOpen, setIsCreateModalOpen, addCard } = useContent();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("IG Carousel");
  const [status, setStatus] = useState("Idea");
  const [category, setCategory] = useState("AI News");
  const [priority, setPriority] = useState("Medium");

  if (!isCreateModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCard = addCard({
      title,
      type,
      status,
      category,
      priority,
    });

    setTitle("");
    setIsCreateModalOpen(false);
    router.push(`/content/${newCard.id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in">
      <div className="bg-white dark:bg-[#131414] rounded-t-3xl sm:rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl max-w-md w-full p-6 pt-3 sm:pt-6 relative pb-[calc(env(safe-area-inset-bottom,0px)+20px)] sm:pb-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95">
        {/* iOS Bottom Sheet Grabber */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300/80 dark:bg-white/20 rounded-full mx-auto mb-4" />

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 dark:text-[#8A8680] hover:text-gray-600 dark:hover:text-[#F5F3EF] p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-4 sm:h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#FFF3EC] dark:bg-[#8E4128]/20 text-[#8E4128] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1A1A1A] dark:text-[#F5F3EF]">Create Content</h3>
            <p className="text-xs text-gray-400 dark:text-[#8A8680]">Add a new item to your editorial pipeline</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-[#8A8680] mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 7 Cognitive Scripts You Inherited..."
              className="w-full bg-gray-50/70 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-gray-900 dark:text-[#F5F3EF] outline-none focus:border-[#8E4128] focus:bg-white dark:focus:bg-[#181818] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-[#8A8680] mb-1">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-50/70 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-medium text-gray-800 dark:text-[#F5F3EF] outline-none"
              >
                <option value="IG Carousel">IG Carousel</option>
                <option value="IG Reel · Standard">IG Reel · Standard</option>
                <option value="IG B-roll · Trial">IG B-roll · Trial</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="X / Twitter">X / Twitter</option>
                <option value="YouTube Long">YouTube Long</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-[#8A8680] mb-1">
                Initial Column
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-50/70 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-medium text-gray-800 dark:text-[#F5F3EF] outline-none"
              >
                <option value="Idea">Idea</option>
                <option value="Scripting">Scripting</option>
                <option value="In Editing">In Editing</option>
                <option value="For Review">For Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-[#8A8680] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50/70 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-medium text-gray-800 dark:text-[#F5F3EF] outline-none"
              >
                <option value="AI News">AI News</option>
                <option value="Sales/Conversion">Sales/Conversion</option>
                <option value="Mindset & Philosophy">Mindset & Philosophy</option>
                <option value="Productivity Systems">Productivity Systems</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-[#8A8680] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-50/70 dark:bg-[#181818] border border-gray-200 dark:border-white/10 rounded-xl px-3 py-2.5 text-sm sm:text-xs font-medium text-gray-800 dark:text-[#F5F3EF] outline-none"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2.5 text-sm sm:text-xs font-medium text-gray-600 dark:text-[#8A8680] hover:bg-gray-100 dark:hover:bg-white/5 active:scale-95 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-2.5 text-xs font-semibold text-white bg-gradient-to-b from-[#8E4128]/95 to-[#6E2E1A]/95 hover:from-[#9E4A2F] hover:to-[#7E351F] border border-[#D97755]/50 active:scale-95 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_14px_rgba(127,57,34,0.35)] transition-all text-center justify-center flex items-center cursor-pointer"
            >
              Create Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
