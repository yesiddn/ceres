import { useState } from "react";
import { useAsyncError, useRevalidator } from "react-router";

import { ExercisesPageHeader } from "./ExercisesPageHeader";
import { ExercisesSkeleton } from "./ExercisesSkeleton";
import { getErrorMessage } from "../utils/getErrorMessage";

export function ExercisesLoadError() {
  const error = useAsyncError();
  const revalidator = useRevalidator();

  const [retryingError, setRetryingError] = useState<unknown>(null);

  const isRetrying = retryingError === error;

  function handleRetry() {
    setRetryingError(error);
    void revalidator.revalidate();
  }

  if (isRetrying) {
    return <ExercisesSkeleton />;
  }

  return (
    <section aria-labelledby="exercises-title" className="space-y-6">
      <ExercisesPageHeader />

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
