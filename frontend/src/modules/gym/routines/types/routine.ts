export const DayOfWeekFlag = {
  None: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 4,
  Thursday: 8,
  Friday: 16,
  Saturday: 32,
  Sunday: 64,
} as const;

export type ScheduledDays = number;

// requests
export interface RoutineExerciseRequest {
  exerciseId: string;
  order: number;
  targetSets: number;
  targetReps: number;
  restTimeSeconds: number;
  groupId: string | null;
}

export interface RoutineRequest {
  name: string;
  scheduledDays: ScheduledDays;
  exercises: RoutineExerciseRequest[];
}

// responses
export interface RoutineListItemResponse {
  id: string;
  name: string;
  scheduledDays: ScheduledDays;
}

export interface RoutineExerciseResponse {
  exerciseId: string;
  name: string;
  muscleGroup: string;
  order: number;
  targetSets: number;
  targetReps: number;
  restTimeSeconds: number;
  groupId: string | null;
}

export interface RoutineResponse {
  id: string;
  name: string;
  scheduledDays: ScheduledDays;
  exercises: RoutineExerciseResponse[];
}
