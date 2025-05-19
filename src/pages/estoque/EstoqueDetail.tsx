
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEstoque, deleteEstoque, getEmpresa } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export function EstoqueDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: estoque, isLoading, error } = useQuery({
    queryKey: ["estoque", id],
    queryFn: () => getEstoque(id!),
    enabled: !!id,
  });

  const { data: empresa } = useQuery({
    queryKey: ["empresa", estoque?.empresa_id],
    queryFn: () => getEmpresa(estoque?.empresa_id!),
    enabled: !!estoque?.empresa_id,
  });

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteEstoque(id);
      toast({
        title: "Registro excluído",
        description: "O registro de estoque foi excluído com sucesso",
      });
      navigate("/estoque");
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o registro",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando detalhes do registro...</p>
      </div>
    );
  }

  if (error || !estoque) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/estoque")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Registro não encontrado</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Registro não encontrado ou erro ao carregar detalhes.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/estoque")}
            >
              Voltar para lista de estoque
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/estoque")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes do Estoque</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Estoque: {estoque.produto}</CardTitle>
          <CardDescription>
            Detalhes completos do registro de estoque
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Produto</h3>
              <p className="text-lg mt-1">{estoque.produto}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quantidade Final</h3>
              <p className="text-lg mt-1">{estoque.quantidade_final}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Data Base</h3>
              <p className="text-lg mt-1">{formatDate(estoque.data_base)}</p>
            </div>
            {empresa && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                <p className="text-lg mt-1">
                  <Link to={`/empresas/${empresa.id}`} className="text-primary hover:underline">
                    {empresa.nome}
                  </Link>
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/estoque")}
          >
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to={`/estoque/${id}/editar`}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              <Trash className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
