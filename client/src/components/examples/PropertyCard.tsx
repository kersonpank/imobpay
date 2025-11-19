import { PropertyCard } from '../PropertyCard';

export default function PropertyCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <PropertyCard
        id="1"
        title="Casa 3 Quartos com Quintal"
        address="Rua das Flores, 123 - Jardim Botânico"
        rentValue={2500}
        status="available"
        onViewDetails={() => console.log('View details clicked')}
      />
    </div>
  );
}
