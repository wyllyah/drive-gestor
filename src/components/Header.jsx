import { CalendarDays } from 'lucide-react';

export default function Header() {
  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-medium text-slate-500">Gestão operacional</p>
          <p className="text-base font-semibold text-slate-950">Controle de locações</p>
        </div>
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 sm:flex">
          <CalendarDays size={17} aria-hidden="true" />
          <span className="capitalize">{today}</span>
        </div>
      </div>
    </header>
  );
}
