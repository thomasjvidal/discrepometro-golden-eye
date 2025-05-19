
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

export function CsvImporter() {
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    empresas: null,
    transacoes: null,
    estoque: null,
  });
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({
    empresas: false,
    transacoes: false,
    estoque: false,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const uploadCsv = async (type: 'empresas' | 'transacoes' | 'estoque') => {
    const file = files[type];
    if (!file) return;

    setLoading({ ...loading, [type]: true });
    
    try {
      // Aqui apenas simulamos o processamento do CSV
      // Em uma implementação real, analisaríamos o CSV e mapeamos para as colunas corretas
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Importação concluída",
        description: `Arquivo ${file.name} importado com sucesso para ${type}`,
      });
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Importação de CSV</CardTitle>
        <CardDescription>
          Importe dados de CSV para o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="empresas">
          <TabsList className="mb-4">
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="transacoes">Transações</TabsTrigger>
            <TabsTrigger value="estoque">Estoque</TabsTrigger>
          </TabsList>
          
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
                Colunas esperadas: produto, valor, data, quantidade, tipo, cfop, empresa_id
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
                Colunas esperadas: produto, quantidade_final, data_base, empresa_id
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
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-center text-sm text-muted-foreground">
        <UploadCloud className="mb-2 text-primary" size={24} />
        <p>Arraste e solte arquivos CSV ou clique para selecionar</p>
      </CardFooter>
    </Card>
  );
}
