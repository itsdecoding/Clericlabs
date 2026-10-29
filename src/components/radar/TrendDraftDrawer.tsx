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
  ExternalLink,
  Layers,
} from "lucide-react";
import { NicheTrend } from "@/data/mockData";
import { useContent } from "@/context/ContentContext";

interface TrendDraftDrawerProps {
  trend: NicheTrend | null;
  isOpen: boolean;
  onClose: () => void;
  onPushedToBoard?: (cardTitle: string) => void;
}

export function TrendDraftDrawer({
  trend,
  isOpen,
  onClose,
  onPushedToBoard,
}: TrendDraftDrawerProps) {
  const { pushTrendToBoard } = useContent();

  const [activeHookIndex, setActiveHookIndex] = useState(0);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [targetType, setTargetType] = useState("IG Carousel");
  const [copied, setCopied] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  useEffect(() => {
    if (trend) {
      setDraftTitle(trend.rewordedDraft?.title || trend.title);
      setDraftBody(trend.rewordedDraft?.body || trend.summary);
      setActiveHookIndex(0);
    }
  }, [trend]);

  if (!isOpen || !trend) return null;

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
    pushTrendToBoard(trend.id, {
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
              Draft from AI Trend
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#8E4128]/15 text-[#C85D3A] border border-[#8E4128]/30 font-medium">
              {trend.category}
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
          {/* Left Column: Source Trend */}
          <div className="md:col-span-5 p-5 space-y-4 bg-black/20 overflow-y-auto">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-medium text-zinc-300">Trend Intelligence</span>
              <span>{trend.detectedAgo}</span>
            </div>

            <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400">
                <span className="font-medium text-[#C85D3A]">{trend.tag}</span>
                <span>{trend.sourceName}</span>
              </div>
              <h3 className="text-sm font-bold text-zinc-100 leading-snug">
                {trend.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {trend.summary}
              </p>
              <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/[0.04]">
                <span>{trend.velocity}</span>
                <a
                  href={trend.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#C85D3A] hover:underline flex items-center gap-1"
                >
                  <span>Source</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* The Clericlabs Angle */}
            <div className="bg-[#8E4128]/10 border border-[#8E4128]/25 rounded-xl p-3 space-y-1">
              <div className="text-[11px] font-semibold text-[#C85D3A]">
                The Asymmetric Angle
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {trend.clericlabsAngle}
              </p>
            </div>
          </div>

          {/* Right Column: Drafting Studio */}
          <div className="md:col-span-7 p-5 space-y-4 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              {/* Hook Options */}
              <div className="space-y-1.5">
                <div className="text-xs font-medium text-zinc-300">Suggested Hook Angles</div>
                <div className="space-y-1.5">
                  {trend.suggestedHooks.map((h, i) => (
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
                  <span className="font-medium text-zinc-300">Adapted Post Copy</span>
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
                    placeholder="Content Title..."
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#8E4128] rounded-lg px-3 py-1.5 text-xs font-semibold text-white outline-none"
                  />

                  <textarea
                    rows={8}
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

              {/* Format Selector */}
              <div className="space-y-1">
                <div className="text-[11px] text-zinc-400">Target Pipeline Format</div>
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

            {/* Bottom Push Button */}
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
