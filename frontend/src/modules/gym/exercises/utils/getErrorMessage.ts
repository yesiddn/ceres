import { isRouteErrorResponse } from "react-router";
import { ApiError } from "@/shared/services/api/ApiError";

export function getErrorMessage(error: unknown): string {
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
    return "No tienes permiso para consultar estos ejercicios.";
  }

  if (status !== undefined && status >= 500) {
    return "El servidor no pudo cargar los ejercicios. Inténtalo nuevamente.";
  }

  return "No pudimos cargar tus ejercicios. Revisa tu conexión e inténtalo nuevamente.";
}
