import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { api } from "../lib/api";

interface AuthContextValue {
  authenticated: boolean | null;
  username: string | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get<{ authenticated: boolean; username?: string }>("/auth/me");
      setAuthenticated(res.authenticated);
      setUsername(res.username ?? null);
    } catch {
      setAuthenticated(false);
      setUsername(null);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setAuthenticated(false);
    setUsername(null);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ authenticated, username, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
