import mangaSeedData from './mangadata';

export interface Chapter {
  chapterId: number;
  title: string;
  date: string;
}

export interface MangaDetail {
  chapters: Chapter[];
}

const chapterStore: Record<number, MangaDetail> = {};

for (const manga of mangaSeedData) {
  chapterStore[manga.id] = { chapters: [] };
}

export const mangaDetails = chapterStore;
