import { useRevalidator, useRouteError } from "react-router";
import { ExercisesPageHeader } from "../components/ExercisesPageHeader";
import { getErrorMessage } from "../utils/getErrorMessage";

export function ExercisesErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  const isRetrying = revalidator.state === "loading";

  return (
    <section aria-labelledby="exercises-title" className="space-y-6">
      <ExercisesPageHeader />

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p role="alert" className="text-red-800">
          {getErrorMessage(error)}
        </p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={() => {
            void revalidator.revalidate();
          }}
          className="mt-4 min-h-11 rounded-lg border border-red-300 px-4
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-red-700 disabled:cursor-not-allowed
            disabled:opacity-60"
        >
          {isRetrying ? "Reintentando…" : "Reintentar"}
        </button>

        {isRetrying && (
          <p role="status" className="mt-3 text-sm text-slate-600">
            Cargando ejercicios…
          </p>
        )}
      </div>
    </section>
  );
}
