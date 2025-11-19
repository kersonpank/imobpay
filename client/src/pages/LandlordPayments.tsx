import { PaymentSchedule } from "@/components/PaymentSchedule";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertCircle } from "lucide-react";

export default function LandlordPayments() {
  //todo: remove mock functionality
  const mockPayments = [
    { id: "1", dueDate: "05/12/2025", amount: 2500, status: "paid" as const },
    { id: "2", dueDate: "05/12/2025", amount: 950, status: "paid" as const },
    { id: "3", dueDate: "05/01/2026", amount: 2500, status: "pending" as const },
    { id: "4", dueDate: "05/01/2026", amount: 950, status: "pending" as const },
    { id: "5", dueDate: "05/02/2026", amount: 2500, status: "pending" as const },
    { id: "6", dueDate: "15/11/2025", amount: 1800, status: "overdue" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Pagamentos</h1>
        <p className="text-muted-foreground mt-1">
          Acompanhe os pagamentos de todos os seus imóveis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Total Recebido</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">R$ 3.450</div>
            <p className="text-xs text-muted-foreground mt-1">
              Dezembro 2025
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.950</div>
            <p className="text-xs text-muted-foreground mt-1">
              3 pagamentos aguardando
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">R$ 1.800</div>
            <p className="text-xs text-muted-foreground mt-1">
              1 pagamento atrasado
            </p>
          </CardContent>
        </Card>
      </div>

      <PaymentSchedule
        payments={mockPayments}
        onGeneratePaymentLink={(id) => console.log(`Generate payment link for ${id}`)}
      />
    </div>
  );
}
