import { useAuth } from "@/modules/auth/hooks/useAuth";
import { AppLoadingScreen } from "@/shared/components/AppLoadingScreen";
import { Navigate, Outlet } from "react-router";

export function PublicOnlyRoute() {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <AppLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
