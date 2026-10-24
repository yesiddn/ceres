import { Link } from "react-router";
import type { RoutineListItemResponse } from "../types/routine";
import { formatScheduledDays } from "../utils/formatScheduledDays";

interface RoutineCardProps {
  routine: RoutineListItemResponse;
}

export function RoutineCard({ routine }: RoutineCardProps) {
  return (
    <Link
      to={`/gym/routines/${routine.id}/edit`}
      className="block h-full min-w-0 rounded-xl border border-slate-200
           bg-white p-4 transition-colors hover:border-slate-400
           focus-visible:outline-2 focus-visible:outline-offset-2
           focus-visible:outline-slate-900"
    >
      <h2 className="wrap-break-word text-lg font-semibold">{routine.name}</h2>

      <p className="mt-2 text-sm text-slate-600">{formatScheduledDays(routine.scheduledDays)}</p>
    </Link>
  );
}
