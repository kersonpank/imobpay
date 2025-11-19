import { StatCard } from "@/components/StatCard";
import { PropertyCard } from "@/components/PropertyCard";
import { Building2, FileText, DollarSign, Users } from "lucide-react";

export default function LandlordDashboard() {
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
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral dos seus imóveis e contratos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Imóveis"
          value={8}
          icon={Building2}
          description="+2 este mês"
        />
        <StatCard
          title="Contratos Ativos"
          value={6}
          icon={FileText}
          description="75% ocupação"
        />
        <StatCard
          title="Receita Mensal"
          value="R$ 12.500"
          icon={DollarSign}
          description="+15% vs mês anterior"
        />
        <StatCard
          title="Locatários"
          value={6}
          icon={Users}
          description="Todos em dia"
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Meus Imóveis</h2>
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
    </div>
  );
}
