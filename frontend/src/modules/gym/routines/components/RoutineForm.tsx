import { Controller, useForm } from "react-hook-form";
import { routineSchema, type RoutineFormValues } from "../schemas/routineSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dayOptions } from "../utils/dayOptions";

interface RoutineFormProps {
  defaultValues: RoutineFormValues;
  onSubmit: (values: RoutineFormValues) => void;
}

export function RoutineForm({ defaultValues, onSubmit }: RoutineFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RoutineFormValues>({ resolver: zodResolver(routineSchema), defaultValues });

  function submit(values: RoutineFormValues) {
    onSubmit(values);
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
          <label htmlFor="routine-name" className="block text-sm font-semibold text-slate-800">
            Nombre del ejercicio
          </label>
          <input
            type="text"
            id="routine-name"
            placeholder="Ej. Torso A"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "routine-name-error" : undefined}
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
          <Controller
            name="scheduledDays"
            control={control}
            render={({ field }) => (
              <fieldset>
                <legend>Días programados</legend>

                <p id="scheduled-days-help">Puedes dejar la rutina sin días programados.</p>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {dayOptions.map(({ flag, label }, index) => (
                    <label key={flag}>
                      <input
                        type="checkbox"
                        name={field.name}
                        ref={index === 0 ? field.ref : undefined}
                        checked={field.value.includes(flag)}
                        onBlur={field.onBlur}
                        aria-describedby="scheduled-days-help"
                        onChange={(event) => {
                          const nextDays = event.target.checked
                            ? [...field.value, flag]
                            : field.value.filter((day) => day !== flag);

                          field.onChange(nextDays);
                        }}
                      />

                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
          />
          {errors.scheduledDays && (
            <p
              id="routine-scheduledDays-error"
              role="alert"
              className="mt-2 text-sm font-medium text-red-600"
            >
              {errors.scheduledDays.message}
            </p>
          )}
        </div>
      </div>

      <button type="submit">Validar datos</button>
    </form>
  );
}
