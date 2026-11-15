import { getMangaByIds, type MangaItem } from '@/services/mangaApi';

export type { MangaItem } from '@/services/mangaApi';

export const bigThree: MangaItem[] = getMangaByIds([17, 19, 18]);
