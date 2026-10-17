import { useForm } from "react-hook-form";
import { exerciseSchema, type ExerciseFormValues } from "../schemas/exerciseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { ApiError } from "@/shared/services/api/ApiError";

interface ExerciseFormProps {
  defaultValues?: ExerciseFormValues;
  submitLabel: string;
  onSubmit: (values: ExerciseFormValues) => Promise<void>;
}

export function ExerciseForm({ defaultValues, submitLabel, onSubmit }: ExerciseFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExerciseFormValues>({ resolver: zodResolver(exerciseSchema), defaultValues });

  const [submitError, setSubmitError] = useState<string | null>(null);

  async function submit(values: ExerciseFormValues) {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("No fue posible guardar el ejercicio.");
    }
  }

  const inputClassName =
    "mt-2 min-h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:border-red-500 aria-[invalid=true]:focus:ring-red-500/10";

  return (
    <form
      onSubmit={handleSubmit(submit)}
      noValidate
      className="w-full max-w-xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-800">
            Nombre del ejercicio
          </label>
          <input
            type="text"
            id="name"
            placeholder="Ej. Press de banca"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            className={inputClassName}
          />
          {errors.name && (
            <p id="name-error" role="alert" className="mt-2 text-sm font-medium text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="muscleGroup" className="block text-sm font-semibold text-slate-800">
            Grupo muscular
          </label>
          <input
            type="text"
            id="muscleGroup"
            placeholder="Ej. Pecho"
            aria-invalid={errors.muscleGroup ? "true" : "false"}
            aria-describedby={errors.muscleGroup ? "muscle-group-error" : undefined}
            {...register("muscleGroup")}
            className={inputClassName}
          />
          {errors.muscleGroup && (
            <p
              id="muscle-group-error"
              role="alert"
              className="mt-2 text-sm font-medium text-red-600"
            >
              {errors.muscleGroup.message}
            </p>
          )}
        </div>
      </div>

      {submitError && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="min-h-12 w-full cursor-pointer rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-400/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Guardando..." : submitLabel}
      </button>
    </form>
  );
}
