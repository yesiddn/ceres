export function ExercisesSkeleton() {
  return (
    <section className="space-y-6">
      <p role="status" className="sr-only">
        Cargando ejercicios…
      </p>

      <div aria-hidden="true" className="space-y-6 motion-safe:animate-pulse">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-3">
            <div className="h-8 w-40 rounded bg-slate-200" />
            <div className="h-4 w-64 max-w-full rounded bg-slate-200" />
          </div>

          <div className="h-11 w-40 rounded-lg bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4">
              <div className="h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />

              <div className="mt-4 flex gap-2">
                <div className="h-11 w-20 rounded-lg bg-slate-200" />
                <div className="h-11 w-24 rounded-lg bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
