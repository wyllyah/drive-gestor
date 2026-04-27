import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CheckCircle2, CreditCard, Info, Plus, QrCode, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Button from "../components/ui/Button.jsx";
import Drawer from "../components/ui/Drawer.jsx";
import { listarCarros } from "../services/carrosService.js";
import { listarClientes } from "../services/clientesService.js";
import {
  criarPagamento,
  excluirPagamento,
  listarPagamentosPorStatus,
  marcarPagamentoComoPago,
} from "../services/pagamentosService.js";
import { formatMoneyInput, parseMoneyToNumber } from "../utils/masks.js";

const pagamentoSchema = z.object({
  cliente_id: z.string().min(1, "Selecione o cliente."),
  carro_id: z.string().min(1, "Selecione o carro."),
  valor: z.preprocess(
    parseMoneyToNumber,
    z
      .number({ invalid_type_error: "Informe o valor.", required_error: "Informe o valor." })
      .positive("Informe um valor maior que zero."),
  ),
  data_vencimento: z.string().min(1, "Informe a data de vencimento."),
  status: z.string().min(1, "Informe o status."),
  forma_pagamento: z.string().min(1, "Informe a forma de pagamento."),
});

const defaultValues = {
  cliente_id: "",
  carro_id: "",
  valor: "",
  data_vencimento: "",
  status: "Pendente",
  forma_pagamento: "Pix",
};

const filterOptions = ["Todos", "Pago", "Pendente"];
const paymentMethods = [
  { value: "Pix", label: "Pix", icon: QrCode },
  { value: "Dinheiro", label: "Dinheiro", icon: Banknote },
  { value: "Cartão", label: "Cartão", icon: CreditCard },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const getErrorMessage = (error) =>
  error?.message || "Não foi possível concluir a operação com pagamentos.";

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [carros, setCarros] = useState([]);
  const [filter, setFilter] = useState("Todos");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pagamentoSchema),
    defaultValues,
  });

  const selectedStatus = watch("status");
  const selectedMethod = watch("forma_pagamento");

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [clientesData, carrosData, pagamentosData] = await Promise.all([
        listarClientes(),
        listarCarros(),
        listarPagamentosPorStatus(filter),
      ]);

      setClientes(clientesData || []);
      setCarros(carrosData || []);
      setPagamentos(pagamentosData || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    reset(defaultValues);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      await criarPagamento(values);
      await carregarDados();
      closeDrawer();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const markAsPaid = async (id) => {
    setSubmitting(true);
    setError("");

    try {
      await marcarPagamentoComoPago(id);
      await carregarDados();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    setError("");

    try {
      await excluirPagamento(id);
      await carregarDados();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMoneyChange = (event) => {
    setValue("valor", formatMoneyInput(event.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Pagamentos</h1>
          <p className="mt-2 text-sm text-slate-500">Controle valores e status financeiros da sua frota.</p>
        </div>
        <Button type="button" onClick={() => setDrawerOpen(true)} disabled={loading}>
          <Plus size={18} aria-hidden="true" />
          Novo Pagamento
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={carregarDados} />}

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-950">Transações recentes</h2>
          <div className="inline-flex w-full rounded-lg border border-slate-200 bg-white p-1 sm:w-auto">
            {filterOptions.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                disabled={loading}
                className={`min-h-9 flex-1 rounded-md px-3 text-sm font-semibold transition sm:flex-none ${
                  filter === item ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Loading message="Carregando pagamentos..." />
        ) : pagamentos.length === 0 ? (
          <EmptyState
            title="Nenhum pagamento encontrado"
            description="Clique em Novo Pagamento para criar a primeira transação."
          />
        ) : (
          <div className="table-wrap overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="table-head">
                <tr>
                  <th className="table-cell">Cliente</th>
                  <th className="table-cell">Carro</th>
                  <th className="table-cell">Valor</th>
                  <th className="table-cell">Vencimento</th>
                  <th className="table-cell">Forma</th>
                  <th className="table-cell">Status</th>
                  <th className="table-cell text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pagamentos.map((pagamento) => {
                  const cliente = pagamento.clientes;
                  const carro = pagamento.carros;

                  return (
                    <tr key={pagamento.id} className="text-slate-700">
                      <td className="table-cell font-semibold text-slate-950">{cliente?.nome || "Cliente removido"}</td>
                      <td className="table-cell">
                        {carro ? `${carro.marca} ${carro.modelo}` : "Carro removido"}
                        {carro && <p className="text-xs uppercase text-slate-500">{carro.placa}</p>}
                      </td>
                      <td className="table-cell font-semibold">{currency.format(Number(pagamento.valor))}</td>
                      <td className="table-cell">
                        {new Date(`${pagamento.data_vencimento}T00:00:00`).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="table-cell">{pagamento.forma_pagamento}</td>
                      <td className="table-cell">
                        <StatusBadge status={pagamento.status} />
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-end gap-2">
                          {pagamento.status === "Pendente" && (
                            <button
                              type="button"
                              className="btn-secondary px-3"
                              onClick={() => markAsPaid(pagamento.id)}
                              disabled={submitting}
                              title="Marcar como pago"
                            >
                              <CheckCircle2 size={17} aria-hidden="true" />
                            </button>
                          )}
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => handleDelete(pagamento.id)}
                            disabled={submitting}
                            title="Excluir pagamento"
                          >
                            <Trash2 size={17} aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Drawer
        open={drawerOpen}
        title="Novo Pagamento"
        description="Preencha os detalhes da transação."
        onClose={closeDrawer}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={closeDrawer} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" form="pagamento-form" disabled={submitting || clientes.length === 0 || carros.length === 0}>
              Salvar Pagamento
            </Button>
          </>
        }
      >
        <form id="pagamento-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <label className="block">
            <span className="field-label">Cliente</span>
            <select className="field-input" {...register("cliente_id")}>
              <option value="">Selecione um cliente...</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.cliente_id && <p className="field-error">{errors.cliente_id.message}</p>}
          </label>

          <label className="block">
            <span className="field-label">Veículo</span>
            <select className="field-input" {...register("carro_id")}>
              <option value="">Selecione o carro...</option>
              {carros.map((carro) => (
                <option key={carro.id} value={carro.id}>
                  {carro.marca} {carro.modelo} - {carro.placa}
                </option>
              ))}
            </select>
            {errors.carro_id && <p className="field-error">{errors.carro_id.message}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Valor (R$)</span>
              <input
                className="field-input"
                inputMode="numeric"
                placeholder="0,00"
                {...register("valor", { onChange: handleMoneyChange })}
              />
              {errors.valor && <p className="field-error">{errors.valor.message}</p>}
            </label>
            <label className="block">
              <span className="field-label">Vencimento</span>
              <input className="field-input" type="date" {...register("data_vencimento")} />
              {errors.data_vencimento && <p className="field-error">{errors.data_vencimento.message}</p>}
            </label>
          </div>

          <div>
            <span className="field-label">Status</span>
            <div className="mt-3 flex flex-wrap gap-5">
              {["Pago", "Pendente"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setValue("status", status, { shouldDirty: true, shouldValidate: true })}
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-950"
                >
                  <span
                    className={`h-5 w-5 rounded-full border ${
                      selectedStatus === status ? "border-blue-600 bg-blue-600 ring-4 ring-blue-100" : "border-slate-400 bg-white"
                    }`}
                  />
                  {status}
                </button>
              ))}
            </div>
            {errors.status && <p className="field-error">{errors.status.message}</p>}
          </div>

          <div>
            <span className="field-label">Forma de Pagamento</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = selectedMethod === method.value;

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setValue("forma_pagamento", method.value, { shouldDirty: true, shouldValidate: true })}
                    className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <Icon size={26} aria-hidden="true" />
                    {method.label}
                  </button>
                );
              })}
            </div>
            {errors.forma_pagamento && <p className="field-error">{errors.forma_pagamento.message}</p>}
          </div>

          <div className="flex gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            <Info className="mt-0.5 shrink-0 text-slate-500" size={18} aria-hidden="true" />
            <p>O comprovante pode ser anexado após a criação do registro.</p>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
