import api, {
  getApiErrorBody,
  getApiErrorMessage,
  getApiErrorStatus,
  setStoredToken,
} from "@/lib/axios";
import type {
  AuthErrorCode,
  AuthMode,
  AuthResponse,
  AuthValues,
  LoginPayload,
  SignupPayload,
} from "@/types/api";

export class AuthRequestError extends Error {
  code: AuthErrorCode;

  constructor(message: string, code: AuthErrorCode) {
    super(message);
    this.name = "AuthRequestError";
    this.code = code;
  }
}

function inferAuthErrorCode(
  message: string,
  serverCode: string | undefined,
  status: number | undefined,
): AuthErrorCode {
  const normalized = `${serverCode ?? ""} ${message}`.toLowerCase();

  if (
    normalized.includes("email_exists") ||
    normalized.includes("already registered") ||
    normalized.includes("already exists")
  ) {
    return "email_exists";
  }

  if (
    normalized.includes("invalid_credentials") ||
    normalized.includes("incorrect") ||
    normalized.includes("invalid email or password")
  ) {
    return "invalid_credentials";
  }

  if (status === undefined) return "network_error";

  return "server_error";
}

function buildPayload(
  values: AuthValues,
  mode: AuthMode,
): LoginPayload | SignupPayload {
  if (mode === "signup") {
    return {
      username: values.username,
      email: values.email,
      password: values.password,
    };
  }

  return {
    email: values.email,
    password: values.password,
  };
}

export async function submitAuth(
  values: AuthValues,
  mode: AuthMode,
): Promise<AuthResponse> {
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

  try {
    const { data } = await api.post<AuthResponse>(
      endpoint,
      buildPayload(values, mode),
    );

    if (data.data?.token) {
      setStoredToken(data.data.token);
    }

    return data;
  } catch (error) {
    const message = getApiErrorMessage(error, "Authentication failed");
    const body = getApiErrorBody(error);
    const status = getApiErrorStatus(error);

    throw new AuthRequestError(
      message,
      inferAuthErrorCode(message, body?.code, status),
    );
  }
}
