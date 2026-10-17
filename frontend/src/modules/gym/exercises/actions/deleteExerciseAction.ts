import { data, type ActionFunctionArgs } from "react-router";
import { ApiError } from "@/shared/services/api/ApiError";
import { deleteExercise } from "../services/exerciseService";

export interface DeleteExerciseActionData {
  ok: boolean;
  exerciseId?: string;
  error?: string;
}

export async function deleteExerciseAction({ request }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return data<DeleteExerciseActionData>(
      {
        ok: false,
        error: "Método no permitido.",
      },
      { status: 405 },
    );
  }

  const formData = await request.formData();
  const exerciseId = formData.get("exerciseId");

  if (typeof exerciseId !== "string" || exerciseId.length === 0) {
    return data<DeleteExerciseActionData>(
      {
        ok: false,
        error: "El identificador del ejercicio es obligatorio.",
      },
      { status: 400 },
    );
  }

  try {
    await deleteExercise(exerciseId);

    return {
      ok: true,
      exerciseId,
    };
  } catch (error: unknown) {
    if (error instanceof ApiError && error.status === 409) {
      return data<DeleteExerciseActionData>(
        {
          ok: false,
          exerciseId,
          error: "No puedes eliminar este ejercicio porque está siendo utilizado por una rutina.",
        },
        { status: 409 },
      );
    }

    return data<DeleteExerciseActionData>(
      {
        ok: false,
        exerciseId,
        error: "No fue posible eliminar el ejercicio.",
      },
      { status: 500 },
    );
  }
}
