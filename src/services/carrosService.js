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

export async function listarCarros() {
  const { data, error } = await supabase
    .from("carros")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function buscarCarroPorId(id) {
  const { data, error } = await supabase
    .from("carros")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function criarCarro(carro) {
  const user = await pegarUsuarioAutenticado();
  const payload = {
    ...carro,
    user_id: user.id,
  };

  const { data, error } = await supabase
    .from("carros")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function atualizarCarro(id, carro) {
  const { data, error } = await supabase
    .from("carros")
    .update(carro)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function excluirCarro(id) {
  const { error } = await supabase
    .from("carros")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}
