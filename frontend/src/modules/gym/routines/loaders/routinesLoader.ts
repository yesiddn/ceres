import type { LoaderFunctionArgs } from "react-router";
import { listRoutines } from "../services/routineService";

export function routinesLoader({ request }: LoaderFunctionArgs) {
  return {
    routines: listRoutines(request.signal),
  };
}
