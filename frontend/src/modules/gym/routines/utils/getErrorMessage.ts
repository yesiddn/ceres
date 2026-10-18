import { ApiError } from "@/shared/services/api/ApiError";
import { isRouteErrorResponse } from "react-router";

export function getErrorMessage(error: unknown) {
  const status =
    error instanceof ApiError
      ? error.status
      : isRouteErrorResponse(error)
        ? error.status
        : undefined;

  if (status === 401) {
    return "No se pudo validar tu sesión.";
  }

  if (status === 403) {
    return "No tienes permiso para consultar estas rutinas.";
  }

  if (status !== undefined && status >= 500) {
    return "El servidor no pudo cargar las rutinas. Inténtalo nuevamente.";
  }

  return "No pudimos cargar tus rutinas. Revisa tu conexión e inténtalo nuevamente.";
}
