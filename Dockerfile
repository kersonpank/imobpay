# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar ferramentas de build necessárias para bcrypt e outras dependências nativas
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Instalar ferramentas de build necessárias para bcrypt e outras dependências nativas
RUN apk add --no-cache python3 make g++

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Copiar build do stage anterior
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/package.json ./

# Criar diretório para uploads
RUN mkdir -p uploads/documents uploads/properties uploads/contracts uploads/inspections

# Expor porta
EXPOSE 5000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=5000

# Comando para iniciar
CMD ["node", "dist/index.js"]

