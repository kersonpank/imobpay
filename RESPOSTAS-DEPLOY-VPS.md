# 📋 Respostas para Deploy na VPS - ImobPaga

## 1. A Aplicação (O que vamos rodar?)

### Tecnologia
**Stack:** Node.js + Express + TypeScript (Backend) + React + Vite + TypeScript (Frontend)

- **Backend:** Node.js 20, Express, TypeScript
- **Frontend:** React 18, Vite, TypeScript, TailwindCSS
- **ORM:** Drizzle ORM
- **Autenticação:** Express Session com PostgreSQL
- **Build:** Vite (frontend) + esbuild (backend)

### Containerização
✅ **SIM, já tem Dockerfile pronto!**

- **Dockerfile:** Multi-stage build otimizado (já criado)
- **Docker Compose:** 3 arquivos prontos:
  - `docker-compose.yml` - Produção padrão
  - `docker-compose.dev.yml` - Desenvolvimento
  - `docker-compose.prod.yml` - Produção avançada (com Nginx opcional)

**Status:** Pronto para produção, apenas precisa ajustar variáveis de ambiente.

### Estrutura
**Monorepo (Frontend + Backend juntos)**

- **Frontend:** `client/` - React SPA
- **Backend:** `server/` - Express API
- **Compartilhado:** `shared/` - Schemas e tipos
- **Build:** Frontend compila para `dist/public/`, Backend para `dist/index.js`
- **Servidor:** Express serve tanto a API (`/api/*`) quanto o frontend estático

**Arquitetura:** Single server (Express serve tudo)

---

## 2. Banco de Dados e Armazenamento

### Banco
**PostgreSQL 16** (via Drizzle ORM)

- **Versão:** PostgreSQL 16 (Alpine)
- **ORM:** Drizzle ORM (TypeScript)
- **Migrations:** Drizzle Kit (`npm run db:push`)

### Localização do Banco
**Recomendação: Container na mesma VPS** (mais barato e simples)

**Configuração atual:**
- Container PostgreSQL no `docker-compose.prod.yml`
- Volume persistente: `postgres_prod_data`
- Porta: 5432 (pode ser exposta ou não, dependendo da segurança)

**Alternativa:** Pode usar banco externo (Neon, Supabase, RDS) apenas mudando a `DATABASE_URL` no `.env`

### Arquivos
**✅ SIM, a aplicação faz upload de arquivos**

**Onde salva hoje:**
- **Local:** Pasta `uploads/` na raiz do projeto
- **Estrutura:**
  - `uploads/documents/` - Documentos gerais
  - `uploads/properties/` - Fotos de imóveis
  - `uploads/contracts/` - Contratos assinados
  - `uploads/inspections/` - Fotos de vistoria

**Sistema atual:** Multer salvando em disco local

**Recomendação para produção:**
- **Curto prazo:** Continuar local (volume Docker persistente)
- **Médio/Longo prazo:** Migrar para S3/MinIO/Cloudflare R2 (já está preparado para isso, só mudar o `server/upload.ts`)

**Tamanho máximo:** 10MB por arquivo

---

## 3. O Estado da VPS

### Limpeza
**❓ Precisa confirmar com você**

**Se for VPS nova (recomendado):**
- Instalar Docker e Docker Compose
- Configurar firewall (UFW)
- Instalar Nginx (se não usar o do docker-compose)

**Se já tiver coisas rodando:**
- Verificar portas em uso (5000, 5432, 80, 443)
- Decidir se vai usar Nginx do host ou do container
- Verificar se há conflitos

### Recursos
**❓ Precisa confirmar com você**

**Recomendações mínimas:**
- **RAM:** 2GB (mínimo) / 4GB (recomendado)
- **CPU:** 2 cores (mínimo) / 4 cores (recomendado)
- **Disco:** 20GB mínimo (para banco + uploads)

**Limites sugeridos no docker-compose (se necessário):**
```yaml
deploy:
  resources:
    limits:
      cpus: '2'
      memory: 2G
```

### Docker
**❓ Precisa confirmar com você**

**Se não tiver instalado:**
- Docker Engine 24+
- Docker Compose V2 (já vem com Docker)

**Comando para verificar:**
```bash
docker --version
docker compose version
```

---

## 4. Acesso e Domínio

### Domínio
**❓ Precisa confirmar com você**

**Se tiver domínio:**
- Apontar DNS para IP da VPS
- Configurar A record: `@` → IP da VPS
- Configurar CNAME (opcional): `www` → domínio principal

**Se não tiver:**
- Pode acessar pelo IP diretamente (não recomendado para produção)
- Ou usar serviço como DuckDNS (gratuito)

### HTTPS/SSL
**Recomendação: Let's Encrypt (Certbot) + Nginx**

**Opções:**
1. **Nginx no host** + Certbot (mais comum)
2. **Nginx no container** (já tem config no docker-compose.prod.yml)
3. **Cloudflare** na frente (mais fácil, SSL automático)

**Preferência:** Sugiro Nginx no host + Certbot (mais simples e confiável)

### Proxy
**Recomendação: Nginx no host (não no container)**

**Por quê:**
- Mais fácil de gerenciar SSL
- Melhor performance
- Padrão da indústria
- Fácil de configurar múltiplos sites depois

**Configuração sugerida:**
- Nginx no host Ubuntu
- Proxy reverso para `localhost:5000` (container da app)
- SSL via Certbot

**Alternativa:** Traefik (se quiser algo mais moderno, mas Nginx é mais simples)

---

## 5. O Código

### Repositório
**❓ Precisa confirmar com você**

**Opções:**
1. **GitHub/GitLab/Bitbucket** (recomendado)
2. **Pasta local** (copiar via SCP/SFTP)

**Recomendação:** Usar Git (GitHub privado ou GitLab)

**Estrutura do repositório:**
```
ImobPaga/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Código compartilhado
├── Dockerfile       # Build da aplicação
├── docker-compose.prod.yml  # Produção
├── package.json
└── .env            # Variáveis (NÃO versionado)
```

### CI/CD
**Recomendação: Deploy manual inicialmente, depois automatizar**

**Opção 1: Manual (mais simples para começar)**
```bash
# Na VPS
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app npm run db:push
```

**Opção 2: Automatizado (GitHub Actions / GitLab CI)**
- Push no `main` → Deploy automático
- Requer configurar secrets na VPS (SSH key, etc.)

**Recomendação:** Começar manual, depois automatizar quando estiver estável.

---

## 📝 Resumo Executivo

### ✅ O que já está pronto:
- ✅ Dockerfile otimizado (multi-stage)
- ✅ Docker Compose para produção
- ✅ Build configurado (frontend + backend)
- ✅ Banco PostgreSQL configurado
- ✅ Sistema de upload funcionando
- ✅ Variáveis de ambiente documentadas

### ❓ O que precisa confirmar:
1. **VPS:** Nova ou já tem coisas rodando?
2. **Recursos:** RAM e CPU disponíveis?
3. **Docker:** Já instalado?
4. **Domínio:** Tem domínio ou vai usar IP?
5. **Repositório:** Onde está o código? (Git ou local?)

### 🎯 Próximos Passos (após confirmar):
1. Criar script de deploy automatizado
2. Configurar Nginx + SSL
3. Configurar backups automáticos
4. Configurar monitoramento (opcional)
5. Documentar processo completo

---

## 📄 Arquivos de Referência

- **Dockerfile:** `./Dockerfile`
- **Docker Compose Produção:** `./docker-compose.prod.yml`
- **Variáveis de Ambiente:** `./env.example.txt`
- **Documentação Docker:** `./DOCKER.md`
- **README:** `./README.md`

---

**Aguardando suas respostas para criar o "mapa do tesouro" completo! 🗺️**





