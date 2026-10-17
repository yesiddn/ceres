import { Suspense } from "react";
import type { exerciseLoader } from "../loaders/exerciseLoader";
import { Await, useLoaderData, useNavigate } from "react-router";
import type { ExerciseFormValues } from "../schemas/exerciseSchema";
import { updateExercise } from "../services/exerciseService";
import type { ExerciseResponse } from "../types/exercise";
import { ExerciseForm } from "../components/ExerciseForm";
import { ExerciseFormSkeleton } from "../components/ExerciseFormSkeleton";
import { ExerciseLoadError } from "../components/ExerciseLoadError";

export function EditExercisePage() {
  const { exercise } = useLoaderData<typeof exerciseLoader>();

  return (
    <Suspense fallback={<ExerciseFormSkeleton />}>
      <Await resolve={exercise} errorElement={<ExerciseLoadError />}>
        {(resolvedExercise) => <EditExerciseContent exercise={resolvedExercise} />}
      </Await>
    </Suspense>
  );
}

function EditExerciseContent({ exercise }: { exercise: ExerciseResponse }) {
  const navigate = useNavigate();

  async function handleUpdate(values: ExerciseFormValues) {
    await updateExercise(exercise.id, values);

    navigate("/gym/exercises");
  }

  return (
    <ExerciseForm
      defaultValues={{
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
      }}
      submitLabel="Guardar cambios"
      onSubmit={handleUpdate}
    />
  );
}
