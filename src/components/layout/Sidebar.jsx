import { Car, CreditCard, LayoutDashboard, LogOut, Users } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../services/authService.js";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/carros", label: "Carros", icon: Car },
  { to: "/pagamentos", label: "Pagamentos", icon: CreditCard },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await logout();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <aside className="border-slate-200 bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Car size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold">DriveGestor</p>
            <p className="text-sm text-slate-400">Gestão de frota</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:p-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  [
                    "inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white",
                  ].join(" ")
                }
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="inline-flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={19} aria-hidden="true" />
            {loggingOut ? "Saindo..." : "Sair"}
          </button>
        </div>
      </div>
    </aside>
  );
}
