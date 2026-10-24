import { Link } from "react-router";

export function RoutinesPageHeader() {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 id="routines-title" className="text-2xl font-semibold">
          Rutinas
        </h1>

        <p className="mt-2 text-slate-600">Consulta y organiza tus rutinas de entrenamiento.</p>
      </div>

      <Link
        to="/gym/routines/new"
        className="inline-flex min-h-11 shrink-0 items-center justify-center
             rounded-lg bg-slate-900 px-4 py-2 font-medium text-white
             focus-visible:outline-2 focus-visible:outline-offset-2
             focus-visible:outline-slate-900"
      >
        Nueva rutina
      </Link>
    </header>
  );
}
