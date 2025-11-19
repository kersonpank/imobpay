import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

export function PropertyForm() {
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = () => {
    console.log("Image upload triggered");
    setImages([...images, `https://via.placeholder.com/400x300?text=Imóvel+${images.length + 1}`]);
  };

  const handleRemoveImage = (index: number) => {
    console.log(`Removing image at index ${index}`);
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    console.log("Property form submitted");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título do Imóvel</Label>
            <Input
              id="titulo"
              placeholder="Ex: Casa 3 quartos com quintal"
              data-testid="input-titulo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva as características do imóvel..."
              rows={4}
              data-testid="input-descricao"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input
                id="endereco"
                placeholder="Rua, Número, Bairro"
                data-testid="input-endereco"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                data-testid="input-cep"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="São Paulo"
                data-testid="input-cidade"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="SP"
                data-testid="input-estado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor">Valor do Aluguel (R$)</Label>
              <Input
                id="valor"
                type="number"
                placeholder="1500"
                data-testid="input-valor"
              />
            </div>
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
        <Button variant="outline" data-testid="button-cancel">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} data-testid="button-save">
          Salvar Imóvel
        </Button>
      </div>
    </div>
  );
}
