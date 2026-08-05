import { useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";
import type { AuthUser } from "../types/auth";
import { getUserFromAccessToken } from "../utils/getUserFromAccessToken";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (token: string) => {
    const authenticatedUser = getUserFromAccessToken(token);

    setAccessToken(token);
    setUser(authenticatedUser);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
