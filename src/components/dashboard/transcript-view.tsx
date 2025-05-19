
import { Textarea } from '@/components/ui/textarea';

interface TranscriptViewProps {
  transcript: string;
  isEditable: boolean;
  onTranscriptChange: (newTranscript: string) => void;
}

export function TranscriptView({ transcript, isEditable, onTranscriptChange }: TranscriptViewProps) {
  return (
    <Textarea
      value={transcript}
      readOnly={!isEditable}
      onChange={(e) => onTranscriptChange(e.target.value)}
      placeholder={isEditable ? "Digite a transcrição da chamada aqui..." : "A transcrição da chamada aparecerá aqui..."}
      className={`h-64 text-sm ${isEditable ? 'bg-background' : 'bg-muted/30'}`}
      aria-label="Transcrição da chamada"
    />
  );
}

    