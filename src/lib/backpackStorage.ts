export const BACKPACK_STORAGE_KEY = "mangahub_backpack";

export function readStoredBackpack(): string[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(BACKPACK_STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((id) => typeof id === "string" || typeof id === "number")
      .map((id) => String(id));
  } catch {
    return [];
  }
}

export function persistBackpack(ids: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(BACKPACK_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    return;
  }
}

export function clearStoredBackpack(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(BACKPACK_STORAGE_KEY);
  } catch {
    return;
  }
}
