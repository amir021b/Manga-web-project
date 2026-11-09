/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  fetchBackpack as apiFetchBackpack,
  addToBackpack as apiAddToBackpack,
  removeFromBackpack as apiRemoveFromBackpack,
} from '../services/backpackApi';

const BackpackContext = createContext(null);

const getToken = () => {
  try {
    return sessionStorage.getItem('mangahub_token');
  } catch {
    return null;
  }
};

const loadLocal = () => {
  try {
    const saved = localStorage.getItem('mangahub_backpack');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveLocal = (items) => {
  try {
    localStorage.setItem('mangahub_backpack', JSON.stringify(items));
  } catch {
    // Intentionally empty: localStorage may be unavailable.
  }
};

export function BackpackProvider({ children }) {
  const [backpack, setBackpack] = useState(loadLocal);

  const isAuthenticated = useCallback(() => !!getToken(), []);

  // Fetch from backend on mount / auth state change.
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!isAuthenticated()) return;
      try {
        const data = await apiFetchBackpack();
        const items = Array.isArray(data) ? data : (data && data.backpack ? data.backpack : []);
        if (mounted) setBackpack(items);
      } catch {
        // Keep existing local state if the API is unavailable.
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated]);

  // React to login/logout dispatched by UserContext.
  useEffect(() => {
    const handleUserUpdated = (e) => {
      if (e.detail) {
        apiFetchBackpack()
          .then((data) => {
            const items = Array.isArray(data) ? data : (data && data.backpack ? data.backpack : []);
            setBackpack(items);
          })
          .catch(() => {});
      } else {
        setBackpack([]);
        saveLocal([]);
      }
    };
    window.addEventListener('user-updated', handleUserUpdated);
    return () => {
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  const addToBackpack = useCallback(async (itemOrId) => {
    const id = typeof itemOrId === 'object' && itemOrId !== null ? itemOrId.id : itemOrId;
    const localItem = typeof itemOrId === 'object' && itemOrId !== null ? itemOrId : { id };

    setBackpack((prev) => {
      if (prev.some((m) => String(m.id) === String(id))) return prev;
      const next = [...prev, localItem];
      if (!getToken()) saveLocal(next);
      return next;
    });

    if (getToken()) {
      try {
        await apiAddToBackpack(id);
      } catch {
        // API failed; local optimistic state is preserved.
      }
    }
  }, []);

  const removeFromBackpack = useCallback(async (id) => {
    setBackpack((prev) => {
      const next = prev.filter((m) => String(m.id) !== String(id));
      if (!getToken()) saveLocal(next);
      return next;
    });

    if (getToken()) {
      try {
        await apiRemoveFromBackpack(id);
      } catch {
        // API failed; local optimistic state is preserved.
      }
    }
  }, []);

  const isInBackpack = useCallback((id) => {
    return backpack.some((m) => String(m.id) === String(id));
  }, [backpack]);

  return (
    <BackpackContext.Provider
      value={{ backpack, setBackpack, addToBackpack, removeFromBackpack, isInBackpack }}
    >
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
