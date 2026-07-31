import { useAuth } from "@/modules/auth/hooks/useAuth";

export function DashboardPage() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <>
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <p className="mt-4">Estado: {isAuthenticated ? "Sesión iniciada" : "Sin autenticación"}</p>

      {isAuthenticated && (
        <button
          type="button"
          onClick={logout}
          className="mt-4 rounded bg-red-600 px-4 py-2 text-white"
        >
          Cerrar sesión
        </button>
      )}
    </>
  );
}
