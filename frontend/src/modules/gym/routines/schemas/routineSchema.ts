import z from "zod";
import { dayOptions } from "../utils/dayOptions";

export const routineSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre debe contener máximo 100 caracteres."),
  scheduledDays: z.array(
    z
      .int()
      .refine(
        (value) => dayOptions.some(({ flag }) => flag === value),
        "El día seleccionado no es válido.",
      ),
  ),
});

export type RoutineFormValues = z.infer<typeof routineSchema>;
