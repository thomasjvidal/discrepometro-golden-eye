
export interface Empresa {
  id: string;
  nome: string;
  cnpj: string;
}

export interface Transacao {
  id: string;
  empresa_id?: string;
  produto: string;
  quantidade: number;
  valor: number;
  data: string;
  tipo?: 'entrada' | 'saida';
  cfop: string;
}

export interface Estoque {
  id: string;
  empresa_id?: string;
  produto: string;
  quantidade_final: number;
  data_base: string;
}

export interface Discrepancia {
  id: string;
  empresa_id?: string;
  tipo_discrep: string;
  produto: string;
  quantidade: number;
  data_evento: string;
  criado_em: string;
}

export interface CSVMappingField {
  csvHeader: string;
  modelField: string;
}

export interface CSVMapping {
  empresas: CSVMappingField[];
  transacoes: CSVMappingField[];
  estoque: CSVMappingField[];
}
