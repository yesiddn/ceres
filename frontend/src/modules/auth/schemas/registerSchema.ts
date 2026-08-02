import z from "zod";

export const registerSchema = z
  .object({
    email: z.email("Ingresa un correo válido").trim().min(1, "El correo es obligatorio"),
    password: z
      .string()
      .min(1, "La contraseña es obligatoria")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "La confirmación de contraseña es obligatoria"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    error: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
