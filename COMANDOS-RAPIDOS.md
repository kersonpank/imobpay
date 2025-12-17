# ⚡ Comandos Rápidos - ImobPaga

## 🗄️ Acessar Banco de Dados

### Docker (Desenvolvimento)
```powershell
# Acessar psql direto
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga

# Listar tabelas
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"

# Ver usuários
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role FROM users;"

# Contar registros
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT 'users' as tabela, COUNT(*) FROM users;"
```

### Produção (VPS)
```bash
# Acessar psql
docker compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga
```

---

## ✅ Verificar Status

### Containers
```powershell
# Ver status de todos
docker compose -f docker-compose.dev.yml ps

# Ver apenas banco
docker compose -f docker-compose.dev.yml ps postgres

# Ver apenas app
docker compose -f docker-compose.dev.yml ps app
```

### Banco de Dados
```powershell
# Testar conexão
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# Ver logs do banco
docker compose -f docker-compose.dev.yml logs postgres --tail 50
```

### Aplicação
```powershell
# Ver logs da app
docker compose -f docker-compose.dev.yml logs app --tail 50

# Ver logs em tempo real
docker compose -f docker-compose.dev.yml logs -f app
```

---

## 🧪 Testar Aplicação

### Acessar no Navegador
```
http://localhost:5000
```

### Testar Endpoints
```powershell
# Testar se está rodando
Invoke-WebRequest -Uri http://localhost:5000 -Method GET

# Ver resposta
curl http://localhost:5000
```

---

## 🚀 Produção (VPS)

### Primeira Deploy
```bash
# 1. Conectar na VPS
ssh usuario@ip-da-vps

# 2. Ir para o diretório
cd /var/www/imobpaga

# 3. Configurar .env
nano .env

# 4. Build e iniciar
docker compose -f docker-compose.prod.yml up -d --build

# 5. Configurar banco (primeira vez)
docker compose -f docker-compose.prod.yml exec app npm run db:push
```

### Atualizar Deploy
```bash
cd /var/www/imobpaga
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build
docker compose -f docker-compose.prod.yml exec app npm run db:push
```

### Reiniciar
```bash
docker compose -f docker-compose.prod.yml restart app
docker compose -f docker-compose.prod.yml restart postgres
```

### Parar Tudo
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 🔍 Verificar Funcionamento

### Teste Rápido Completo
```powershell
# 1. Verificar containers
docker compose -f docker-compose.dev.yml ps

# 2. Verificar banco
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# 3. Verificar tabelas
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"

# 4. Testar site
Invoke-WebRequest -Uri http://localhost:5000 -Method GET

# 5. Ver logs
docker compose -f docker-compose.dev.yml logs app --tail 20
```

---

**Guia Completo:** Veja `GUIA-ACESSO-BANCO-E-TESTES.md` para detalhes!






