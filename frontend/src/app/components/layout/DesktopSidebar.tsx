import { NavLink } from "react-router";

import { gymNavigationItems } from "@/app/navigation/gymNavigationItems";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useLogout } from "@/modules/auth/hooks/useLogout";
import { LogoutIcon } from "../icons/LogoutIcon";

export function DesktopSidebar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <aside
      className="
        hidden
        bg-white
        lg:sticky lg:top-0
        lg:flex lg:h-dvh lg:flex-col
      "
    >
      <div className="px-6 py-5">
        <span className="text-xl font-semibold">Ceres</span>
      </div>

      <nav aria-label="Navegación de Gym Tracking" className="flex-1 space-y-1 p-3">
        {gymNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex gap-2 rounded-md px-3 py-2",
                  "text-sm font-medium transition-colors",
                  isActive ? "bg-emerald-300 text-slate-950" : "text-slate-600 hover:bg-slate-50",
                ].join(" ")
              }
            >
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        {user && <p className="px-3 truncate text-sm text-slate-600">{user.email}</p>}

        <button
          type="button"
          onClick={() => void logout()}
          className="
              flex gap-2 text-red-500 w-full mt-3 cursor-pointer
              rounded-md px-3 py-2
              text-left text-sm font-medium
              hover:bg-slate-100
            "
        >
          <LogoutIcon />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
