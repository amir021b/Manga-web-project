import api, { getApiErrorMessage, getStoredToken } from "@/lib/axios";
import {
  getAdjacentChapters as getMockAdjacentChapters,
  getAvailableChapterCount as getMockAvailableChapterCount,
  getChapter as getMockChapter,
  getAllManga as getMockAllManga,
  getMangaById as getMockMangaById,
  getMangaByIds as getMockMangaByIds,
  getVolume as getMockVolume,
  getVolumes as getMockVolumes,
  hasAvailableChapters as getMockHasAvailableChapters,
  searchManga as getMockSearchManga,
  type Chapter,
  type MangaItem,
  type MangaWithDetails,
  type Volume,
} from "@/services/mangaApi";
import {
  getMockProfile as getMockProfileImpl,
  updateProfile as updateMockProfile,
  unwrapUserPayload,
} from "@/services/userApi";
import type {
  ProfileResponse,
  UpdateProfileInput,
  UserData,
} from "@/types/api";

export type {
  Chapter,
  MangaDetail,
  MangaItem,
  MangaWithDetails,
  Volume,
} from "@/services/mangaApi";

const PROFILE_ENDPOINT = "/api/users/profile";

export const USE_MOCK_PROFILE =
  process.env.NEXT_PUBLIC_USE_MOCK !== "false";

function notImplemented(name: string): never {
  throw new Error(`Not implemented: ${name}`);
}

export function getAllManga(): MangaItem[] {
  if (USE_MOCK_PROFILE) return getMockAllManga();
  return notImplemented("getAllManga");
}

export function getMangaById(id: number): MangaWithDetails | undefined {
  if (USE_MOCK_PROFILE) return getMockMangaById(id);
  return notImplemented("getMangaById");
}

export function getMangaByIds(ids: number[]): MangaItem[] {
  if (USE_MOCK_PROFILE) return getMockMangaByIds(ids);
  return notImplemented("getMangaByIds");
}

export function getVolumes(id: number | string): Volume[] {
  if (USE_MOCK_PROFILE) return getMockVolumes(id);
  return notImplemented("getVolumes");
}

export function getVolume(
  id: number | string,
  volumeId: string,
): Volume | undefined {
  if (USE_MOCK_PROFILE) return getMockVolume(id, volumeId);
  return notImplemented("getVolume");
}

export function getChapter(
  id: number | string,
  chapterId: number | string,
): Chapter | undefined {
  if (USE_MOCK_PROFILE) return getMockChapter(id, chapterId);
  return notImplemented("getChapter");
}

export function getAdjacentChapters(
  id: number | string,
  chapterId: number | string,
): { prev: Chapter | null; next: Chapter | null } {
  if (USE_MOCK_PROFILE) return getMockAdjacentChapters(id, chapterId);
  return notImplemented("getAdjacentChapters");
}

export function getAvailableChapterCount(id: number | string): number {
  if (USE_MOCK_PROFILE) return getMockAvailableChapterCount(id);
  return notImplemented("getAvailableChapterCount");
}

export function hasAvailableChapters(id: number | string): boolean {
  if (USE_MOCK_PROFILE) return getMockHasAvailableChapters(id);
  return notImplemented("hasAvailableChapters");
}

export function searchManga(query: string): MangaItem[] {
  if (USE_MOCK_PROFILE) return getMockSearchManga(query);
  return notImplemented("searchManga");
}

export function getMockProfile(): UserData {
  return getMockProfileImpl();
}

export async function fetchProfile(): Promise<UserData | null> {
  if (USE_MOCK_PROFILE) return getMockProfile();

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
  if (USE_MOCK_PROFILE) return updateMockProfile(userData);

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
