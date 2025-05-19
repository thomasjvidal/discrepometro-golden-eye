
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAnaliseDiscrepancia, deleteAnaliseDiscrepancia, calcularEstoqueFinal } from "@/services/api";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnaliseDiscrepancia } from "@/types";

export function AnaliseDiscrepanciaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [discrepancia, setDiscrepancia] = useState<AnaliseDiscrepancia | null>(null);
  const [estoqueCalculado, setEstoqueCalculado] = useState<number>(0);
  
  const { isLoading, error, data } = useQuery({
    queryKey: ["analise_discrepancia", id],
    queryFn: () => id ? getAnaliseDiscrepancia(id) : Promise.reject("ID não fornecido"),
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setDiscrepancia(data);
      setEstoqueCalculado(calcularEstoqueFinal(
        data.estoque_inicial_2021,
        data.total_entradas,
        data.total_saidas
      ));
    }
  }, [data]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteAnaliseDiscrepancia(id);
      toast({
        title: "Registro excluído",
        description: "A análise de discrepância foi excluída com sucesso",
      });
      navigate("/analise");
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o registro",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const getBadgeVariant = (tipo?: string) => {
    switch (tipo) {
      case "Compra sem Nota":
        return "destructive";
      case "Venda sem Nota":
        return "secondary";
      case "Sem Discrepância":
        return "default";
      default:
        return "outline";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando dados...</p>
      </div>
    );
  }
  
  if (error || !discrepancia) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Erro ao carregar dados. Tente novamente mais tarde.</p>
      </div>
    );
  }

  const temDiscrepancia = estoqueCalculado !== discrepancia.estoque_final_2021;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/analise")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Detalhes da Análise de Discrepância
        </h1>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button variant="outline" asChild>
          <Link to={`/analise/${id}/editar`}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{discrepancia.produto}</CardTitle>
          <CardDescription>
            {discrepancia.codigo_produto ? `Código: ${discrepancia.codigo_produto}` : "Sem código de produto"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Tipo de Discrepância</h3>
                <Badge className="mt-1" variant={getBadgeVariant(discrepancia.tipo_discrepancia)}>
                  {discrepancia.tipo_discrepancia || "Não classificado"}
                </Badge>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Fonte</h3>
                <p>{discrepancia.fonte || "N/A"}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Cadastrado em</h3>
                <p>{formatDate(discrepancia.created_at)}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Última atualização</h3>
                <p>{formatDate(discrepancia.updated_at)}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estoque Inicial</h3>
                <p>{discrepancia.estoque_inicial_2021}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Entradas</h3>
                <p>{discrepancia.total_entradas}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total de Saídas</h3>
                <p>{discrepancia.total_saidas}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estoque Final</h3>
                <p>{discrepancia.estoque_final_2021}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h2 className="text-xl font-semibold mb-2">Análise de Discrepância</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Estoque Final Calculado</h3>
                <p className={`text-xl font-bold ${temDiscrepancia ? "text-destructive" : ""}`}>
                  {estoqueCalculado}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estoque Inicial + Total Entradas - Total Saídas
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Diferença</h3>
                <p className={`text-xl font-bold ${temDiscrepancia ? "text-destructive" : ""}`}>
                  {discrepancia.estoque_final_2021 - estoqueCalculado}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estoque Final - Estoque Final Calculado
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" onClick={() => navigate("/analise")}>Voltar</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
