import { Await, useLoaderData } from "react-router";
import { routinesLoader } from "../loaders/routinesLoader";
import { RoutinesPageHeader } from "../components/RoutinesPageheader";
import { Suspense } from "react";
import { RoutinesSkeleton } from "../components/RoutinesSkeleton";
import { RoutinesLoadError } from "../components/RoutinesLoadError";
import { RoutineCard } from "../components/RoutineCard";

export function RoutinesPage() {
  const { routines } = useLoaderData<typeof routinesLoader>();

  return (
    <Suspense fallback={<RoutinesSkeleton />}>
      <Await resolve={routines} errorElement={<RoutinesLoadError />}>
        {(resolvedRoutines) => (
          <section aria-labelledby="routines-title" className="space-y-6">
            <RoutinesPageHeader />

            {resolvedRoutines.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8">
                <p className="font-medium">Todavía no tienes rutinas.</p>

                <p className="mt-2 text-slate-600">
                  Crea tu primera rutina para organizar tus entrenamientos.
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resolvedRoutines.map((routine) => (
                  <li key={routine.id} className="min-w-0">
                    <RoutineCard routine={routine} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </Await>
    </Suspense>
  );
}
