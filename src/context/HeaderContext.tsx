"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface HeaderContextValue {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const HeaderContext = createContext<HeaderContextValue>({
  collapsed: false,
  toggle: () => {},
  setCollapsed: () => {},
});

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = useCallback(() => {
    setCollapsed((previous) => !previous);
  }, []);

  const value = useMemo(
    () => ({ collapsed, toggle, setCollapsed }),
    [collapsed, toggle],
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeaderCollapsed(): HeaderContextValue {
  return useContext(HeaderContext);
}

export default HeaderProvider;
