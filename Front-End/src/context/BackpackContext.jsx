/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';

const BackpackContext = createContext([]);

export function BackpackProvider({ children }) {
  const [backpack, setBackpack] = useState(() => {
    try {
      const saved = localStorage.getItem('mangahub_backpack');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const addToBackpack = useCallback((item) => {
    setBackpack((prev) => {
      if (prev.some((m) => m.id === item.id)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeFromBackpack = useCallback((id) => {
    setBackpack((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const isInBackpack = useCallback((id) => {
    return backpack.some((m) => m.id === id);
  }, [backpack]);

  return (
    <BackpackContext.Provider value={{ backpack, setBackpack, addToBackpack, removeFromBackpack, isInBackpack }}>
      {children}
    </BackpackContext.Provider>
  );
}

export function useBackpack() {
  const context = useContext(BackpackContext);
  if (!context) {
    throw new Error('useBackpack must be used within a BackpackProvider');
  }
  return context;
}

export default BackpackProvider;
