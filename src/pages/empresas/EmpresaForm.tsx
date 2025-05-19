
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getEmpresa, createEmpresa, updateEmpresa } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

const formSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cnpj: z.string().min(14, "CNPJ deve ter pelo menos 14 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

export function EmpresaForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cnpj: "",
    },
  });

  useEffect(() => {
    if (isEditing) {
      loadEmpresa();
    }
  }, [id]);

  const loadEmpresa = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const empresa = await getEmpresa(id);
      form.reset({
        nome: empresa.nome,
        cnpj: empresa.cnpj,
      });
    } catch (error) {
      toast({
        title: "Erro ao carregar",
        description: "Não foi possível carregar os dados da empresa",
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
        await updateEmpresa(id, values);
        toast({
          title: "Empresa atualizada",
          description: "Dados da empresa atualizados com sucesso",
        });
      } else {
        await createEmpresa(values);
        toast({
          title: "Empresa criada",
          description: "Nova empresa cadastrada com sucesso",
        });
      }
      
      navigate("/empresas");
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar os dados da empresa",
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
        <Button variant="ghost" size="icon" onClick={() => navigate("/empresas")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {isEditing ? "Editar Empresa" : "Nova Empresa"}
        </h1>
      </div>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Editar Empresa" : "Nova Empresa"}</CardTitle>
          <CardDescription>
            {isEditing 
              ? "Atualize os dados da empresa selecionada"
              : "Preencha os dados para cadastrar uma nova empresa"}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => navigate("/empresas")}
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
