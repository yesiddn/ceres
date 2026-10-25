import type { LoaderFunctionArgs } from "react-router";
import { getRoutine } from "../services/routineService";

export function routineLoader({ params, request }: LoaderFunctionArgs) {
  const routineId = params.routineId;

  if (!routineId) {
    throw new Response("Routine id is required", {
      status: 400,
    });
  }

  return {
    routine: getRoutine(routineId, request.signal),
  };
}
