import { Await, useLoaderData, useNavigate } from "react-router";
import type { routineLoader } from "../loaders/routineLoader";
import { Suspense } from "react";
import { RoutineFormSkeleton } from "../components/RoutineFormSkeleton";
import { RoutineLoadError } from "../components/RoutineLoadError";
import type { RoutineResponse } from "../types/routine";
import type { RoutineFormValues } from "../schemas/routineSchema";
import { RoutineForm } from "../components/RoutineForm";
import { fromScheduledDays } from "../utils/scheduledDays";

export function EditRoutinePage() {
  const { routine } = useLoaderData<typeof routineLoader>();

  return (
    <Suspense fallback={<RoutineFormSkeleton />}>
      <Await resolve={routine} errorElement={<RoutineLoadError />}>
        {(resolvedRoutine) => (
          <EditRoutineContent key={resolvedRoutine.id} routine={resolvedRoutine} />
        )}
      </Await>
    </Suspense>
  );
}

function EditRoutineContent({ routine }: { routine: RoutineResponse }) {
  const navigate = useNavigate();

  async function handleUpdate(values: RoutineFormValues) {
    console.log(values);

    navigate("/gym/routines");
  }

  return (
    <RoutineForm
      defaultValues={{
        name: routine.name,
        scheduledDays: fromScheduledDays(routine.scheduledDays),
      }}
      onSubmit={handleUpdate}
    />
  );
}
