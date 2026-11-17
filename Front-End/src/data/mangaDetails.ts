import mangaSeedData from './mangadata';
import { berserkVolume1 } from './chapters/berserk';

export interface Chapter {
  chapterId: number;
  number: number;
  title: string;
  volumeId: string;
  date: string;
  pages: string[];
}

export interface Volume {
  volumeId: string;
  number: number;
  title: string;
  coverImage: string;
  chapters: Chapter[];
}

export interface MangaDetail {
  volumes: Volume[];
}

const detailStore: Record<number, MangaDetail> = {};

for (const manga of mangaSeedData) {
  detailStore[manga.id] = { volumes: [] };
}

detailStore[17] = { volumes: [berserkVolume1] };

export const mangaDetails = detailStore;
