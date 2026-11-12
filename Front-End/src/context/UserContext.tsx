/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface UserData {
  username?: string;
  email?: string;
  avatar?: string | null;
  bio?: string;
}

interface UserContextValue {
  user: UserData | null;
  setCurrentUser: (nextUser: UserData | null) => void;
  logout: () => void;
  setIsLoadingAuth: (loading: boolean) => void;
  isLoadingAuth: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const setCurrentUser = useCallback((nextUser: UserData | null) => {
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
    const handleUserUpdated = (e: CustomEvent) => {
      setUser(e.detail);
    };
    window.addEventListener('user-updated', handleUserUpdated as EventListener);
    return () => {
      window.removeEventListener('user-updated', handleUserUpdated as EventListener);
    };
  }, []);

  const value: UserContextValue = { user, setCurrentUser, logout, setIsLoadingAuth, isLoadingAuth, isLoggedIn: !!user };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default UserProvider;
