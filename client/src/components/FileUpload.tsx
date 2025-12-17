import { useState, useRef } from "react";
import { Upload, X, File, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface FileUploadProps {
  onUploadComplete?: (file: any) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // em MB
  multiple?: boolean;
  category?: "documents" | "properties" | "contracts" | "inspections";
  type?: string;
  contractId?: string;
  label?: string;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/*,.pdf,.doc,.docx",
  maxSize = 10,
  multiple = false,
  category = "documents",
  type = "document",
  contractId,
  label,
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    // Validar tamanho
    const validFiles = selectedFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione pelo menos um arquivo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach((file) => {
          if (category === "properties") {
            formData.append("photos", file);
          } else {
            formData.append("documents", file);
          }
        });
      } else {
        formData.append("file", files[0]);
      }

      formData.append("type", type);
      if (contractId) {
        formData.append("contractId", contractId);
      }

      const endpoint = multiple ? "/api/upload/multiple" : "/api/documents";
      const response = await apiRequest("POST", endpoint, formData);

      const result = await response.json();
      
      if (multiple && result.files) {
        setUploadedFiles((prev) => [...prev, ...result.files]);
        toast({
          title: "Upload concluído!",
          description: `${result.files.length} arquivo(s) enviado(s) com sucesso`,
        });
        if (onUploadComplete) {
          result.files.forEach((file: any) => onUploadComplete(file));
        }
      } else {
        setUploadedFiles((prev) => [...prev, result]);
        toast({
          title: "Upload concluído!",
          description: "Arquivo enviado com sucesso",
        });
        if (onUploadComplete) {
          onUploadComplete(result);
        }
      }

      // Limpar arquivos após upload bem-sucedido
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errorMessage = error.message || "Erro ao fazer upload do arquivo";
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o tamanho máximo de ${maxSize}MB`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    if (multiple) {
      setFiles((prev) => [...prev, ...validFiles]);
    } else {
      setFiles(validFiles);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}

      <Card
        className="border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <CardContent className="p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Clique ou arraste arquivos aqui
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Máximo {maxSize}MB por arquivo
          </p>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium">Arquivos selecionados:</div>
          {files.map((file, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <File className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(index)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}

          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              `Enviar ${files.length} arquivo(s)`
            )}
          </Button>
        </div>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-green-600">Arquivos enviados:</div>
          {uploadedFiles.map((file, index) => (
            <Card key={index} className="p-3 bg-green-50">
              <div className="flex items-center gap-2">
                <File className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium">{file.name}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

