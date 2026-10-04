import { useRevalidator, useRouteError } from "react-router";

export function AuthInitializationErrorBoundary() {
  const error = useRouteError();
  const revalidator = useRevalidator();

  const isRetrying = revalidator.state === "loading";

  // Puedes conectar `error` con tu mecanismo de diagnóstico.
  void error;

  return (
    <main className="grid min-h-dvh place-items-center p-4">
      <section className="max-w-md space-y-4">
        <h1 className="text-xl font-semibold">No pudimos cargar Ceres</h1>

        <p role="alert">Revisa tu conexión e inténtalo nuevamente.</p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={() => {
            void revalidator.revalidate();
          }}
          className="min-h-11 rounded-lg border px-4
            focus-visible:outline-2
            focus-visible:outline-offset-2"
        >
          {isRetrying ? "Reintentando…" : "Reintentar"}
        </button>
      </section>
    </main>
  );
}
