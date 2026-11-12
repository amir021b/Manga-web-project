const API_URL = "http://localhost:5000/api/users/backpack";

export interface BackpackItem {
  id: number | string;
  title: string;
  genre: string;
  posterUrl?: string;
}

export async function fetchBackpack(): Promise<string[]> {
  const token = localStorage.getItem("mangahub_token");
  if (!token) return [];

  try {
    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return [];
    const result = await res.json();
    return result.data?.backpack || [];
  } catch (err) {
    console.error("Failed to fetch backpack:", err);
    return [];
  }
}

export async function toggleBackpackItem(mangaId: string | number): Promise<BackpackItem[]> {
  const token = localStorage.getItem("mangahub_token");
  if (!token) return [];

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mangaId: String(mangaId) }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update backpack");
  return result.data;
}

export async function addToBackpack(itemOrId: BackpackItem | string | number) {
  const id =
    typeof itemOrId === "object" && itemOrId !== null ? itemOrId.id : itemOrId;
  return toggleBackpackItem(id);
}

export async function removeFromBackpack(itemOrId: BackpackItem | string | number) {
  const id =
    typeof itemOrId === "object" && itemOrId !== null ? itemOrId.id : itemOrId;
  return toggleBackpackItem(id);
}

const backpackApi = {
  fetchBackpack,
  toggleBackpackItem,
  addToBackpack,
  removeFromBackpack,
};

export default backpackApi;
