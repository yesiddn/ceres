import { Link, useFetcher } from "react-router";
import type { ExerciseResponse } from "../types/exercise";
import type { DeleteExerciseActionData } from "../actions/deleteExerciseAction";
import type { SubmitEventHandler } from "react";

interface ExerciseCardProps {
  exercise: ExerciseResponse;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const fetcher = useFetcher<DeleteExerciseActionData>();
  const isDeleting = fetcher.state !== "idle";

  const handleDeleteSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    const confirmed = window.confirm(`¿Eliminar "${exercise.name}"?`);

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="wrap-break-words text-lg font-semibold">{exercise.name}</h2>

      <p className="mt-1 wrap-break-words text-sm text-slate-600">
        Grupo muscular: {exercise.muscleGroup}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to={`/gym/exercises/${exercise.id}/edit`}
          aria-label={`Editar ${exercise.name}`}
          className="flex items-center min-h-11 rounded-lg border border-slate-300 px-4
          disabled:cursor-not-allowed disabled:opacity-60"
        >
          Editar
        </Link>

        <fetcher.Form method="delete" action="/gym/exercises?index" onSubmit={handleDeleteSubmit}>
          <input type="hidden" name="exerciseId" value={exercise.id} />

          <button
            type="submit"
            disabled={isDeleting}
            aria-label={`Eliminar ${exercise.name}`}
            className="min-h-11 rounded-lg border border-red-200 px-4 text-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </button>
        </fetcher.Form>
      </div>

      {fetcher.data?.error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {fetcher.data.error}
        </p>
      )}
    </article>
  );
}
