const styles = {
  Disponivel: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Disponível: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Alugado: 'bg-sky-50 text-sky-700 ring-sky-200',
  Manutenção: 'bg-amber-50 text-amber-700 ring-amber-200',
  Pago: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  Pendente: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] || 'bg-stone-100 text-stone-700 ring-stone-200'
      }`}
    >
      {status}
    </span>
  );
}
