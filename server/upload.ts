import multer from "multer";
import path from "path";
import fs from "fs";

// Criar diretório de uploads se não existir
const uploadsDir = path.resolve(import.meta.dirname, "..", "uploads");

// Criar subdiretórios
const createUploadDirs = () => {
  const dirs = [
    uploadsDir,
    path.join(uploadsDir, "documents"),
    path.join(uploadsDir, "properties"),
    path.join(uploadsDir, "contracts"),
    path.join(uploadsDir, "inspections"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configuração de storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = uploadsDir;

    // Determinar diretório baseado no tipo de arquivo ou campo
    if (file.fieldname.includes("document")) {
      uploadPath = path.join(uploadsDir, "documents");
    } else if (file.fieldname.includes("property") || file.fieldname.includes("photo")) {
      uploadPath = path.join(uploadsDir, "properties");
    } else if (file.fieldname.includes("contract")) {
      uploadPath = path.join(uploadsDir, "contracts");
    } else if (file.fieldname.includes("inspection")) {
      uploadPath = path.join(uploadsDir, "inspections");
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Gerar nome único: timestamp-random-originalname
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const sanitizedName = name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
    cb(null, `${sanitizedName}-${uniqueSuffix}${ext}`);
  },
});

// Filtros de arquivo
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Permitir imagens, PDFs e documentos comuns
  const allowedMimes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de arquivo não permitido: ${file.mimetype}`));
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo
  },
});

// Middleware para múltiplos arquivos (ex: fotos de propriedade)
export const uploadMultiple = upload.fields([
  { name: "photos", maxCount: 10 },
  { name: "documents", maxCount: 10 },
]);

// Middleware para arquivo único
export const uploadSingle = upload.single("file");

// Helper para obter URL do arquivo
export function getFileUrl(filename: string, category: "documents" | "properties" | "contracts" | "inspections"): string {
  return `/uploads/${category}/${filename}`;
}

// Helper para obter caminho absoluto do arquivo
export function getFilePath(filename: string, category: "documents" | "properties" | "contracts" | "inspections"): string {
  return path.join(uploadsDir, category, filename);
}

// Helper para deletar arquivo
export async function deleteFile(filename: string, category: "documents" | "properties" | "contracts" | "inspections"): Promise<void> {
  const filePath = getFilePath(filename, category);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
}

