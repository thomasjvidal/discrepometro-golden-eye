
export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
}

export interface Transacao {
  id: string;
  empresa_id?: string;
  produto: string;
  codigo_produto?: string;
  nome_produto?: string;
  quantidade: number;
  valor: number;
  data: string;
  tipo?: 'entrada' | 'saida';
  cfop: string;
  estoque_inicial_2021?: number;
  estoque_final_2021?: number;
  total_entradas?: number;
  total_saidas?: number;
}

export interface Estoque {
  id: string;
  empresa_id?: string;
  produto: string;
  quantidade_final: number;
  data_base: string;
  estoque_inicial_2021?: number;
  estoque_final_2021?: number;
}

export interface AnaliseDiscrepancia {
  id: string;
  empresa_id?: string;
  produto: string;
  codigo_produto?: string;
  estoque_inicial_2021: number;
  estoque_final_2021: number;
  total_entradas: number;
  total_saidas: number;
  tipo_discrepancia?: 'Compra sem Nota' | 'Venda sem Nota' | 'Sem Discrepância';
  fonte?: 'EFD' | 'Planilha Emitente' | 'Planilha Destinatário' | 'Inventário Fev/21' | 'Inventário Fev/22';
  created_at: string;
  updated_at: string;
}

export interface CSVMappingField {
  csvHeader: string;
  modelField: string;
}

export interface CSVMapping {
  empresas: CSVMappingField[];
  transacoes: CSVMappingField[];
  estoque: CSVMappingField[];
  analiseDiscrepancia: CSVMappingField[];
}
