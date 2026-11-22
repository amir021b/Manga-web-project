import { getMangaByIds, type MangaItem } from '@/services/mangaApi';

export const newUserBundle: MangaItem[] = getMangaByIds([10, 13, 14]);
