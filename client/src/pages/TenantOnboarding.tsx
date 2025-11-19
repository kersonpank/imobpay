import { OnboardingForm } from "@/components/OnboardingForm";

export default function TenantOnboarding() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Cadastro de Locatário</h1>
        <p className="text-muted-foreground mt-1">
          Complete seu cadastro para iniciar o processo de locação
        </p>
      </div>

      <OnboardingForm />
    </div>
  );
}
