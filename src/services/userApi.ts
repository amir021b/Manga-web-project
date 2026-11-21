import api, { getApiErrorMessage } from "@/lib/axios";
import { USE_MOCK_API } from "@/lib/mockMode";
import type {
  ProfilePayload,
  ProfileResponse,
  UpdateProfileInput,
  UserData,
} from "@/types/api";

const PROFILE_ENDPOINT = "/api/users/profile";

const mockProfile: UserData = {
  id: "mock-user",
  username: "Manga Tester",
  email: "manga.tester@mangahub.local",
  bio: "Frontend UI testing profile with mocked data.",
  avatar: "/avatars/manga-tester.png",
};

export function getMockProfile(): UserData {
  return { ...mockProfile };
}

export function unwrapUserPayload(
  payload: ProfilePayload | undefined,
): UserData | null {
  if (!payload) return null;

  if (typeof payload === "object" && payload !== null && "user" in payload) {
    return payload.user ?? null;
  }

  return payload as UserData;
}

export async function updateProfile(
  userData: UpdateProfileInput,
): Promise<UserData | null> {
  if (USE_MOCK_API) {
    Object.assign(mockProfile, userData);
    return getMockProfile();
  }

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
