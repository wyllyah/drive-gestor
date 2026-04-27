import { X } from "lucide-react";

export default function Drawer({ open, title, description, onClose, children, footer }) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar painel"
      />
      <aside className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-6">
          <div>
            <h2 className="text-2xl font-bold tracking-normal text-slate-950">{title}</h2>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100"
            aria-label="Fechar"
          >
            <X size={22} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

        {footer && (
          <footer className="border-t border-slate-200 bg-slate-50 px-6 py-5">
            <div className="grid gap-3 sm:grid-cols-2">{footer}</div>
          </footer>
        )}
      </aside>
    </div>
  );
}
