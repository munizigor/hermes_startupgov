import { Textarea } from '@/components/ui/textarea';

interface TranscriptViewProps {
  transcript: string;
}

export function TranscriptView({ transcript }: TranscriptViewProps) {
  return (
    <Textarea
      value={transcript}
      readOnly
      placeholder="A transcrição da chamada aparecerá aqui..."
      className="h-64 text-sm bg-muted/30"
      aria-label="Transcrição da chamada"
    />
  );
}
