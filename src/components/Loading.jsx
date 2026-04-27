export default function Loading({ message = "Carregando dados..." }) {
  return (
    <div className="panel flex min-h-40 items-center justify-center p-6">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
        <span>{message}</span>
      </div>
    </div>
  );
}
