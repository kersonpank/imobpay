import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function LandlordProperties() {
  const [, setLocation] = useLocation();
  
  const { data: properties = [], isLoading, error } = useQuery({
    queryKey: ["/api/properties"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando imóveis...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive">Erro ao carregar imóveis</p>
          <p className="text-muted-foreground text-sm mt-2">
            {(error as Error).message || "Tente recarregar a página"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Meus Imóveis</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os seus imóveis
          </p>
        </div>
        <Button 
          data-testid="button-add-property"
          onClick={() => setLocation("/landlord/properties/new")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Você ainda não tem imóveis cadastrados.</p>
          <Button onClick={() => setLocation("/landlord/properties/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Imóvel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property: any) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              address={`${property.address}, ${property.city}/${property.state}`}
              rentValue={typeof property.rentValue === 'string' ? parseFloat(property.rentValue) : property.rentValue}
              status={property.status || 'available'}
              onViewDetails={() => console.log(`View details for ${property.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
