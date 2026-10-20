"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ContentCard, INITIAL_CARDS } from "@/data/mockData";
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
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "clericlabs_content_cards_v1";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [cards, setCards] = useState<ContentCard[]>([]);
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
    }
  }, [cards, isLoaded]);

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

  return (
    <ContentContext.Provider
      value={{
        cards,
        updateCardStatus,
        updateCard,
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
