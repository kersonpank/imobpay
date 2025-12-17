# 🗄️ Guia Completo: Acessar Banco, Testar e Produção

## 📋 Índice

1. [Acessar o Banco de Dados](#1-acessar-o-banco-de-dados)
2. [Verificar se o Banco está Funcionando](#2-verificar-se-o-banco-está-funcionando)
3. [Testar a Aplicação](#3-testar-a-aplicação)
4. [Colocar em Produção](#4-colocar-em-produção)

---

## 1. Acessar o Banco de Dados

### 🐳 No Docker (Desenvolvimento Atual)

#### Opção 1: Via psql direto (Mais Rápido)

```powershell
# Acessar o PostgreSQL dentro do container
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga
```

**Depois de conectar, você pode executar comandos SQL:**
```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Ver dados de uma tabela
SELECT * FROM users LIMIT 10;

-- Contar registros
SELECT COUNT(*) FROM users;

-- Sair
\q
```

#### Opção 2: Via pgAdmin (Interface Gráfica)

**Iniciar pgAdmin:**
```powershell
docker compose --profile tools -f docker-compose.dev.yml up -d pgadmin
```

**Acessar:** http://localhost:5050

**Credenciais padrão:**
- **Email:** `admin@imobpaga.com`
- **Senha:** `admin_change_in_production`

**Adicionar servidor no pgAdmin:**
1. Clique com botão direito em "Servers" → "Register" → "Server"
2. **General Tab:**
   - Name: `ImobPaga Local`
3. **Connection Tab:**
   - Host name/address: `postgres` (nome do serviço no docker-compose)
   - Port: `5432`
   - Maintenance database: `imobpaga`
   - Username: `imobpaga`
   - Password: `imobpaga_dev_password`
4. Clique em "Save"

#### Opção 3: Via Ferramenta Externa (DBeaver, TablePlus, etc.)

**Connection String:**
```
Host: localhost
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

**URL de conexão:**
```
postgresql://imobpaga:imobpaga_dev_password@localhost:5432/imobpaga
```

### 🖥️ Em Produção na VPS

#### Via SSH + Docker Exec

```bash
# Conectar na VPS
ssh usuario@ip-da-vps

# Acessar o PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga
```

#### Via Ferramenta Externa

**Connection String:**
```
Host: SEU-IP-VPS (ou domínio)
Port: 5432 (ou porta que você configurou)
Database: imobpaga
Username: imobpaga
Password: SUA_SENHA_PRODUCAO
```

**⚠️ IMPORTANTE:** Em produção, configure firewall para não expor a porta 5432 publicamente!

---

## 2. Verificar se o Banco está Funcionando

### ✅ Testes Rápidos

#### 1. Verificar se o Container está Rodando

```powershell
# Ver status
docker compose -f docker-compose.dev.yml ps postgres

# Deve mostrar: STATUS "Up ... (healthy)"
```

#### 2. Testar Conexão

```powershell
# Testar se o PostgreSQL está respondendo
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# Deve retornar: postgres:5432 - accepting connections
```

#### 3. Verificar Tabelas

```powershell
# Listar todas as tabelas
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"
```

**Tabelas esperadas:**
- `users`
- `properties`
- `contracts`
- `payments`
- `documents`
- `tenant_settings`
- `onboarding_data`
- `sessions`

#### 4. Verificar Dados (se tiver)

```powershell
# Contar usuários
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT COUNT(*) FROM users;"

# Ver usuários (últimos 5)
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;"
```

#### 5. Verificar Logs do PostgreSQL

```powershell
# Ver logs recentes
docker compose -f docker-compose.dev.yml logs postgres --tail 50

# Ver logs em tempo real
docker compose -f docker-compose.dev.yml logs -f postgres
```

#### 6. Teste Completo (Script)

```powershell
# Criar script de teste rápido
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "
SELECT 
    'users' as tabela, COUNT(*) as registros FROM users
UNION ALL
SELECT 'properties', COUNT(*) FROM properties
UNION ALL
SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL
SELECT 'payments', COUNT(*) FROM payments
UNION ALL
SELECT 'documents', COUNT(*) FROM documents;
"
```

### 🔍 Verificar Configuração

#### Ver Variáveis de Ambiente

```powershell
# Ver variáveis do container
docker compose -f docker-compose.dev.yml exec postgres env | grep POSTGRES
```

#### Verificar Volume Persistente

```powershell
# Ver volumes Docker
docker volume ls | grep postgres

# Inspecionar volume
docker volume inspect imobpaga_postgres_dev_data
```

---

## 3. Testar a Aplicação

### 🧪 Testes Básicos

#### 1. Verificar se o Servidor está Rodando

```powershell
# Ver status do container
docker compose -f docker-compose.dev.yml ps app

# Deve mostrar: STATUS "Up ..."
```

#### 2. Acessar a Aplicação

**No navegador:** http://localhost:5000

**Deve mostrar:** Página inicial do ImobPaga

#### 3. Verificar Logs da Aplicação

```powershell
# Ver logs recentes
docker compose -f docker-compose.dev.yml logs app --tail 50

# Ver logs em tempo real
docker compose -f docker-compose.dev.yml logs -f app
```

#### 4. Testar Endpoints da API

**Via navegador ou PowerShell:**

```powershell
# Testar endpoint de health (criar se não existir)
curl http://localhost:5000/api/auth/user

# Deve retornar 401 (não autenticado) - isso é normal!
```

**Via PowerShell (Invoke-WebRequest):**

```powershell
# Testar landing page
Invoke-WebRequest -Uri http://localhost:5000 -Method GET

# Deve retornar HTML da página inicial
```

### 📝 Teste Completo do Fluxo

#### 1. Criar Conta

1. Acesse: http://localhost:5000
2. Clique em **"Criar Conta"**
3. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!`
   - Nome (opcional)
4. Clique em **"Criar Conta"**

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, created_at FROM users ORDER BY created_at DESC LIMIT 1;"
```

#### 2. Completar Onboarding

1. Você será redirecionado para escolher perfil
2. Escolha **"Locador"** ou **"Locatário"**
3. Preencha CPF e telefone
4. Clique em **"Continuar"**

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, cpf, phone FROM users WHERE email = 'teste@exemplo.com';"
```

#### 3. Testar Dashboard

- **Locador:** Deve ver dashboard em `/landlord`
- **Locatário:** Deve ver dashboard em `/tenant`

#### 4. Testar Upload de Arquivos

1. Acesse uma página com upload
2. Use o componente `FileUpload` para enviar arquivo
3. Verifique se o arquivo aparece em `uploads/`

**Verificar no sistema de arquivos:**
```powershell
# Ver arquivos enviados
Get-ChildItem uploads\documents
Get-ChildItem uploads\properties
```

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT name, type, path, uploaded_at FROM documents ORDER BY uploaded_at DESC LIMIT 5;"
```

#### 5. Testar Criação de Propriedade (Locador)

1. Acesse o dashboard do locador
2. Crie uma nova propriedade
3. Verifique no banco se foi salva

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT title, address, rent_value, status FROM properties ORDER BY created_at DESC LIMIT 5;"
```

### 🔍 Verificar Conexão App → Banco

#### Ver Logs de Conexão

```powershell
# Ver logs da aplicação (procure por conexões de banco)
docker compose -f docker-compose.dev.yml logs app | Select-String -Pattern "database\|postgres\|connection"
```

#### Testar Query via API

```powershell
# Fazer login primeiro (salvar cookie)
$response = Invoke-WebRequest -Uri http://localhost:5000/api/auth/login -Method POST -Body (@{email="teste@exemplo.com";password="Senha123!"} | ConvertTo-Json) -ContentType "application/json" -SessionVariable session

# Testar endpoint autenticado
$userResponse = Invoke-WebRequest -Uri http://localhost:5000/api/auth/user -WebSession $session
$userResponse.Content
```

---

## 4. Colocar em Produção

### 🚀 Passo a Passo Completo

#### Pré-requisitos na VPS

1. **Ubuntu 20.04 ou superior**
2. **Acesso SSH**
3. **Docker e Docker Compose instalados**

### Passo 1: Preparar a VPS

#### 1.1 Conectar via SSH

```bash
ssh usuario@ip-da-vps
```

#### 1.2 Instalar Docker (se não tiver)

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Logout e login novamente (ou executar: newgrp docker)

# Instalar Docker Compose (vem com Docker, mas verificar)
docker compose version
```

#### 1.3 Configurar Firewall

```bash
# Instalar UFW (se não tiver)
sudo apt install ufw -y

# Permitir SSH
sudo ufw allow 22/tcp

# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Ativar firewall
sudo ufw enable

# Ver status
sudo ufw status
```

#### 1.4 Instalar Nginx (no host)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Passo 2: Clonar/Transferir o Código

#### Opção 1: Via Git (Recomendado)

```bash
# Instalar Git (se não tiver)
sudo apt install git -y

# Clonar repositório
cd /var/www
sudo git clone https://github.com/seu-usuario/imobpaga.git
# OU seu repositório privado
sudo git clone git@github.com:seu-usuario/imobpaga.git

cd imobpaga

# Dar permissões
sudo chown -R $USER:$USER /var/www/imobpaga
```

#### Opção 2: Via SCP (Do Windows)

```powershell
# No PowerShell do Windows
scp -r "D:\Kerson Company Tech\ImobPaga\ImobPaga" usuario@ip-da-vps:/var/www/
```

### Passo 3: Configurar Variáveis de Ambiente

```bash
# Na VPS
cd /var/www/imobpaga

# Copiar arquivo de exemplo
cp env.example.txt .env

# Editar .env
nano .env
```

**Configurar no `.env`:**
```env
NODE_ENV=production
PORT=5000

# Banco de dados (usar senha forte!)
DATABASE_URL=postgresql://imobpaga:SUA_SENHA_FORTE_AQUI@postgres:5432/imobpaga
POSTGRES_PASSWORD=SUA_SENHA_FORTE_AQUI
POSTGRES_USER=imobpaga
POSTGRES_DB=imobpaga

# SESSION_SECRET (gerar novo seguro)
SESSION_SECRET=GERE_UM_NOVO_SECRET_AQUI

# Domínio (se tiver)
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# Debug (desabilitar em produção)
DEBUG_AUTH=false
```

**Gerar SESSION_SECRET seguro:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Passo 4: Build e Iniciar

```bash
# Build e iniciar containers
docker compose -f docker-compose.prod.yml up -d --build

# Aguardar alguns segundos
sleep 10

# Configurar banco de dados (primeira vez)
docker compose -f docker-compose.prod.yml exec app npm run db:push

# Verificar logs
docker compose -f docker-compose.prod.yml logs -f app
```

### Passo 5: Configurar Nginx

#### 5.1 Criar Configuração do Nginx

```bash
sudo nano /etc/nginx/sites-available/imobpaga
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Redirecionar para HTTPS (após configurar SSL)
    # return 301 https://$server_name$request_uri;

    # Ou servir HTTP primeiro (antes de configurar SSL)
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout para uploads grandes
        client_max_body_size 10M;
    }
}
```

#### 5.2 Ativar Site

```bash
# Criar link simbólico
sudo ln -s /etc/nginx/sites-available/imobpaga /etc/nginx/sites-enabled/

# Remover configuração padrão (se não precisar)
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### Passo 6: Configurar SSL (HTTPS)

#### 6.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 6.2 Obter Certificado

```bash
# Certificado automático com Nginx
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Siga as instruções
# Escolha: 2 (Redirect HTTP to HTTPS)
```

#### 6.3 Renovação Automática

```bash
# Testar renovação
sudo certbot renew --dry-run

# Certbot já configura renovação automática
```

### Passo 7: Configurar Backup Automático

```bash
# Criar script de backup
sudo nano /usr/local/bin/backup-imobpaga.sh
```

**Conteúdo:**
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/imobpaga"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup do banco
docker compose -f /var/www/imobpaga/docker-compose.prod.yml exec -T postgres pg_dump -U imobpaga imobpaga > $BACKUP_DIR/db_$DATE.sql

# Backup de uploads
tar czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/imobpaga/uploads

# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

**Tornar executável:**
```bash
sudo chmod +x /usr/local/bin/backup-imobpaga.sh
```

**Agendar backup diário (cron):**
```bash
sudo crontab -e

# Adicionar linha:
0 2 * * * /usr/local/bin/backup-imobpaga.sh
```

### Passo 8: Verificar Tudo

#### 8.1 Verificar Containers

```bash
docker compose -f docker-compose.prod.yml ps
```

#### 8.2 Verificar Logs

```bash
docker compose -f docker-compose.prod.yml logs -f app
```

#### 8.3 Testar Aplicação

- **HTTP:** http://seudominio.com
- **HTTPS:** https://seudominio.com

#### 8.4 Verificar Banco

```bash
docker compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"
```

---

## 🔄 Atualizações Futuras

### Deploy de Atualizações

```bash
# Na VPS
cd /var/www/imobpaga

# Atualizar código
git pull origin main

# Rebuild e reiniciar
docker compose -f docker-compose.prod.yml up -d --build

# Atualizar banco (se houver migrations)
docker compose -f docker-compose.prod.yml exec app npm run db:push

# Verificar logs
docker compose -f docker-compose.prod.yml logs -f app
```

---

## 📊 Monitoramento Básico

### Ver Status dos Containers

```bash
docker compose -f docker-compose.prod.yml ps
```

### Ver Uso de Recursos

```bash
docker stats
```

### Ver Espaço em Disco

```bash
df -h
docker system df
```

---

## 🆘 Troubleshooting

### App não inicia

```bash
# Ver logs detalhados
docker compose -f docker-compose.prod.yml logs app

# Verificar variáveis de ambiente
docker compose -f docker-compose.prod.yml exec app env
```

### Banco não conecta

```bash
# Verificar se PostgreSQL está rodando
docker compose -f docker-compose.prod.yml ps postgres

# Ver logs do PostgreSQL
docker compose -f docker-compose.prod.yml logs postgres

# Testar conexão
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U imobpaga
```

### Nginx não funciona

```bash
# Ver logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t

# Recarregar
sudo systemctl reload nginx
```

---

**Agora você tem tudo para acessar, testar e colocar em produção! 🚀**





