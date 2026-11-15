export interface UserData {
  id?: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  bio?: string;
}

export type AuthMode = "login" | "signup";

export interface AuthValues {
  username?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  username?: string;
  email: string;
  password: string;
}

export interface AuthPayload {
  token?: string;
  user?: UserData;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
}

export type AuthResponse = ApiResponse<AuthPayload>;

export type ProfilePayload = UserData | { user?: UserData };
export type ProfileResponse = ApiResponse<ProfilePayload>;

export interface BackpackPayload {
  backpack?: Array<string | number>;
}

export type BackpackResponse = ApiResponse<BackpackPayload | Array<string | number>>;

export interface BackpackItem {
  id: string | number;
  title: string;
  genres: string[];
  posterUrl?: string;
}

export type BackpackToggleResult = BackpackItem[] | string[] | number[];

export interface UpdateProfileInput {
  username?: string;
  bio?: string;
  avatar?: string | null;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailInput {
  email: string;
}

export type AuthErrorCode =
  | "email_exists"
  | "invalid_credentials"
  | "network_error"
  | "server_error";

export interface ApiErrorBody {
  message?: string;
  code?: string;
  error?: string;
}
