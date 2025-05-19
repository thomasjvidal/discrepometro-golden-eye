
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-800">Empresas</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
            className="border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <FileUp className="mr-2 h-4 w-4" />
            {showImporter ? "Ocultar Importador" : "Importar CSV"}
          </Button>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
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

      <Card className="border border-gray-300 shadow-sm">
        <CardHeader className="bg-white">
          <CardTitle className="text-gray-800">Lista de Empresas</CardTitle>
          <CardDescription className="text-gray-600">
            Gerenciamento de empresas cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-600">Carregando empresas...</p>
            </div>
          ) : empresas && empresas.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Nome</TableHead>
                  <TableHead className="text-gray-700">CNPJ</TableHead>
                  <TableHead className="w-24 text-gray-700">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empresas.map((empresa) => (
                  <TableRow key={empresa.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-gray-800">
                      <Link 
                        to={`/empresas/${empresa.id}`}
                        className="hover:text-primary"
                      >
                        {empresa.nome}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-700">{empresa.cnpj}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                          className="hover:bg-gray-100"
                        >
                          <Link to={`/empresas/${empresa.id}/editar`}>
                            <Edit className="h-4 w-4 text-gray-600" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(empresa.id)}
                          className="hover:bg-gray-100"
                        >
                          <Trash className="h-4 w-4 text-gray-600" />
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
              <p className="text-gray-600">Nenhuma empresa cadastrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
