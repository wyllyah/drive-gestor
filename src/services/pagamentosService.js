import { supabase } from "../lib/supabase";

async function pegarUsuarioAutenticado() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user;
}

const pagamentosSelect = `
  *,
  clientes (
    id,
    nome,
    cpf
  ),
  carros (
    id,
    marca,
    modelo,
    placa
  )
`;

export async function listarPagamentos() {
  const { data, error } = await supabase
    .from("pagamentos")
    .select(pagamentosSelect)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function buscarPagamentoPorId(id) {
  const { data, error } = await supabase
    .from("pagamentos")
    .select(pagamentosSelect)
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarPagamento(pagamento) {
  const user = await pegarUsuarioAutenticado();
  const payload = {
    ...pagamento,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("pagamentos")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarPagamento(id, pagamento) {
  const { data, error } = await supabase
    .from("pagamentos")
    .update(pagamento)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function marcarPagamentoComoPago(id) {
  const { data, error } = await supabase
    .from("pagamentos")
    .update({ status: "Pago" })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirPagamento(id) {
  const { error } = await supabase
    .from("pagamentos")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function listarPagamentosPorStatus(status) {
  if (!status || status === "Todos") {
    return listarPagamentos();
  }

  let query = supabase
    .from("pagamentos")
    .select(pagamentosSelect)
    .order("created_at", { ascending: false });

  if (status === "Pago" || status === "Pendente") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}
