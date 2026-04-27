import { Banknote, Car, Clock3, Users } from 'lucide-react';
import CardDashboard from '../components/CardDashboard.jsx';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { listItems } from '../utils/storage.js';

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Dashboard() {
  const clientes = listItems('clientes');
  const carros = listItems('carros');
  const pagamentos = listItems('pagamentos');
  const pagamentosPendentes = pagamentos.filter((pagamento) => pagamento.status === 'Pendente');
  const pagamentosRecebidos = pagamentos
    .filter((pagamento) => pagamento.status === 'Pago')
    .reduce((total, pagamento) => total + Number(pagamento.valor || 0), 0);
  const proximosPagamentos = pagamentosPendentes
    .slice()
    .sort((a, b) => new Date(a.vencimento) - new Date(b.vencimento))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-2 text-sm text-stone-500">
          Acompanhe clientes, frota e recebimentos registrados no navegador.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <CardDashboard title="Clientes cadastrados" value={clientes.length} icon={Users} tone="sky" />
        <CardDashboard title="Carros cadastrados" value={carros.length} icon={Car} tone="emerald" />
        <CardDashboard title="Pagamentos pendentes" value={pagamentosPendentes.length} icon={Clock3} tone="amber" />
        <CardDashboard title="Pagamentos recebidos" value={currency.format(pagamentosRecebidos)} icon={Banknote} tone="rose" />
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-stone-950">Próximos vencimentos</h2>
            <p className="text-sm text-stone-500">Pagamentos pendentes ordenados por data.</p>
          </div>
        </div>

        {proximosPagamentos.length === 0 ? (
          <EmptyState
            title="Nenhum pagamento pendente"
            description="Quando houver cobranças em aberto, elas aparecerão aqui."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="table-head">
                <tr>
                  <th className="table-cell">Valor</th>
                  <th className="table-cell">Vencimento</th>
                  <th className="table-cell">Forma</th>
                  <th className="table-cell">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {proximosPagamentos.map((pagamento) => (
                  <tr key={pagamento.id} className="text-stone-700">
                    <td className="table-cell font-semibold text-stone-950">{currency.format(Number(pagamento.valor))}</td>
                    <td className="table-cell">{new Date(`${pagamento.vencimento}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                    <td className="table-cell">{pagamento.formaPagamento}</td>
                    <td className="table-cell"><StatusBadge status={pagamento.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
