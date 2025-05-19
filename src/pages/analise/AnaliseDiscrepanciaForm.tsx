
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAnaliseDiscrepancia, createAnaliseDiscrepancia, updateAnaliseDiscrepancia, calcularEstoqueFinal } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { AnaliseDiscrepancia } from "@/types";

const formSchema = z.object({
  produto: z.string().min(1, "Produto é obrigatório"),
  codigo_produto: z.string().optional(),
  estoque_inicial_2021: z.coerce.number(),
  estoque_final_2021: z.coerce.number(),
  total_entradas: z.coerce.number(),
  total_saidas: z.coerce.number(),
  tipo_discrepancia: z.string().optional(),
  fonte: z.string().optional(),
  empresa_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function AnaliseDiscrepanciaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [estoqueCalculado, setEstoqueCalculado] = useState<number>(0);
  const isEditing = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: "",
      codigo_produto: "",
      estoque_inicial_2021: 0,
      estoque_final_2021: 0,
      total_entradas: 0,
      total_saidas: 0,
      tipo_discrepancia: "",
      fonte: "",
    },
  });

  // Watch values to calculate estoque final
  const estoque_inicial = form.watch("estoque_inicial_2021");
  const total_entradas = form.watch("total_entradas");
  const total_saidas = form.watch("total_saidas");

  useEffect(() => {
    const calculado = calcularEstoqueFinal(estoque_inicial, total_entradas, total_saidas);
    setEstoqueCalculado(calculado);
  }, [estoque_inicial, total_entradas, total_saidas]);

  useEffect(() => {
    if (isEditing) {
      loadAnaliseDiscrepancia();
    }
  }, [id]);

  const loadAnaliseDiscrepancia = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const analiseDiscrepancia = await getAnaliseDiscrepancia(id);
      form.reset({
        produto: analiseDiscrepancia.produto,
        codigo_produto: analiseDiscrepancia.codigo_produto,
        estoque_inicial_2021: analiseDiscrepancia.estoque_inicial_2021,
        estoque_final_2021: analiseDiscrepancia.estoque_final_2021,
        total_entradas: analiseDiscrepancia.total_entradas,
        total_saidas: analiseDiscrepancia.total_saidas,
        tipo_discrepancia: analiseDiscrepancia.tipo_discrepancia,
        fonte: analiseDiscrepancia.fonte,
        empresa_id: analiseDiscrepancia.empresa_id,
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da análise",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      
      if (isEditing && id) {
        await updateAnaliseDiscrepancia(id, values as Partial<AnaliseDiscrepancia>);
        toast({
          title: "Análise atualizada",
          description: "Dados da análise atualizados com sucesso",
        });
      } else {
        await createAnaliseDiscrepancia(values as Omit<AnaliseDiscrepancia, "id" | "created_at" | "updated_at">);
        toast({
          title: "Análise criada",
          description: "Nova análise cadastrada com sucesso",
        });
      }
      
      navigate("/analise");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da análise",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/analise")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Análise de Discrepância" : "Nova Análise de Discrepância"}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Análise de Discrepância" : "Nova Análise de Discrepância"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Atualize os dados da análise selecionada"
              : "Preencha os dados para cadastrar uma nova análise de discrepância"}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="produto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="codigo_produto"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Código do produto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="estoque_inicial_2021"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Inicial 2021</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="estoque_final_2021"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Final 2021</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="total_entradas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Entradas</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="total_saidas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Saídas</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="text-sm font-medium mb-2">Estoque Final Calculado</h3>
                <p className="text-xl">
                  {estoqueCalculado}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Estoque Inicial + Total Entradas - Total Saídas
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="tipo_discrepancia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Discrepância</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de discrepância" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Não classificado</SelectItem>
                        <SelectItem value="Compra sem Nota">Compra sem Nota</SelectItem>
                        <SelectItem value="Venda sem Nota">Venda sem Nota</SelectItem>
                        <SelectItem value="Sem Discrepância">Sem Discrepância</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="fonte"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fonte</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a fonte" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Não especificado</SelectItem>
                        <SelectItem value="EFD">EFD</SelectItem>
                        <SelectItem value="Planilha Emitente">Planilha Emitente</SelectItem>
                        <SelectItem value="Planilha Destinatário">Planilha Destinatário</SelectItem>
                        <SelectItem value="Inventário Fev/21">Inventário Fev/21</SelectItem>
                        <SelectItem value="Inventário Fev/22">Inventário Fev/22</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/analise")}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
