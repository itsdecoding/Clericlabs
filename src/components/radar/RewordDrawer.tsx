"use client";

import React, { useState, useEffect } from "react";
import {
  X as CloseIcon,
  Sparkles,
  Flame,
  ArrowRight,
  Copy,
  Check,
  Send,
  Heart,
  Repeat2,
  MessageSquare,
} from "lucide-react";
import { WeeklyOutlier } from "@/data/mockData";
import { getPlatformMeta } from "./WatchlistShelf";
import { useContent } from "@/context/ContentContext";

interface RewordDrawerProps {
  outlier: WeeklyOutlier | null;
  isOpen: boolean;
  onClose: () => void;
  onPushedToBoard?: (cardTitle: string) => void;
}

const CLIENT_VOICE_PRESETS = [
  {
    id: "rewrite-minds",
    name: "Rewrite Minds",
    tagline: "Psychological reframing",
  },
  {
    id: "clericlabs",
    name: "Clericlabs Agency",
    tagline: "Systems & leverage",
  },
  {
    id: "stoic",
    name: "Minimalist Stoic",
    tagline: "Direct assertions",
  },
];

export function RewordDrawer({
  outlier,
  isOpen,
  onClose,
  onPushedToBoard,
}: RewordDrawerProps) {
  const { pushOutlierToBoard } = useContent();

  const [selectedVoice, setSelectedVoice] = useState(CLIENT_VOICE_PRESETS[0].id);
  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [targetType, setTargetType] = useState("IG Carousel");
  const [copied, setCopied] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    if (outlier) {
      setDraftTitle(outlier.rewordedDraft?.title || outlier.originalHook);
      setDraftBody(outlier.rewordedDraft?.body || outlier.originalBody);
      setActiveHookIndex(0);
      setTargetType(
        outlier.platform === "x"
          ? "X / Twitter"
          : outlier.platform === "linkedin"
          ? "LinkedIn"
          : "IG Carousel"
      );
    }
  }, [outlier]);

  if (!isOpen || !outlier) return null;

  const meta = getPlatformMeta(outlier.platform);

  const handleApplyHook = (index: number, hookText: string) => {
    setActiveHookIndex(index);
    const lines = draftBody.split("\n\n");
    if (lines.length > 1) {
      lines[0] = hookText;
      setDraftBody(lines.join("\n\n"));
    } else {
      setDraftBody(`${hookText}\n\n${draftBody}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${draftTitle}\n\n${draftBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushToBoard = () => {
    setIsPushing(true);
    pushOutlierToBoard(outlier.id, {
      title: draftTitle,
      body: draftBody,
      type: targetType,
    });

    if (onPushedToBoard) {
      onPushedToBoard(draftTitle);
    }

    setTimeout(() => {
      setIsPushing(false);
      onClose();
    }, 300);
  };

  const charCount = draftBody.length;
  const wordCount = draftBody.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-3xl bg-[#111110] border-l border-white/[0.1] text-zinc-100 flex flex-col h-full shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-[#141414]">
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-semibold">
              Reword for Client
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#8E4128]/15 text-[#C85D3A] border border-[#8E4128]/30 flex items-center gap-1 font-mono font-medium">
              <Flame className="w-3 h-3 fill-current" />
              {outlier.outlierMultiple}x Outlier
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* 2-Column Content Area */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
          {/* Left Column: Source Post */}
          <div className="md:col-span-5 p-5 space-y-4 bg-black/20 overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium text-zinc-300">Source Post</span>
              <span>{outlier.postedDaysAgo}</span>
            </div>

            <div className="flex items-center justify-between bg-white/[0.03] border border-white/[0.08] rounded-xl p-3">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${meta.badgeBg}`}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-100 truncate">
                    {outlier.authorName}
                  </div>
                  <div className="text-[11px] text-zinc-400 truncate">
                    {outlier.authorHandle}
                  </div>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.05] text-zinc-400">
                {meta.label}
              </span>
            </div>

            {/* Engagement Stats */}
            <div className="grid grid-cols-3 gap-2 bg-white/[0.02] border border-white/[0.06] rounded-xl p-2.5 text-center text-xs">
              <div>
                <div className="font-medium text-zinc-200">
                  {outlier.metrics.likes.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">Likes</div>
              </div>
              <div className="border-x border-white/[0.06]">
                <div className="font-medium text-zinc-200">
                  {outlier.metrics.reposts.toLocaleString()}
                </div>
                <div className="text-[10px] text-zinc-500">Reposts</div>
              </div>
              <div>
                <div className="font-medium text-[#C85D3A]">
                  +{Math.round((outlier.outlierMultiple - 1) * 100)}%
                </div>
                <div className="text-[10px] text-zinc-500">Over Avg</div>
              </div>
            </div>

            {/* Original Copy */}
            <div className="space-y-1.5">
              <div className="text-xs text-zinc-400 font-medium">Original Copy</div>
              <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">
                {outlier.originalBody}
              </div>
            </div>
          </div>

          {/* Right Column: Rewording Studio */}
          <div className="md:col-span-7 p-5 space-y-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* Brand Voice */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-zinc-300">Brand Voice</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {CLIENT_VOICE_PRESETS.map((voice) => (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`text-left p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedVoice === voice.id
                          ? "bg-[#8E4128]/15 border-[#8E4128] text-white"
                          : "bg-white/[0.03] border-white/[0.06] text-zinc-400 hover:border-white/[0.12]"
                      }`}
                    >
                      <div className="text-xs font-medium">{voice.name}</div>
                      <div className="text-[10px] text-zinc-500 leading-tight">
                        {voice.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hook Variations */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-zinc-300">Hook Variations</div>
                <div className="space-y-1.5">
                  {outlier.suggestedHooks.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyHook(i, h.text)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2 ${
                        activeHookIndex === i
                          ? "bg-white/[0.06] border-[#8E4128]"
                          : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                      }`}
                    >
                      <span
                        className={`text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5 ${
                          activeHookIndex === i
                            ? "bg-[#8E4128] text-white"
                            : "bg-white/[0.06] text-zinc-400"
                        }`}
                      >
                        {h.label}
                      </span>
                      <span className="text-xs text-zinc-200 leading-snug">
                        {h.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Draft */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Reworded Draft</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-zinc-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Title..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#8E4128] rounded-lg px-3 py-1.5 text-xs font-semibold text-white outline-none"
                  />

                  <textarea
                    rows={7}
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    placeholder="Draft copy..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#8E4128] rounded-xl p-3 text-xs text-zinc-200 outline-none leading-relaxed resize-none"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{charCount} characters • {wordCount} words</span>
                  <div className="flex items-center gap-2">
                    <span className={charCount <= 500 ? "text-emerald-400" : "text-amber-400"}>
                      Threads: {charCount}/500
                    </span>
                    <span>•</span>
                    <span className={charCount <= 280 ? "text-emerald-400" : "text-zinc-500"}>
                      𝕏: {charCount}/280
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Format */}
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400">Target Format</div>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    [
                      "IG Carousel",
                      "X / Twitter",
                      "LinkedIn",
                      "IG Reel · Standard",
                    ] as const
                  ).map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setTargetType(fmt)}
                      className={`py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                        targetType === fmt
                          ? "bg-[#8E4128] text-white border-[#8E4128]"
                          : "bg-white/[0.03] text-zinc-400 border-white/[0.06] hover:text-zinc-200"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Push Action Button */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg text-zinc-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePushToBoard}
                disabled={isPushing}
                className="px-4 py-1.5 text-xs font-medium text-white bg-[#8E4128] hover:bg-[#A34B2F] active:scale-95 rounded-lg shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isPushing ? "Pushing..." : "Push to Content Board"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
