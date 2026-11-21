import mangaSeedData, { type MangaSeedItem } from '@/data/mangadata';
import {
  mangaDetails,
  type Chapter,
  type MangaDetail,
  type Volume,
} from '@/data/mangaDetails';

export interface MangaItem extends MangaSeedItem {
  posterUrl: string;
}

export type { Chapter, MangaDetail, Volume } from '@/data/mangaDetails';

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

/** Returns a single manga by id, merged with its volume record. */
export function getMangaById(id: number): MangaWithDetails | undefined {
  const manga = mangaSeedData.find((m) => m.id === id);
  if (!manga) return undefined;
  return {
    ...manga,
    posterUrl: manga.coverImage,
    detail: mangaDetails[manga.id] ?? { volumes: [] },
  };
}

/** Returns manga in the requested order, omitting unknown ids. */
export function getMangaByIds(ids: number[]): MangaItem[] {
  return ids.flatMap((id) => {
    const manga = getMangaById(id);
    return manga ? [manga] : [];
  });
}

/** Returns all volumes for a manga, in order. */
export function getVolumes(id: number | string): Volume[] {
  const numericId = typeof id === 'number' ? id : Number(id);
  if (!Number.isFinite(numericId)) return [];
  return mangaDetails[numericId]?.volumes ?? [];
}

/** Returns a single volume for a manga. */
export function getVolume(
  id: number | string,
  volumeId: string,
): Volume | undefined {
  return getVolumes(id).find((volume) => volume.volumeId === volumeId);
}

/** Returns a chapter across all volumes of a manga. */
export function getChapter(
  id: number | string,
  chapterId: number | string,
): Chapter | undefined {
  const numericChapterId =
    typeof chapterId === 'number' ? chapterId : Number(chapterId);
  if (!Number.isFinite(numericChapterId)) return undefined;
  for (const volume of getVolumes(id)) {
    const chapter = volume.chapters.find(
      (ch) => ch.chapterId === numericChapterId,
    );
    if (chapter) return chapter;
  }
  return undefined;
}

/** Returns the previous and next chapters in reading order. */
export function getAdjacentChapters(
  id: number | string,
  chapterId: number | string,
): { prev: Chapter | null; next: Chapter | null } {
  const chapters = getVolumes(id).flatMap((volume) => volume.chapters);
  const numericChapterId =
    typeof chapterId === 'number' ? chapterId : Number(chapterId);
  const index = chapters.findIndex(
    (chapter) => chapter.chapterId === numericChapterId,
  );
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? chapters[index - 1] : null,
    next: index < chapters.length - 1 ? chapters[index + 1] : null,
  };
}

/** Returns the number of published chapters available for a manga. */
export function getAvailableChapterCount(id: number | string): number {
  return getVolumes(id).reduce(
    (count, volume) => count + volume.chapters.length,
    0,
  );
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
