
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransacao, deleteTransacao, getEmpresa } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { format } from "date-fns";

export function TransacaoDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: transacao, isLoading, error } = useQuery({
    queryKey: ["transacao", id],
    queryFn: () => getTransacao(id!),
    enabled: !!id,
  });

  const { data: empresa } = useQuery({
    queryKey: ["empresa", transacao?.empresa_id],
    queryFn: () => getEmpresa(transacao?.empresa_id!),
    enabled: !!transacao?.empresa_id,
  });

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await deleteTransacao(id);
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso",
      });
      navigate("/transacoes");
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Carregando detalhes da transação...</p>
      </div>
    );
  }

  if (error || !transacao) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/transacoes")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Transação não encontrada</h1>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Transação não encontrada ou erro ao carregar detalhes.</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/transacoes")}
            >
              Voltar para lista de transações
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/transacoes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Detalhes da Transação</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transação: {transacao.produto}</CardTitle>
          <CardDescription>
            Detalhes completos do registro de transação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Produto</h3>
              <p className="text-lg mt-1">{transacao.produto}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Tipo</h3>
              <p className="text-lg mt-1">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  transacao.tipo === 'entrada' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {transacao.tipo || '-'}
                </span>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">CFOP</h3>
              <p className="text-lg mt-1">{transacao.cfop}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Data</h3>
              <p className="text-lg mt-1">{formatDate(transacao.data)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Quantidade</h3>
              <p className="text-lg mt-1">{transacao.quantidade}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Valor</h3>
              <p className="text-lg mt-1">{formatCurrency(transacao.valor)}</p>
            </div>
            {empresa && (
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Empresa</h3>
                <p className="text-lg mt-1">
                  <Link to={`/empresas/${empresa.id}`} className="text-primary hover:underline">
                    {empresa.nome} ({empresa.cnpj})
                  </Link>
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate("/transacoes")}
          >
            Voltar
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              asChild
            >
              <Link to={`/transacoes/${id}/editar`}>
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
