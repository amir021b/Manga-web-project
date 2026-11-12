const API_URL = "http://localhost:5000/api/auth";

export interface AuthResponse {
  data?: {
    token?: string;
    user?: any;
  };
  message?: string;
}

export async function submitAuth(values: Record<string, any>, mode: string): Promise<any> {
  const endpoint = mode === "signup" ? `${API_URL}/signup` : `${API_URL}/login`;

  const payload =
    mode === "signup"
      ? {
          username: values.username,
          email: values.email,
          password: values.password,
        }
      : { email: values.email, password: values.password };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || "Authentication failed") as Error & { code?: string };
    if (data.message?.includes("already registered"))
      error.code = "email_exists";
    if (data.message?.includes("INCORRECT")) error.code = "invalid_credentials";
    throw error;
  }

  if (data.data?.token) {
    localStorage.setItem("mangahub_token", data.data.token);
  }

  return data;
}
