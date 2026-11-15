"use client";

import { createContext, useContext, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBackpackQuery,
  useToggleBackpackItem,
} from "@/hooks/api/useBackpack";
import { queryKeys } from "@/hooks/api/queryKeys";
import { getAllManga, type MangaItem } from "@/services/mangaApi";
import { USE_MOCK_PROFILE } from "@/services/userApi";
import { useUser } from "./UserContext";

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
  addToBackpack: () => {},
  removeFromBackpack: () => {},
  isInBackpack: () => false,
});

const allManga: MangaItem[] = getAllManga();

const normalizeId = (id: string | number): string => String(id);

export function BackpackProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useUser();
  const canSyncBackpack = isLoggedIn && !USE_MOCK_PROFILE;
  const queryClient = useQueryClient();
  const { data: backpackIds = [] } = useBackpackQuery(canSyncBackpack);
  const toggleBackpackItem = useToggleBackpackItem();

  const backpack = useMemo(() => {
    return backpackIds.flatMap((id) => {
      const manga = allManga.find(
        (item) => normalizeId(item.id) === normalizeId(id),
      );
      return manga ? [manga] : [];
    });
  }, [backpackIds]);

  const setBackpack = (nextBackpack: MangaItem[]) => {
    queryClient.setQueryData<string[]>(
      queryKeys.backpack,
      nextBackpack.map((item) => normalizeId(item.id)),
    );
  };

  const addToBackpack = (manga: MangaItem | string | number) => {
    const mangaId = typeof manga === "object" ? manga.id : manga;
    const normalizedId = normalizeId(mangaId);

    if (backpackIds.includes(normalizedId)) return;

    if (!canSyncBackpack) {
      queryClient.setQueryData<string[]>(queryKeys.backpack, [
        ...backpackIds,
        normalizedId,
      ]);
      return;
    }

    toggleBackpackItem.mutate({ id: mangaId, action: "add" });
  };

  const removeFromBackpack = (itemOrId: MangaItem | string | number) => {
    const mangaId = typeof itemOrId === "object" ? itemOrId.id : itemOrId;
    const normalizedId = normalizeId(mangaId);

    if (!backpackIds.includes(normalizedId)) return;

    if (!canSyncBackpack) {
      queryClient.setQueryData<string[]>(
        queryKeys.backpack,
        backpackIds.filter((id) => id !== normalizedId),
      );
      return;
    }

    toggleBackpackItem.mutate({ id: mangaId, action: "remove" });
  };

  const isInBackpack = (id: string | number) => {
    return backpackIds.includes(normalizeId(id));
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
  if (!context && typeof window !== "undefined") {
    throw new Error("useBackpack must be used within a BackpackProvider");
  }
  return context;
}
