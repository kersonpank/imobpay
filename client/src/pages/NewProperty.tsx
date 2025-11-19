import { PropertyForm } from "@/components/PropertyForm";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function NewProperty() {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/landlord/properties")}
          data-testid="button-back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-semibold">Novo Imóvel</h1>
          <p className="text-muted-foreground mt-1">
            Cadastre um novo imóvel para locação
          </p>
        </div>
      </div>

      <PropertyForm />
    </div>
  );
}
