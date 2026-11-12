const API_URL = "http://localhost:5000/api/users";

interface UserData {
  username?: string;
  email?: string;
  avatar?: string | null;
  bio?: string;
}

export async function fetchProfile(): Promise<UserData | null> {
  const token = localStorage.getItem("mangahub_token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return null;
    const result = await res.json();
    return result.data?.user || result.data;
  } catch (err) {
    console.error("Failed to fetch profile:", err);
    return null;
  }
}

export async function updateProfile(userData: UserData): Promise<UserData | null> {
  const token = localStorage.getItem("mangahub_token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: userData.username,
      bio: userData.bio,
      avatar: userData.avatar,
    }),
  });

  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result.data?.user || result.data;
}
