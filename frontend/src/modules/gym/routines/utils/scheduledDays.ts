import { DayOfWeekFlag, type ScheduledDays } from "../types/routine";
import { dayOptions } from "./dayOptions";

export function fromScheduledDays(days: ScheduledDays): number[] {
  return dayOptions.filter(({ flag }) => (days & flag) === flag).map(({ flag }) => flag);
}

export function toScheduledDays(days: readonly number[]): ScheduledDays {
  return days.reduce<number>((result, flag) => result | flag, DayOfWeekFlag.None);
}
