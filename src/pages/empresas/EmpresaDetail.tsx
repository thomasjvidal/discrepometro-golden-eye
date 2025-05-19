
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getEmpresa, deleteEmpresa } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash } from "lucide-react";

export function EmpresaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: empresa, isLoading, error } = useQuery({
    queryKey: ["empresa", id],
    queryFn: () => getEmpresa(id!),
    enabled: !!id,
  });

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteEmpresa(id);
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso",
      });
      navigate("/empresas");
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a empresa",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando detalhes da empresa...</p>
      </div>
    );
  }

  if (error || !empresa) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/empresas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Empresa não encontrada</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Empresa não encontrada ou erro ao carregar detalhes.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/empresas")}
            >
              Voltar para lista de empresas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/empresas")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{empresa.nome}</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Empresa</CardTitle>
          <CardDescription>
            Informações cadastrais da empresa selecionada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Nome</h3>
              <p className="text-lg mt-1">{empresa.nome}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CNPJ</h3>
              <p className="text-lg mt-1">{empresa.cnpj}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/empresas")}
          >
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to={`/empresas/${id}/editar`}>
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
