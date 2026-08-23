import type { ComponentType } from "react";
import type { IconProps } from "../components/icons/IconProps";
import { CalendarIcon } from "../components/icons/CalendarIcon";
import { FitnessIcon } from "../components/icons/FitnessIcon";
import { PlannerIcon } from "../components/icons/PlannerIcon";

interface GymNavigationItem {
  label: string;
  to: string;
  icon: ComponentType<IconProps>;
}
export const gymNavigationItems: GymNavigationItem[] = [
  {
    label: "Rutinas",
    to: "/gym/routines",
    icon: CalendarIcon,
  },
  {
    label: "Entrenamientos",
    to: "/gym/workouts",
    icon: PlannerIcon,
  },
  {
    label: "Ejercicios",
    to: "/gym/exercises",
    icon: FitnessIcon,
  },
];
