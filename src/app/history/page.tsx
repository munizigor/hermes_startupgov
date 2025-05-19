"use client";

import { useState, useEffect, useMemo } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { HistoryFilters, type FiltersState } from '@/components/history/history-filters';
import { HistoryTable } from '@/components/history/history-table';
import type { CallRecord } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';

// Mock data - replace with actual data fetching
const MOCK_CALL_HISTORY: CallRecord[] = [
  {
    id: '1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    transcript: "Incêndio na Rua das Flores, 123. Solicitante: Maria Oliveira. Telefone: (21) 99887-6655. Prédio residencial.",
    classification: "Ocorrência",
    dispatchType: "Viatura de Bombeiros, Ambulância",
    callerName: "Maria Oliveira",
    callerPhoneNumber: "(21) 99887-6655",
    address: "Rua das Flores, 123, Flamengo",
    city: "Rio de Janeiro",
    summary: "Incêndio em prédio residencial na Rua das Flores, Rio de Janeiro. Solicitante Maria Oliveira. Viatura de bombeiros e ambulância despachadas."
  },
  {
    id: '2',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    transcript: "Acidente de trânsito na Av. Brasil, altura do número 5000. Solicitante: Carlos Alberto. Telefone: (11) 91122-3344. Envolveu dois carros, uma vítima presa nas ferragens.",
    classification: "Incidente",
    dispatchType: "Polícia Militar, Bombeiros (Resgate), Ambulância",
    callerName: "Carlos Alberto",
    callerPhoneNumber: "(11) 91122-3344",
    address: "Av. Brasil, 5000, Centro",
    city: "São Paulo",
    summary: "Acidente de trânsito com vítima presa na Av. Brasil, São Paulo. Solicitante Carlos Alberto. Múltiplas agências despachadas."
  },
  {
    id: '3',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    transcript: "Vazamento de gás na Rua da Consolação, 900. Solicitante: Joana Silva. Telefone: (11) 95566-7788. Cheiro forte de gás.",
    classification: "Ocorrência",
    dispatchType: "Viatura de Bombeiros",
    callerName: "Joana Silva",
    callerPhoneNumber: "(11) 95566-7788",
    address: "Rua da Consolação, 900",
    city: "São Paulo",
    summary: "Vazamento de gás na Rua da Consolação, São Paulo. Solicitante Joana Silva. Viatura de bombeiros despachada."
  },
  // Add more mock calls as needed for pagination and filtering tests
  ...Array.from({ length: 15 }, (_, i) => ({
    id: (i + 4).toString(),
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (i + 3)).toISOString(),
    transcript: `Chamada de teste ${i+1}. Detalhes variados para teste de filtro. Cidade Exemplo. Incidente Ocorrência`,
    classification: i % 2 === 0 ? "Ocorrência" : "Incidente" as "Ocorrência" | "Incidente",
    dispatchType: i % 2 === 0 ? "Bombeiros" : "Polícia",
    callerName: `Solicitante ${i+1}`,
    callerPhoneNumber: `(00) 90000-000${i}`,
    address: `Rua Teste ${i+1}, Bairro Exemplo`,
    city: i % 3 === 0 ? "São Paulo" : (i % 3 === 1 ? "Rio de Janeiro" : "Belo Horizonte"),
    summary: `Resumo da chamada de teste ${i+1}.`
  }))
];


export default function HistoryPage() {
  const [filters, setFilters] = useState<FiltersState>({});
  const [filteredCalls, setFilteredCalls] = useState<CallRecord[]>(MOCK_CALL_HISTORY);

  const applyFilters = () => {
    let calls = MOCK_CALL_HISTORY;
    if (filters.date) {
      calls = calls.filter(call => new Date(call.date).toDateString() === filters.date?.toDateString());
    }
    if (filters.nature) {
      calls = calls.filter(call => call.classification === filters.nature);
    }
    if (filters.city) {
      calls = calls.filter(call => call.city?.toLowerCase().includes(filters.city!.toLowerCase()));
    }
    if (filters.agency) { // Assuming agency maps to dispatchType
      calls = calls.filter(call => call.dispatchType?.toLowerCase().includes(filters.agency!.toLowerCase()));
    }
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      calls = calls.filter(call => 
        call.transcript.toLowerCase().includes(searchTermLower) ||
        (call.callerName && call.callerName.toLowerCase().includes(searchTermLower)) ||
        (call.address && call.address.toLowerCase().includes(searchTermLower)) ||
        (call.summary && call.summary.toLowerCase().includes(searchTermLower))
      );
    }
    setFilteredCalls(calls);
  };

  // Apply filters when component mounts or filters change (optional, button click is primary)
  // useEffect(() => {
  //   applyFilters();
  // }, [filters]);

  return (
    <div className="flex flex-col h-full">
      <PageHeader 
        title="Histórico de Chamadas" 
        description="Pesquise e revise chamadas anteriores." 
      />
      <HistoryFilters filters={filters} setFilters={setFilters} onApplyFilters={applyFilters} />
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {filteredCalls.length > 0 ? (
          <HistoryTable calls={filteredCalls} />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-card rounded-lg shadow">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar seus filtros de pesquisa ou verifique se há registros disponíveis.</p>
          </div>
        )}
      </div>
    </div>
  );
}
