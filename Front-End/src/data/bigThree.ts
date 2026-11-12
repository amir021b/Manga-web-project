export interface MangaItem {
  id: number | string;
  title: string;
  genre: string;
  posterUrl?: string;
  badge?: string;
  rating?: string;
  synopsis?: string;
}

export const bigThree: MangaItem[] = [
  {
    id: 1,
    title: "Berserk",
    genre: "Dark Fantasy",
    posterUrl: "/Berserk_black_white_4x.png",
  },
  {
    id: 2,
    title: "Vinland Saga",
    genre: "Historical",
    posterUrl: "/Vinland_Saga_black_white_4x.png",
  },
  {
    id: 3,
    title: "Vagabond",
    genre: "Samurai",
    posterUrl: "/Vagabond_black_white_4x.png",
  },
];
