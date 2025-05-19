
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { getDiscrepancias } from "@/services/api";
import { format } from "date-fns";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Filter } from "lucide-react";

const filterSchema = z.object({
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  tipoDiscrep: z.string().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

export function DiscrepanciasPage() {
  const { data: discrepancias = [], isLoading, error } = useQuery({
    queryKey: ["discrepancias"],
    queryFn: getDiscrepancias,
  });

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      dataInicio: "",
      dataFim: "",
      tipoDiscrep: "",
    },
  });

  const onSubmit = (values: FilterValues) => {
    // Em uma implementação real, aqui filtraremos as discrepâncias com base nos valores de filtro
    console.log("Filtros aplicados:", values);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  // Como não temos dados reais de discrepâncias, vamos criar alguns dados de exemplo para visualização
  const discrepanciasExemplo = [
    {
      id: "1",
      empresa_id: "1",
      tipo_discrep: "Divergência de entrada",
      produto: "Produto A",
      quantidade: 10,
      data_evento: "2025-05-15",
      criado_em: "2025-05-16",
    },
    {
      id: "2",
      empresa_id: "2",
      tipo_discrep: "Divergência de saída",
      produto: "Produto B",
      quantidade: 5,
      data_evento: "2025-05-14",
      criado_em: "2025-05-16",
    },
    {
      id: "3",
      empresa_id: "1",
      tipo_discrep: "Produto não encontrado",
      produto: "Produto C",
      quantidade: 3,
      data_evento: "2025-05-13",
      criado_em: "2025-05-16",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Discrepâncias</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtre as discrepâncias por período e tipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="dataInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Início</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dataFim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data Fim</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipoDiscrep"
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
                            <SelectValue placeholder="Todos os tipos" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Todos os tipos</SelectItem>
                          <SelectItem value="Divergência de entrada">Divergência de entrada</SelectItem>
                          <SelectItem value="Divergência de saída">Divergência de saída</SelectItem>
                          <SelectItem value="Produto não encontrado">Produto não encontrado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full md:w-auto">
                <Filter className="mr-2 h-4 w-4" />
                Aplicar Filtros
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Relatório de Discrepâncias</CardTitle>
          <CardDescription>
            Divergências identificadas entre registros de entrada, saída e estoque
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Carregando discrepâncias...</p>
            </div>
          ) : discrepanciasExemplo.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Data do Evento</TableHead>
                    <TableHead>Data de Registro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discrepanciasExemplo.map((disc) => (
                    <TableRow key={disc.id}>
                      <TableCell className="font-medium">
                        {disc.produto}
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400`}>
                          {disc.tipo_discrep}
                        </span>
                      </TableCell>
                      <TableCell>{disc.quantidade}</TableCell>
                      <TableCell>{formatDate(disc.data_evento)}</TableCell>
                      <TableCell>{formatDate(disc.criado_em)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-64">
              <p className="text-muted-foreground mb-4">Nenhuma discrepância encontrada.</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>As discrepâncias são calculadas automaticamente com base nos registros de transações e estoque</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
