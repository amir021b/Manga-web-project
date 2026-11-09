/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const setCurrentUser = useCallback((nextUser) => {
    setUser(nextUser);
    window.dispatchEvent(new CustomEvent('user-updated', { detail: nextUser }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.dispatchEvent(new CustomEvent('user-updated', { detail: null }));
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

  const value = { user, setCurrentUser, logout, isLoggedIn: !!user };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default UserProvider;
