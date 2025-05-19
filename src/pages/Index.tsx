
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Bem-vindo ao Discrepômetro</h1>
        <p className="text-muted-foreground text-lg">
          Sistema de controle e análise de discrepâncias em estoque
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => navigate("/empresas")}>
          <CardHeader className="pb-2">
            <CardTitle>Empresas</CardTitle>
            <CardDescription>Gerenciamento de empresas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              Cadastrar
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => navigate("/transacoes")}>
          <CardHeader className="pb-2">
            <CardTitle>Transações</CardTitle>
            <CardDescription>Registros de entrada e saída</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              Registrar
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => navigate("/estoque")}>
          <CardHeader className="pb-2">
            <CardTitle>Estoque</CardTitle>
            <CardDescription>Posições atuais de estoque</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              Controlar
            </p>
          </CardContent>
        </Card>

        <Card className="hover:border-primary/50 cursor-pointer transition-all" onClick={() => navigate("/discrepancias")}>
          <CardHeader className="pb-2">
            <CardTitle>Discrepâncias</CardTitle>
            <CardDescription>Análise de divergências</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">
              Analisar
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sobre o Discrepômetro</CardTitle>
          <CardDescription>
            Ferramenta completa para gerenciamento e análise de estoques
          </CardDescription>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            O Discrepômetro é uma aplicação desenvolvida para auxiliar empresas no controle eficiente de estoque,
            identificando e analisando divergências entre registros de entrada, saída e posições de estoque.
          </p>
          <h3>Principais recursos</h3>
          <ul>
            <li><strong>Cadastro de Empresas</strong> - Gerencie múltiplas empresas e filiais</li>
            <li><strong>Registro de Transações</strong> - Controle entradas e saídas de produtos</li>
            <li><strong>Posição de Estoque</strong> - Acompanhe a quantidade disponível de cada produto</li>
            <li><strong>Análise de Discrepâncias</strong> - Identifique e corrija divergências no estoque</li>
            <li><strong>Importação de CSV</strong> - Importe dados em massa para agilizar o cadastro</li>
          </ul>
          
          <div className="flex gap-4 mt-6">
            <Button 
              onClick={() => navigate("/empresas/novo")}
              className="flex-1"
            >
              Cadastrar Empresa
            </Button>
            <Button 
              onClick={() => navigate("/transacoes/novo")}
              className="flex-1"
            >
              Registrar Transação
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
