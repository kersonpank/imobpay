import { PaymentSchedule } from '../PaymentSchedule';

export default function PaymentScheduleExample() {
  const mockPayments = [
    { id: '1', dueDate: '05/12/2025', amount: 2500, status: 'paid' as const },
    { id: '2', dueDate: '05/01/2026', amount: 2500, status: 'pending' as const },
    { id: '3', dueDate: '05/02/2026', amount: 2500, status: 'pending' as const },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <PaymentSchedule
        payments={mockPayments}
        onGeneratePaymentLink={(id) => console.log('Generate payment link for', id)}
      />
    </div>
  );
}
