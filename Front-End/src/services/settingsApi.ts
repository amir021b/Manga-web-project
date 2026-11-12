const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '';
const SETTINGS_ENDPOINT = `${API_BASE}/api/user/settings`;

const authHeaders = (): HeadersInit => {
  const token = sessionStorage.getItem('mangahub_token');
  return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : {};
};

const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

export async function changePassword({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) {
  const res = await fetch(`${SETTINGS_ENDPOINT}/password`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(res);
}

export async function updateEmail({ email }: { email: string }) {
  const res = await fetch(`${SETTINGS_ENDPOINT}/email`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}
