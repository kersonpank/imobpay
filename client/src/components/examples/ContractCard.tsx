import { ContractCard } from '../ContractCard';

export default function ContractCardExample() {
  return (
    <div className="p-6 max-w-2xl">
      <ContractCard
        propertyTitle="Casa 3 Quartos com Quintal"
        tenant="Maria Santos"
        startDate="01/12/2025"
        endDate="30/11/2027"
        monthlyRent={2500}
        status="active"
        onViewContract={() => console.log('View contract clicked')}
        onDownload={() => console.log('Download clicked')}
      />
    </div>
  );
}
