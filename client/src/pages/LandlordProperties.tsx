import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function LandlordProperties() {
  //todo: remove mock functionality
  const mockProperties = [
    {
      id: "1",
      title: "Casa 3 Quartos com Quintal",
      address: "Rua das Flores, 123 - Jardim Botânico",
      rentValue: 2500,
      status: "rented" as const,
    },
    {
      id: "2",
      title: "Apartamento 2 Quartos Centro",
      address: "Av. Principal, 456 - Centro",
      rentValue: 1800,
      status: "available" as const,
    },
    {
      id: "3",
      title: "Kitnet Próximo ao Metrô",
      address: "Rua do Comércio, 789 - Vila Nova",
      rentValue: 950,
      status: "rented" as const,
    },
    {
      id: "4",
      title: "Sobrado 4 Quartos",
      address: "Rua das Palmeiras, 321 - Jardim Europa",
      rentValue: 4200,
      status: "maintenance" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Meus Imóveis</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus imóveis
          </p>
        </div>
        <Button data-testid="button-add-property">
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProperties.map((property) => (
          <PropertyCard
            key={property.id}
            {...property}
            onViewDetails={() => console.log(`View details for ${property.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
