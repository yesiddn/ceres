// modules/gym/exercises/loaders/exercisesLoader.ts
import type { LoaderFunctionArgs } from "react-router";
import { listExercises } from "../services/exerciseService";

export function exercisesLoader({ request }: LoaderFunctionArgs) {
  return {
    exercises: listExercises(request.signal),
  };
}
