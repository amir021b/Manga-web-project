const API_BASE = import.meta.env.VITE_API_BASE || '';
const PROFILE_ENDPOINT = `${API_BASE}/api/user/profile`;

const authHeaders = () => {
  const token = sessionStorage.getItem('mangahub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export async function fetchProfile() {
  const res = await fetch(PROFILE_ENDPOINT, {
    method: 'GET',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function updateProfile({ bio, avatar }) {
  const formData = new FormData();
  if (bio !== undefined) formData.append('bio', bio);
  if (avatar) formData.append('avatar', avatar);

  const res = await fetch(PROFILE_ENDPOINT, {
    method: 'PUT',
    headers: authHeaders(),
    body: formData,
  });

  return handleResponse(res);
}
