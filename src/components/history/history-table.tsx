"use client";

import type { CallRecord } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryTableProps {
  calls: CallRecord[];
  itemsPerPage?: number;
}

export function HistoryTable({ calls, itemsPerPage = 10 }: HistoryTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(calls.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCalls = calls.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString; // fallback if date is not ISO
    }
  };


  if (calls.length === 0) {
    return <p className="p-4 text-center text-muted-foreground">Nenhum registro de chamada encontrado.</p>;
  }

  return (
    <div className="bg-card rounded-lg shadow">
      <ScrollArea className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Natureza</TableHead>
              <TableHead>Cidade</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Despacho</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCalls.map((call) => (
              <TableRow key={call.id}>
                <TableCell>{formatDate(call.date)}</TableCell>
                <TableCell>
                  <Badge variant={call.classification === 'Ocorrência' ? 'default' : 'secondary'} className={call.classification === 'Ocorrência' ? 'bg-primary' : ''}>
                    {call.classification}
                  </Badge>
                </TableCell>
                <TableCell>{call.city || 'N/A'}</TableCell>
                <TableCell>{call.callerName || 'N/A'}</TableCell>
                <TableCell>{call.dispatchType || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <FileText className="mr-2 h-4 w-4" /> Ver Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Detalhes da Chamada - {formatDate(call.date)}</DialogTitle>
                        <DialogDescription>
                          Classificação: {call.classification} {call.city && ` - Cidade: ${call.city}`}
                        </DialogDescription>
                      </DialogHeader>
                      <ScrollArea className="max-h-[60vh] pr-4">
                        <div className="grid gap-4 py-4 text-sm">
                          {call.callerName && <p><strong>Solicitante:</strong> {call.callerName}</p>}
                          {call.callerPhoneNumber && <p><strong>Telefone:</strong> {call.callerPhoneNumber}</p>}
                          {call.address && <p><strong>Endereço:</strong> {call.address}</p>}
                          {call.dispatchType && <p><strong>Tipo de Despacho:</strong> {call.dispatchType}</p>}
                          
                          <h4 className="font-semibold mt-4">Transcrição:</h4>
                          <div className="p-2 bg-muted/50 rounded-md max-h-48 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">{call.transcript}</pre>
                          </div>
                          
                          {call.summary && (
                            <>
                              <h4 className="font-semibold mt-2">Resumo:</h4>
                              <div className="p-2 bg-muted/50 rounded-md">
                                <p>{call.summary}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </ScrollArea>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {totalPages > 1 && (
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Próxima <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
