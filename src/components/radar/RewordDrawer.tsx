"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X as CloseIcon,
  Sparkles,
  Flame,
  ArrowRight,
  Copy,
  Check,
  Radio,
  ExternalLink,
  Sliders,
  Layers,
  FileText,
  Send,
  Zap,
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
    tagline: "Psychological reframing & cognitive deconditioning",
    modifier: "Reframed through deep behavioral psychology, zero cliché, high agency.",
  },
  {
    id: "clericlabs",
    name: "Clericlabs Agency",
    tagline: "Operational systems & asymmetrical distribution leverage",
    modifier: "Sharp B2B founder perspective on automation, leverage, and media engines.",
  },
  {
    id: "stoic",
    name: "Minimalist Stoic",
    tagline: "Cold clarity, direct assertions, zero fluff",
    modifier: "Short punchy sentences, focus on emotional autonomy and discipline.",
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

  // Sync state whenever selected outlier changes
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

  // Apply selected hook
  const handleApplyHook = (index: number, hookText: string) => {
    setActiveHookIndex(index);
    // Replace the first paragraph or hook of the draft
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
    }, 400);
  };

  const charCount = draftBody.length;
  const wordCount = draftBody.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-Over Drawer Container */}
      <div className="w-full max-w-4xl bg-[#FBFBFA] dark:bg-[#111110] border-l border-black/[0.1] dark:border-white/[0.12] text-[#111110] dark:text-[#F5F3EF] flex flex-col h-full shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between bg-white/60 dark:bg-[#131414]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-[#8E4128]/15 border border-[#8E4128]/30 flex items-center justify-center text-[#8E4128] dark:text-[#C85D3A]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">
                  Reword for Client Studio
                </h2>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border border-[#8E4128]/30 flex items-center gap-1 font-bold">
                  <Flame className="w-3 h-3 fill-current" />
                  {outlier.outlierMultiple}x Outlier
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-[#8A8680]">
                Reverse-engineering {outlier.authorHandle}&apos;s weekly breakout into your signature voice.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-black/[0.08] dark:divide-white/[0.08]">
          {/* Left Column: Original Outlier Breakdown (5 cols) */}
          <div className="lg:col-span-5 p-6 space-y-5 bg-black/[0.01] dark:bg-black/[0.2] overflow-y-auto">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-500 dark:text-[#8A8680] font-bold">
                1. SOURCE OUTLIER
              </span>
              <span className="text-[11px] font-mono text-zinc-400">
                Posted {outlier.postedDaysAgo}
              </span>
            </div>

            {/* Author & Platform Card */}
            <div className="flex items-center justify-between bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-3.5 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${meta.badgeBg}`}
                >
                  {meta.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 dark:text-[#F5F3EF]">
                    {outlier.authorName}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500">
                    {outlier.authorHandle}
                  </div>
                </div>
              </div>
              <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-black/[0.04] dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-400 border border-black/[0.06] dark:border-white/[0.08]">
                {meta.label}
              </span>
            </div>

            {/* Engagement Anomaly Stats */}
            <div className="grid grid-cols-3 gap-2 bg-[#8E4128]/5 dark:bg-[#8E4128]/10 border border-[#8E4128]/20 rounded-2xl p-3">
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-[#8E4128] dark:text-[#C85D3A]">
                  {outlier.metrics.likes.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  Likes
                </div>
              </div>
              <div className="text-center border-x border-[#8E4128]/20">
                <div className="text-xs font-mono font-bold text-[#8E4128] dark:text-[#C85D3A]">
                  {outlier.metrics.reposts.toLocaleString()}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  Reposts
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-mono font-bold text-[#8E4128] dark:text-[#C85D3A]">
                  +{Math.round((outlier.outlierMultiple - 1) * 100)}%
                </div>
                <div className="text-[10px] font-mono text-zinc-500 uppercase">
                  Vs Baseline
                </div>
              </div>
            </div>

            {/* Original Post Box */}
            <div className="space-y-2">
              <div className="text-[11px] font-mono text-zinc-500 uppercase">
                Original Post Copy
              </div>
              <div className="bg-white dark:bg-white/[0.03] border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-4 text-xs leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap font-sans">
                {outlier.originalBody}
              </div>
            </div>

            {/* Hook Anatomy Diagnosis */}
            <div className="bg-black/[0.03] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-3.5 space-y-1.5">
              <div className="text-[11px] font-mono font-semibold text-[#8E4128] dark:text-[#C85D3A] flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Why This Hook Blew Up
              </div>
              <p className="text-xs text-zinc-600 dark:text-[#8A8680] leading-relaxed">
                Uses a <strong>{outlier.hookType}</strong> structure. It attacks common consensus in the first 12 words, creating an instant curiosity tension loop that demands completion.
              </p>
            </div>
          </div>

          {/* Right Column: Rewording Studio (7 cols) */}
          <div className="lg:col-span-7 p-6 space-y-5 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              {/* Voice Preset Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-500 dark:text-[#8A8680] font-bold">
                    2. SELECT CLIENT BRAND VOICE
                  </span>
                  <span className="text-[11px] font-mono text-[#8E4128] dark:text-[#C85D3A]">
                    Tuned Preset
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {CLIENT_VOICE_PRESETS.map((voice) => (
                    <button
                      key={voice.id}
                      type="button"
                      onClick={() => setSelectedVoice(voice.id)}
                      className={`text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                        selectedVoice === voice.id
                          ? "bg-[#8E4128]/10 border-[#8E4128] text-zinc-900 dark:text-[#F5F3EF] shadow-2xs"
                          : "bg-white dark:bg-white/[0.03] border-black/[0.08] dark:border-white/[0.08] text-zinc-600 dark:text-[#8A8680] hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <div className="text-xs font-bold">{voice.name}</div>
                      <div className="text-[10px] text-zinc-500 leading-tight mt-0.5">
                        {voice.tagline}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hook Variation Matrix */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-500 dark:text-[#8A8680] font-bold">
                    3. HOOK ANGLE VARIATIONS
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    Click to insert into draft
                  </span>
                </div>

                <div className="space-y-2">
                  {outlier.suggestedHooks.map((h, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyHook(i, h.text)}
                      className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                        activeHookIndex === i
                          ? "bg-white dark:bg-white/[0.06] border-[#8E4128] shadow-xs"
                          : "bg-white/60 dark:bg-white/[0.02] border-black/[0.06] dark:border-white/[0.06] hover:border-black/20 dark:hover:border-white/20"
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${
                          activeHookIndex === i
                            ? "bg-[#8E4128] text-white"
                            : "bg-black/[0.05] dark:bg-white/[0.08] text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        {h.label}
                      </span>
                      <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-snug">
                        {h.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Editable Draft Body */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-500 dark:text-[#8A8680] font-bold">
                    4. REWORDED CLIENT DRAFT (EDITABLE)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[11px] font-mono text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Content Title / Topic..."
                    className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] focus:border-[#8E4128] rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 dark:text-white outline-none"
                  />

                  <textarea
                    rows={8}
                    value={draftBody}
                    onChange={(e) => setDraftBody(e.target.value)}
                    placeholder="Reworded draft copy..."
                    className="w-full bg-white dark:bg-white/[0.04] border border-black/[0.08] dark:border-white/[0.08] focus:border-[#8E4128] rounded-2xl p-4 text-xs font-sans text-zinc-900 dark:text-zinc-100 outline-none leading-relaxed resize-none"
                  />
                </div>

                {/* Character & Word Counter */}
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-[#8A8680] pt-1">
                  <div className="flex items-center gap-3">
                    <span>{charCount} characters</span>
                    <span>{wordCount} words</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        charCount <= 500 ? "text-emerald-500" : "text-amber-500"
                      }
                    >
                      Threads: {charCount}/500
                    </span>
                    <span>•</span>
                    <span
                      className={
                        charCount <= 280 ? "text-emerald-500" : "text-zinc-400"
                      }
                    >
                      𝕏: {charCount}/280
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Format Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10.5px] font-mono uppercase text-zinc-500">
                  Target Pipeline Format
                </label>
                <div className="grid grid-cols-4 gap-2">
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
                      className={`px-2.5 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        targetType === fmt
                          ? "bg-[#8E4128] text-white border-[#8E4128]"
                          : "bg-black/[0.02] dark:bg-white/[0.03] text-zinc-600 dark:text-zinc-400 border-black/[0.06] dark:border-white/[0.08]"
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Push Action Button */}
            <div className="pt-6 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePushToBoard}
                disabled={isPushing}
                className="flex-1 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-98 rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isPushing
                    ? "Pushing to Board..."
                    : "Push to Content Board (Radar Column)"}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
