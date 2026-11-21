"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AUTH_USER_KEY,
  clearStoredToken,
} from "@/lib/axios";
import { useProfileQuery } from "@/hooks/api/useUser";
import { getMockProfile, USE_MOCK_PROFILE } from "@/services/data";
import type { UserData } from "@/types/api";

interface UserContextValue {
  user: UserData | null;
  setCurrentUser: (nextUser: UserData | null) => void;
  logout: () => void;
  setIsLoadingAuth: (loading: boolean) => void;
  isLoadingAuth: boolean;
  isLoggedIn: boolean;
}

const UserContext = createContext<UserContextValue>({
  user: null,
  setCurrentUser: () => {},
  logout: () => {},
  setIsLoadingAuth: () => {},
  isLoadingAuth: true,
  isLoggedIn: false,
});

function readStoredUser(): UserData | null {
  if (typeof window === "undefined") return null;

  try {
    const localUser = window.localStorage.getItem(AUTH_USER_KEY);
    const storedUser =
      localUser ?? window.sessionStorage.getItem(AUTH_USER_KEY);

    if (!storedUser) return null;

    if (!localUser) {
      window.localStorage.setItem(AUTH_USER_KEY, storedUser);
      window.sessionStorage.removeItem(AUTH_USER_KEY);
    }

    return JSON.parse(storedUser) as UserData;
  } catch {
    return null;
  }
}

function persistUser(user: UserData | null): void {
  if (typeof window === "undefined") return;

  try {
    if (user) {
      window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      window.sessionStorage.removeItem(AUTH_USER_KEY);
    } else {
      window.localStorage.removeItem(AUTH_USER_KEY);
      window.sessionStorage.removeItem(AUTH_USER_KEY);
    }
  } catch {
    return;
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const setCurrentUser = useCallback((nextUser: UserData | null) => {
    persistUser(nextUser);
    setUser(nextUser);
    window.dispatchEvent(new CustomEvent("user-updated", { detail: nextUser }));
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    persistUser(null);
    setUser(null);
    queryClient.clear();
    window.dispatchEvent(new CustomEvent("user-updated", { detail: null }));
  }, [queryClient]);

  useEffect(() => {
    const restoreSession = () => {
      setUser(USE_MOCK_PROFILE ? getMockProfile() : readStoredUser());
      setIsLoadingAuth(false);
    };

    restoreSession();
  }, []);

  const { data: profile } = useProfileQuery(!!user);

  useEffect(() => {
    const syncProfile = () => {
      if (profile) {
        setCurrentUser(profile);
      }
    };

    syncProfile();
  }, [profile, setCurrentUser]);

  useEffect(() => {
    const handleUserUpdated = (event: CustomEvent<UserData | null>) => {
      setUser(event.detail);
    };

    window.addEventListener(
      "user-updated",
      handleUserUpdated as EventListener,
    );
    return () => {
      window.removeEventListener(
        "user-updated",
        handleUserUpdated as EventListener,
      );
    };
  }, []);

  const value: UserContextValue = {
    user,
    setCurrentUser,
    logout,
    setIsLoadingAuth,
    isLoadingAuth,
    isLoggedIn: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = (): UserContextValue => {
  const context = useContext(UserContext);
  if (!context && typeof window !== "undefined") {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
