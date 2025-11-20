import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

export default function OnboardingRole() {
  const [selectedRole, setSelectedRole] = useState<"landlord" | "tenant" | null>(null);
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const mutation = useMutation({
    mutationFn: async (data: { role: "landlord" | "tenant"; cpf: string; phone: string }) => {
      console.log('[OnboardingRole] Submitting data:', data);
      const response = await apiRequest("PATCH", "/api/user", data);
      return response.json();
    },
    onSuccess: (data) => {
      console.log('[OnboardingRole] Success! Updated user:', data);
      queryClient.setQueryData(["/api/auth/user"], data);
      toast({
        title: "Perfil atualizado!",
        description: "Seu perfil foi configurado com sucesso.",
      });
      setLocation(selectedRole === "landlord" ? "/landlord" : "/tenant");
    },
    onError: (error: any) => {
      console.error('[OnboardingRole] Error updating profile:', error);
      const errorMessage = error.message || "Não foi possível atualizar seu perfil. Tente novamente.";
      toast({
        title: "Erro ao atualizar perfil",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedRole || !cpf || !phone) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({ role: selectedRole, cpf, phone });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete seu Cadastro</CardTitle>
          <CardDescription>
            Para continuar, precisamos de algumas informações adicionais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Selecione seu perfil</Label>
            <div className="grid grid-cols-2 gap-4">
              <Card
                className={`cursor-pointer hover-elevate active-elevate-2 ${
                  selectedRole === "landlord" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRole("landlord")}
                data-testid="card-landlord"
              >
                <CardHeader className="text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">Locador</CardTitle>
                  <CardDescription>
                    Possuo imóveis para alugar
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card
                className={`cursor-pointer hover-elevate active-elevate-2 ${
                  selectedRole === "tenant" ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedRole("tenant")}
                data-testid="card-tenant"
              >
                <CardHeader className="text-center">
                  <Home className="h-12 w-12 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">Locatário</CardTitle>
                  <CardDescription>
                    Busco um imóvel para alugar
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                data-testid="input-cpf"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                placeholder="(11) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                data-testid="input-phone"
              />
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={mutation.isPending}
            data-testid="button-submit"
          >
            {mutation.isPending ? "Salvando..." : "Continuar"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
