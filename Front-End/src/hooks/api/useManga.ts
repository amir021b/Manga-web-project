"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllManga,
  getMangaById,
  searchManga,
  type MangaItem,
  type MangaWithDetails,
} from "@/services/data";
import { queryKeys } from "./queryKeys";

export function useMangaList() {
  return useQuery<MangaItem[]>({
    queryKey: queryKeys.manga.list,
    queryFn: getAllManga,
    initialData: getAllManga,
    staleTime: Infinity,
  });
}

export function useMangaById(id: number) {
  return useQuery<MangaWithDetails | null>({
    queryKey: queryKeys.manga.detail(id),
    queryFn: () => getMangaById(id) ?? null,
    initialData: () => getMangaById(id) ?? null,
    enabled: Number.isFinite(id),
    staleTime: Infinity,
    retry: false,
  });
}

export function useMangaSearch(query: string) {
  const normalizedQuery = query.trim();

  return useQuery<MangaItem[]>({
    queryKey: queryKeys.manga.search(normalizedQuery),
    queryFn: () => searchManga(normalizedQuery),
    initialData: () => searchManga(normalizedQuery),
    staleTime: Infinity,
  });
}
