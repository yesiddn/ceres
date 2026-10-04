import { Outlet, useNavigation } from "react-router";

import { DesktopSidebar } from "@/app/components/layout/DesktopSidebar";
import { MobileAppBar } from "@/app/components/layout/MobileAppBar";
import { MobileBottomNavigation } from "@/app/components/layout/MobileBottomNavigation";

export function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div
      className="
        min-h-dvh bg-slate-50 text-slate-950
        lg:grid
        lg:grid-cols-[16rem_minmax(0,1fr)]
      "
    >
      <DesktopSidebar />

      <div className="min-w-0">
        <MobileAppBar />

        <main
          className="
            mx-auto w-full max-w-7xl
            px-4 py-6 pb-24
            sm:px-6
            lg:px-8 lg:py-8 lg:pb-8
          "
        >
          {isLoading && (
            <p role="status" className="mb-4 text-sm text-slate-600">
              Cargando contenido…
            </p>
          )}
          <Outlet />
        </main>
      </div>

      <MobileBottomNavigation />
    </div>
  );
}
