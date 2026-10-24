import { ApiError } from "@/shared/services/api/ApiError";
import { isRouteErrorResponse, Link, useRouteError } from "react-router";

function getErrorStatus(error: unknown) {
  if (error instanceof ApiError) return error.status;

  if (isRouteErrorResponse(error)) return error.status;

  return undefined;
}

export function RoutineErrorBoundary() {
  const error = useRouteError();

  const status = getErrorStatus(error);
  const isNotFound = status === 404;

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {isNotFound ? "Rutina no encontrada" : "Ocurrió un error"}
        </h1>

        <p role="alert" className="mt-2 text-slate-600">
          {isNotFound ? "La rutina solicitado no existe." : "No fue posible mostrar esta página."}
        </p>
      </div>

      <Link
        to="/gym/exercises"
        className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4"
      >
        Volver a ejercicios
      </Link>
    </section>
  );
}
