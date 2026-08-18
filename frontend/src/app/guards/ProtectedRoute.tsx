import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Navigate, Outlet } from "react-router";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
