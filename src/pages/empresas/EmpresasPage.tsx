
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEmpresas, deleteEmpresa } from "@/services/api";
import { CsvImporter } from "@/components/CsvImporter";
import { Plus, FileUp, Trash, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export function EmpresasPage() {
  const { data: empresas, isLoading, error, refetch } = useQuery({
    queryKey: ["empresas"],
    queryFn: getEmpresas,
  });

  const [showImporter, setShowImporter] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteEmpresa(id);
      toast({
        title: "Empresa excluída",
        description: "A empresa foi excluída com sucesso",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a empresa",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Erro ao carregar empresas. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Empresas</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {showImporter ? "Ocultar Importador" : "Importar CSV"}
          </Button>
          <Button asChild>
            <Link to="/empresas/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Empresa
            </Link>
          </Button>
        </div>
      </div>

      {showImporter && (
        <div className="mb-6">
          <CsvImporter />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Empresas</CardTitle>
          <CardDescription>
            Gerenciamento de empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando empresas...</p>
            </div>
          ) : empresas && empresas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CNPJ</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa.id}>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/empresas/${empresa.id}`}
                        className="hover:text-primary"
                      >
                        {empresa.nome}
                      </Link>
                    </TableCell>
                    <TableCell>{empresa.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/empresas/${empresa.id}/editar`}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(empresa.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Nenhuma empresa cadastrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
