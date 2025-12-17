# 🐳 Guia Docker - ImobPaga

Este projeto pode ser executado completamente usando Docker e Docker Compose, facilitando o desenvolvimento e deploy.

## 📋 Pré-requisitos

- **Docker Desktop** instalado e rodando
- **Docker Compose** (vem com Docker Desktop)

## 🚀 Início Rápido

### Modo Desenvolvimento (Recomendado para começar)

```bash
# 1. Configure o arquivo .env (copie do env.example.txt)
cp env.example.txt .env

# 2. Edite o .env e configure pelo menos:
# - SESSION_SECRET (gere um novo)
# - OPENAI_API_KEY (opcional, para geração de contratos com IA)

# 3. Inicie os serviços (banco + app em modo dev)
docker-compose -f docker-compose.dev.yml up -d

# 4. Configure o banco de dados (primeira vez)
docker-compose -f docker-compose.dev.yml exec app npm run db:push

# 5. Acesse a aplicação
# http://localhost:5000
```

### Modo Produção

```bash
# 1. Configure variáveis de ambiente em .env
# IMPORTANTE: Use valores seguros em produção!

# 2. Build e inicie os serviços
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Configure o banco de dados (primeira vez)
docker-compose -f docker-compose.prod.yml exec app npm run db:push

# 4. Acesse a aplicação
# http://localhost:5000
```

## 📁 Arquivos Docker

### Estrutura

```
ImobPaga/
├── Dockerfile                 # Build da aplicação
├── docker-compose.yml         # Configuração padrão (produção)
├── docker-compose.dev.yml     # Configuração desenvolvimento
├── docker-compose.prod.yml    # Configuração produção avançada
├── .dockerignore             # Arquivos ignorados no build
└── DOCKER.md                 # Este arquivo
```

## 🔧 Comandos Úteis

### Desenvolvimento

```bash
# Iniciar serviços
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f app

# Parar serviços
docker-compose -f docker-compose.dev.yml down

# Parar e remover volumes (CUIDADO: apaga banco de dados!)
docker-compose -f docker-compose.dev.yml down -v

# Acessar container da aplicação
docker-compose -f docker-compose.dev.yml exec app sh

# Executar comandos no container
docker-compose -f docker-compose.dev.yml exec app npm run db:push
docker-compose -f docker-compose.dev.yml exec app npm install
```

### Produção

```bash
# Build e iniciar
docker-compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# Parar
docker-compose -f docker-compose.prod.yml down

# Reiniciar apenas a aplicação (sem rebuild)
docker-compose -f docker-compose.prod.yml restart app

# Rebuild completo
docker-compose -f docker-compose.prod.yml up -d --build --force-recreate
```

## 🗄️ Banco de Dados

### Configuração Padrão

- **Usuário**: `imobpaga`
- **Senha**: `imobpaga_dev_password` (dev) / `imobpaga_password_change_in_production` (prod)
- **Database**: `imobpaga`
- **Porta**: `5432`

### Acessar o PostgreSQL

#### Via Docker Exec

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga

# Produção
docker-compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga
```

#### Via pgAdmin (Ferramenta Gráfica)

Se você iniciou com o profile `tools`:

```bash
docker-compose --profile tools up -d pgadmin
```

Acesse: http://localhost:5050

**Credenciais padrão**:
- Email: `admin@imobpaga.com`
- Senha: `admin_change_in_production`

**Adicionar servidor no pgAdmin**:
- Host: `postgres` (nome do serviço no docker-compose)
- Port: `5432`
- Username: `imobpaga`
- Password: `imobpaga_dev_password` (ou a senha configurada)

#### Via Connection String Externa

Se quiser conectar de fora do Docker:

```bash
# Desenvolvimento
psql postgresql://imobpaga:imobpaga_dev_password@localhost:5432/imobpaga

# Produção (ajuste a senha)
psql postgresql://imobpaga:SUA_SENHA@localhost:5432/imobpaga
```

### Backup do Banco de Dados

```bash
# Backup
docker-compose -f docker-compose.prod.yml exec postgres pg_dump -U imobpaga imobpaga > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U imobpaga imobpaga < backup_20241201_120000.sql
```

## 🔐 Variáveis de Ambiente

### Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com:

```env
# Banco de dados (será sobrescrito pelo docker-compose, mas útil para referência)
DATABASE_URL=postgresql://imobpaga:imobpaga_dev_password@postgres:5432/imobpaga

# Secret para sessões
SESSION_SECRET=seu-secret-super-seguro-aqui

# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# CORS (produção)
ALLOWED_ORIGINS=https://seudominio.com

# PostgreSQL (apenas se quiser sobrescrever padrões do docker-compose)
POSTGRES_USER=imobpaga
POSTGRES_PASSWORD=sua_senha_segura
POSTGRES_DB=imobpaga
```

### Produção

Para produção, use variáveis de ambiente do sistema ou arquivo `.env` com valores seguros:

```env
SESSION_SECRET=gerar-um-secret-super-seguro-aqui
POSTGRES_PASSWORD=senha-super-forte-em-producao
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com
```

## 📦 Volumes e Persistência

### Volumes Criados

- `postgres_data` - Dados do PostgreSQL (persistente)
- `pgadmin_data` - Dados do pgAdmin (persistente)
- `./uploads` - Arquivos enviados pelos usuários (montado como volume)

### Backup de Volumes

```bash
# Backup do volume PostgreSQL
docker run --rm -v imobpaga_postgres_data:/data -v $(pwd)/backups:/backup alpine tar czf /backup/postgres_backup_$(date +%Y%m%d).tar.gz /data

# Restaurar volume
docker run --rm -v imobpaga_postgres_data:/data -v $(pwd)/backups:/backup alpine tar xzf /backup/postgres_backup_20241201.tar.gz -C /
```

## 🛠️ Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose -f docker-compose.dev.yml logs app

# Verificar se o banco está pronto
docker-compose -f docker-compose.dev.yml ps postgres

# Recriar containers
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up -d
```

### Erro de conexão com banco

```bash
# Verificar se o PostgreSQL está rodando
docker-compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# Verificar logs do PostgreSQL
docker-compose -f docker-compose.dev.yml logs postgres
```

### Rebuild completo

```bash
# Parar tudo
docker-compose -f docker-compose.dev.yml down -v

# Remover imagens
docker rmi imobpaga-app imobpaga-app-dev

# Rebuild
docker-compose -f docker-compose.dev.yml build --no-cache
docker-compose -f docker-compose.dev.yml up -d
```

### Limpar tudo

```bash
# Parar e remover containers, volumes e redes
docker-compose -f docker-compose.dev.yml down -v --remove-orphans

# Remover imagens não utilizadas
docker image prune -a
```

## 🌐 Rede

Os containers estão na mesma rede Docker (`imobpaga-network` ou `imobpaga-dev-network`), então:

- A aplicação acessa o PostgreSQL via hostname `postgres` (não `localhost`)
- Connection string dentro do Docker: `postgresql://imobpaga:senha@postgres:5432/imobpaga`
- Connection string de fora: `postgresql://imobpaga:senha@localhost:5432/imobpaga`

## 🚀 Deploy em Produção

### Passos Recomendados

1. **Configure variáveis de ambiente seguras**
2. **Use secrets do Docker** (não commit `.env` com senhas!)
3. **Configure SSL/HTTPS** (use nginx ou similar)
4. **Configure backups automáticos**
5. **Use docker-compose.prod.yml**

### Exemplo de Deploy

```bash
# 1. Clone o repositório no servidor
git clone <repo-url>
cd ImobPaga

# 2. Configure .env com valores de produção
nano .env

# 3. Inicie serviços
docker-compose -f docker-compose.prod.yml up -d --build

# 4. Configure banco
docker-compose -f docker-compose.prod.yml exec app npm run db:push

# 5. Verifique logs
docker-compose -f docker-compose.prod.yml logs -f
```

## 📝 Notas Importantes

1. **Senhas**: Mude todas as senhas padrão em produção!
2. **Volumes**: Os uploads ficam em `./uploads` (montado como volume)
3. **Banco de Dados**: Dados persistem no volume `postgres_data`
4. **Hot Reload**: Funciona apenas em modo desenvolvimento (`docker-compose.dev.yml`)
5. **Build**: Modo produção faz build da aplicação (mais lento, mas otimizado)

---

**Agora você pode desenvolver e deployar facilmente usando Docker! 🎉**

