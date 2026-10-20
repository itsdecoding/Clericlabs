"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  Plus,
  Flame,
  Clock,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Trash2,
  Layers,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Sparkles,
  AlertCircle,
  ExternalLink,
  Kanban,
  ListTodo,
  FolderGit2,
  X,
  User,
} from "lucide-react";
import { Header } from "@/components/layout/Header";
import { useContent } from "@/context/ContentContext";
import { TaskItem, ContentCard } from "@/data/mockData";

type ViewMode = "List" | "ByContent" | "Kanban";
type FilterType = "All" | "Urgent" | "Content" | "StudioOps" | "Completed";

// Helper for local YYYY-MM-DD string (avoids UTC timezone shift)
const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function TasksPage() {
  const { cards, tasks, addTask, toggleTaskStatus, updateTask, deleteTask } =
    useContent();

  const [viewMode, setViewMode] = useState<ViewMode>("List");
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Input ref for auto-focusing
  const quickInputRef = useRef<HTMLInputElement>(null);

  // Dedicated Create Task Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalPriority, setModalPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [modalCardId, setModalCardId] = useState("");
  const [modalDueDate, setModalDueDate] = useState(() => getLocalDateStr());
  const [modalAssignee, setModalAssignee] = useState("Muzammil");

  // Inline Quick Add State
  const [quickTitle, setQuickTitle] = useState("");
  const [quickPriority, setQuickPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [quickCardId, setQuickCardId] = useState("");
  const [quickDueDate, setQuickDueDate] = useState(() => getLocalDateStr());
  const [isQuickAddExpanded, setIsQuickAddExpanded] = useState(false);

  // Collapsed sections in List view
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

  // Local Today string
  const todayStr = useMemo(() => getLocalDateStr(), []);

  // Submit helper for Inline Quick Add
  const handleQuickAddSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!quickTitle.trim()) {
      setIsQuickAddExpanded(true);
      quickInputRef.current?.focus();
      return;
    }

    const linkedCard = cards.find((c) => c.id === quickCardId);

    addTask({
      title: quickTitle.trim(),
      priority: quickPriority,
      contentCardId: quickCardId || undefined,
      contentCardTitle: linkedCard ? linkedCard.title : undefined,
      contentType: linkedCard ? linkedCard.type : undefined,
      dueDate: quickDueDate || todayStr,
      status: "todo",
    });

    setQuickTitle("");
    setQuickCardId("");
    setIsQuickAddExpanded(false);
  };

  // Submit helper for Dedicated Create Modal
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalTitle.trim()) return;

    const linkedCard = cards.find((c) => c.id === modalCardId);

    addTask({
      title: modalTitle.trim(),
      priority: modalPriority,
      contentCardId: modalCardId || undefined,
      contentCardTitle: linkedCard ? linkedCard.title : undefined,
      contentType: linkedCard ? linkedCard.type : undefined,
      dueDate: modalDueDate || todayStr,
      assignee: modalAssignee || "Unassigned",
      status: "todo",
    });

    setModalTitle("");
    setModalCardId("");
    setIsModalOpen(false);
  };

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return (tasks || []).filter((t) => {
      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchContent = (t.contentCardTitle || "").toLowerCase().includes(q);
        if (!matchTitle && !matchContent) return false;
      }

      // Tab filter
      if (filterType === "Urgent") return t.priority === "High" && t.status !== "done";
      if (filterType === "Content") return Boolean(t.contentCardId) && t.status !== "done";
      if (filterType === "StudioOps") return !t.contentCardId && t.status !== "done";
      if (filterType === "Completed") return t.status === "done";
      if (filterType === "All") return true;

      return true;
    });
  }, [tasks, filterType, searchQuery]);

  // Metric counts
  const openTasks = useMemo(() => (tasks || []).filter((t) => t.status !== "done"), [tasks]);
  const urgentTasks = useMemo(
    () => (tasks || []).filter((t) => t.priority === "High" && t.status !== "done"),
    [tasks]
  );
  const completedTasks = useMemo(
    () => (tasks || []).filter((t) => t.status === "done"),
    [tasks]
  );

  // List View Grouping (Using local date math)
  const urgentGroup = useMemo(() => {
    return filteredTasks.filter(
      (t) => t.status !== "done" && (t.priority === "High" || (Boolean(t.dueDate) && t.dueDate! < todayStr))
    );
  }, [filteredTasks, todayStr]);

  const todayGroup = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        t.status !== "done" &&
        t.priority !== "High" &&
        t.dueDate === todayStr
    );
  }, [filteredTasks, todayStr]);

  const upcomingGroup = useMemo(() => {
    return filteredTasks.filter(
      (t) =>
        t.status !== "done" &&
        t.priority !== "High" &&
        (!t.dueDate || t.dueDate > todayStr)
    );
  }, [filteredTasks, todayStr]);

  const completedGroup = useMemo(() => {
    return filteredTasks.filter((t) => t.status === "done");
  }, [filteredTasks]);

  // Tasks grouped by Content Card
  const contentClusters = useMemo(() => {
    const map = new Map<string, { card?: ContentCard; tasks: TaskItem[] }>();

    (tasks || []).forEach((t) => {
      const key = t.contentCardId || "__studio_ops__";
      if (!map.has(key)) {
        const card = cards.find((c) => c.id === key);
        map.set(key, { card, tasks: [] });
      }
      map.get(key)!.tasks.push(t);
    });

    return Array.from(map.entries());
  }, [tasks, cards]);

  // Priority badge styling
  const getPriorityBadge = (priority: "High" | "Medium" | "Low") => {
    switch (priority) {
      case "High":
        return "bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border-[#8E4128]/30";
      case "Medium":
        return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20";
      case "Low":
        return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24 md:pb-12 bg-[#FBFBFA] dark:bg-[#0E0E0E] text-[#111110] dark:text-[#F5F3EF]">
      {/* Top Header */}
      <Header showBoardFilters={false} />

      {/* Main Container */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        {/* Sub-Header & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          {/* Title & Primary Action Button */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase font-mono text-[#8E4128] dark:text-[#C85D3A]">
                OPERATIONAL QUEUE
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span className="text-xs text-zinc-500 dark:text-[#8A8680] font-mono">
                {openTasks.length} open • {urgentTasks.length} urgent • {completedTasks.length} completed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111110] dark:text-[#F5F3EF]">
                Tasks
              </h1>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/5 dark:bg-white/[0.06] text-zinc-600 dark:text-zinc-300 border border-black/5 dark:border-white/10 font-mono">
                {tasks.length} total
              </span>

              {/* Primary + Add Task Button (Agency OS Terracotta Gradient) */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="relative py-1.5 px-3.5 bg-gradient-to-b from-[#8E4128]/95 to-[#6E2E1A]/95 hover:from-[#9E4A2F] hover:to-[#7E351F] border border-[#D97755]/50 text-white rounded-full font-semibold text-xs shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_3px_10px_rgba(127,57,34,0.3)] flex items-center gap-1.5 transition-all active:scale-[0.98] overflow-hidden cursor-pointer"
              >
                <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full" />
                <Plus className="w-3.5 h-3.5 stroke-[2.5] relative z-10" />
                <span className="relative z-10 font-semibold">Add Task</span>
              </button>
            </div>
          </div>

          {/* Controls: View Modes & Quick Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle: [ List | By Content | Kanban ] */}
            <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode("List")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "List"
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                }`}
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("ByContent")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "ByContent"
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>By Content</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("Kanban")}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === "Kanban"
                    ? "bg-[#8E4128] text-white shadow-xs"
                    : "text-zinc-600 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-[#F5F3EF]"
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Kanban</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center bg-white/80 dark:bg-white/[0.04] p-1 rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs overflow-x-auto">
              {(
                [
                  { id: "All", label: "All" },
                  { id: "Urgent", label: "Urgent" },
                  { id: "Content", label: "Post Tasks" },
                  { id: "StudioOps", label: "Studio Ops" },
                  { id: "Completed", label: "Done" },
                ] as { id: FilterType; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterType(tab.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    filterType === tab.id
                      ? "bg-black/10 dark:bg-white/10 text-zinc-900 dark:text-white"
                      : "text-zinc-500 dark:text-[#8A8680] hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* LINEAR-STYLE QUICK ADD INPUT                            */}
        {/* ======================================================== */}
        <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-3 mb-6 transition-all focus-within:border-[#8E4128]/50">
          <form onSubmit={handleQuickAddSubmit} className="space-y-3">
            <div className="flex items-center gap-3">
              <Plus className="w-4 h-4 text-[#8E4128] shrink-0" />
              <input
                ref={quickInputRef}
                type="text"
                value={quickTitle}
                onChange={(e) => {
                  setQuickTitle(e.target.value);
                  if (!isQuickAddExpanded) setIsQuickAddExpanded(true);
                }}
                onFocus={() => setIsQuickAddExpanded(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleQuickAddSubmit();
                  }
                }}
                placeholder="Add a new task... (e.g. Generate Midjourney cover art, Record voiceover)"
                className="flex-1 bg-transparent text-sm text-zinc-900 dark:text-[#F5F3EF] outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600 font-medium"
              />

              <button
                type="button"
                onClick={() => handleQuickAddSubmit()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-95 rounded-full transition-all cursor-pointer shadow-xs shrink-0"
              >
                Add Task
              </button>
            </div>

            {/* Quick Add Options: Priority, Linked Post, Due Date */}
            {isQuickAddExpanded && (
              <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-black/[0.06] dark:border-white/[0.08] animate-in fade-in duration-150">
                {/* Priority Selector */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <span>Priority:</span>
                  {(["High", "Medium", "Low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setQuickPriority(p)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                        quickPriority === p
                          ? getPriorityBadge(p)
                          : "border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                {/* Link to Content Card */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <span>Post:</span>
                  <select
                    value={quickCardId}
                    onChange={(e) => setQuickCardId(e.target.value)}
                    className="bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-lg px-2 py-1 text-xs text-zinc-800 dark:text-zinc-200 outline-none max-w-[200px] truncate"
                  >
                    <option value="">(None - Studio Ops)</option>
                    {cards.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.type}] {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
                  <span>Due:</span>
                  <input
                    type="date"
                    value={quickDueDate}
                    onChange={(e) => setQuickDueDate(e.target.value)}
                    className="bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-lg px-2 py-0.5 text-xs text-zinc-800 dark:text-zinc-200 outline-none"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        {/* ======================================================== */}
        {/* VIEW 1: LIST / DUE DATE VIEW                            */}
        {/* ======================================================== */}
        {viewMode === "List" && (
          <div className="space-y-6">
            {/* 1. Urgent & Overdue Section */}
            {urgentGroup.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-1">
                  <Flame className="w-4 h-4 text-[#8E4128]" />
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-[#8E4128] dark:text-[#C85D3A]">
                    Urgent & Overdue ({urgentGroup.length})
                  </h3>
                </div>
                <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-[#8E4128]/30 dark:border-[#8E4128]/40 shadow-xs divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden">
                  {urgentGroup.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskStatus(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* 2. Today Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <Clock className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-600 dark:text-[#8A8680]">
                  Today ({todayGroup.length})
                </h3>
              </div>
              <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden">
                {todayGroup.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 dark:text-zinc-600 font-mono italic">
                    No remaining tasks due today.
                  </div>
                ) : (
                  todayGroup.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskStatus(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 3. Upcoming Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-1">
                <CalendarIcon className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-zinc-600 dark:text-[#8A8680]">
                  Upcoming & Backlog ({upcomingGroup.length})
                </h3>
              </div>
              <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden">
                {upcomingGroup.length === 0 ? (
                  <div className="p-6 text-center text-xs text-zinc-400 dark:text-zinc-600 font-mono italic">
                    No upcoming tasks.
                  </div>
                ) : (
                  upcomingGroup.map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onToggle={() => toggleTaskStatus(task.id)}
                      onDelete={() => deleteTask(task.id)}
                    />
                  ))
                )}
              </div>
            </div>

            {/* 4. Completed Section (Collapsible) */}
            {completedGroup.length > 0 && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setIsCompletedOpen(!isCompletedOpen)}
                  className="flex items-center gap-2 px-1 text-xs font-bold font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {isCompletedOpen ? (
                    <ChevronDown className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5" />
                  )}
                  <span>Completed ({completedGroup.length})</span>
                </button>

                {isCompletedOpen && (
                  <div className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-2xl border border-black/[0.08] dark:border-white/[0.12] shadow-xs divide-y divide-black/[0.06] dark:divide-white/[0.06] overflow-hidden opacity-75">
                    {completedGroup.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskStatus(task.id)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 2: GROUPED BY CONTENT POST                         */}
        {/* ======================================================== */}
        {viewMode === "ByContent" && (
          <div className="space-y-6">
            {contentClusters.map(([cardId, cluster]) => {
              const isStudioOps = cardId === "__studio_ops__";
              const total = cluster.tasks.length;
              const done = cluster.tasks.filter((t) => t.status === "done").length;
              const percent = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div
                  key={cardId}
                  className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-5 space-y-4"
                >
                  {/* Card Header & Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono font-bold text-[#8E4128] uppercase">
                          {isStudioOps ? "STUDIO OPS" : cluster.card?.type || "CONTENT POST"}
                        </span>
                        {!isStudioOps && cluster.card && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                            Stage: {cluster.card.status}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-[#F5F3EF]">
                        {isStudioOps ? "General Studio & Workflow Operations" : cluster.card?.title}
                      </h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {done}/{total} done
                        </span>
                        <span className="text-[10px] text-zinc-400 block font-mono">
                          {percent}% complete
                        </span>
                      </div>
                      <div className="w-24 h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#8E4128] to-[#C85D3A] transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {!isStudioOps && (
                        <Link
                          href={`/content/${cardId}`}
                          className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-500 transition-colors"
                          title="Open Post Details"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Tasks Checklist */}
                  <div className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
                    {cluster.tasks.map((task) => (
                      <TaskRow
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTaskStatus(task.id)}
                        onDelete={() => deleteTask(task.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ======================================================== */}
        {/* VIEW 3: KANBAN TASK COLUMNS                             */}
        {/* ======================================================== */}
        {viewMode === "Kanban" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(
              [
                { id: "todo", title: "To Do", color: "bg-zinc-400" },
                { id: "in_progress", title: "In Progress", color: "bg-[#8E4128]" },
                { id: "done", title: "Completed", color: "bg-emerald-500" },
              ] as const
            ).map((col) => {
              const columnTasks = (tasks || []).filter((t) => t.status === col.id);

              return (
                <div
                  key={col.id}
                  className="bg-white/80 dark:bg-[#131414]/90 backdrop-blur-xl rounded-3xl border border-black/[0.08] dark:border-white/[0.12] shadow-sm p-4 flex flex-col min-h-[480px]"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-black/[0.06] dark:border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${col.color}`} />
                      <h3 className="text-sm font-bold text-zinc-900 dark:text-[#F5F3EF]">
                        {col.title}
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300">
                      {columnTasks.length}
                    </span>
                  </div>

                  {/* Column Cards */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {columnTasks.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-xs text-zinc-400 font-mono italic">
                        Empty
                      </div>
                    ) : (
                      columnTasks.map((t) => (
                        <div
                          key={t.id}
                          className="p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.08] space-y-2 hover:border-black/20 dark:hover:border-white/20 transition-all shadow-xs"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span
                              className={`px-1.5 py-0.5 rounded-md font-semibold border ${getPriorityBadge(
                                t.priority
                              )}`}
                            >
                              {t.priority}
                            </span>
                            {t.dueDate && (
                              <span className="text-zinc-400">{t.dueDate}</span>
                            )}
                          </div>

                          <h4
                            className={`text-xs font-bold leading-snug ${
                              t.status === "done"
                                ? "line-through text-zinc-400"
                                : "text-zinc-900 dark:text-[#F5F3EF]"
                            }`}
                          >
                            {t.title}
                          </h4>

                          {t.contentCardTitle && (
                            <div className="text-[10px] text-zinc-500 font-mono truncate">
                              [{t.contentType || "Post"}] {t.contentCardTitle}
                            </div>
                          )}

                          {/* Quick Column Shift Buttons */}
                          <div className="flex items-center justify-between pt-2 border-t border-black/[0.04] dark:border-white/[0.04]">
                            <button
                              type="button"
                              onClick={() => toggleTaskStatus(t.id)}
                              className="text-[10px] font-semibold text-[#8E4128] hover:underline cursor-pointer"
                            >
                              {t.status === "done" ? "Reopen" : "Mark Done"}
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteTask(t.id)}
                              className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: DEDICATED CREATE TASK MODAL                      */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-[#131414] rounded-3xl border border-black/10 dark:border-white/15 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#8E4128] font-mono tracking-wider uppercase">
                  OPERATIONAL ACTION
                </span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-[#F5F3EF]">
                  Add New Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="e.g. Design Midjourney cover art, Record voiceover clips"
                  className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 dark:text-[#F5F3EF] outline-none focus:border-[#8E4128]"
                />
              </div>

              {/* Priority Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                  Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["High", "Medium", "Low"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setModalPriority(p)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                        modalPriority === p
                          ? getPriorityBadge(p)
                          : "bg-zinc-50 dark:bg-white/[0.04] border-black/10 dark:border-white/10 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Link to Content Post */}
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                  Associated Content Post (Optional)
                </label>
                <select
                  value={modalCardId}
                  onChange={(e) => setModalCardId(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2.5 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                >
                  <option value="">(None - Independent Studio Ops Task)</option>
                  {cards.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.type}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Due Date */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={modalDueDate}
                    onChange={(e) => setModalDueDate(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                  />
                </div>

                {/* Assignee */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 dark:text-[#8A8680] mb-1.5">
                    Assignee
                  </label>
                  <select
                    value={modalAssignee}
                    onChange={(e) => setModalAssignee(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#181818] border border-black/10 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-800 dark:text-[#F5F3EF] outline-none"
                  >
                    <option value="Muzammil">Muzammil</option>
                    <option value="Writer">Writer</option>
                    <option value="Designer">Designer</option>
                    <option value="Video Editor">Video Editor</option>
                    <option value="Unassigned">Unassigned</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!modalTitle.trim()}
                  className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-b from-[#8E4128] to-[#6E2E1A] hover:from-[#9E4A2F] hover:to-[#7E351F] active:scale-95 disabled:opacity-50 rounded-xl cursor-pointer shadow-xs transition-all"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Single Task Row Component
function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: TaskItem;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const isDone = task.status === "done";

  return (
    <div className="p-3.5 sm:px-4 flex items-center justify-between gap-3 group hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Custom Rounded Checkbox */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={isDone ? "Mark incomplete" : "Mark complete"}
          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            isDone
              ? "bg-[#8E4128] border-[#8E4128] text-white"
              : "border-black/20 dark:border-white/20 hover:border-[#8E4128] dark:hover:border-[#C85D3A]"
          }`}
        >
          {isDone && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Task Title & Meta */}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold leading-snug transition-all truncate ${
              isDone
                ? "line-through text-zinc-400 dark:text-zinc-600"
                : "text-zinc-900 dark:text-[#F5F3EF]"
            }`}
          >
            {task.title}
          </p>

          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {/* Linked Content Badge */}
            {task.contentCardId && task.contentCardTitle && (
              <Link
                href={`/content/${task.contentCardId}`}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:underline inline-flex items-center gap-1 shrink-0"
              >
                <span>[{task.contentType || "Post"}] {task.contentCardTitle}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </Link>
            )}

            {/* Studio Ops Badge if not linked */}
            {!task.contentCardId && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-500/10 text-zinc-600 dark:text-zinc-400">
                Studio Ops
              </span>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.dueDate}
              </span>
            )}

            {/* Assignee */}
            {task.assignee && task.assignee !== "Unassigned" && (
              <span className="text-[10px] text-zinc-400 font-mono flex items-center gap-1">
                <User className="w-3 h-3" />
                {task.assignee}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right meta: Priority & Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10.5px] font-mono font-semibold px-2 py-0.5 rounded-md border ${
            task.priority === "High"
              ? "bg-[#8E4128]/15 text-[#8E4128] dark:text-[#C85D3A] border-[#8E4128]/30"
              : task.priority === "Medium"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20"
              : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20"
          }`}
        >
          {task.priority}
        </span>

        <button
          type="button"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
