
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { CallControls } from '@/components/dashboard/call-controls';
import { TranscriptView } from '@/components/dashboard/transcript-view';
import { ClassificationView } from '@/components/dashboard/classification-view';
import { SummaryView } from '@/components/dashboard/summary-view';
import { MapView } from '@/components/dashboard/map-view';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { handleClassifyCallAction, handleSummarizeCallAction, saveCallRecordToFirestore, type SaveCallPayload } from './actions';
import type { ClassifyCallOutput } from '@/ai/flows/classify-call';
import type { SummarizeCallOutput } from '@/ai/flows/summarize-call';
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [isCallActive, setIsCallActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isTranscriptEditable, setIsTranscriptEditable] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassifyCallOutput | null>(null);
  const [summaryResult, setSummaryResult] = useState<SummarizeCallOutput | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  const { toast } = useToast();

  const clearCallData = () => {
    setTranscript("");
    setClassificationResult(null);
    setSummaryResult(null);
    setCurrentError(null);
    setIsTranscriptEditable(false);
  };
  
  const handleStartCall = useCallback(() => {
    clearCallData();
    setIsCallActive(true);
    setIsProcessing(false);
    setIsTranscriptEditable(true); // Make textarea editable
    setTranscript(""); // Clear previous transcript for new input
  }, []);

  const handleStopCall = useCallback(async () => {
    setIsCallActive(false);
    setIsTranscriptEditable(false); // Make textarea read-only

    if (!transcript.trim()) {
      toast({ title: "Nenhuma transcrição", description: "A chamada foi encerrada sem transcrição.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    setCurrentError(null);

    try {
      toast({ title: "Processando chamada...", description: "Analisando transcrição com IA." });
      
      // Ensure transcript state is up-to-date before sending to AI
      const currentTranscript = transcript;

      const classification = await handleClassifyCallAction({ transcript: currentTranscript });
      setClassificationResult(classification);
      toast({ title: "Classificação Concluída", description: `Chamada classificada como: ${classification.classification}` });

      const summary = await handleSummarizeCallAction({ transcript: currentTranscript });
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
  }, [transcript, toast]);

  const handleSaveCall = async () => {
    if (!classificationResult || !transcript) {
      toast({ title: "Dados incompletos", description: "Não é possível salvar sem classificação ou transcrição.", variant: "destructive" });
      return;
    }
    setIsProcessing(true);
    setCurrentError(null);
    try {
      const callDataToSave: SaveCallPayload = {
        transcript: transcript,
        classification: classificationResult.classification,
        dispatchType: classificationResult.dispatchType,
        callerName: classificationResult.callerName,
        callerPhoneNumber: classificationResult.callerPhoneNumber,
        address: classificationResult.address,
        city: classificationResult.city,
        summary: summaryResult?.summary,
      };

      const result = await saveCallRecordToFirestore(callDataToSave);
      toast({ title: "Registro Salvo", description: `A chamada foi salva no histórico com ID: ${result.id}.` });
      clearCallData(); // Clear data after successful save
      // Reset UI elements that might depend on active call or results
      setClassificationResult(null);
      setSummaryResult(null);
    } catch (error) {
      console.error("Error saving call record:", error);
      const errorMessage = error instanceof Error ? error.message : "Falha ao salvar o registro.";
      setCurrentError(`Erro ao salvar: ${errorMessage}`);
      toast({ title: "Erro ao Salvar", description: errorMessage, variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

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
              <TranscriptView 
                transcript={transcript} 
                isEditable={isTranscriptEditable}
                onTranscriptChange={setTranscript}
              />
            </CardContent>
          </Card>
          {currentError && (
            <Card className="border-destructive bg-destructive/10">
              <CardHeader>
                <CardTitle className="text-destructive">Erro</CardTitle>
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
          {classificationResult && summaryResult && !isProcessing && (
            <Card>
              <CardHeader><CardTitle>Salvar Registro</CardTitle></CardHeader>
              <CardContent>
                <Button onClick={handleSaveCall} className="w-full bg-primary hover:bg-primary/90" disabled={isProcessing}>
                  {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar Chamada no Histórico
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

    