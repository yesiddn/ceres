import { type ScheduledDays } from "../types/routine";
import { dayOptions } from "./dayOptions";

export function formatScheduledDays(days: ScheduledDays): string {
  const labels = dayOptions.filter(({ flag }) => (days & flag) === flag).map(({ label }) => label);

  return labels.length > 0 ? labels.join(", ") : "Sin días programados";
}
