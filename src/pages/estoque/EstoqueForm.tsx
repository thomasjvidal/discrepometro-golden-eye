
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
import { getEstoque, createEstoque, updateEstoque, getEmpresas } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  produto: z.string().min(1, "Produto é obrigatório"),
  quantidade_final: z.coerce.number().min(0, "A quantidade não pode ser negativa"),
  data_base: z.string().min(1, "Data base é obrigatória"),
  empresa_id: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function EstoqueForm() {
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
      quantidade_final: 0,
      data_base: new Date().toISOString().split('T')[0],
      empresa_id: undefined,
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadEstoque();
    }
  }, [id]);

  const loadEstoque = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const estoque = await getEstoque(id);
      form.reset({
        produto: estoque.produto,
        quantidade_final: estoque.quantidade_final,
        data_base: estoque.data_base ? new Date(estoque.data_base).toISOString().split('T')[0] : "",
        empresa_id: estoque.empresa_id,
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados do registro",
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
        await updateEstoque(id, values);
        toast({
          title: "Registro atualizado",
          description: "Dados do estoque atualizados com sucesso",
        });
      } else {
        await createEstoque(values);
        toast({
          title: "Registro criado",
          description: "Novo registro de estoque cadastrado com sucesso",
        });
      }
      
      navigate("/estoque");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados do registro",
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/estoque")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Registro de Estoque" : "Novo Registro de Estoque"}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Registro" : "Novo Registro"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Atualize os dados do registro de estoque selecionado"
              : "Preencha os dados para registrar uma nova posição de estoque"}
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
                  name="quantidade_final"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade Final</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="data_base"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Base</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
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
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/estoque")}
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
