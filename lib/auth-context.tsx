"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { API_URL, fetchJson } from "@/lib/api";
import { AuthUser } from "@/lib/types";

const STORAGE_KEY = "gt_auth";

interface StoredAuth {
  token: string;
  user: AuthUser;
}

interface AuthResult {
  accessToken: string;
  user: AuthUser;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (displayName: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  checkUsername: (username: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): StoredAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuth;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = readStoredAuth();
    if (!stored) {
      setIsLoading(false);
      return;
    }

    fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${stored.token}` },
    })
      .then(async (res) => {
        if (res.ok) {
          const freshUser: AuthUser = await res.json();
          setToken(stored.token);
          setUser(freshUser);
          return;
        }
        if (res.status === 401) {
          localStorage.removeItem(STORAGE_KEY);
          return;
        }
        // Transient server/network error: keep the cached session instead of logging out.
        setToken(stored.token);
        setUser(stored.user);
      })
      .catch(() => {
        setToken(stored.token);
        setUser(stored.user);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function persist(result: AuthResult) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: result.accessToken, user: result.user }));
    setToken(result.accessToken);
    setUser(result.user);
  }

  async function login(username: string, password: string) {
    const result = await fetchJson<AuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    persist(result);
  }

  async function register(displayName: string, username: string, password: string) {
    const result = await fetchJson<AuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ displayName, username, password }),
    });
    persist(result);
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }

  async function checkUsername(username: string): Promise<boolean> {
    const result = await fetchJson<{ available: boolean }>(
      `/auth/check-username?username=${encodeURIComponent(username)}`,
    );
    return result.available;
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      checkUsername,
    }),
    [user, token, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
