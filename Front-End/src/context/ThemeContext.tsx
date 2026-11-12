"use client";

/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

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
  { id: 'compact', label: 'Compact' },
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
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('mangahub_theme') || 'dark'; } catch { return 'dark'; }
  });
  const [accent, setAccent] = useState(() => {
    try { return localStorage.getItem('mangahub_accent') || 'red'; } catch { return 'red'; }
  });
  const [density, setDensity] = useState(() => {
    try { return localStorage.getItem('mangahub_density') || 'comfortable'; } catch { return 'comfortable'; }
  });

  useEffect(() => {
    localStorage.setItem('mangahub_theme', theme);
    localStorage.setItem('mangahub_accent', accent);
    localStorage.setItem('mangahub_density', density);
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
    document.documentElement.dataset.density = density;
  }, [theme, accent, density]);

  const value: ThemeContextValue = { theme, setTheme, accent, setAccent, density, setDensity, THEME_OPTIONS, ACCENT_OPTIONS, DENSITY_OPTIONS };

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
