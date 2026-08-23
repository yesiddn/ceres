import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useLogout } from "@/modules/auth/hooks/useLogout";
import { LogoutIcon } from "../icons/LogoutIcon";

export function MobileAppBar() {
  const { user } = useAuth();
  const logout = useLogout();

  return (
    <header
      className="
        sticky top-0 z-30
        flex items-center justify-between
        border-b border-slate-200
        bg-white px-4 py-3
        lg:hidden
      "
    >
      <span className="text-lg font-semibold">Ceres</span>

      <details className="relative">
        <summary
          className="
            cursor-pointer list-none
            rounded-md px-3 py-2
            text-sm font-medium
            hover:bg-slate-100
          "
        >
          Cuenta
        </summary>

        <div
          className="
            absolute right-0 mt-2 w-64
            rounded-lg border border-slate-200
            bg-white p-3 shadow-lg
          "
        >
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
      </details>
    </header>
  );
}
