import mangaSeedData, { type MangaSeedItem } from '@/data/mangadata';
import { mangaDetails, type MangaDetail } from '@/data/mangaDetails';

export interface MangaItem extends MangaSeedItem {
  posterUrl: string;
}

export type { Chapter, MangaDetail } from '@/data/mangaDetails';

export interface MangaWithDetails extends MangaItem {
  detail: MangaDetail;
}

/** Returns the full list of manga from local mock data. */
export function getAllManga(): MangaItem[] {
  return mangaSeedData.map((m) => ({
    ...m,
    posterUrl: m.coverImage,
  }));
}

/** Returns a single manga by id, merged with its chapter record. */
export function getMangaById(id: number): MangaWithDetails | undefined {
  const manga = mangaSeedData.find((m) => m.id === id);
  if (!manga) return undefined;
  return {
    ...manga,
    posterUrl: manga.coverImage,
    detail: mangaDetails[manga.id] ?? { chapters: [] },
  };
}

/** Returns manga in the requested order, omitting unknown ids. */
export function getMangaByIds(ids: number[]): MangaItem[] {
  return ids.flatMap((id) => {
    const manga = getMangaById(id);
    return manga ? [manga] : [];
  });
}

/** Returns the number of published chapters available for a manga. */
export function getAvailableChapterCount(id: number | string): number {
  const numericId = typeof id === 'number' ? id : Number(id);
  if (!Number.isFinite(numericId)) return 0;
  return mangaDetails[numericId]?.chapters?.length ?? 0;
}

/** True when a manga has at least one chapter available to read. */
export function hasAvailableChapters(id: number | string): boolean {
  return getAvailableChapterCount(id) > 0;
}

/** Simple case-insensitive filter by title. */
export function searchManga(query: string): MangaItem[] {
  const q = query.toLowerCase().trim();
  if (!q) return getAllManga();
  return getAllManga().filter((m) => m.title.toLowerCase().includes(q));
}
