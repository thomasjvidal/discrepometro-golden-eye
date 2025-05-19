
import { supabase } from "@/integrations/supabase/client";
import { Empresa, Transacao, Estoque, Discrepancia } from "@/types";

// Empresas
export const getEmpresas = async (): Promise<Empresa[]> => {
  const { data, error } = await supabase.from("empresas").select("*");
  if (error) throw error;
  return data;
};

export const getEmpresa = async (id: string): Promise<Empresa> => {
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createEmpresa = async (empresa: Omit<Empresa, "id">): Promise<Empresa> => {
  const { data, error } = await supabase
    .from("empresas")
    .insert([empresa])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEmpresa = async (id: string, empresa: Partial<Empresa>): Promise<Empresa> => {
  const { data, error } = await supabase
    .from("empresas")
    .update(empresa)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEmpresa = async (id: string): Promise<void> => {
  const { error } = await supabase.from("empresas").delete().eq("id", id);
  if (error) throw error;
};

// Transações
export const getTransacoes = async (): Promise<Transacao[]> => {
  const { data, error } = await supabase.from("transacoes").select("*");
  if (error) throw error;
  return data;
};

export const getTransacao = async (id: string): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createTransacao = async (transacao: Omit<Transacao, "id">): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .insert([transacao])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateTransacao = async (id: string, transacao: Partial<Transacao>): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .update(transacao)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteTransacao = async (id: string): Promise<void> => {
  const { error } = await supabase.from("transacoes").delete().eq("id", id);
  if (error) throw error;
};

// Estoque
export const getEstoques = async (): Promise<Estoque[]> => {
  const { data, error } = await supabase.from("estoque").select("*");
  if (error) throw error;
  return data;
};

export const getEstoque = async (id: string): Promise<Estoque> => {
  const { data, error } = await supabase
    .from("estoque")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const createEstoque = async (estoque: Omit<Estoque, "id">): Promise<Estoque> => {
  const { data, error } = await supabase
    .from("estoque")
    .insert([estoque])
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const updateEstoque = async (id: string, estoque: Partial<Estoque>): Promise<Estoque> => {
  const { data, error } = await supabase
    .from("estoque")
    .update(estoque)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

export const deleteEstoque = async (id: string): Promise<void> => {
  const { error } = await supabase.from("estoque").delete().eq("id", id);
  if (error) throw error;
};

// Função para calcular discrepâncias (como não temos uma tabela real, vamos simular)
export const getDiscrepancias = async (): Promise<Discrepancia[]> => {
  // Aqui seria uma query para obter discrepâncias de uma tabela real
  // Por enquanto, vamos retornar um array vazio
  return [];
};
