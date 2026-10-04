import { Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import type { exercisesLoader } from "../loaders/exercisesLoader";
import { ExercisesSkeleton } from "../components/ExercisesSkeleton";
import { ExercisesPageHeader } from "../components/ExercisesPageHeader";
import { ExerciseCard } from "../components/ExerciseCard";

export function ExercisesPage() {
  const { exercises } = useLoaderData<typeof exercisesLoader>();

  return (
    <Suspense fallback={<ExercisesSkeleton />}>
      <Await resolve={exercises}>
        {(resolvedExercises) => (
          <section aria-labelledby="exercises-title" className="space-y-6">
            <ExercisesPageHeader />

            {resolvedExercises.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 p-8">
                <p className="font-medium">Todavía no tienes ejercicios.</p>

                <p className="mt-2 text-slate-600">
                  Aquí aparecerá tu catálogo personal de ejercicios.
                </p>
              </div>
            ) : (
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {resolvedExercises.map((exercise) => (
                  <li key={exercise.id} className="min-w-0">
                    <ExerciseCard exercise={exercise} />
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
