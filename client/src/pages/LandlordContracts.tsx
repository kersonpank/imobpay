import { ContractCard } from "@/components/ContractCard";

export default function LandlordContracts() {
  //todo: remove mock functionality
  const mockContracts = [
    {
      propertyTitle: "Casa 3 Quartos com Quintal",
      tenant: "Maria Santos",
      startDate: "01/12/2025",
      endDate: "30/11/2027",
      monthlyRent: 2500,
      status: "active" as const,
    },
    {
      propertyTitle: "Kitnet Próximo ao Metrô",
      tenant: "João Silva",
      startDate: "15/10/2025",
      endDate: "14/10/2026",
      monthlyRent: 950,
      status: "active" as const,
    },
    {
      propertyTitle: "Apartamento 2 Quartos Centro",
      tenant: "Pedro Oliveira",
      startDate: "01/01/2026",
      endDate: "31/12/2027",
      monthlyRent: 1800,
      status: "signed" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Contratos</h1>
        <p className="text-muted-foreground mt-1">
          Visualize e gerencie todos os contratos de locação
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockContracts.map((contract, index) => (
          <ContractCard
            key={index}
            {...contract}
            onViewContract={() => console.log(`View contract ${index}`)}
            onDownload={() => console.log(`Download contract ${index}`)}
          />
        ))}
      </div>
    </div>
  );
}
