"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { fetchBackpack, toggleBackpackItem } from "../services/backpackApi";
import { bigThree, bestSellers, latestUpdates } from "../data";
import type { MangaItem } from "../data/bigThree";

interface BackpackContextValue {
  backpack: MangaItem[];
  setBackpack: (backpack: MangaItem[]) => void;
  addToBackpack: (manga: MangaItem | string | number) => void;
  removeFromBackpack: (itemOrId: MangaItem | string | number) => void;
  isInBackpack: (id: string | number) => boolean;
}

const BackpackContext = createContext<BackpackContextValue>({
  backpack: [],
  setBackpack: () => {},
  addToBackpack: async () => {},
  removeFromBackpack: async () => {},
  isInBackpack: () => false,
});

const allManga: MangaItem[] = [...bigThree, ...bestSellers, ...latestUpdates];

export function BackpackProvider({ children }: { children: React.ReactNode }) {
  const [backpack, setBackpack] = useState<MangaItem[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadBackpack() {
      const token = localStorage.getItem("mangahub_token");
      if (!token) return;

      try {
        const ids = await fetchBackpack();
        if (mounted && Array.isArray(ids)) {
          const matchedManga = ids
            .map((id) => allManga.find((m) => String(m.id) === String(id)))
            .filter((m): m is MangaItem => m !== undefined);

          setBackpack(matchedManga);
        }
      } catch (err) {
        console.error("Failed to load backpack from API:", err);
      }
    }

    loadBackpack();
    return () => {
      mounted = false;
    };
  }, []);

  const addToBackpack = async (manga: MangaItem | string | number) => {
    const mangaId = typeof manga === "object" ? manga.id : manga;
    const mangaObj =
      typeof manga === "object"
        ? manga
        : allManga.find((m) => String(m.id) === String(mangaId)) || {
            id: Number(mangaId),
          } as MangaItem;

    setBackpack((prev) => {
      if (prev.some((item) => String(item.id) === String(mangaId))) return prev;
      return [...prev, mangaObj];
    });

    try {
      await toggleBackpackItem(mangaId);
    } catch (err) {
      console.error("Failed to sync addToBackpack with backend:", err);
    }
  };

  const removeFromBackpack = async (itemOrId: MangaItem | string | number) => {
    const mangaId = typeof itemOrId === "object" ? itemOrId.id : itemOrId;

    setBackpack((prev) =>
      prev.filter((item) => String(item.id) !== String(mangaId)),
    );

    try {
      await toggleBackpackItem(mangaId);
    } catch (err) {
      console.error("Failed to sync removeFromBackpack with backend:", err);
    }
  };

  const isInBackpack = (id: string | number) => {
    return backpack.some((item) => String(item.id) === String(id));
  };

  return (
    <BackpackContext.Provider
      value={{
        backpack,
        setBackpack,
        addToBackpack,
        removeFromBackpack,
        isInBackpack,
      }}
    >
      {children}
    </BackpackContext.Provider>
  );
}

export function useBackpack(): BackpackContextValue {
  const context = useContext(BackpackContext);
  if (!context && typeof window !== 'undefined') {
    throw new Error("useBackpack must be used within a BackpackProvider");
  }
  return context;
}
