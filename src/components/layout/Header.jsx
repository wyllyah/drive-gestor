import { CalendarDays } from "lucide-react";

export default function Header() {
  const today = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0 shrink-0">
          <p className="truncate text-sm font-medium text-slate-500">Gestão operacional</p>
          <p className="truncate text-base font-semibold text-slate-950">Controle de locações</p>
        </div>

        <div className="ml-auto hidden shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 md:flex">
          <CalendarDays size={17} aria-hidden="true" />
          <span className="max-w-44 truncate capitalize">{today}</span>
        </div>
      </div>
    </header>
  );
}
