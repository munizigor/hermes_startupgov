"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, Search, ListFilter } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { Dispatch, SetStateAction } from 'react';

export interface FiltersState {
  date?: Date;
  nature?: string;
  city?: string;
  agency?: string; // dispatchType
  searchTerm?: string;
}

interface HistoryFiltersProps {
  filters: FiltersState;
  setFilters: Dispatch<SetStateAction<FiltersState>>;
  onApplyFilters: () => void;
}

export function HistoryFilters({ filters, setFilters, onApplyFilters }: HistoryFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof FiltersState) => (value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDateChange = (date?: Date) => {
    setFilters(prev => ({ ...prev, date: date }));
  };

  return (
    <div className="p-4 border-b bg-card">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        <Input
          name="searchTerm"
          placeholder="Buscar por palavra-chave..."
          value={filters.searchTerm || ""}
          onChange={handleInputChange}
          className="lg:col-span-2"
          aria-label="Buscar na transcrição"
        />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.date ? format(filters.date, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={filters.date}
              onSelect={handleDateChange}
              initialFocus
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
        <Select name="nature" onValueChange={handleSelectChange('nature')} value={filters.nature}>
          <SelectTrigger aria-label="Natureza da chamada">
            <SelectValue placeholder="Natureza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ocorrência">Ocorrência</SelectItem>
            <SelectItem value="Incidente">Incidente</SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="city"
          placeholder="Cidade"
          value={filters.city || ""}
          onChange={handleInputChange}
          aria-label="Filtrar por cidade"
        />
        {/* Agency filter could be dispatchType */}
        {/* <Input
          name="agency"
          placeholder="Agência/Tipo Despacho"
          value={filters.agency || ""}
          onChange={handleInputChange}
          aria-label="Filtrar por agência"
        /> */}
        <Button onClick={onApplyFilters} className="w-full bg-primary hover:bg-primary/90">
          <Search className="mr-2 h-4 w-4" /> Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
