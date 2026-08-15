import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { logout as logoutRequest } from "../services/authService";

export function useLogout() {
  const { logout: clearLocalSession } = useAuth();

  return useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      clearLocalSession();
    }
  }, [clearLocalSession]);
}
