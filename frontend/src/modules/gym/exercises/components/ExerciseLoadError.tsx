import { useState } from "react";
import { Link, useAsyncError, useRevalidator } from "react-router";

import { ApiError } from "@/shared/services/api/ApiError";
import { ExerciseFormSkeleton } from "./ExerciseFormSkeleton";

export function ExerciseLoadError() {
  const error = useAsyncError();
  const revalidator = useRevalidator();

  const [retryingError, setRetryingError] = useState<unknown>(null);

  const isRetrying = retryingError === error;

  const status = error instanceof ApiError ? error.status : undefined;

  const isNotFound = status === 404;

  function handleRetry() {
    setRetryingError(error);
    void revalidator.revalidate();
  }

  if (isRetrying) {
    return <ExerciseFormSkeleton />;
  }

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {isNotFound ? "Ejercicio no encontrado" : "No pudimos cargar el ejercicio"}
        </h1>

        <p role="alert" className="mt-2 text-slate-600">
          {isNotFound
            ? "El ejercicio que intentas editar no existe o ya fue eliminado."
            : "Ocurrió un problema al cargar el ejercicio. Inténtalo nuevamente."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/gym/exercises" className="min-h-11 rounded-lg border border-slate-300 px-4 py-2">
          Volver a ejercicios
        </Link>

        {!isNotFound && (
          <button
            type="button"
            onClick={handleRetry}
            className="min-h-11 rounded-lg bg-slate-900 px-4 py-2 text-white cursor-pointer"
          >
            Reintentar
          </button>
        )}
      </div>
    </section>
  );
}
