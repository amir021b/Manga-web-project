"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from 'react';

export const THEME_OPTIONS = [
  { id: 'dark', label: 'Dark', hint: 'Minimalist dark mode' },
];

export const ACCENT_OPTIONS = [
  { id: 'red', label: 'Default Red', color: '#ef4444' },
  { id: 'purple', label: 'Neon Purple', color: '#a855f7' },
  { id: 'blue', label: 'Cyber Blue', color: '#22d3ee' },
];

export const DENSITY_OPTIONS = [
  { id: 'comfortable', label: 'Comfortable' },
  // { id: 'compact', label: 'Compact' }, // Hidden until density is implemented
];

export type AccentOption = { id: string; label: string; color: string };
export type DensityOption = { id: string; label: string };

interface ThemeContextValue {
  theme: string;
  setTheme: (theme: string) => void;
  accent: string;
  setAccent: (accent: string) => void;
  density: string;
  setDensity: (density: string) => void;
  THEME_OPTIONS: typeof THEME_OPTIONS;
  ACCENT_OPTIONS: typeof ACCENT_OPTIONS;
  DENSITY_OPTIONS: typeof DENSITY_OPTIONS;
}

interface ThemeSettings {
  theme: string;
  accent: string;
  density: string;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  theme: 'dark',
  accent: 'red',
  density: 'comfortable',
};

const listeners = new Set<() => void>();
let currentSettings: ThemeSettings | null = null;

function readSettings(): ThemeSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;

  try {
    const savedDensity = window.localStorage.getItem('mangahub_density');
    return {
      theme: window.localStorage.getItem('mangahub_theme') || 'dark',
      accent: window.localStorage.getItem('mangahub_accent') || 'red',
      density:
        savedDensity === 'compact'
          ? 'comfortable'
          : savedDensity || 'comfortable',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function getSettingsSnapshot(): ThemeSettings {
  if (currentSettings === null) {
    currentSettings = readSettings();
  }
  return currentSettings;
}

function getServerSettingsSnapshot(): ThemeSettings {
  return DEFAULT_SETTINGS;
}

function applySettings(settings: ThemeSettings): void {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.accent = settings.accent;
  document.documentElement.dataset.density = settings.density;
}

function emitChange(): void {
  listeners.forEach((listener) => listener());
}

function subscribeToSettings(listener: () => void): () => void {
  listeners.add(listener);

  const handleStorage = () => {
    currentSettings = readSettings();
    applySettings(currentSettings);
    emitChange();
  };

  window.addEventListener('storage', handleStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

function updateSettings(patch: Partial<ThemeSettings>): void {
  const nextSettings = { ...getSettingsSnapshot(), ...patch };
  currentSettings = nextSettings;

  try {
    window.localStorage.setItem('mangahub_theme', nextSettings.theme);
    window.localStorage.setItem('mangahub_accent', nextSettings.accent);
    window.localStorage.setItem('mangahub_density', nextSettings.density);
  } catch {
    applySettings(nextSettings);
    emitChange();
    return;
  }

  applySettings(nextSettings);
  emitChange();
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  accent: 'red',
  setAccent: () => {},
  density: 'comfortable',
  setDensity: () => {},
  THEME_OPTIONS,
  ACCENT_OPTIONS,
  DENSITY_OPTIONS,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const settings = useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot,
  );

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  const setTheme = useCallback((theme: string) => {
    updateSettings({ theme });
  }, []);

  const setAccent = useCallback((accent: string) => {
    updateSettings({ accent });
  }, []);

  const setDensity = useCallback((density: string) => {
    updateSettings({ density });
  }, []);

  const value: ThemeContextValue = {
    theme: settings.theme,
    setTheme,
    accent: settings.accent,
    setAccent,
    density: settings.density,
    setDensity,
    THEME_OPTIONS,
    ACCENT_OPTIONS,
    DENSITY_OPTIONS,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context && typeof window !== 'undefined') {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
