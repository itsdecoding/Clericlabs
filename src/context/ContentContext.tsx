"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ContentCard,
  TaskItem,
  RadarSignal,
  WatchlistAccount,
  WeeklyOutlier,
  INITIAL_CARDS,
  INITIAL_TASKS,
  INITIAL_SIGNALS,
  INITIAL_WATCHLIST,
  INITIAL_WEEKLY_OUTLIERS,
} from "@/data/mockData";
import {
  fetchCardsFromDb,
  upsertCardInDb,
  deleteCardFromDb,
  clearAllCardsInDb,
} from "@/lib/contentService";
import { isSupabaseConfigured } from "@/lib/supabase";

interface ContentContextType {
  cards: ContentCard[];
  updateCardStatus: (cardId: string, newStatus: string) => void;
  updateCard: (updatedCard: ContentCard) => void;
  scheduleCard: (cardId: string, date: string | null) => void;
  addCard: (card: Partial<ContentCard>) => ContentCard;
  deleteCard: (id: string) => void;
  clearAllCards: () => void;
  getCardById: (id: string) => ContentCard | undefined;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWriter: string;
  setSelectedWriter: (writer: string) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isDbConnected: boolean;
  isSyncing: boolean;
  tasks: TaskItem[];
  addTask: (task: Partial<TaskItem>) => TaskItem;
  toggleTaskStatus: (taskId: string) => void;
  updateTask: (updatedTask: TaskItem) => void;
  deleteTask: (taskId: string) => void;
  signals: RadarSignal[];
  addSignal: (signal: Partial<RadarSignal>) => RadarSignal;
  deleteSignal: (id: string) => void;
  promoteSignalToCard: (signalId: string, contentType?: string) => ContentCard;
  watchlist: WatchlistAccount[];
  addWatchlistAccount: (account: Omit<WatchlistAccount, "id" | "lastScouted" | "outliersThisWeek">) => boolean;
  removeWatchlistAccount: (id: string) => void;
  outliers: WeeklyOutlier[];
  pushOutlierToBoard: (
    outlierId: string,
    customDraft?: { title?: string; body?: string; type?: string }
  ) => ContentCard;
  dismissOutlier: (outlierId: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "clericlabs_content_cards_v1";
const TASKS_STORAGE_KEY = "clericlabs_tasks_v1";
const SIGNALS_STORAGE_KEY = "clericlabs_radar_signals_v1";
const WATCHLIST_STORAGE_KEY = "clericlabs_radar_watchlist_v1";
const OUTLIERS_STORAGE_KEY = "clericlabs_radar_outliers_v1";

const getLocalDateStr = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const DEFAULT_STARTER_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "Generate Midjourney cover art & typography layout",
    status: "todo",
    priority: "High",
    contentType: "IG Carousel",
    dueDate: getLocalDateStr(),
    createdAt: getLocalDateStr(),
  },
  {
    id: "task-2",
    title: "Record voiceover audio & sound bite clips",
    status: "in_progress",
    priority: "High",
    contentType: "IG Reel · Standard",
    dueDate: getLocalDateStr(),
    createdAt: getLocalDateStr(),
  },
  {
    id: "task-3",
    title: "Batch research 10 viral hooks for Q4 newsletter",
    status: "todo",
    priority: "Medium",
    dueDate: getLocalDateStr(),
    createdAt: getLocalDateStr(),
  },
  {
    id: "task-4",
    title: "Audit top-performing Reels & Carousels of September",
    status: "done",
    priority: "Low",
    dueDate: getLocalDateStr(),
    createdAt: getLocalDateStr(),
    completedAt: getLocalDateStr(),
  },
];

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<ContentCard[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [signals, setSignals] = useState<RadarSignal[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistAccount[]>([]);
  const [outliers, setOutliers] = useState<WeeklyOutlier[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedWriter, setSelectedWriter] = useState<string>("All Writers");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Initial load from LocalStorage first (instant paint) then Supabase
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored !== null) {
        setCards(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load from localStorage", e);
    }

    try {
      const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks(DEFAULT_STARTER_TASKS);
      }
    } catch (e) {
      setTasks(DEFAULT_STARTER_TASKS);
    }

    try {
      const storedSignals = localStorage.getItem(SIGNALS_STORAGE_KEY);
      if (storedSignals !== null) {
        setSignals(JSON.parse(storedSignals));
      } else {
        setSignals(INITIAL_SIGNALS);
      }
    } catch (e) {
      setSignals(INITIAL_SIGNALS);
    }

    try {
      const storedWatchlist = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (storedWatchlist !== null) {
        setWatchlist(JSON.parse(storedWatchlist));
      } else {
        setWatchlist(INITIAL_WATCHLIST);
      }
    } catch (e) {
      setWatchlist(INITIAL_WATCHLIST);
    }

    try {
      const storedOutliers = localStorage.getItem(OUTLIERS_STORAGE_KEY);
      if (storedOutliers !== null) {
        setOutliers(JSON.parse(storedOutliers));
      } else {
        setOutliers(INITIAL_WEEKLY_OUTLIERS);
      }
    } catch (e) {
      setOutliers(INITIAL_WEEKLY_OUTLIERS);
    }

    setIsLoaded(true);

    // Fetch from Supabase
    if (isSupabaseConfigured()) {
      setIsSyncing(true);
      fetchCardsFromDb()
        .then((dbCards) => {
          if (Array.isArray(dbCards)) {
            setCards(dbCards);
            setIsDbConnected(true);
            try {
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dbCards));
            } catch (e) {
              console.warn("Could not cache dbCards to localStorage", e);
            }
          }
        })
        .catch((err) => {
          console.warn("Supabase initial sync error:", err);
        })
        .finally(() => {
          setIsSyncing(false);
        });
    }
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
      } catch (e) {
        console.warn("Could not save to localStorage", e);
      }
      try {
        localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.warn("Could not save tasks to localStorage", e);
      }
      try {
        localStorage.setItem(SIGNALS_STORAGE_KEY, JSON.stringify(signals));
      } catch (e) {
        console.warn("Could not save signals to localStorage", e);
      }
      try {
        localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
      } catch (e) {
        console.warn("Could not save watchlist to localStorage", e);
      }
      try {
        localStorage.setItem(OUTLIERS_STORAGE_KEY, JSON.stringify(outliers));
      } catch (e) {
        console.warn("Could not save outliers to localStorage", e);
      }
    }
  }, [cards, tasks, signals, watchlist, outliers, isLoaded]);

  const updateCardStatus = useCallback((cardId: string, newStatus: string) => {
    setCards((prev) => {
      const target = prev.find((c) => c.id === cardId);
      if (!target) return prev;

      const updated = {
        ...target,
        status: newStatus,
        activityLog: [
          { text: `Moved to ${newStatus}`, time: "Just now" },
          ...(target.activityLog || []),
        ],
      };

      // Background push to DB
      upsertCardInDb(updated).catch((err) =>
        console.warn("Error updating card status in DB:", err)
      );

      return prev.map((c) => (c.id === cardId ? updated : c));
    });
  }, []);

  const updateCard = useCallback((updatedCard: ContentCard) => {
    setCards((prev) => {
      const newCards = prev.map((c) => (c.id === updatedCard.id ? updatedCard : c));
      upsertCardInDb(updatedCard).catch((err) =>
        console.warn("Error updating card in DB:", err)
      );
      return newCards;
    });
  }, []);

  const scheduleCard = useCallback((cardId: string, date: string | null) => {
    setCards((prev) => {
      const target = prev.find((c) => c.id === cardId);
      if (!target) return prev;

      const updated: ContentCard = {
        ...target,
        scheduledDate: date || undefined,
        activityLog: [
          {
            text: date ? `Scheduled for ${date}` : "Removed from schedule",
            time: "Just now",
          },
          ...(target.activityLog || []),
        ],
      };

      const newCards = prev.map((c) => (c.id === cardId ? updated : c));
      upsertCardInDb(updated).catch((err) =>
        console.warn("Error scheduling card in DB:", err)
      );
      return newCards;
    });
  }, []);

  const addCard = useCallback((cardData: Partial<ContentCard>) => {
    const newCard: ContentCard = {
      id: "card-" + Date.now(),
      title: cardData.title || "Untitled Card",
      type: cardData.type || "IG Carousel",
      status: cardData.status || "Idea",
      category: cardData.category || "AI News",
      priority: cardData.priority || "Medium",
      slidesCount: cardData.slidesCount || 8,
      slideCopy: cardData.slideCopy || "Slide 1 (cover): ...\nSlide 2: ...",
      caption: cardData.caption || "",
      hashtags: cardData.hashtags || "#AI #Automation #Productivity",
      owner: cardData.owner || "Unassigned",
      pm: cardData.pm || "Unassigned",
      designer: cardData.designer || "Unassigned",
      writer: cardData.writer || "Unassigned",
      tags: cardData.tags || "ai, automation",
      activityLog: [
        { text: "Created card", time: "Just now" },
        ...(cardData.activityLog || []),
      ],
      ...cardData,
    };

    setCards((prev) => [newCard, ...prev]);

    upsertCardInDb(newCard).catch((err) =>
      console.warn("Error inserting card into DB:", err)
    );

    return newCard;
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    deleteCardFromDb(id).catch((err) =>
      console.warn("Error deleting card from DB:", err)
    );
  }, []);

  const clearAllCards = useCallback(() => {
    setCards([]);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } catch (e) {}
    clearAllCardsInDb().catch((err) =>
      console.warn("Error clearing cards in DB:", err)
    );
  }, []);

  const getCardById = useCallback(
    (id: string) => {
      return cards.find((c) => c.id === id);
    },
    [cards]
  );

  const addTask = useCallback((taskData: Partial<TaskItem>) => {
    const localToday = getLocalDateStr();
    const newTask: TaskItem = {
      id: "task-" + Date.now(),
      title: taskData.title || "Untitled Task",
      status: taskData.status || "todo",
      priority: taskData.priority || "Medium",
      contentCardId: taskData.contentCardId,
      contentCardTitle: taskData.contentCardTitle,
      contentType: taskData.contentType,
      assignee: taskData.assignee || "Unassigned",
      dueDate: taskData.dueDate || localToday,
      createdAt: localToday,
      ...taskData,
    };

    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const toggleTaskStatus = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const newStatus = t.status === "done" ? "todo" : "done";
        return {
          ...t,
          status: newStatus,
          completedAt: newStatus === "done" ? new Date().toISOString() : undefined,
        };
      })
    );
  }, []);

  const updateTask = useCallback((updatedTask: TaskItem) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const addSignal = useCallback((signalData: Partial<RadarSignal>) => {
    const newSignal: RadarSignal = {
      id: "sig-" + Date.now(),
      title: signalData.title || "Untitled Signal",
      source: signalData.source || "X / Twitter",
      signalType: signalData.signalType || "Viral Hook",
      conviction: signalData.conviction || "High",
      notes: signalData.notes || "",
      tags: signalData.tags || "",
      createdAt: getLocalDateStr(),
      isPromoted: false,
      ...signalData,
    };
    setSignals((prev) => [newSignal, ...prev]);
    return newSignal;
  }, []);

  const deleteSignal = useCallback((id: string) => {
    setSignals((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const promoteSignalToCard = useCallback(
    (signalId: string, contentType = "IG Carousel") => {
      const signal = signals.find((s) => s.id === signalId);
      const newCard = addCard({
        title: signal ? signal.title : "New Radar Idea",
        type: contentType,
        status: "Radar",
        category: signal?.tags?.includes("ai") ? "AI News" : "Mindset & Philosophy",
        priority: signal?.conviction === "High" ? "High" : "Medium",
        tags: signal?.tags,
      });

      setSignals((prev) =>
        prev.map((s) => (s.id === signalId ? { ...s, isPromoted: true } : s))
      );

      return newCard;
    },
    [signals, addCard]
  );

  const addWatchlistAccount = useCallback(
    (account: Omit<WatchlistAccount, "id" | "lastScouted" | "outliersThisWeek">) => {
      if (watchlist.length >= 6) {
        return false;
      }
      const newAcc: WatchlistAccount = {
        ...account,
        id: "acc-" + Date.now(),
        lastScouted: "Just added",
        outliersThisWeek: 0,
      };
      setWatchlist((prev) => [...prev, newAcc]);
      return true;
    },
    [watchlist.length]
  );

  const removeWatchlistAccount = useCallback((id: string) => {
    setWatchlist((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const pushOutlierToBoard = useCallback(
    (
      outlierId: string,
      customDraft?: { title?: string; body?: string; type?: string }
    ) => {
      const outlier = outliers.find((o) => o.id === outlierId);
      const draftTitle =
        customDraft?.title ||
        outlier?.rewordedDraft?.title ||
        outlier?.originalHook ||
        "Weekly Outlier";
      const draftBody =
        customDraft?.body ||
        outlier?.rewordedDraft?.body ||
        outlier?.originalBody ||
        "";

      const defaultType =
        customDraft?.type ||
        (outlier?.platform === "x"
          ? "X / Twitter"
          : outlier?.platform === "linkedin"
          ? "LinkedIn"
          : "IG Carousel");

      const newCard = addCard({
        title: draftTitle,
        type: defaultType,
        status: "Radar",
        category: outlier?.hookType ? `${outlier.hookType} Hook` : "Mindset & Philosophy",
        priority: (outlier?.outlierMultiple || 0) >= 8 ? "High" : "Medium",
        caption: draftBody,
        slideCopy: draftBody,
        tags: `radar-outlier, ${outlier?.platform || "social"}, ${outlier?.authorHandle || ""}`,
        supportingAssetsUrl: outlier?.originalUrl,
      });

      setOutliers((prev) =>
        prev.map((o) => (o.id === outlierId ? { ...o, isPromoted: true } : o))
      );

      return newCard;
    },
    [outliers, addCard]
  );

  const dismissOutlier = useCallback((outlierId: string) => {
    setOutliers((prev) => prev.filter((o) => o.id !== outlierId));
  }, []);

  return (
    <ContentContext.Provider
      value={{
        cards,
        updateCardStatus,
        updateCard,
        scheduleCard,
        addCard,
        deleteCard,
        clearAllCards,
        getCardById,
        activeFilter,
        setActiveFilter,
        searchQuery,
        setSearchQuery,
        selectedWriter,
        setSelectedWriter,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDbConnected,
        isSyncing,
        tasks,
        addTask,
        toggleTaskStatus,
        updateTask,
        deleteTask,
        signals,
        addSignal,
        deleteSignal,
        promoteSignalToCard,
        watchlist,
        addWatchlistAccount,
        removeWatchlistAccount,
        outliers,
        pushOutlierToBoard,
        dismissOutlier,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
