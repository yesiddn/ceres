import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
