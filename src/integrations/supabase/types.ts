export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analise_discrepancia: {
        Row: {
          codigo_produto: string | null
          created_at: string
          empresa_id: string | null
          estoque_final_2021: number
          estoque_inicial_2021: number
          fonte: string | null
          id: string
          produto: string
          tipo_discrepancia: string | null
          total_entradas: number
          total_saidas: number
          updated_at: string
        }
        Insert: {
          codigo_produto?: string | null
          created_at?: string
          empresa_id?: string | null
          estoque_final_2021?: number
          estoque_inicial_2021?: number
          fonte?: string | null
          id?: string
          produto: string
          tipo_discrepancia?: string | null
          total_entradas?: number
          total_saidas?: number
          updated_at?: string
        }
        Update: {
          codigo_produto?: string | null
          created_at?: string
          empresa_id?: string | null
          estoque_final_2021?: number
          estoque_inicial_2021?: number
          fonte?: string | null
          id?: string
          produto?: string
          tipo_discrepancia?: string | null
          total_entradas?: number
          total_saidas?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "analise_discrepancia_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          cnpj: string
          id: string
          nome: string
        }
        Insert: {
          cnpj: string
          id?: string
          nome: string
        }
        Update: {
          cnpj?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      estoque: {
        Row: {
          data_base: string
          empresa_id: string | null
          estoque_final_2021: number | null
          estoque_inicial_2021: number | null
          id: string
          produto: string
          quantidade_final: number
        }
        Insert: {
          data_base: string
          empresa_id?: string | null
          estoque_final_2021?: number | null
          estoque_inicial_2021?: number | null
          id?: string
          produto: string
          quantidade_final: number
        }
        Update: {
          data_base?: string
          empresa_id?: string | null
          estoque_final_2021?: number | null
          estoque_inicial_2021?: number | null
          id?: string
          produto?: string
          quantidade_final?: number
        }
        Relationships: [
          {
            foreignKeyName: "estoque_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          cfop: string
          codigo_produto: string | null
          data: string
          empresa_id: string | null
          estoque_final_2021: number | null
          estoque_inicial_2021: number | null
          id: string
          nome_produto: string | null
          produto: string
          quantidade: number
          tipo: string | null
          total_entradas: number | null
          total_saidas: number | null
          valor: number
        }
        Insert: {
          cfop: string
          codigo_produto?: string | null
          data: string
          empresa_id?: string | null
          estoque_final_2021?: number | null
          estoque_inicial_2021?: number | null
          id?: string
          nome_produto?: string | null
          produto: string
          quantidade: number
          tipo?: string | null
          total_entradas?: number | null
          total_saidas?: number | null
          valor: number
        }
        Update: {
          cfop?: string
          codigo_produto?: string | null
          data?: string
          empresa_id?: string | null
          estoque_final_2021?: number | null
          estoque_inicial_2021?: number | null
          id?: string
          nome_produto?: string | null
          produto?: string
          quantidade?: number
          tipo?: string | null
          total_entradas?: number | null
          total_saidas?: number | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transacoes_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
