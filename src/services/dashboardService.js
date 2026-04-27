import { supabase } from "../lib/supabase";

export async function buscarResumoDashboard() {
  const { count: totalClientes, error: clientesError } = await supabase
    .from("clientes")
    .select("*", { count: "exact", head: true });

  if (clientesError) throw clientesError;

  const { count: totalCarros, error: carrosError } = await supabase
    .from("carros")
    .select("*", { count: "exact", head: true });

  if (carrosError) throw carrosError;

  const { count: pagamentosPendentes, error: pendentesError } = await supabase
    .from("pagamentos")
    .select("*", { count: "exact", head: true })
    .eq("status", "Pendente");

  if (pendentesError) throw pendentesError;

  const { data: pagamentosRecebidos, error: recebidosError } = await supabase
    .from("pagamentos")
    .select("valor")
    .eq("status", "Pago");

  if (recebidosError) throw recebidosError;

  const totalRecebido = (pagamentosRecebidos || []).reduce(
    (total, pagamento) => total + Number(pagamento.valor || 0),
    0,
  );

  return {
    totalClientes: totalClientes || 0,
    totalCarros: totalCarros || 0,
    pagamentosPendentes: pagamentosPendentes || 0,
    totalRecebido,
  };
}
