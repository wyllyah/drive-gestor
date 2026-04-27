import { zodResolver } from "@hookform/resolvers/zod";
import { Edit2, Info, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import EmptyState from "../components/EmptyState.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import Loading from "../components/Loading.jsx";
import Button from "../components/ui/Button.jsx";
import Drawer from "../components/ui/Drawer.jsx";
import {
  atualizarCliente,
  criarCliente,
  excluirCliente,
  listarClientes,
} from "../services/clientesService.js";
import { formatCpf, formatPhone } from "../utils/masks.js";

const clienteSchema = z.object({
  nome: z.string().min(1, "Informe o nome."),
  cpf: z.string().min(1, "Informe o CPF."),
  telefone: z.string().min(1, "Informe o telefone."),
  email: z.string().min(1, "Informe o e-mail.").email("Informe um e-mail válido."),
});

const defaultValues = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
};

const getErrorMessage = (error) =>
  error?.message || "Não foi possível concluir a operação com clientes.";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
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
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues,
  });

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await listarClientes();
      setClientes(data || []);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

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
        await atualizarCliente(editingId, values);
      } else {
        await criarCliente(values);
      }

      await carregarClientes();
      closeDrawer();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    reset({
      nome: cliente.nome,
      cpf: formatCpf(cliente.cpf),
      telefone: formatPhone(cliente.telefone),
      email: cliente.email,
    });
    setDrawerOpen(true);
  };

  const handleDelete = async (id) => {
    setSubmitting(true);
    setError("");

    try {
      await excluirCliente(id);
      await carregarClientes();
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
          <h1 className="page-title">Clientes</h1>
          <p className="mt-2 text-sm text-slate-500">Gerencie sua base de clientes e informações de contato.</p>
        </div>
        <Button type="button" onClick={openCreateDrawer}>
          <Plus size={18} aria-hidden="true" />
          Novo Cliente
        </Button>
      </div>

      {error && <ErrorMessage message={error} onRetry={carregarClientes} />}

      {loading ? (
        <Loading message="Carregando clientes..." />
      ) : clientes.length === 0 ? (
        <EmptyState title="Nenhum cliente cadastrado" description="Clique em Novo Cliente para criar o primeiro cadastro." />
      ) : (
        <div className="table-wrap overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Nome</th>
                <th className="table-cell">CPF</th>
                <th className="table-cell">Telefone</th>
                <th className="table-cell">E-mail</th>
                <th className="table-cell text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="text-slate-700">
                  <td className="table-cell font-semibold text-slate-950">{cliente.nome}</td>
                  <td className="table-cell">{cliente.cpf}</td>
                  <td className="table-cell">{cliente.telefone}</td>
                  <td className="table-cell">{cliente.email}</td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary px-3"
                        onClick={() => handleEdit(cliente)}
                        disabled={submitting}
                        title="Editar cliente"
                      >
                        <Edit2 size={17} aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn-danger"
                        onClick={() => handleDelete(cliente.id)}
                        disabled={submitting}
                        title="Excluir cliente"
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
        title={editingId ? "Editar Cliente" : "Novo Cliente"}
        description="Preencha os dados básicos para cadastro."
        onClose={closeDrawer}
        footer={
          <>
            <Button type="button" variant="secondary" onClick={closeDrawer} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" form="cliente-form" disabled={submitting}>
              {editingId ? "Salvar Alterações" : "Salvar Cliente"}
            </Button>
          </>
        }
      >
        <form id="cliente-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <label className="block">
            <span className="field-label">Nome Completo</span>
            <input className="field-input" placeholder="Ex: André Martins" {...register("nome")} />
            {errors.nome && <p className="field-error">{errors.nome.message}</p>}
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="field-label">CPF</span>
              <input
                className="field-input"
                inputMode="numeric"
                placeholder="000.000.000-00"
                {...register("cpf", { onChange: handleMaskedChange("cpf", formatCpf) })}
              />
              {errors.cpf && <p className="field-error">{errors.cpf.message}</p>}
            </label>
            <label className="block">
              <span className="field-label">Telefone</span>
              <input
                className="field-input"
                inputMode="tel"
                placeholder="(11) 90000-0000"
                {...register("telefone", { onChange: handleMaskedChange("telefone", formatPhone) })}
              />
              {errors.telefone && <p className="field-error">{errors.telefone.message}</p>}
            </label>
          </div>

          <label className="block">
            <span className="field-label">E-mail</span>
            <input className="field-input" placeholder="cliente@email.com" {...register("email")} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </label>

          <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white">
              <Info size={14} aria-hidden="true" />
            </div>
            <p>Após o cadastro, você poderá anexar documentos (CNH) e vincular veículos no perfil detalhado do cliente.</p>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
