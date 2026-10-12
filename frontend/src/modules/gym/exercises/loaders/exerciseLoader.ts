import type { LoaderFunctionArgs } from "react-router";
import { getExercise } from "../services/exerciseService";

export function exerciseLoader({ params, request }: LoaderFunctionArgs) {
  const exerciseId = params.exerciseId;

  if (!exerciseId) {
    throw new Response("Exercise id is required.", { status: 400 });
  }

  return {
    exercise: getExercise(exerciseId, request.signal),
  };
}
