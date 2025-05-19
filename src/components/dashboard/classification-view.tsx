import type { ClassifyCallOutput } from '@/ai/flows/classify-call';
import { Badge } from '@/components/ui/badge';

interface ClassificationViewProps {
  data: ClassifyCallOutput;
}

export function ClassificationView({ data }: ClassificationViewProps) {
  return (
    <div className="space-y-4 text-sm">
      <div>
        <h4 className="font-semibold mb-1">Classificação:</h4>
        <Badge variant={data.classification === 'Ocorrência' ? 'default' : 'secondary'} className={data.classification === 'Ocorrência' ? 'bg-primary' : ''}>
          {data.classification}
        </Badge>
      </div>
      {data.dispatchType && (
        <div>
          <h4 className="font-semibold mb-1">Tipo de Despacho:</h4>
          <p className="text-muted-foreground">{data.dispatchType}</p>
        </div>
      )}
      {data.callerName && (
         <div>
          <h4 className="font-semibold mb-1">Nome do Solicitante:</h4>
          <p className="text-muted-foreground">{data.callerName}</p>
        </div>
      )}
      {data.callerPhoneNumber && (
        <div>
          <h4 className="font-semibold mb-1">Telefone:</h4>
          <p className="text-muted-foreground">{data.callerPhoneNumber}</p>
        </div>
      )}
      {data.address && (
        <div>
          <h4 className="font-semibold mb-1">Endereço:</h4>
          <p className="text-muted-foreground">{data.address}</p>
        </div>
      )}
      {data.city && (
        <div>
          <h4 className="font-semibold mb-1">Cidade:</h4>
          <p className="text-muted-foreground">{data.city}</p>
        </div>
      )}
      <div className="mt-4">
        <h4 className="font-semibold mb-1">Dados Completos (JSON):</h4>
        <pre className="bg-muted/30 p-3 rounded-md overflow-x-auto text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
