import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { login as loginRequest } from "../services/authService";
import axios from "axios";

export function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      const response = await loginRequest({
        email: values.email,
        password: values.password,
      });

      auth.login(response.accessToken);

      navigate("/", {
        replace: true,
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("root.server", {
          type: "server",
          message: "Credenciales incorrectas",
        });

        return;
      }

      setError("root.server", {
        type: "server",
        message: "No fue posible iniciar sesión. Intenta nuevamente.",
      });
    }
  }

  return (
    <section className="w-full max-w-md rounded-xl bg-white p-8 shadow">
      <h1 className="text-2xl font-semibold text-slate-900">Iniciar sesión</h1>

      <p className="mt-2 text-sm text-slate-600">Ingresa tus credenciales para continuar.</p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {errors.email?.message && (
            <p role="alert" className="mt-1 text-sm text-red-600">
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
            autoComplete="current-password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          />

          {errors.password?.message && (
            <p role="alert" className="mt-1 text-sm text-red-600">
              {errors.password.message}
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
          className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>
    </section>
  );
}
