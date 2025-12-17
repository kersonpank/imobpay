# 🚀 Resumo Rápido - Deploy Easypanel

## Checklist Rápido

### 1. Preparação
- [ ] Repositório Git configurado
- [ ] Dockerfile presente na raiz
- [ ] `.dockerignore` configurado

### 2. No Easypanel - Criar Projeto
- [ ] Criar novo projeto: `imobpaga`
- [ ] Adicionar serviço: **App** (Dockerfile)
- [ ] Adicionar serviço: **PostgreSQL**

### 3. Configurar App
- [ ] **Source**: Repositório Git
- [ ] **Port**: `5000`
- [ ] **Variáveis de Ambiente**:
  - `NODE_ENV=production`
  - `PORT=5000`
  - `DATABASE_URL=postgresql://...` (do serviço PostgreSQL)
  - `SESSION_SECRET=[gerar com openssl rand -base64 32]`
  - `ALLOWED_ORIGINS=https://seu-dominio.com`
- [ ] **Volume**: `/app/uploads` (5GB)

### 4. Configurar PostgreSQL
- [ ] Database: `imobpaga`
- [ ] Username: `imobpaga`
- [ ] Password: [senha forte]
- [ ] Copiar `DATABASE_URL` e colar no App

### 5. Deploy
- [ ] Fazer deploy inicial
- [ ] Executar migrações: `npm run db:push` (via terminal)
- [ ] Configurar domínio e SSL
- [ ] Atualizar `ALLOWED_ORIGINS` com o domínio

### 6. Verificação
- [ ] Aplicação acessível
- [ ] Banco conectado
- [ ] Login funcionando
- [ ] Uploads funcionando

---

## Comandos Úteis

### Gerar SESSION_SECRET
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Executar Migrações (via Terminal do Easypanel)
```bash
npm run db:push
```

---

## Variáveis de Ambiente Essenciais

```
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://usuario:senha@postgres:5432/imobpaga
SESSION_SECRET=[SECRET_GERADO]
ALLOWED_ORIGINS=https://seu-dominio.com
```

---

## Links Úteis

- 📖 [Guia Completo](./GUIA-DEPLOY-EASYPANEL.md)
- 🌐 [Easypanel Docs](https://easypanel.io/docs)

---

**💡 Dica**: Consulte o [GUIA-DEPLOY-EASYPANEL.md](./GUIA-DEPLOY-EASYPANEL.md) para instruções detalhadas passo a passo.


