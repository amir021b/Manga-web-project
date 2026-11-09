const API_BASE = import.meta.env.VITE_API_BASE || '';
const BACKPACK_ENDPOINT = `${API_BASE}/api/backpack`;

const authHeaders = () => {
  const token = sessionStorage.getItem('mangahub_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export async function fetchBackpack() {
  const res = await fetch(BACKPACK_ENDPOINT, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function addToBackpack(mangaId) {
  const res = await fetch(BACKPACK_ENDPOINT, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ mangaId }),
  });
  return handleResponse(res);
}

export async function removeFromBackpack(mangaId) {
  const res = await fetch(`${BACKPACK_ENDPOINT}/${encodeURIComponent(mangaId)}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}
