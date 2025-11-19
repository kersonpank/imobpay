import { StatCard } from '../StatCard';
import { Building2 } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 max-w-xs">
      <StatCard
        title="Total de Imóveis"
        value={8}
        icon={Building2}
        description="+2 este mês"
      />
    </div>
  );
}
