import { Car, CreditCard, LayoutDashboard, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/carros', label: 'Carros', icon: Car },
  { to: '/pagamentos', label: 'Pagamentos', icon: CreditCard },
];

export default function Sidebar() {
  return (
    <aside className="border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-20 lg:w-72 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-slate-200 px-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Car size={24} aria-hidden="true" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-950">DriveGestor</p>
            <p className="text-sm text-slate-500">Aluguel de veículos</p>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:overflow-visible lg:p-5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  [
                    'inline-flex min-h-11 shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
                  ].join(' ')
                }
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
