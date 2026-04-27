import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, CreditCard, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import EmptyState from '../components/EmptyState.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { addItem, deleteItem, listItems, updateItem } from '../utils/storage.js';

const pagamentoSchema = z.object({
  clienteId: z.string().min(1, 'Selecione o cliente.'),
  carroId: z.string().min(1, 'Selecione o carro.'),
  valor: z.coerce.number({ invalid_type_error: 'Informe o valor.' }).positive('Informe um valor maior que zero.'),
  vencimento: z.string().min(1, 'Informe a data de vencimento.'),
  status: z.string().min(1, 'Informe o status.'),
  formaPagamento: z.string().min(1, 'Informe a forma de pagamento.'),
});

const defaultValues = {
  clienteId: '',
  carroId: '',
  valor: '',
  vencimento: '',
  status: 'Pendente',
  formaPagamento: 'Pix',
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export default function Pagamentos() {
  const [pagamentos, setPagamentos] = useState(() => listItems('pagamentos'));
  const [filter, setFilter] = useState('todos');
  const clientes = listItems('clientes');
  const carros = listItems('carros');
  const clientesById = useMemo(() => new Map(clientes.map((cliente) => [cliente.id, cliente])), [clientes]);
  const carrosById = useMemo(() => new Map(carros.map((carro) => [carro.id, carro])), [carros]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pagamentoSchema),
    defaultValues,
  });

  const filteredPagamentos = pagamentos.filter((pagamento) => {
    if (filter === 'todos') {
      return true;
    }

    return pagamento.status.toLowerCase() === filter;
  });

  const onSubmit = (values) => {
    addItem('pagamentos', values);
    setPagamentos(listItems('pagamentos'));
    reset(defaultValues);
  };

  const markAsPaid = (id) => {
    updateItem('pagamentos', id, { status: 'Pago' });
    setPagamentos(listItems('pagamentos'));
  };

  const handleDelete = (id) => {
    deleteItem('pagamentos', id);
    setPagamentos(listItems('pagamentos'));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="page-title">Pagamentos</h1>
        <p className="mt-2 text-sm text-stone-500">Controle vencimentos, status e formas de recebimento.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label>
            <span className="field-label">Cliente</span>
            <select className="field-input" {...register('clienteId')}>
              <option value="">Selecione</option>
              {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
            {errors.clienteId && <p className="field-error">{errors.clienteId.message}</p>}
          </label>
          <label>
            <span className="field-label">Carro</span>
            <select className="field-input" {...register('carroId')}>
              <option value="">Selecione</option>
              {carros.map((carro) => (
                <option key={carro.id} value={carro.id}>
                  {carro.marca} {carro.modelo} - {carro.placa}
                </option>
              ))}
            </select>
            {errors.carroId && <p className="field-error">{errors.carroId.message}</p>}
          </label>
          <label>
            <span className="field-label">Valor</span>
            <input className="field-input" type="number" step="0.01" placeholder="950,00" {...register('valor')} />
            {errors.valor && <p className="field-error">{errors.valor.message}</p>}
          </label>
          <label>
            <span className="field-label">Data de vencimento</span>
            <input className="field-input" type="date" {...register('vencimento')} />
            {errors.vencimento && <p className="field-error">{errors.vencimento.message}</p>}
          </label>
          <label>
            <span className="field-label">Status</span>
            <select className="field-input" {...register('status')}>
              <option value="Pendente">Pendente</option>
              <option value="Pago">Pago</option>
            </select>
            {errors.status && <p className="field-error">{errors.status.message}</p>}
          </label>
          <label>
            <span className="field-label">Forma de pagamento</span>
            <select className="field-input" {...register('formaPagamento')}>
              <option value="Pix">Pix</option>
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão">Cartão</option>
            </select>
            {errors.formaPagamento && <p className="field-error">{errors.formaPagamento.message}</p>}
          </label>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button type="submit" className="btn-primary">
            <CreditCard size={18} aria-hidden="true" />
            Cadastrar pagamento
          </button>
          {(clientes.length === 0 || carros.length === 0) && (
            <p className="text-sm font-medium text-amber-700">
              Cadastre ao menos um cliente e um carro para vincular pagamentos.
            </p>
          )}
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-stone-950">Histórico de pagamentos</h2>
          <div className="inline-flex w-full rounded-lg border border-stone-200 bg-white p-1 sm:w-auto">
            {['todos', 'pago', 'pendente'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`min-h-9 flex-1 rounded-md px-3 text-sm font-semibold capitalize transition sm:flex-none ${
                  filter === item ? 'bg-emerald-600 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filteredPagamentos.length === 0 ? (
          <EmptyState
            title="Nenhum pagamento encontrado"
            description="Cadastre um pagamento ou ajuste o filtro de status."
          />
        ) : (
          <div className="table-wrap overflow-x-auto">
            <table className="min-w-full divide-y divide-stone-200">
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
              <tbody className="divide-y divide-stone-100">
                {filteredPagamentos.map((pagamento) => {
                  const cliente = clientesById.get(pagamento.clienteId);
                  const carro = carrosById.get(pagamento.carroId);

                  return (
                    <tr key={pagamento.id} className="text-stone-700">
                      <td className="table-cell font-semibold text-stone-950">{cliente?.nome || 'Cliente removido'}</td>
                      <td className="table-cell">
                        {carro ? `${carro.marca} ${carro.modelo}` : 'Carro removido'}
                        {carro && <p className="text-xs uppercase text-stone-500">{carro.placa}</p>}
                      </td>
                      <td className="table-cell font-semibold">{currency.format(Number(pagamento.valor))}</td>
                      <td className="table-cell">{new Date(`${pagamento.vencimento}T00:00:00`).toLocaleDateString('pt-BR')}</td>
                      <td className="table-cell">{pagamento.formaPagamento}</td>
                      <td className="table-cell"><StatusBadge status={pagamento.status} /></td>
                      <td className="table-cell">
                        <div className="flex justify-end gap-2">
                          {pagamento.status === 'Pendente' && (
                            <button type="button" className="btn-secondary px-3" onClick={() => markAsPaid(pagamento.id)} title="Marcar como pago">
                              <CheckCircle2 size={17} aria-hidden="true" />
                            </button>
                          )}
                          <button type="button" className="btn-danger" onClick={() => handleDelete(pagamento.id)} title="Excluir pagamento">
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
    </div>
  );
}
