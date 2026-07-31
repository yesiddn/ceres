import { useState, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = (token: string) => {
    setAccessToken(token);
  };

  const logout = () => {
    setAccessToken(null);
  };

  const value: AuthContextValue = {
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    logout,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
