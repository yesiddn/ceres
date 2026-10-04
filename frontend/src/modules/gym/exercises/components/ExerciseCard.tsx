import type { ExerciseResponse } from "../types/exercise";

interface ExerciseCardProps {
  exercise: ExerciseResponse;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <article className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="break-words text-lg font-semibold">{exercise.name}</h2>

      <p className="mt-1 break-words text-sm text-slate-600">
        Grupo muscular: {exercise.muscleGroup}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled
          aria-label={`Editar ${exercise.name}`}
          className="min-h-11 rounded-lg border border-slate-300 px-4
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          Editar
        </button>

        <button
          type="button"
          disabled
          aria-label={`Eliminar ${exercise.name}`}
          className="min-h-11 rounded-lg border border-red-200 px-4 text-red-700
            disabled:cursor-not-allowed disabled:opacity-60"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}
