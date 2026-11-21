import api, { getApiErrorMessage, getStoredToken } from "@/lib/axios";
import type {
  ApiResponse,
  BackpackResponse,
  BackpackToggleResult,
} from "@/types/api";

const BACKPACK_ENDPOINT = "/api/users/backpack";

export async function fetchBackpack(): Promise<string[]> {
  if (!getStoredToken()) return [];

  try {
    const { data } = await api.get<BackpackResponse>(BACKPACK_ENDPOINT);
    const payload = data.data;
    const backpack = Array.isArray(payload)
      ? payload
      : payload?.backpack ?? [];

    return backpack.map((id) => String(id));
  } catch {
    return [];
  }
}

export async function toggleBackpackItem(
  mangaId: string | number,
): Promise<BackpackToggleResult> {
  if (!getStoredToken()) return [];

  try {
    const { data } = await api.post<ApiResponse<BackpackToggleResult>>(
      BACKPACK_ENDPOINT,
      { mangaId: String(mangaId) },
    );

    return data.data ?? [];
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update backpack"));
  }
}
