import { gymNavigationItems } from "@/app/navigation/gymNavigationItems";
import { NavLink } from "react-router";

export function MobileBottomNavigation() {
  return (
    <nav
      aria-label="Navegación de Gym Tracking"
      className="fixed inset-x-0 bottom-0 z-40 shadow-md bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="mx-auto flex max-w-lg">
        {gymNavigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex gap-2 min-w-0 flex-1 items-center justify-center",
                  "px-2 py-4 text-xs font-medium tracking-tight",
                  "transition-colors",
                  isActive ? "text-emerald-500" : "text-slate-500",
                ].join(" ")
              }
            >
              <Icon />
              {item.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
