import z from "zod";

export const exerciseSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio.")
    .max(100, "El nombre debe contener máximo 100 caracteres."),
  muscleGroup: z
    .string()
    .trim()
    .min(1, "El grupo muscular es obligatorio")
    .max(50, "El grupo muscular debe contener máximo 50 caracteres."),
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
