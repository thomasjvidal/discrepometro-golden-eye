
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVMapping } from "@/types";
import { supabase } from "@/integrations/supabase/client";
import { UploadCloud } from "lucide-react";

interface CsvImporterProps {
  entityType?: "empresas" | "transacoes" | "estoque" | "analiseDiscrepancia";
  onSuccess?: () => void;
}

export function CsvImporter({ entityType = "empresas", onSuccess }: CsvImporterProps) {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    empresas: null,
    transacoes: null,
    estoque: null,
    analiseDiscrepancia: null,
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    empresas: false,
    transacoes: false,
    estoque: false,
    analiseDiscrepancia: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const parseCSV = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          if (!e.target || typeof e.target.result !== "string") {
            throw new Error("Failed to read file.");
          }
          
          const csv = e.target.result;
          const lines = csv.split("\n");
          const result = [];
          const headers = lines[0].split(",").map(header => header.trim());
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const obj: Record<string, any> = {};
            const currentLine = lines[i].split(",");
            
            for (let j = 0; j < headers.length; j++) {
              obj[headers[j]] = currentLine[j]?.trim();
            }
            
            result.push(obj);
          }
          
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };
  
  const mapCsvDataToEntityFormat = (data: any[], type: string) => {
    const entityMappers: Record<string, (item: any) => any> = {
      empresas: (item: any) => ({
        nome: item.nome,
        cnpj: item.cnpj,
      }),
      transacoes: (item: any) => ({
        empresa_id: item.empresa_id,
        produto: item.produto,
        codigo_produto: item.codigo_produto || null,
        nome_produto: item.nome_produto || null,
        quantidade: parseFloat(item.quantidade),
        valor: parseFloat(item.valor),
        data: item.data,
        tipo: item.tipo || "entrada",
        cfop: item.cfop,
        estoque_inicial_2021: parseFloat(item.estoque_inicial_2021 || "0"),
        estoque_final_2021: parseFloat(item.estoque_final_2021 || "0"),
        total_entradas: parseFloat(item.total_entradas || "0"),
        total_saidas: parseFloat(item.total_saidas || "0"),
      }),
      estoque: (item: any) => ({
        empresa_id: item.empresa_id,
        produto: item.produto,
        quantidade_final: parseFloat(item.quantidade_final),
        data_base: item.data_base,
        estoque_inicial_2021: parseFloat(item.estoque_inicial_2021 || "0"),
        estoque_final_2021: parseFloat(item.estoque_final_2021 || "0"),
      }),
      analiseDiscrepancia: (item: any) => ({
        empresa_id: item.empresa_id,
        produto: item.produto,
        codigo_produto: item.codigo_produto,
        estoque_inicial_2021: parseFloat(item.estoque_inicial_2021 || "0"),
        estoque_final_2021: parseFloat(item.estoque_final_2021 || "0"),
        total_entradas: parseFloat(item.total_entradas || "0"),
        total_saidas: parseFloat(item.total_saidas || "0"),
        tipo_discrepancia: item.tipo_discrepancia,
        fonte: item.fonte,
      }),
    };
    
    return data.map(item => entityMappers[type](item));
  };

  const uploadCsv = async (type: 'empresas' | 'transacoes' | 'estoque' | 'analiseDiscrepancia') => {
    const file = files[type];
    if (!file) return;

    setLoading({ ...loading, [type]: true });
    
    try {
      // Parse CSV file
      const csvData = await parseCSV(file);
      
      // Map CSV data to entity format
      const formattedData = mapCsvDataToEntityFormat(csvData, type);
      
      if (formattedData.length === 0) {
        throw new Error("No valid data found in CSV file");
      }
      
      // Insert into database
      const tableName = type === 'analiseDiscrepancia' ? 'analise_discrepancia' : type;
      const { error } = await supabase.from(tableName).insert(formattedData);
      
      if (error) throw error;
      
      toast({
        title: "Importação concluída",
        description: `Arquivo ${file.name} importado com sucesso para ${type}`,
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar o arquivo",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading({ ...loading, [type]: false });
      setFiles({ ...files, [type]: null });
    }
  };

  // Determine which tab to show based on entityType
  const defaultTab = entityType;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importação de CSV</CardTitle>
        <CardDescription>
          Importe dados de CSV para o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab}>
          <TabsList className="mb-4">
            {entityType === "empresas" && <TabsTrigger value="empresas">Empresas</TabsTrigger>}
            {entityType === "transacoes" && <TabsTrigger value="transacoes">Transações</TabsTrigger>}
            {entityType === "estoque" && <TabsTrigger value="estoque">Estoque</TabsTrigger>}
            {entityType === "analiseDiscrepancia" && <TabsTrigger value="analiseDiscrepancia">Análise de Discrepâncias</TabsTrigger>}
          </TabsList>
          
          {entityType === "empresas" && (
            <TabsContent value="empresas">
              <div className="grid gap-4">
                <Label htmlFor="empresas-csv">Arquivo CSV de Empresas</Label>
                <Input
                  id="empresas-csv"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, 'empresas')}
                />
                <p className="text-sm text-muted-foreground">
                  Colunas esperadas: nome, cnpj
                </p>
              </div>
              <Button 
                className="mt-4 w-full"
                onClick={() => uploadCsv('empresas')}
                disabled={!files.empresas || loading.empresas}
              >
                {loading.empresas ? "Importando..." : "Importar Empresas"}
              </Button>
            </TabsContent>
          )}
          
          {entityType === "transacoes" && (
            <TabsContent value="transacoes">
              <div className="grid gap-4">
                <Label htmlFor="transacoes-csv">Arquivo CSV de Transações</Label>
                <Input
                  id="transacoes-csv"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, 'transacoes')}
                />
                <p className="text-sm text-muted-foreground">
                  Colunas esperadas: produto, valor, data, quantidade, tipo, cfop, empresa_id, codigo_produto, nome_produto,
                  estoque_inicial_2021, estoque_final_2021, total_entradas, total_saidas
                </p>
              </div>
              <Button 
                className="mt-4 w-full"
                onClick={() => uploadCsv('transacoes')}
                disabled={!files.transacoes || loading.transacoes}
              >
                {loading.transacoes ? "Importando..." : "Importar Transações"}
              </Button>
            </TabsContent>
          )}
          
          {entityType === "estoque" && (
            <TabsContent value="estoque">
              <div className="grid gap-4">
                <Label htmlFor="estoque-csv">Arquivo CSV de Estoque</Label>
                <Input
                  id="estoque-csv"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, 'estoque')}
                />
                <p className="text-sm text-muted-foreground">
                  Colunas esperadas: produto, quantidade_final, data_base, empresa_id, estoque_inicial_2021, estoque_final_2021
                </p>
              </div>
              <Button 
                className="mt-4 w-full"
                onClick={() => uploadCsv('estoque')}
                disabled={!files.estoque || loading.estoque}
              >
                {loading.estoque ? "Importando..." : "Importar Estoque"}
              </Button>
            </TabsContent>
          )}
          
          {entityType === "analiseDiscrepancia" && (
            <TabsContent value="analiseDiscrepancia">
              <div className="grid gap-4">
                <Label htmlFor="analise-csv">Arquivo CSV de Análise de Discrepâncias</Label>
                <Input
                  id="analise-csv"
                  type="file"
                  accept=".csv"
                  onChange={(e) => handleFileChange(e, 'analiseDiscrepancia')}
                />
                <p className="text-sm text-muted-foreground">
                  Colunas esperadas: produto, codigo_produto, estoque_inicial_2021, estoque_final_2021,
                  total_entradas, total_saidas, tipo_discrepancia, fonte, empresa_id
                </p>
              </div>
              <Button 
                className="mt-4 w-full"
                onClick={() => uploadCsv('analiseDiscrepancia')}
                disabled={!files.analiseDiscrepancia || loading.analiseDiscrepancia}
              >
                {loading.analiseDiscrepancia ? "Importando..." : "Importar Análise"}
              </Button>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
        <UploadCloud className="mb-2 text-primary" size={24} />
        <p>Arraste e solte arquivos CSV ou clique para selecionar</p>
      </CardFooter>
    </Card>
  );
}
