
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getTransacoes, deleteTransacao } from "@/services/api";
import { CsvImporter } from "@/components/CsvImporter";
import { Plus, FileImport, Trash, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

export function TransacoesPage() {
  const { data: transacoes, isLoading, error, refetch } = useQuery({
    queryKey: ["transacoes"],
    queryFn: getTransacoes,
  });

  const [showImporter, setShowImporter] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransacao(id);
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a transação",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
        <p className="text-destructive">Erro ao carregar transações. Tente novamente mais tarde.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowImporter(!showImporter)}
          >
            <FileImport className="mr-2 h-4 w-4" />
            {showImporter ? "Ocultar Importador" : "Importar CSV"}
          </Button>
          <Button asChild>
            <Link to="/transacoes/novo">
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
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
          <CardTitle>Lista de Transações</CardTitle>
          <CardDescription>
            Histórico de todas as transações registradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando transações...</p>
            </div>
          ) : transacoes && transacoes.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>CFOP</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Qtd</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead className="w-24">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transacoes.map((transacao) => (
                    <TableRow key={transacao.id}>
                      <TableCell className="font-medium">
                        <Link 
                          to={`/transacoes/${transacao.id}`}
                          className="hover:text-primary"
                        >
                          {transacao.produto}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          transacao.tipo === 'entrada' 
                            ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                            : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                        }`}>
                          {transacao.tipo || '-'}
                        </span>
                      </TableCell>
                      <TableCell>{transacao.cfop}</TableCell>
                      <TableCell>{formatDate(transacao.data)}</TableCell>
                      <TableCell>{transacao.quantidade}</TableCell>
                      <TableCell>{formatCurrency(transacao.valor)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <Link to={`/transacoes/${transacao.id}/editar`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Editar</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(transacao.id)}
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
              <p className="text-muted-foreground">Nenhuma transação registrada.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
