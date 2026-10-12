import { Link } from "react-router";

export function ExercisesPageHeader() {
  return (
    <header className="space-y-3">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 id="exercises-title" className="text-2xl font-semibold">
            Ejercicios
          </h1>

          <p className="mt-2 text-slate-600">Consulta tu catálogo personal de ejercicios.</p>
        </div>

        <Link
          to="/gym/exercises/new"
          className="min-h-11 shrink-0 rounded-lg bg-slate-900 px-4 py-2
          font-medium text-white disabled:cursor-not-allowed
          disabled:opacity-60"
          aria-describedby="exercise-actions-note"
        >
          Nuevo ejercicio
        </Link>
      </div>
    </header>
  );
}
