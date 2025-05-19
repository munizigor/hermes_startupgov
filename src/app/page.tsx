"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { CallControls } from '@/components/dashboard/call-controls';
import { TranscriptView } from '@/components/dashboard/transcript-view';
import { ClassificationView } from '@/components/dashboard/classification-view';
import { SummaryView } from '@/components/dashboard/summary-view';
import { MapView } from '@/components/dashboard/map-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { handleClassifyCallAction, handleSummarizeCallAction } from './actions';
import type { ClassifyCallOutput } from '@/ai/flows/classify-call';
import type { SummarizeCallOutput } from '@/ai/flows/summarize-call';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

const MOCK_TRANSCRIPT_PARTS = [
  "Alô, Central 193?", "Sim, qual a sua emergência?", "Preciso de ajuda, há um incêndio de grandes proporções na Avenida Paulista, número 1578, próximo ao MASP.",
  "Ok, por favor, qual o seu nome?", "Meu nome é Ana Pereira.", "E o seu telefone de contato, Ana?", "É (11) 91234-5678.",
  "O incêndio é em um prédio comercial ou residencial?", "É um prédio comercial, parece ser um escritório.", "Há informações sobre vítimas ou pessoas presas no local?", "Eu vi algumas pessoas saindo correndo, mas não sei dizer se todos conseguiram evacuar. Tem muita fumaça.",
  "Entendido, Ana. A cidade é São Paulo, correto?", "Sim, São Paulo capital.",
  "Estamos enviando as equipes de bombeiros para o local imediatamente. Por favor, se estiver em segurança, permaneça afastada e aguarde as instruções das autoridades.", "Muito obrigada, por favor, venham rápido!", "As equipes já estão a caminho. Mantenha a calma e a linha desocupada, se possível."
];

export default function DashboardPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [classificationResult, setClassificationResult] = useState<ClassifyCallOutput | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummarizeCallOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const { toast } = useToast();

  // To store interval ID
  const [transcriptIntervalId, setTranscriptIntervalId] = useState<NodeJS.Timeout | null>(null);

  const clearCallData = () => {
    setTranscript("");
    setClassificationResult(null);
    setSummaryResult(null);
    setCurrentError(null);
  };
  
  const handleStartCall = useCallback(() => {
    clearCallData();
    setIsCallActive(true);
    setIsProcessing(false);
    
    let currentPart = 0;
    const intervalId = setInterval(() => {
      setTranscript(prev => prev + MOCK_TRANSCRIPT_PARTS[currentPart] + "\n\n");
      currentPart++;
      if (currentPart >= MOCK_TRANSCRIPT_PARTS.length) {
        if (transcriptIntervalId) clearInterval(transcriptIntervalId);
        setTranscriptIntervalId(null);
        // Optionally auto-end call here, or let user click "Encerrar Chamada"
        // For now, let user end it.
      }
    }, 1500);
    setTranscriptIntervalId(intervalId);
  }, [transcriptIntervalId]); // Include transcriptIntervalId in dependencies

  const handleStopCall = useCallback(async () => {
    setIsCallActive(false);
    if (transcriptIntervalId) {
      clearInterval(transcriptIntervalId);
      setTranscriptIntervalId(null);
    }

    if (!transcript.trim()) {
      toast({ title: "Nenhuma transcrição", description: "A chamada foi encerrada sem transcrição.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setCurrentError(null);

    try {
      toast({ title: "Processando chamada...", description: "Analisando transcrição com IA." });
      const classification = await handleClassifyCallAction({ transcript });
      setClassificationResult(classification);
      toast({ title: "Classificação Concluída", description: `Chamada classificada como: ${classification.classification}` });

      if (classification.address) {
        // Address will be used by MapView automatically
      }

      const summary = await handleSummarizeCallAction({ transcript });
      setSummaryResult(summary);
      toast({ title: "Resumo Gerado", description: "Resumo da chamada disponível." });

    } catch (error) {
      console.error("Error processing call:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
      setCurrentError(errorMessage);
      toast({ title: "Erro ao Processar Chamada", description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  }, [transcript, toast, transcriptIntervalId]); // transcriptIntervalId in dependencies

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (transcriptIntervalId) {
        clearInterval(transcriptIntervalId);
      }
    };
  }, [transcriptIntervalId]);


  return (
    <div className="flex flex-col h-full">
      <PageHeader title="Painel de Atendimento de Chamadas" description="Gerencie chamadas de emergência em tempo real." />
      <div className="grid md:grid-cols-2 gap-6 flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <CallControls 
            isCallActive={isCallActive}
            isProcessing={isProcessing}
            onStartCall={handleStartCall}
            onStopCall={handleStopCall}
          />
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-primary h-5 w-5" />
                Transcrição da Chamada
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <TranscriptView transcript={transcript} />
            </CardContent>
          </Card>
          {currentError && (
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Erro no Processamento</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-destructive-foreground">{currentError}</p>
              </CardContent>
            </Card>
          )}
          {classificationResult && (
            <Card>
              <CardHeader><CardTitle>Classificação da IA</CardTitle></CardHeader>
              <CardContent><ClassificationView data={classificationResult} /></CardContent>
            </Card>
          )}
        </div>
        {/* Right Column */}
        <div className="flex flex-col gap-6">
          <Card className="flex-1 min-h-[300px] md:min-h-[400px] flex flex-col">
            <CardHeader><CardTitle>Localização do Incidente</CardTitle></CardHeader>
            <CardContent className="flex-grow">
              <MapView address={classificationResult?.address || classificationResult?.city} />
            </CardContent>
          </Card>
          {summaryResult && (
            <Card>
              <CardHeader><CardTitle>Resumo da Chamada (IA)</CardTitle></CardHeader>
              <CardContent><SummaryView summary={summaryResult.summary} /></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
