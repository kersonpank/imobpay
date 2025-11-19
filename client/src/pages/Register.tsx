import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const mutation = useMutation({
    mutationFn: async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
      const res = await apiRequest("POST", "/api/auth/register", data);
      return res.json();
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      setLocation("/onboarding");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar conta",
        description: error.message || "Não foi possível criar sua conta. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha email e senha.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter no mínimo 8 caracteres.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({ 
      email, 
      password,
      firstName: firstName || undefined,
      lastName: lastName || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus className="w-8 h-8 text-primary" />
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
          </div>
          <CardDescription>
            Crie sua conta para começar a gerenciar seus aluguéis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" data-testid="label-first-name">Nome</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="João"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  data-testid="input-first-name"
                  autoComplete="given-name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" data-testid="label-last-name">Sobrenome</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Silva"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  data-testid="input-last-name"
                  autoComplete="family-name"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" data-testid="label-email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
                autoComplete="email"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" data-testid="label-password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="input-password"
                autoComplete="new-password"
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 8 caracteres, com letra maiúscula, minúscula e número
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={mutation.isPending}
              data-testid="button-submit"
            >
              {mutation.isPending ? "Criando conta..." : "Criar conta"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login">
                <a className="text-primary hover:underline" data-testid="link-login">
                  Fazer login
                </a>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
