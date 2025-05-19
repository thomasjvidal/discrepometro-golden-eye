
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getEstoques, deleteEstoque } from "@/services/api";
import { CsvImporter } from "@/components/CsvImporter";
import { Plus, FileImport, Trash, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function EstoquePage() {
  const { data: estoques, isLoading, error, refetch } = useQuery({
    queryKey: ["estoques"],
    queryFn: getEstoques,
  });

  const [showImporter, setShowImporter] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteEstoque(id);
      toast({
        title: "Registro excluído",
        description: "O registro de estoque foi excluído com sucesso",
      });
      refetch();
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

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Erro ao carregar registros de estoque. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Estoque</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
          >
            <FileImport className="mr-2 h-4 w-4" />
            {showImporter ? "Ocultar Importador" : "Importar CSV"}
          </Button>
          <Button asChild>
            <Link to="/estoque/novo">
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
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
          <CardTitle>Registros de Estoque</CardTitle>
          <CardDescription>
            Acompanhamento do estoque de produtos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando registros de estoque...</p>
            </div>
          ) : estoques && estoques.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Quantidade Final</TableHead>
                    <TableHead>Data Base</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {estoques.map((estoque) => (
                    <TableRow key={estoque.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/estoque/${estoque.id}`}
                          className="hover:text-primary"
                        >
                          {estoque.produto}
                        </Link>
                      </TableCell>
                      <TableCell>{estoque.quantidade_final}</TableCell>
                      <TableCell>{formatDate(estoque.data_base)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/estoque/${estoque.id}/editar`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(estoque.id)}
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
            </div>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Nenhum registro de estoque disponível.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
