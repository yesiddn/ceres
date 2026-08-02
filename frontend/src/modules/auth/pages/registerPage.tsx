import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { registerSchema, type RegisterFormValues } from "../schemas/registerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterRequest } from "../types/auth";
import { register as registerRequestService } from "../services/authService";
import axios from "axios";

export function RegisterPager() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    clearErrors("root.server");

    const request: RegisterRequest = {
      email: values.email,
      password: values.password,
    };

    try {
      await registerRequestService(request);

      navigate("/login", {
        replace: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          setError("email", {
            type: "server",
            message: "Ya existe una cuenta con este correo electrónico",
          });

          return;
        }

        setError("root.server", {
          type: "server",
          message: "No fue posible crear la cuenta. Intenta nuevamente.",
        });

        return;
      }

      setError("root.server", {
        type: "server",
        message: "Ocurreió un error inesperado. Intenta nuevamente.",
      });
    }
  }

  return (
    <section className="w-full max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-900">Crear cuenta</h1>

      <p className="mt-2 text-sm text-slate-600">Ingresa tus datos para crear una cuenta.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {errors.email?.message && (
            <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            {...register("password")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {errors.password?.message && (
            <p id="password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
            Confirmar contraseña
          </label>

          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirm-password-error" : undefined}
            {...register("confirmPassword")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {errors.confirmPassword?.message && (
            <p id="confirm-password-error" role="alert" className="mt-1 text-sm text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {errors.root?.server?.message && (
          <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
            {errors.root.server.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full cursor-pointer rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="text-center text-sm mt-4">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="font-medium underline">
          Inicia sesión
        </Link>
      </p>
    </section>
  );
}
