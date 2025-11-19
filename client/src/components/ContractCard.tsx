import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download } from "lucide-react";

interface ContractCardProps {
  propertyTitle: string;
  tenant?: string;
  landlord?: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: "draft" | "generated" | "signed" | "active" | "terminated";
  onViewContract?: () => void;
  onDownload?: () => void;
}

export function ContractCard({
  propertyTitle,
  tenant,
  landlord,
  startDate,
  endDate,
  monthlyRent,
  status,
  onViewContract,
  onDownload,
}: ContractCardProps) {
  const statusMap = {
    draft: { label: "Rascunho", variant: "secondary" as const },
    generated: { label: "Gerado", variant: "default" as const },
    signed: { label: "Assinado", variant: "default" as const },
    active: { label: "Ativo", variant: "default" as const },
    terminated: { label: "Encerrado", variant: "destructive" as const },
  };

  return (
    <Card className="hover-elevate" data-testid="card-contract">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="rounded-md bg-primary/10 p-2 flex-shrink-0">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold truncate" data-testid="text-contract-property">
              {propertyTitle}
            </h3>
            {tenant && (
              <p className="text-sm text-muted-foreground truncate">
                Locatário: {tenant}
              </p>
            )}
            {landlord && (
              <p className="text-sm text-muted-foreground truncate">
                Locador: {landlord}
              </p>
            )}
          </div>
        </div>
        <Badge variant={statusMap[status].variant}>
          {statusMap[status].label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Início</p>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{startDate}</span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">Término</p>
            <div className="flex items-center gap-1 mt-1">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{endDate}</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Valor Mensal</p>
          <p className="text-2xl font-semibold mt-1" data-testid="text-monthly-rent">
            R$ {monthlyRent.toLocaleString("pt-BR")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onViewContract}
            data-testid="button-view-contract"
          >
            Ver Contrato
          </Button>
          {status !== "draft" && (
            <Button
              variant="outline"
              size="icon"
              onClick={onDownload}
              data-testid="button-download"
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
