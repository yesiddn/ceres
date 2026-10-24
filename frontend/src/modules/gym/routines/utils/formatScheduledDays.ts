import { DayOfWeekFlag, type ScheduledDays } from "../types/routine";

const dayOptions = [
  { flag: DayOfWeekFlag.Monday, label: "Lunes" },
  { flag: DayOfWeekFlag.Tuesday, label: "Martes" },
  { flag: DayOfWeekFlag.Wednesday, label: "Miércoles" },
  { flag: DayOfWeekFlag.Thursday, label: "Jueves" },
  { flag: DayOfWeekFlag.Friday, label: "Viernes" },
  { flag: DayOfWeekFlag.Saturday, label: "Sábado" },
  { flag: DayOfWeekFlag.Sunday, label: "Domingo" },
] as const;

export function formatScheduledDays(days: ScheduledDays): string {
  const labels = dayOptions.filter(({ flag }) => (days & flag) === flag).map(({ label }) => label);

  return labels.length > 0 ? labels.join(", ") : "Sin días programados";
}
