import { zodResolver } from '@hookform/resolvers/zod';
import { CarFront, Edit2, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { addItem, deleteItem, listItems, updateItem } from '../utils/storage.js';

const carroSchema = z.object({
  marca: z.string().min(1, 'Informe a marca.'),
  modelo: z.string().min(1, 'Informe o modelo.'),
  ano: z.coerce.number({ invalid_type_error: 'Informe o ano.' }).min(1900, 'Informe um ano válido.'),
  placa: z.string().min(1, 'Informe a placa.'),
  valorDiaria: z.coerce.number({ invalid_type_error: 'Informe o valor.' }).positive('Informe um valor maior que zero.'),
  status: z.string().min(1, 'Informe o status.'),
});

const defaultValues = {
  marca: '',
  modelo: '',
  ano: '',
  placa: '',
  valorDiaria: '',
  status: 'Disponível',
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Carros() {
  const [carros, setCarros] = useState(() => listItems('carros'));
  const [editingId, setEditingId] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(carroSchema),
    defaultValues,
  });

  const onSubmit = (values) => {
    if (editingId) {
      updateItem('carros', editingId, values);
    } else {
      addItem('carros', values);
    }

    setCarros(listItems('carros'));
    setEditingId(null);
    reset(defaultValues);
  };

  const handleEdit = (carro) => {
    setEditingId(carro.id);
    reset(carro);
  };

  const handleCancel = () => {
    setEditingId(null);
    reset(defaultValues);
  };

  const handleDelete = (id) => {
    deleteItem('carros', id);
    setCarros(listItems('carros'));
    if (editingId === id) {
      handleCancel();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Carros</h1>
        <p className="mt-2 text-sm text-stone-500">Organize a frota, disponibilidade e valor de diária.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label>
            <span className="field-label">Marca</span>
            <input className="field-input" placeholder="Ex.: Toyota" {...register('marca')} />
            {errors.marca && <p className="field-error">{errors.marca.message}</p>}
          </label>
          <label>
            <span className="field-label">Modelo</span>
            <input className="field-input" placeholder="Ex.: Corolla" {...register('modelo')} />
            {errors.modelo && <p className="field-error">{errors.modelo.message}</p>}
          </label>
          <label>
            <span className="field-label">Ano</span>
            <input className="field-input" type="number" placeholder="2024" {...register('ano')} />
            {errors.ano && <p className="field-error">{errors.ano.message}</p>}
          </label>
          <label>
            <span className="field-label">Placa</span>
            <input className="field-input uppercase" placeholder="ABC1D23" {...register('placa')} />
            {errors.placa && <p className="field-error">{errors.placa.message}</p>}
          </label>
          <label>
            <span className="field-label">Valor da diária</span>
            <input className="field-input" type="number" step="0.01" placeholder="180,00" {...register('valorDiaria')} />
            {errors.valorDiaria && <p className="field-error">{errors.valorDiaria.message}</p>}
          </label>
          <label>
            <span className="field-label">Status</span>
            <select className="field-input" {...register('status')}>
              <option value="Disponível">Disponível</option>
              <option value="Alugado">Alugado</option>
              <option value="Manutenção">Manutenção</option>
            </select>
            {errors.status && <p className="field-error">{errors.status.message}</p>}
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="submit" className="btn-primary">
            {editingId ? <Save size={18} aria-hidden="true" /> : <CarFront size={18} aria-hidden="true" />}
            {editingId ? 'Salvar alterações' : 'Cadastrar carro'}
          </button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              <X size={18} aria-hidden="true" />
              Cancelar edição
            </button>
          )}
        </div>
      </form>

      {carros.length === 0 ? (
        <EmptyState title="Nenhum carro cadastrado" description="Cadastre os veículos para começar a vincular pagamentos." />
      ) : (
        <div className="table-wrap overflow-x-auto">
          <table className="min-w-full divide-y divide-stone-200">
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
            <tbody className="divide-y divide-stone-100">
              {carros.map((carro) => (
                <tr key={carro.id} className="text-stone-700">
                  <td className="table-cell">
                    <p className="font-semibold text-stone-950">{carro.marca}</p>
                    <p className="text-xs text-stone-500">{carro.modelo}</p>
                  </td>
                  <td className="table-cell">{carro.ano}</td>
                  <td className="table-cell font-semibold uppercase">{carro.placa}</td>
                  <td className="table-cell">{currency.format(Number(carro.valorDiaria))}</td>
                  <td className="table-cell"><StatusBadge status={carro.status} /></td>
                  <td className="table-cell">
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-secondary px-3" onClick={() => handleEdit(carro)} title="Editar carro">
                        <Edit2 size={17} aria-hidden="true" />
                      </button>
                      <button type="button" className="btn-danger" onClick={() => handleDelete(carro.id)} title="Excluir carro">
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
