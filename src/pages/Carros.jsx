import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, CheckCircle2, Edit2, KeyRound, Plus, Trash2, Wrench } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Button from "../components/ui/Button.jsx";
import Drawer from "../components/ui/Drawer.jsx";
import { atualizarCarro, criarCarro, excluirCarro, listarCarros } from "../services/carrosService.js";
import { formatMoneyInput, formatMoneyValue, formatPlate, parseMoneyToNumber } from "../utils/masks.js";

const carroSchema = z.object({
  marca: z.string().min(1, "Informe a marca."),
  modelo: z.string().min(1, "Informe o modelo."),
  ano: z.coerce.number({ invalid_type_error: "Informe o ano." }).min(1900, "Informe um ano válido."),
  placa: z.string().min(1, "Informe a placa."),
  valor_diaria: z.preprocess(
    parseMoneyToNumber,
    z
      .number({ invalid_type_error: "Informe o valor.", required_error: "Informe o valor." })
      .positive("Informe um valor maior que zero."),
  ),
  status: z.string().min(1, "Informe o status."),
});

const defaultValues = {
  marca: "",
  modelo: "",
  ano: "",
  placa: "",
  valor_diaria: "",
  status: "Disponível",
};

const statusOptions = [
  { value: "Disponível", label: "Livre", icon: CheckCircle2, tone: "text-emerald-600" },
  { value: "Alugado", label: "Alugado", icon: KeyRound, tone: "text-blue-600" },
  { value: "Manutenção", label: "Oficina", icon: Wrench, tone: "text-orange-500" },
];

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const getErrorMessage = (error) =>
  error?.message || "Não foi possível concluir a operação com carros.";

export default function Carros() {
  const [carros, setCarros] = useState([]);
  const [editingId, setEditingId] = useState(null);
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
    resolver: zodResolver(carroSchema),
    defaultValues,
  });

  const selectedStatus = watch("status");

  const carregarCarros = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listarCarros();
      setCarros(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarCarros();
  }, [carregarCarros]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingId(null);
    reset(defaultValues);
  };

  const openCreateDrawer = () => {
    setEditingId(null);
    reset(defaultValues);
    setDrawerOpen(true);
  };

  const onSubmit = async (values) => {
    setSubmitting(true);
    setError("");

    try {
      if (editingId) {
        await atualizarCarro(editingId, values);
      } else {
        await criarCarro(values);
      }

      await carregarCarros();
      closeDrawer();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (carro) => {
    setEditingId(carro.id);
    reset({
      marca: carro.marca,
      modelo: carro.modelo,
      ano: carro.ano,
      placa: formatPlate(carro.placa),
      valor_diaria: formatMoneyValue(carro.valor_diaria),
      status: carro.status,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    setError("");

    try {
      await excluirCarro(id);
      await carregarCarros();
      if (editingId === id) {
        closeDrawer();
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleMaskedChange = (field, formatter) => (event) => {
    setValue(field, formatter(event.target.value), {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="page-title">Carros</h1>
          <p className="mt-2 text-sm text-slate-500">Organize a frota, disponibilidade e valor de diária.</p>
        </div>
        <Button type="button" onClick={openCreateDrawer}>
          <Plus size={18} aria-hidden="true" />
          Novo Veículo
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={carregarCarros} />}

      {loading ? (
        <Loading message="Carregando carros..." />
      ) : carros.length === 0 ? (
        <EmptyState title="Nenhum carro cadastrado" description="Clique em Novo Veículo para criar o primeiro cadastro." />
      ) : (
        <div className="table-wrap overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Veículo</th>
                <th className="table-cell">Ano</th>
                <th className="table-cell">Placa</th>
                <th className="table-cell">Diária</th>
                <th className="table-cell">Status</th>
                <th className="table-cell text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {carros.map((carro) => (
                <tr key={carro.id} className="text-slate-700">
                  <td className="table-cell">
                    <p className="font-semibold text-slate-950">{carro.marca}</p>
                    <p className="text-xs text-slate-500">{carro.modelo}</p>
                  </td>
                  <td className="table-cell">{carro.ano}</td>
                  <td className="table-cell font-semibold uppercase">{carro.placa}</td>
                  <td className="table-cell">{currency.format(Number(carro.valor_diaria))}</td>
                  <td className="table-cell">
                    <StatusBadge status={carro.status} />
                  </td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary px-3"
                        onClick={() => handleEdit(carro)}
                        disabled={submitting}
                        title="Editar carro"
                      >
                        <Edit2 size={17} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(carro.id)}
                        disabled={submitting}
                        title="Excluir carro"
                      >
                        <Trash2 size={17} aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        title={editingId ? "Editar Veículo" : "Novo Veículo"}
        description={editingId ? "Atualize os dados do carro na sua frota" : "Cadastre um novo carro na sua frota"}
        onClose={closeDrawer}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={closeDrawer} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" form="carro-form" disabled={submitting}>
              {editingId ? "Salvar Alterações" : "Salvar Veículo"}
            </Button>
          </>
        }
      >
        <form id="carro-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block">
            <span className="field-label">Marca</span>
            <input className="field-input" placeholder="Ex: Toyota" {...register("marca")} />
            {errors.marca && <p className="field-error">{errors.marca.message}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Modelo</span>
              <input className="field-input" placeholder="Ex: Corolla" {...register("modelo")} />
              {errors.modelo && <p className="field-error">{errors.modelo.message}</p>}
            </label>
            <label className="block">
              <span className="field-label">Ano</span>
              <input className="field-input" type="number" placeholder="2024" {...register("ano")} />
              {errors.ano && <p className="field-error">{errors.ano.message}</p>}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">Placa</span>
              <input
                className="field-input uppercase"
                placeholder="AAA-0000"
                {...register("placa", { onChange: handleMaskedChange("placa", formatPlate) })}
              />
              {errors.placa && <p className="field-error">{errors.placa.message}</p>}
            </label>
            <label className="block">
              <span className="field-label">Valor Diária</span>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                  R$
                </span>
                <input
                  className="field-input pl-11"
                  inputMode="numeric"
                  placeholder="0,00"
                  {...register("valor_diaria", { onChange: handleMaskedChange("valor_diaria", formatMoneyInput) })}
                />
              </div>
              {errors.valor_diaria && <p className="field-error">{errors.valor_diaria.message}</p>}
            </label>
          </div>

          <div>
            <span className="field-label">Status Inicial</span>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {statusOptions.map((option) => {
                const Icon = option.icon;
                const active = selectedStatus === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setValue("status", option.value, { shouldDirty: true, shouldValidate: true })}
                    className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition ${
                      active
                        ? "border-blue-600 bg-blue-50 text-slate-900 ring-2 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                    }`}
                  >
                    <Icon className={option.tone} size={24} aria-hidden="true" />
                    {option.label}
                  </button>
                );
              })}
            </div>
            {errors.status && <p className="field-error">{errors.status.message}</p>}
          </div>

          <div>
            <span className="field-label">Foto do Veículo</span>
            <div className="mt-3 flex min-h-32 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-4 text-center text-sm text-slate-500">
              <Camera className="mb-3 text-slate-300" size={34} aria-hidden="true" />
              Arraste uma foto ou clique para buscar
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
