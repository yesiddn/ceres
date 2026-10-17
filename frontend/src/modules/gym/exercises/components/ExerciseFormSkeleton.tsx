export function ExerciseFormSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-slate-200" />

      <div className="space-y-2">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-11 rounded-lg bg-slate-200" />
      </div>

      <div className="space-y-2">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-11 rounded-lg bg-slate-200" />
      </div>

      <div className="h-11 w-36 rounded-lg bg-slate-200" />
    </div>
  );
}
