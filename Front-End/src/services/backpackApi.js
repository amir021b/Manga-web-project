const API_URL = "http://localhost:5000/api/users/backpack";

export async function fetchBackpack() {
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

export async function toggleBackpackItem(mangaId) {
  const token = localStorage.getItem("mangahub_token");
  if (!token) return;

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

export async function addToBackpack(itemOrId) {
  const id =
    typeof itemOrId === "object" && itemOrId !== null ? itemOrId.id : itemOrId;
  return toggleBackpackItem(id);
}

export async function removeFromBackpack(itemOrId) {
  const id =
    typeof itemOrId === "object" && itemOrId !== null ? itemOrId.id : itemOrId;
  return toggleBackpackItem(id);
}

export default {
  fetchBackpack,
  toggleBackpackItem,
  addToBackpack,
  removeFromBackpack,
};
