
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
import { getTransacao, createTransacao, updateTransacao, getEmpresas } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Transacao } from "@/types";

const formSchema = z.object({
  produto: z.string().min(1, "Produto é obrigatório"),
  quantidade: z.coerce.number().min(0.01, "A quantidade deve ser maior que zero"),
  valor: z.coerce.number().min(0.01, "O valor deve ser maior que zero"),
  data: z.string().min(1, "Data é obrigatória"),
  tipo: z.enum(["entrada", "saida"], { 
    required_error: "Selecione o tipo de transação" 
  }),
  cfop: z.string().min(1, "CFOP é obrigatório"),
  empresa_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function TransacaoForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const { data: empresas = [] } = useQuery({
    queryKey: ["empresas"],
    queryFn: getEmpresas,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      produto: "",
      quantidade: 0,
      valor: 0,
      data: new Date().toISOString().split('T')[0],
      tipo: "entrada",
      cfop: "",
      empresa_id: undefined,
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadTransacao();
    }
  }, [id]);

  const loadTransacao = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const transacao = await getTransacao(id);
      form.reset({
        produto: transacao.produto,
        quantidade: transacao.quantidade,
        valor: transacao.valor,
        data: transacao.data ? new Date(transacao.data).toISOString().split('T')[0] : "",
        tipo: transacao.tipo || "entrada",
        cfop: transacao.cfop,
        empresa_id: transacao.empresa_id,
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da transação",
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
        await updateTransacao(id, values as Partial<Transacao>);
        toast({
          title: "Transação atualizada",
          description: "Dados da transação atualizados com sucesso",
        });
      } else {
        await createTransacao(values as Omit<Transacao, "id">);
        toast({
          title: "Transação criada",
          description: "Nova transação cadastrada com sucesso",
        });
      }
      
      navigate("/transacoes");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da transação",
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/transacoes")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Transação" : "Nova Transação"}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Transação" : "Nova Transação"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Atualize os dados da transação selecionada"
              : "Preencha os dados para registrar uma nova transação"}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="quantidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="valor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cfop"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CFOP</FormLabel>
                      <FormControl>
                        <Input placeholder="CFOP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="empresa_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Empresa</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a empresa" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {empresas.map((empresa) => (
                            <SelectItem key={empresa.id} value={empresa.id}>
                              {empresa.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/transacoes")}
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
