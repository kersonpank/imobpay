import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export function PropertyForm() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [rentValue, setRentValue] = useState("");
  const [status, setStatus] = useState<"available" | "rented" | "maintenance">("available");
  
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/properties", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso!",
        description: "Imóvel criado com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setLocation("/landlord/properties");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar imóvel",
        description: error.message || "Não foi possível criar o imóvel. Tente novamente.",
        variant: "destructive",
      });
    },
  });

  const handleAddImage = () => {
    console.log("Image upload triggered");
    setImages([...images, `https://via.placeholder.com/400x300?text=Imóvel+${images.length + 1}`]);
  };

  const handleRemoveImage = (index: number) => {
    console.log(`Removing image at index ${index}`);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !address || !city || !state || !zipcode || !rentValue) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    mutation.mutate({
      title,
      description,
      address,
      city,
      state,
      zipcode,
      rentValue: parseFloat(rentValue),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Imóvel *</Label>
            <Input
              id="titulo"
              placeholder="Ex: Casa 3 quartos com quintal"
              data-testid="input-titulo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva as características do imóvel..."
              rows={4}
              data-testid="input-descricao"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo *</Label>
              <Input
                id="endereco"
                placeholder="Rua, Número, Bairro"
                data-testid="input-endereco"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                data-testid="input-cep"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                placeholder="São Paulo"
                data-testid="input-cidade"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                placeholder="SP"
                data-testid="input-estado"
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                maxLength={2}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Aluguel (R$) *</Label>
              <Input
                id="valor"
                type="number"
                placeholder="1500"
                data-testid="input-valor"
                value={rentValue}
                onChange={(e) => setRentValue(e.target.value)}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="available">Disponível</option>
              <option value="rented">Alugado</option>
              <option value="maintenance">Em Manutenção</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fotos do Imóvel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative aspect-video rounded-md overflow-hidden group">
                <img src={img} alt={`Imóvel ${index + 1}`} className="object-cover w-full h-full" />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveImage(index)}
                  data-testid={`button-remove-image-${index}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <button
              onClick={handleAddImage}
              className="aspect-video border-2 border-dashed rounded-md flex flex-col items-center justify-center gap-2 hover-elevate active-elevate-2 cursor-pointer"
              data-testid="button-add-image"
            >
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Adicionar Foto</span>
            </button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button 
          type="button"
          variant="outline" 
          data-testid="button-cancel"
          onClick={() => setLocation("/landlord/properties")}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          data-testid="button-save"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Salvando..." : "Salvar Imóvel"}
        </Button>
      </div>
    </form>
  );
}
