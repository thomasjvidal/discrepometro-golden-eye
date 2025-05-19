
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterProps {
  filters: {
    tipo: string;
    fonte: string;
    cfop: string;
    dataInicio: string;
    dataFim: string;
  };
  onFilterChange: (filters: any) => void;
}

export function AnaliseDiscrepanciaFilter({ filters, onFilterChange }: FilterProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (field: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      tipo: "",
      fonte: "",
      cfop: "",
      dataInicio: "",
      dataFim: "",
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  return (
    <Card>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="space-y-2">
          <Label htmlFor="tipo">Tipo de Discrepância</Label>
          <Select
            value={localFilters.tipo}
            onValueChange={(value) => handleChange("tipo", value)}
          >
            <SelectTrigger id="tipo">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Compra sem Nota">Compra sem Nota</SelectItem>
              <SelectItem value="Venda sem Nota">Venda sem Nota</SelectItem>
              <SelectItem value="Sem Discrepância">Sem Discrepância</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fonte">Fonte</Label>
          <Select
            value={localFilters.fonte}
            onValueChange={(value) => handleChange("fonte", value)}
          >
            <SelectTrigger id="fonte">
              <SelectValue placeholder="Selecione a fonte" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="EFD">EFD</SelectItem>
              <SelectItem value="Planilha Emitente">Planilha Emitente</SelectItem>
              <SelectItem value="Planilha Destinatário">Planilha Destinatário</SelectItem>
              <SelectItem value="Inventário Fev/21">Inventário Fev/21</SelectItem>
              <SelectItem value="Inventário Fev/22">Inventário Fev/22</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cfop">CFOP</Label>
          <Input
            id="cfop"
            value={localFilters.cfop}
            onChange={(e) => handleChange("cfop", e.target.value)}
            placeholder="Digite o CFOP"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataInicio">Data Inicial</Label>
          <Input
            id="dataInicio"
            type="date"
            value={localFilters.dataInicio}
            onChange={(e) => handleChange("dataInicio", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dataFim">Data Final</Label>
          <Input
            id="dataFim"
            type="date"
            value={localFilters.dataFim}
            onChange={(e) => handleChange("dataFim", e.target.value)}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={handleApplyFilters} className="flex-1">Aplicar Filtros</Button>
          <Button variant="outline" onClick={handleClearFilters}>Limpar</Button>
        </div>
      </CardContent>
    </Card>
  );
}
