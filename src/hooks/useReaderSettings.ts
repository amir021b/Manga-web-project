"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ReaderMargin = "none" | "small" | "medium" | "large";
export type ReaderMode = "scroll" | "paged";

export interface ReaderSettings {
  margin: ReaderMargin;
  darkPages: boolean;
  mode: ReaderMode;
}

export const READER_SETTINGS_KEY = "mangahub_reader";

export const DEFAULT_READER_SETTINGS: ReaderSettings = {
  margin: "medium",
  darkPages: false,
  mode: "scroll",
};

const MARGINS: ReaderMargin[] = ["none", "small", "medium", "large"];
const MODES: ReaderMode[] = ["scroll", "paged"];

function readStoredSettings(): ReaderSettings {
  if (typeof window === "undefined") {
    return { ...DEFAULT_READER_SETTINGS };
  }

  try {
    const raw = window.localStorage.getItem(READER_SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_READER_SETTINGS };

    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...DEFAULT_READER_SETTINGS };
    }

    const record = parsed as Record<string, unknown>;
    return {
      margin: MARGINS.includes(record.margin as ReaderMargin)
        ? (record.margin as ReaderMargin)
        : DEFAULT_READER_SETTINGS.margin,
      darkPages:
        typeof record.darkPages === "boolean"
          ? record.darkPages
          : DEFAULT_READER_SETTINGS.darkPages,
      mode: MODES.includes(record.mode as ReaderMode)
        ? (record.mode as ReaderMode)
        : DEFAULT_READER_SETTINGS.mode,
    };
  } catch {
    return { ...DEFAULT_READER_SETTINGS };
  }
}

function persistSettings(settings: ReaderSettings): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      READER_SETTINGS_KEY,
      JSON.stringify(settings),
    );
  } catch {
    return;
  }
}

export function useReaderSettings() {
  const [settings, setSettings] =
    useState<ReaderSettings>(DEFAULT_READER_SETTINGS);
  const [isHydrated, setIsHydrated] = useState(false);
  const settingsRef = useRef<ReaderSettings>(DEFAULT_READER_SETTINGS);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const stored = readStoredSettings();
      settingsRef.current = stored;
      setSettings(stored);
      setIsHydrated(true);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  const updateSettings = useCallback((patch: Partial<ReaderSettings>) => {
    const next: ReaderSettings = { ...settingsRef.current, ...patch };
    settingsRef.current = next;
    setSettings(next);
    persistSettings(next);
  }, []);

  return { settings, updateSettings, isHydrated };
}
