import api, { getApiErrorMessage, getStoredToken } from "@/lib/axios";
import type {
  ProfilePayload,
  ProfileResponse,
  UpdateProfileInput,
  UserData,
} from "@/types/api";

const PROFILE_ENDPOINT = "/api/users/profile";

export function unwrapUserPayload(
  payload: ProfilePayload | undefined,
): UserData | null {
  if (!payload) return null;

  if (typeof payload === "object" && payload !== null && "user" in payload) {
    return payload.user ?? null;
  }

  return payload as UserData;
}

export async function fetchProfile(): Promise<UserData | null> {
  if (!getStoredToken()) return null;

  try {
    const { data } = await api.get<ProfileResponse>(PROFILE_ENDPOINT);
    return unwrapUserPayload(data.data);
  } catch {
    return null;
  }
}

export async function updateProfile(
  userData: UpdateProfileInput,
): Promise<UserData | null> {
  try {
    const { data } = await api.put<ProfileResponse>(PROFILE_ENDPOINT, {
      username: userData.username,
      bio: userData.bio,
      avatar: userData.avatar,
    });

    return unwrapUserPayload(data.data);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Failed to update profile"));
  }
}
