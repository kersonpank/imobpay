import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Upload } from "lucide-react";

type GuaranteeType = "fiador" | "caucao" | "seguro" | "nenhuma";

export function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [guaranteeType, setGuaranteeType] = useState<GuaranteeType>("caucao");
  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    console.log(`Advancing to step ${step + 1}`);
    if (step < totalSteps) setStep(step + 1);
  };

  const handleBack = () => {
    console.log(`Going back to step ${step - 1}`);
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    console.log("Form submitted", { guaranteeType });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Passo {step} de {totalSteps}</span>
          <span className="text-muted-foreground">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} />
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>
              Preencha seus dados básicos para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo</Label>
                <Input id="nome" placeholder="João Silva" data-testid="input-nome" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" data-testid="input-cpf" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rg">RG/CNH</Label>
                <Input id="rg" placeholder="00.000.000-0" data-testid="input-rg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nascimento">Data de Nascimento</Label>
                <Input id="nascimento" type="date" data-testid="input-nascimento" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="joao@email.com" data-testid="input-email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(11) 99999-9999" data-testid="input-telefone" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="profissao">Profissão</Label>
              <Input id="profissao" placeholder="Desenvolvedor" data-testid="input-profissao" />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>
              Faça upload dos documentos necessários
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>RG ou CNH</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique ou arraste o arquivo aqui
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comprovante de Residência</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique ou arraste o arquivo aqui
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Comprovante de Renda</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center hover-elevate cursor-pointer">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique ou arraste o arquivo aqui
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Tipo de Garantia</CardTitle>
            <CardDescription>
              Escolha o tipo de garantia para o contrato
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={guaranteeType} onValueChange={(v) => setGuaranteeType(v as GuaranteeType)}>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 rounded-md border p-4 hover-elevate">
                  <RadioGroupItem value="caucao" id="caucao" data-testid="radio-caucao" />
                  <div className="flex-1">
                    <Label htmlFor="caucao" className="font-medium cursor-pointer">
                      Caução
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Depósito de valor equivalente a 2-3 meses de aluguel
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-md border p-4 hover-elevate">
                  <RadioGroupItem value="fiador" id="fiador" data-testid="radio-fiador" />
                  <div className="flex-1">
                    <Label htmlFor="fiador" className="font-medium cursor-pointer">
                      Fiador
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pessoa física que se responsabiliza pelo pagamento
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-md border p-4 hover-elevate">
                  <RadioGroupItem value="seguro" id="seguro" data-testid="radio-seguro" />
                  <div className="flex-1">
                    <Label htmlFor="seguro" className="font-medium cursor-pointer">
                      Seguro-Fiança
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contratação de seguro com seguradora
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 rounded-md border p-4 hover-elevate">
                  <RadioGroupItem value="nenhuma" id="nenhuma" data-testid="radio-nenhuma" />
                  <div className="flex-1">
                    <Label htmlFor="nenhuma" className="font-medium cursor-pointer">
                      Sem Garantia
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Prosseguir sem garantia adicional
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={step === 1}
          data-testid="button-back"
        >
          Voltar
        </Button>
        {step < totalSteps ? (
          <Button onClick={handleNext} data-testid="button-next">
            Continuar
          </Button>
        ) : (
          <Button onClick={handleSubmit} data-testid="button-submit">
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
}
