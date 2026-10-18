import { useState } from "react";
import { useAsyncError, useRevalidator } from "react-router";
import { RoutinesSkeleton } from "./RoutinesSkeleton";
import { RoutinesPageHeader } from "./RoutinesPageheader";
import { getErrorMessage } from "../utils/getErrorMessage";

export function RoutinesLoadError() {
  const error = useAsyncError();
  const revalidator = useRevalidator();

  const [retryingError, setRetryingError] = useState<unknown>(null);

  const isRetrying = retryingError === error;

  function handleRetry() {
    setRetryingError(error);
    void revalidator.revalidate();
  }

  if (isRetrying) return <RoutinesSkeleton />;

  return (
    <section aria-labelledby="exercises-title" className="space-y-6">
      <RoutinesPageHeader />

      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p role="alert" className="text-red-800">
          {getErrorMessage(error)}
        </p>

        <button
          type="button"
          onClick={handleRetry}
          className="mt-4 min-h-11 rounded-lg border border-red-300 px-4 cursor-pointer
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-red-700"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}
