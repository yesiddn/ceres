import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b bg-white px-6 py-4">
        <h1 className="text-xl font-semibold">Ceres</h1>
      </header>

      <div className="flex">
        <aside className="min-h-[calc(100vh-65px)] w-64 border-r bg-white p-4">Navegación</aside>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
