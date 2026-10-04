import { useSyncExternalStore, type ReactNode } from "react";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";
import * as authRuntime from "../services/authRuntime";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const state = useSyncExternalStore(authRuntime.subscribe, authRuntime.getSnapshot);

  const value: AuthContextValue = {
    user: state.user,
    accessToken: state.accessToken,
    isAuthenticated: state.status === "authenticated",
    isInitialized: state.status !== "uninitialized",
    login: authRuntime.setSession,
    logout: authRuntime.clearSession,
  };

  return <AuthContext value={value}>{children}</AuthContext>;
}
