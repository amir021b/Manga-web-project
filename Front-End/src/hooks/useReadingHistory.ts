"use client";

import { useSyncExternalStore } from "react";

const HISTORY_KEY = "mangahub_history";
const HISTORY_EVENT = "mangahub-history-updated";

export interface ReadingHistoryEntry {
  mangaId: number;
  chapterId: number;
  volumeId: string;
  updatedAt: string;
  progress?: number;
}

interface StoredHistoryEntry {
  chapterId: number;
  volumeId: string;
  updatedAt: string;
  progress?: number;
}

type StoredHistory = Record<string, StoredHistoryEntry>;

function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) return 0;
  return Math.min(1, Math.max(0, progress));
}

function readHistory(): StoredHistory {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed as StoredHistory;
  } catch {
    return {};
  }
}

function parseHistory(raw: string | null): ReadingHistoryEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return [];
    }
    return Object.entries(parsed as StoredHistory)
      .map(([mangaId, entry]) => ({
        mangaId: Number(mangaId),
        chapterId: entry.chapterId,
        volumeId: entry.volumeId,
        updatedAt: entry.updatedAt,
        ...(typeof entry.progress === "number" &&
        Number.isFinite(entry.progress)
          ? { progress: clampProgress(entry.progress) }
          : {}),
      }))
      .filter((entry) => Number.isFinite(entry.mangaId))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  } catch {
    return [];
  }
}

function getSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(HISTORY_KEY);
  } catch {
    return null;
  }
}

function getServerSnapshot(): string | null {
  return null;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(HISTORY_EVENT, callback);
  };
}

export function recordReading(
  mangaId: number,
  chapterId: number,
  volumeId: string,
): void {
  if (typeof window === "undefined") return;
  try {
    const history = readHistory();
    const previous = history[String(mangaId)];
    const sameChapter = previous?.chapterId === chapterId;
    const progress =
      sameChapter && typeof previous?.progress === "number"
        ? clampProgress(previous.progress)
        : 0;
    history[String(mangaId)] = {
      chapterId,
      volumeId,
      updatedAt: new Date().toISOString(),
      progress,
    };
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    return;
  }
}

export function getReadingProgress(
  mangaId: number,
  chapterId: number,
): number {
  if (typeof window === "undefined") return 0;
  const history = readHistory();
  const entry = history[String(mangaId)];
  if (!entry || entry.chapterId !== chapterId) return 0;
  if (typeof entry.progress !== "number" || !Number.isFinite(entry.progress)) {
    return 0;
  }
  return clampProgress(entry.progress);
}

export function updateReadingProgress(
  mangaId: number,
  chapterId: number,
  progress: number,
): void {
  if (typeof window === "undefined") return;
  try {
    const history = readHistory();
    const key = String(mangaId);
    const entry = history[key];
    if (!entry || entry.chapterId !== chapterId) return;
    history[key] = { ...entry, progress: clampProgress(progress) };
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new Event(HISTORY_EVENT));
  } catch {
    return;
  }
}

export function useReadingHistory(): ReadingHistoryEntry[] {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return parseHistory(raw);
}
