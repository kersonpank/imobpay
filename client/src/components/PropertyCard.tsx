import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, DollarSign } from "lucide-react";

interface PropertyCardProps {
  id: string;
  title: string;
  address: string;
  rentValue: number;
  status: "available" | "rented" | "maintenance";
  imageUrl?: string;
  onViewDetails?: () => void;
}

export function PropertyCard({
  title,
  address,
  rentValue,
  status,
  imageUrl,
  onViewDetails,
}: PropertyCardProps) {
  const statusMap = {
    available: { label: "Disponível", variant: "default" as const },
    rented: { label: "Alugado", variant: "secondary" as const },
    maintenance: { label: "Manutenção", variant: "destructive" as const },
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid="card-property">
      <div className="aspect-video bg-muted relative overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Building2 className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <Badge
          variant={statusMap[status].variant}
          className="absolute top-3 right-3"
        >
          {statusMap[status].label}
        </Badge>
      </div>
      <CardHeader className="space-y-2 pb-3">
        <h3 className="font-semibold text-lg truncate" data-testid="text-property-title">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <span className="text-2xl font-semibold" data-testid="text-rent-value">
            R$ {rentValue.toLocaleString("pt-BR")}
          </span>
          <span className="text-sm text-muted-foreground">/mês</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant="outline"
          onClick={onViewDetails}
          data-testid="button-view-details"
        >
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
