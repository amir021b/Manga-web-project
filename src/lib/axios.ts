import axios from "axios";
import type { ApiErrorBody } from "@/types/api";

export const AUTH_TOKEN_KEY = "mangahub_token";
export const AUTH_USER_KEY = "mangahub_user";

const DEFAULT_API_BASE_URL = "http://localhost:5000";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;

  try {
    const localToken = window.localStorage.getItem(AUTH_TOKEN_KEY);
    if (localToken) return localToken;

    const sessionToken = window.sessionStorage.getItem(AUTH_TOKEN_KEY);
    if (sessionToken) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, sessionToken);
      window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
      return sessionToken;
    }
  } catch {
    return null;
  }

  return null;
}

export function setStoredToken(token: string | null): void {
  if (typeof window === "undefined") return;

  try {
    if (token) {
      window.localStorage.setItem(AUTH_TOKEN_KEY, token);
      window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    } else {
      window.localStorage.removeItem(AUTH_TOKEN_KEY);
      window.sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }
  } catch {
    return;
  }
}

export function clearStoredToken(): void {
  setStoredToken(null);
}

export function getApiErrorBody(error: unknown): ApiErrorBody | undefined {
  if (!axios.isAxiosError(error)) return undefined;

  const data: unknown = error.response?.data;
  return typeof data === "object" && data !== null
    ? (data as ApiErrorBody)
    : undefined;
}

export function getApiErrorStatus(error: unknown): number | undefined {
  if (!axios.isAxiosError(error)) return undefined;
  return error.response?.status;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Request failed",
): string {
  const body = getApiErrorBody(error);
  if (body?.message) return body.message;
  if (body?.error) return body.error;
  if (axios.isAxiosError(error)) return error.message || fallback;
  if (error instanceof Error) return error.message || fallback;
  return fallback;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

export default api;
