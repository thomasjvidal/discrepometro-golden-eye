
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Layout } from "./components/Layout";
import { EmpresasPage } from "./pages/empresas/EmpresasPage";
import { EmpresaForm } from "./pages/empresas/EmpresaForm";
import { EmpresaDetail } from "./pages/empresas/EmpresaDetail";
import { TransacoesPage } from "./pages/transacoes/TransacoesPage";
import { TransacaoForm } from "./pages/transacoes/TransacaoForm";
import { TransacaoDetail } from "./pages/transacoes/TransacaoDetail";
import { EstoquePage } from "./pages/estoque/EstoquePage";
import { EstoqueForm } from "./pages/estoque/EstoqueForm";
import { EstoqueDetail } from "./pages/estoque/EstoqueDetail";
import { DiscrepanciasPage } from "./pages/discrepancias/DiscrepanciasPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Index /></Layout>} />
          
          {/* Rotas de Empresas */}
          <Route path="/empresas" element={<Layout><EmpresasPage /></Layout>} />
          <Route path="/empresas/novo" element={<Layout><EmpresaForm /></Layout>} />
          <Route path="/empresas/:id" element={<Layout><EmpresaDetail /></Layout>} />
          <Route path="/empresas/:id/editar" element={<Layout><EmpresaForm /></Layout>} />
          
          {/* Rotas de Transações */}
          <Route path="/transacoes" element={<Layout><TransacoesPage /></Layout>} />
          <Route path="/transacoes/novo" element={<Layout><TransacaoForm /></Layout>} />
          <Route path="/transacoes/:id" element={<Layout><TransacaoDetail /></Layout>} />
          <Route path="/transacoes/:id/editar" element={<Layout><TransacaoForm /></Layout>} />
          
          {/* Rotas de Estoque */}
          <Route path="/estoque" element={<Layout><EstoquePage /></Layout>} />
          <Route path="/estoque/novo" element={<Layout><EstoqueForm /></Layout>} />
          <Route path="/estoque/:id" element={<Layout><EstoqueDetail /></Layout>} />
          <Route path="/estoque/:id/editar" element={<Layout><EstoqueForm /></Layout>} />
          
          {/* Rota de Discrepâncias */}
          <Route path="/discrepancias" element={<Layout><DiscrepanciasPage /></Layout>} />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
