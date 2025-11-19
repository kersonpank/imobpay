import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function LandlordSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas credenciais e preferências
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Integração Mercado Pago</CardTitle>
          <CardDescription>
            Configure suas credenciais do Mercado Pago para receber pagamentos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mp-public-key">Public Key</Label>
            <Input
              id="mp-public-key"
              type="password"
              placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              data-testid="input-mp-public-key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mp-access-token">Access Token</Label>
            <Input
              id="mp-access-token"
              type="password"
              placeholder="APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              data-testid="input-mp-access-token"
            />
          </div>
          <Button data-testid="button-save-mp">
            Salvar Credenciais
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input id="nome" defaultValue="Carlos Silva" data-testid="input-nome" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" defaultValue="123.456.789-00" data-testid="input-cpf" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" type="email" defaultValue="carlos@email.com" data-testid="input-email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input id="telefone" defaultValue="(11) 99999-9999" data-testid="input-telefone" />
            </div>
          </div>
          <Button data-testid="button-save-profile">
            Atualizar Dados
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            Configure como deseja receber notificações
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-email">Notificações por E-mail</Label>
              <p className="text-sm text-muted-foreground">
                Receba atualizações sobre pagamentos e contratos
              </p>
            </div>
            <Switch id="notif-email" defaultChecked data-testid="switch-notif-email" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-vencimento">Lembrete de Vencimento</Label>
              <p className="text-sm text-muted-foreground">
                Avisos 3 dias antes do vencimento
              </p>
            </div>
            <Switch id="notif-vencimento" defaultChecked data-testid="switch-notif-vencimento" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notif-inadimplencia">Alerta de Inadimplência</Label>
              <p className="text-sm text-muted-foreground">
                Notificação imediata para pagamentos atrasados
              </p>
            </div>
            <Switch id="notif-inadimplencia" defaultChecked data-testid="switch-notif-inadimplencia" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
