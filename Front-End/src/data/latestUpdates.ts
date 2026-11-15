import { getMangaByIds, type MangaItem } from '@/services/mangaApi';

export const latestUpdates: MangaItem[] = getMangaByIds([
  11, 12, 13, 14, 15, 16, 20, 21, 22, 23,
]);
