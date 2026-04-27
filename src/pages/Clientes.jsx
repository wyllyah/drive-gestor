import { zodResolver } from '@hookform/resolvers/zod';
import { Edit2, Save, Trash2, UserPlus, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EmptyState from '../components/EmptyState.jsx';
import { addItem, deleteItem, listItems, updateItem } from '../utils/storage.js';

const clienteSchema = z.object({
  nome: z.string().min(1, 'Informe o nome.'),
  cpf: z.string().min(1, 'Informe o CPF.'),
  telefone: z.string().min(1, 'Informe o telefone.'),
  email: z.string().min(1, 'Informe o e-mail.').email('Informe um e-mail válido.'),
});

const defaultValues = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
};

export default function Clientes() {
  const [clientes, setClientes] = useState(() => listItems('clientes'));
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(clienteSchema),
    defaultValues,
  });

  const onSubmit = (values) => {
    if (editingId) {
      updateItem('clientes', editingId, values);
    } else {
      addItem('clientes', values);
    }

    setClientes(listItems('clientes'));
    setEditingId(null);
    reset(defaultValues);
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    reset({
      nome: cliente.nome,
      cpf: cliente.cpf,
      telefone: cliente.telefone,
      email: cliente.email,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    reset(defaultValues);
  };

  const handleDelete = (id) => {
    deleteItem('clientes', id);
    setClientes(listItems('clientes'));
    if (editingId === id) {
      handleCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Clientes</h1>
        <p className="mt-2 text-sm text-stone-500">Cadastre e mantenha os dados dos locatários.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label>
            <span className="field-label">Nome</span>
            <input className="field-input" placeholder="Ex.: Ana Souza" {...register('nome')} />
            {errors.nome && <p className="field-error">{errors.nome.message}</p>}
          </label>
          <label>
            <span className="field-label">CPF</span>
            <input className="field-input" placeholder="000.000.000-00" {...register('cpf')} />
            {errors.cpf && <p className="field-error">{errors.cpf.message}</p>}
          </label>
          <label>
            <span className="field-label">Telefone</span>
            <input className="field-input" placeholder="(00) 00000-0000" {...register('telefone')} />
            {errors.telefone && <p className="field-error">{errors.telefone.message}</p>}
          </label>
          <label>
            <span className="field-label">E-mail</span>
            <input className="field-input" placeholder="cliente@email.com" {...register('email')} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary">
            {editingId ? <Save size={18} aria-hidden="true" /> : <UserPlus size={18} aria-hidden="true" />}
            {editingId ? 'Salvar alterações' : 'Cadastrar cliente'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              <X size={18} aria-hidden="true" />
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {clientes.length === 0 ? (
        <EmptyState title="Nenhum cliente cadastrado" description="Use o formulário acima para criar o primeiro cliente." />
      ) : (
        <div className="table-wrap overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="table-head">
              <tr>
                <th className="table-cell">Nome</th>
                <th className="table-cell">CPF</th>
                <th className="table-cell">Telefone</th>
                <th className="table-cell">E-mail</th>
                <th className="table-cell text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {clientes.map((cliente) => (
                <tr key={cliente.id} className="text-stone-700">
                  <td className="table-cell font-semibold text-stone-950">{cliente.nome}</td>
                  <td className="table-cell">{cliente.cpf}</td>
                  <td className="table-cell">{cliente.telefone}</td>
                  <td className="table-cell">{cliente.email}</td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-secondary px-3" onClick={() => handleEdit(cliente)} title="Editar cliente">
                        <Edit2 size={17} aria-hidden="true" />
                      </button>
                      <button type="button" className="btn-danger" onClick={() => handleDelete(cliente.id)} title="Excluir cliente">
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
    </div>
  );
}
