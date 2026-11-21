export const queryKeys = {
  profile: ["user", "profile"] as const,
  backpack: ["backpack"] as const,
  comments: {
    list: (mangaId: number) => ["comments", String(mangaId)] as const,
  },
  manga: {
    list: ["manga", "list"] as const,
    detail: (id: number) => ["manga", "detail", String(id)] as const,
    search: (query: string) => ["manga", "search", query] as const,
  },
};
