interface SummaryViewProps {
  summary: string;
}

export function SummaryView({ summary }: SummaryViewProps) {
  return (
    <div className="text-sm space-y-2">
      <p className="text-muted-foreground whitespace-pre-wrap">{summary}</p>
    </div>
  );
}
