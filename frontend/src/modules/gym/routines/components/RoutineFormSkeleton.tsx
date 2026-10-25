import { dayOptions } from "../utils/dayOptions";

export function RoutineFormSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-xl animate-pulse space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm motion-reduce:animate-none sm:p-7"
    >
      <div className="space-y-5">
        <div>
          <div className="h-5 w-36 rounded bg-slate-200" />
          <div className="mt-2 h-12 rounded-xl bg-slate-200" />
        </div>

        <div>
          <div className="h-6 w-36 rounded bg-slate-200" />
          <div className="flex h-6 items-center">
            <div className="h-4 w-80 max-w-full rounded bg-slate-200" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dayOptions.map(({ flag }) => (
              <div key={flag} className="flex h-6 min-w-0 items-center gap-2">
                <div className="h-4 w-4 shrink-0 rounded bg-slate-200" />
                <div className="h-4 w-20 max-w-full rounded bg-slate-200" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="h-6 w-24 rounded bg-slate-200" />
    </div>
  );
}
