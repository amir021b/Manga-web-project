export const queryKeys = {
  profile: ["user", "profile"] as const,
  backpack: ["backpack"] as const,
  manga: {
    list: ["manga", "list"] as const,
    detail: (id: number) => ["manga", "detail", String(id)] as const,
    search: (query: string) => ["manga", "search", query] as const,
  },
};
