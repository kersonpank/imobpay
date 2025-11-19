import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, DollarSign, Shield } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Building2 className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold">AlugaFácil</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Plataforma completa para gerenciamento de aluguéis com geração automática de contratos,
            integração com Mercado Pago e muito mais.
          </p>
          <div className="mt-8">
            <Button size="lg" onClick={handleLogin} data-testid="button-login">
              Entrar com Replit
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <Building2 className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Gestão de Imóveis</CardTitle>
              <CardDescription>
                Cadastre e gerencie todos os seus imóveis em um só lugar
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Contratos Automáticos</CardTitle>
              <CardDescription>
                Gere contratos personalizados com IA em segundos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Pagamentos Online</CardTitle>
              <CardDescription>
                Integração nativa com Mercado Pago para receber aluguéis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multi-tenant</CardTitle>
              <CardDescription>
                Cada locador usa suas próprias credenciais de pagamento
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Como Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Cadastre seus Imóveis</h3>
                  <p className="text-muted-foreground text-sm">
                    Adicione fotos, descrição e valor do aluguel
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Locatário faz Onboarding</h3>
                  <p className="text-muted-foreground text-sm">
                    Coleta de documentos e escolha de garantia de forma digital
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contrato Gerado Automaticamente</h3>
                  <p className="text-muted-foreground text-sm">
                    IA personaliza o contrato com todos os dados coletados
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Receba Pagamentos</h3>
                  <p className="text-muted-foreground text-sm">
                    Seus inquilinos pagam via Mercado Pago direto na sua conta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
