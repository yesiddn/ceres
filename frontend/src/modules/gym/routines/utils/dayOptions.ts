import { DayOfWeekFlag } from "../types/routine";

export const dayOptions = [
  { flag: DayOfWeekFlag.Monday, label: "Lunes" },
  { flag: DayOfWeekFlag.Tuesday, label: "Martes" },
  { flag: DayOfWeekFlag.Wednesday, label: "Miércoles" },
  { flag: DayOfWeekFlag.Thursday, label: "Jueves" },
  { flag: DayOfWeekFlag.Friday, label: "Viernes" },
  { flag: DayOfWeekFlag.Saturday, label: "Sábado" },
  { flag: DayOfWeekFlag.Sunday, label: "Domingo" },
] as const;
