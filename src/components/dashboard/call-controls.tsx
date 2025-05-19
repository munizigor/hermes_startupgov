
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, PhoneOff, Loader2, Edit3 } from 'lucide-react';

interface CallControlsProps {
  isCallActive: boolean;
  isProcessing: boolean;
  onStartCall: () => void;
  onStopCall: () => void;
}

export function CallControls({ isCallActive, isProcessing, onStartCall, onStopCall }: CallControlsProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${isCallActive ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
          <span className="text-sm font-medium">
            {isCallActive ? 'Chamada Ativa (Editando Transcrição)' : 'Chamada Inativa'}
            {isProcessing && ' (Processando...)'}
          </span>
        </div>
        {!isCallActive ? (
          <Button 
            onClick={onStartCall} 
            disabled={isProcessing} 
            className="bg-primary hover:bg-primary/90"
          >
            <Edit3 className="mr-2 h-4 w-4" /> {/* Changed icon to reflect manual editing */}
            Iniciar Chamada (Manual)
          </Button>
        ) : (
          <Button onClick={onStopCall} variant="destructive" disabled={isProcessing}>
            {isProcessing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PhoneOff className="mr-2 h-4 w-4" />
            )}
            Encerrar e Processar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

    