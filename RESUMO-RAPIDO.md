# ⚡ Resumo Rápido - ImobPaga

## 🗄️ Acessar Banco de Dados

### Método Mais Rápido (psql)
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga
```

### Método Visual (pgAdmin)
```powershell
# 1. Iniciar pgAdmin
docker compose --profile tools -f docker-compose.dev.yml up -d pgadmin

# 2. Acessar: http://localhost:5050
# 3. Login: admin@imobpaga.com / admin_change_in_production
# 4. Adicionar servidor:
#    - Host: postgres
#    - Port: 5432
#    - User: imobpaga
#    - Password: imobpaga_dev_password
```

---

## ✅ Verificar se Está Funcionando

### Teste Rápido Completo
```powershell
# Execute o script de teste
.\scripts\test-db.ps1
```

### Ou manualmente:
```powershell
# 1. Ver status
docker compose -f docker-compose.dev.yml ps

# 2. Testar banco
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# 3. Ver tabelas
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"

# 4. Ver dados
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT COUNT(*) FROM users;"
```

---

## 🧪 Testar Aplicação

### 1. Acessar no Navegador
```
http://localhost:5000
```

### 2. Testar Fluxo Completo

**Passo 1: Criar Conta**
- Acesse: http://localhost:5000
- Clique em "Criar Conta"
- Preencha email e senha
- Crie a conta

**Passo 2: Completar Onboarding**
- Escolha perfil (Locador ou Locatário)
- Preencha CPF e telefone
- Continue

**Passo 3: Verificar no Banco**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, cpf FROM users;"
```

**Passo 4: Testar Dashboard**
- Você será redirecionado para o dashboard
- Verifique se as informações aparecem

---

## 🚀 Colocar em Produção (VPS)

### Passo a Passo Resumido

**1. Na VPS (via SSH):**
```bash
# Conectar
ssh usuario@ip-da-vps

# Ir para diretório
cd /var/www
git clone https://github.com/seu-usuario/imobpaga.git
cd imobpaga

# Configurar .env
nano .env
# Configure DATABASE_URL, SESSION_SECRET, etc.

# Build e iniciar
docker compose -f docker-compose.prod.yml up -d --build

# Configurar banco (primeira vez)
docker compose -f docker-compose.prod.yml exec app npm run db:push
```

**2. Configurar Nginx:**
```bash
# Criar config
sudo nano /etc/nginx/sites-available/imobpaga
# (veja template em GUIA-ACESSO-BANCO-E-TESTES.md)

# Ativar
sudo ln -s /etc/nginx/sites-available/imobpaga /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**3. Configurar SSL (HTTPS):**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d seudominio.com -d www.seudominio.com
```

**Pronto!** Acesse: https://seudominio.com

---

## 📊 Informações do Banco

### Credenciais (Desenvolvimento)
- **Host:** `localhost` (ou `postgres` dentro do Docker)
- **Porta:** `5432`
- **Database:** `imobpaga`
- **Usuário:** `imobpaga`
- **Senha:** `imobpaga_dev_password`

### Connection String
```
postgresql://imobpaga:imobpaga_dev_password@localhost:5432/imobpaga
```

### Tabelas Principais
- `users` - Usuários (locadores, locatários)
- `properties` - Imóveis cadastrados
- `contracts` - Contratos de aluguel
- `payments` - Pagamentos/cobranças
- `documents` - Documentos enviados
- `sessions` - Sessões de usuários
- `tenant_settings` - Configurações do Mercado Pago

---

## 🔍 Comandos Úteis

### Ver Logs
```powershell
# Logs da aplicação
docker compose -f docker-compose.dev.yml logs -f app

# Logs do banco
docker compose -f docker-compose.dev.yml logs -f postgres
```

### Reiniciar
```powershell
# Reiniciar app
docker compose -f docker-compose.dev.yml restart app

# Reiniciar banco
docker compose -f docker-compose.dev.yml restart postgres

# Reiniciar tudo
docker compose -f docker-compose.dev.yml restart
```

### Parar Tudo
```powershell
docker compose -f docker-compose.dev.yml down
```

### Iniciar Novamente
```powershell
docker compose -f docker-compose.dev.yml up -d
```

---

## 📚 Documentação Completa

- **Guia Completo:** `GUIA-ACESSO-BANCO-E-TESTES.md`
- **Comandos Rápidos:** `COMANDOS-RAPIDOS.md`
- **Respostas Deploy:** `RESPOSTAS-DEPLOY-VPS.md`
- **Documentação Docker:** `DOCKER.md`

---

**Agora você tem tudo para acessar, testar e colocar em produção! 🚀**






