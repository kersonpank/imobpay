import { ContractCard } from "@/components/ContractCard";
import { PaymentSchedule } from "@/components/PaymentSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

export default function TenantDashboard() {
  //todo: remove mock functionality
  const mockPayments = [
    { id: "1", dueDate: "05/12/2025", amount: 2500, status: "paid" as const },
    { id: "2", dueDate: "05/01/2026", amount: 2500, status: "pending" as const },
    { id: "3", dueDate: "05/02/2026", amount: 2500, status: "pending" as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">Meu Painel</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe seu contrato e pagamentos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Último Pagamento</CardTitle>
            <CheckCircle className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">05/12/2025</div>
            <p className="text-xs text-muted-foreground mt-1">
              R$ 2.500 - Confirmado
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Próximo Pagamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">05/01/2026</div>
            <p className="text-xs text-muted-foreground mt-1">
              R$ 2.500 - Em 12 dias
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Status do Contrato</CardTitle>
            <AlertCircle className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ativo</div>
            <p className="text-xs text-muted-foreground mt-1">
              Válido até 30/11/2027
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Meu Contrato</h2>
        <ContractCard
          propertyTitle="Casa 3 Quartos com Quintal"
          landlord="Carlos Silva"
          startDate="01/12/2025"
          endDate="30/11/2027"
          monthlyRent={2500}
          status="active"
          onViewContract={() => console.log("View contract")}
          onDownload={() => console.log("Download contract")}
        />
      </div>

      <PaymentSchedule
        payments={mockPayments}
        onGeneratePaymentLink={(id) => console.log(`Generate payment link for ${id}`)}
      />
    </div>
  );
}
