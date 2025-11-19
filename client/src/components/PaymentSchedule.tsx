import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface Payment {
  id: string;
  dueDate: string;
  amount: number;
  status: "pending" | "paid" | "overdue";
}

interface PaymentScheduleProps {
  payments: Payment[];
  onGeneratePaymentLink?: (paymentId: string) => void;
}

export function PaymentSchedule({
  payments,
  onGeneratePaymentLink,
}: PaymentScheduleProps) {
  const statusMap = {
    pending: { label: "Pendente", variant: "secondary" as const },
    paid: { label: "Pago", variant: "default" as const },
    overdue: { label: "Vencido", variant: "destructive" as const },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Cronograma de Pagamentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vencimento</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhum pagamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment) => (
                  <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                    <TableCell className="font-medium">
                      {payment.dueDate}
                    </TableCell>
                    <TableCell data-testid={`text-amount-${payment.id}`}>
                      R$ {payment.amount.toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[payment.status].variant}>
                        {statusMap[payment.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {payment.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => onGeneratePaymentLink?.(payment.id)}
                          data-testid={`button-pay-${payment.id}`}
                        >
                          Pagar Agora
                        </Button>
                      )}
                      {payment.status === "overdue" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onGeneratePaymentLink?.(payment.id)}
                          data-testid={`button-pay-${payment.id}`}
                        >
                          Pagar Atrasado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
