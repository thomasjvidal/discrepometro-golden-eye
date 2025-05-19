
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { getAnaliseDiscrepancias, deleteAnaliseDiscrepancia, calcularEstoqueFinal } from "@/services/api";
import { CsvImporter } from "@/components/CsvImporter";
import { Plus, FileUp, Trash, Edit, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AnaliseDiscrepanciaFilter } from "./AnaliseDiscrepanciaFilter";

export function AnaliseDiscrepanciaPage() {
  const { data: discrepancias, isLoading, error, refetch } = useQuery({
    queryKey: ["analise_discrepancias"],
    queryFn: getAnaliseDiscrepancias,
  });

  const [showImporter, setShowImporter] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    tipo: "",
    fonte: "",
    cfop: "",
    dataInicio: "",
    dataFim: "",
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteAnaliseDiscrepancia(id);
      toast({
        title: "Registro excluído",
        description: "A análise de discrepância foi excluída com sucesso",
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

  const filteredDiscrepancias = discrepancias
    ? discrepancias.filter(item => {
        if (filters.tipo && item.tipo_discrepancia !== filters.tipo) return false;
        if (filters.fonte && item.fonte !== filters.fonte) return false;
        return true;
      })
    : [];

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-destructive">Erro ao carregar dados. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Análise de Discrepâncias</h1>
        <div className="flex gap-2">
          <Button
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            {showFilters ? "Ocultar Filtros" : "Filtrar"}
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
          >
            <FileUp className="mr-2 h-4 w-4" />
            {showImporter ? "Ocultar Importador" : "Importar CSV"}
          </Button>
          <Button asChild>
            <Link to="/analise/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Análise
            </Link>
          </Button>
        </div>
      </div>

      {showImporter && (
        <div className="mb-6">
          <CsvImporter entityType="analiseDiscrepancia" onSuccess={() => refetch()} />
        </div>
      )}

      {showFilters && (
        <AnaliseDiscrepanciaFilter 
          filters={filters} 
          onFilterChange={setFilters} 
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Análises de Discrepância</CardTitle>
          <CardDescription>
            <div className="flex flex-col">
              <span>Estoque Final Calculado = Estoque Inicial 2021 + Total Entradas - Total Saídas</span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando dados...</p>
            </div>
          ) : filteredDiscrepancias.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Estoque Inicial</TableHead>
                  <TableHead>Total Entradas</TableHead>
                  <TableHead>Total Saídas</TableHead>
                  <TableHead>Estoque Calculado</TableHead>
                  <TableHead>Estoque Final</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fonte</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscrepancias.map((discrepancia) => {
                  const estoqueCalculado = calcularEstoqueFinal(
                    discrepancia.estoque_inicial_2021,
                    discrepancia.total_entradas,
                    discrepancia.total_saidas
                  );
                  const temDiscrepancia = estoqueCalculado !== discrepancia.estoque_final_2021;
                  
                  return (
                    <TableRow key={discrepancia.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/analise/${discrepancia.id}`}
                          className="hover:text-primary"
                        >
                          {discrepancia.produto}
                        </Link>
                      </TableCell>
                      <TableCell>{discrepancia.codigo_produto}</TableCell>
                      <TableCell>{discrepancia.estoque_inicial_2021}</TableCell>
                      <TableCell>{discrepancia.total_entradas}</TableCell>
                      <TableCell>{discrepancia.total_saidas}</TableCell>
                      <TableCell className={temDiscrepancia ? "text-destructive font-bold" : ""}>
                        {estoqueCalculado}
                      </TableCell>
                      <TableCell>{discrepancia.estoque_final_2021}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(discrepancia.tipo_discrepancia)}>
                          {discrepancia.tipo_discrepancia || "Não classificado"}
                        </Badge>
                      </TableCell>
                      <TableCell>{discrepancia.fonte || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/analise/${discrepancia.id}/editar`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(discrepancia.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Nenhuma análise de discrepância cadastrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
