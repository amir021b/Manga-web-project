/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const setCurrentUser = useCallback((nextUser) => {
    try {
      sessionStorage.setItem('mangahub_user', JSON.stringify(nextUser));
    } catch {
      // Intentionally empty: sessionStorage may be unavailable in some environments.
    }
    setUser(nextUser);
    window.dispatchEvent(new CustomEvent('user-updated', { detail: nextUser }));
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem('mangahub_user');
      sessionStorage.removeItem('mangahub_token');
    } catch {
      // Intentionally empty: sessionStorage may be unavailable in some environments.
    }
    setUser(null);
    window.dispatchEvent(new CustomEvent('user-updated', { detail: null }));
  }, []);

  useEffect(() => {
    const restoreSession = () => {
      try {
        const saved = sessionStorage.getItem('mangahub_user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      } finally {
        setIsLoadingAuth(false);
      }
    };
    restoreSession();
  }, []);

  useEffect(() => {
    const handleUserUpdated = (e) => {
      setUser(e.detail);
    };
    window.addEventListener('user-updated', handleUserUpdated);
    return () => {
      window.removeEventListener('user-updated', handleUserUpdated);
    };
  }, []);

  const value = { user, setCurrentUser, logout, setIsLoadingAuth, isLoadingAuth, isLoggedIn: !!user };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default UserProvider;
