
import { supabase } from "@/integrations/supabase/client";
import { Empresa, Transacao, Estoque, AnaliseDiscrepancia } from "@/types";

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
  
  // Ensure the tipos are correctly typed
  return data.map(item => ({
    ...item,
    tipo: item.tipo as "entrada" | "saida"
  }));
};

export const getTransacao = async (id: string): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo: data.tipo as "entrada" | "saida"
  };
};

export const createTransacao = async (transacao: Omit<Transacao, "id">): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .insert([transacao])
    .select()
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo: data.tipo as "entrada" | "saida"
  };
};

export const updateTransacao = async (id: string, transacao: Partial<Transacao>): Promise<Transacao> => {
  const { data, error } = await supabase
    .from("transacoes")
    .update(transacao)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo: data.tipo as "entrada" | "saida"
  };
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

// Análise de Discrepâncias
export const getAnaliseDiscrepancias = async (): Promise<AnaliseDiscrepancia[]> => {
  const { data, error } = await supabase.from("analise_discrepancia").select("*");
  if (error) throw error;
  
  // Ensure the tipo_discrepancia and fonte are correctly typed
  return data.map(item => ({
    ...item,
    tipo_discrepancia: item.tipo_discrepancia as AnaliseDiscrepancia['tipo_discrepancia'],
    fonte: item.fonte as AnaliseDiscrepancia['fonte']
  }));
};

export const getAnaliseDiscrepancia = async (id: string): Promise<AnaliseDiscrepancia> => {
  const { data, error } = await supabase
    .from("analise_discrepancia")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo_discrepancia: data.tipo_discrepancia as AnaliseDiscrepancia['tipo_discrepancia'],
    fonte: data.fonte as AnaliseDiscrepancia['fonte']
  };
};

export const createAnaliseDiscrepancia = async (analiseDiscrepancia: Omit<AnaliseDiscrepancia, "id" | "created_at" | "updated_at">): Promise<AnaliseDiscrepancia> => {
  const { data, error } = await supabase
    .from("analise_discrepancia")
    .insert([analiseDiscrepancia])
    .select()
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo_discrepancia: data.tipo_discrepancia as AnaliseDiscrepancia['tipo_discrepancia'],
    fonte: data.fonte as AnaliseDiscrepancia['fonte']
  };
};

export const updateAnaliseDiscrepancia = async (id: string, analiseDiscrepancia: Partial<AnaliseDiscrepancia>): Promise<AnaliseDiscrepancia> => {
  const { data, error } = await supabase
    .from("analise_discrepancia")
    .update(analiseDiscrepancia)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  
  return {
    ...data,
    tipo_discrepancia: data.tipo_discrepancia as AnaliseDiscrepancia['tipo_discrepancia'],
    fonte: data.fonte as AnaliseDiscrepancia['fonte']
  };
};

export const deleteAnaliseDiscrepancia = async (id: string): Promise<void> => {
  const { error } = await supabase.from("analise_discrepancia").delete().eq("id", id);
  if (error) throw error;
};

// Função para calcular estoque final com base em dados
export const calcularEstoqueFinal = (
  estoqueInicial: number,
  totalEntradas: number,
  totalSaidas: number
): number => {
  return estoqueInicial + totalEntradas - totalSaidas;
};
