import { Banknote, Car, Clock3, Users } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import CardDashboard from "../components/CardDashboard.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { buscarResumoDashboard } from "../services/dashboardService.js";
import { listarPagamentosPorStatus } from "../services/pagamentosService.js";

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const getErrorMessage = (error) =>
  error?.message || "Não foi possível carregar os dados do dashboard.";

export default function Dashboard() {
  const [resumo, setResumo] = useState({
    totalClientes: 0,
    totalCarros: 0,
    pagamentosPendentes: 0,
    totalRecebido: 0,
  });
  const [proximosPagamentos, setProximosPagamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const carregarDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [resumoDashboard, pagamentosPendentes] = await Promise.all([
        buscarResumoDashboard(),
        listarPagamentosPorStatus("Pendente"),
      ]);

      setResumo(resumoDashboard);
      setProximosPagamentos(
        pagamentosPendentes
          .slice()
          .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))
          .slice(0, 5),
      );
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-500">
          Acompanhe clientes, frota e recebimentos registrados no Supabase.
        </p>
      </div>

      {error && <ErrorMessage message={error} onRetry={carregarDashboard} />}

      {loading ? (
        <Loading message="Carregando resumo do dashboard..." />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CardDashboard title="Clientes cadastrados" value={resumo.totalClientes} icon={Users} tone="sky" />
            <CardDashboard title="Carros cadastrados" value={resumo.totalCarros} icon={Car} tone="emerald" />
            <CardDashboard title="Pagamentos pendentes" value={resumo.pagamentosPendentes} icon={Clock3} tone="amber" />
            <CardDashboard
              title="Pagamentos recebidos"
              value={currency.format(resumo.totalRecebido)}
              icon={Banknote}
              tone="rose"
            />
          </section>

          <section className="panel p-5">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">Próximos vencimentos</h2>
                <p className="text-sm text-slate-500">Pagamentos pendentes ordenados por data.</p>
              </div>
            </div>

            {proximosPagamentos.length === 0 ? (
              <EmptyState
                title="Nenhum pagamento pendente"
                description="Quando houver cobranças em aberto, elas aparecerão aqui."
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="table-head">
                    <tr>
                      <th className="table-cell">Cliente</th>
                      <th className="table-cell">Carro</th>
                      <th className="table-cell">Valor</th>
                      <th className="table-cell">Vencimento</th>
                      <th className="table-cell">Forma</th>
                      <th className="table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {proximosPagamentos.map((pagamento) => (
                      <tr key={pagamento.id} className="text-slate-700">
                        <td className="table-cell font-semibold text-slate-950">
                          {pagamento.clientes?.nome || "Cliente removido"}
                        </td>
                        <td className="table-cell">
                          {pagamento.carros
                            ? `${pagamento.carros.marca} ${pagamento.carros.modelo}`
                            : "Carro removido"}
                        </td>
                        <td className="table-cell font-semibold text-slate-950">
                          {currency.format(Number(pagamento.valor))}
                        </td>
                        <td className="table-cell">
                          {new Date(`${pagamento.data_vencimento}T00:00:00`).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="table-cell">{pagamento.forma_pagamento}</td>
                        <td className="table-cell">
                          <StatusBadge status={pagamento.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
