import type { UserData } from "../context/UserContext";

const API_URL = "http://localhost:5000/api/auth";

export interface AuthValues {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface AuthResponse {
  data?: {
    token?: string;
    user?: UserData;
  };
  message?: string;
}

export async function submitAuth(values: AuthValues, mode: string): Promise<AuthResponse> {
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
