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

export async function listarClientes() {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function buscarClientePorId(id) {
  const { data, error } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarCliente(cliente) {
  const user = await pegarUsuarioAutenticado();
  const payload = {
    ...cliente,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("clientes")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarCliente(id, cliente) {
  const { data, error } = await supabase
    .from("clientes")
    .update(cliente)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirCliente(id) {
  const { error } = await supabase
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}
