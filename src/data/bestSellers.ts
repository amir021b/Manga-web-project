import { getMangaByIds, type MangaItem } from '@/services/mangaApi';

export const bestSellers: MangaItem[] = getMangaByIds([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
]);
