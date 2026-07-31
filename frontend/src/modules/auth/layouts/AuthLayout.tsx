import { Outlet } from "react-router";

export function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100">
      <section className="w-full max-w-md">
        <Outlet />
      </section>
    </main>
  );
}
