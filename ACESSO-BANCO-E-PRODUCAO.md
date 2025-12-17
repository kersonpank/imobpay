# ✅ Guia Completo: Acessar Banco, Testar e Produção

## 🎉 Status Atual

✅ **Banco de dados funcionando!**  
✅ **Containers rodando!**  
✅ **Tabelas criadas!**  
✅ **Pronto para testar!**

---

## 1️⃣ Como Acessar o Banco de Dados

### Método 1: psql direto (Mais Rápido) ⚡

```powershell
# No PowerShell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga
```

**Depois de conectar, você pode:**
```sql
-- Listar tabelas
\dt

-- Ver estrutura de uma tabela
\d users

-- Ver dados
SELECT * FROM users;

-- Contar registros
SELECT COUNT(*) FROM users;

-- Sair
\q
```

### Método 2: pgAdmin (Interface Gráfica) 🖥️

**1. Iniciar pgAdmin:**
```powershell
docker compose --profile tools -f docker-compose.dev.yml up -d pgadmin
```

**2. Acessar:** http://localhost:5050

**3. Login:**
- Email: `admin@imobpaga.com`
- Senha: `admin_change_in_production`

**4. Adicionar Servidor:**
- Host: `postgres` (nome do serviço)
- Port: `5432`
- Database: `imobpaga`
- Username: `imobpaga`
- Password: `imobpaga_dev_password`

### Método 3: Ferramenta Externa (DBeaver, TablePlus) 🔧

**Connection String:**
```
Host: localhost
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

**URL:**
```
postgresql://imobpaga:imobpaga_dev_password@localhost:5432/imobpaga
```

---

## 2️⃣ Como Verificar se Está Funcionando

### ✅ Teste Automático (Script)

```powershell
# Execute o script de teste
.\scripts\test-db.ps1
```

**O que o script verifica:**
- ✅ Status dos containers
- ✅ Conexão com PostgreSQL
- ✅ Tabelas criadas
- ✅ Quantidade de registros
- ✅ Últimos usuários cadastrados

### ✅ Teste Manual

```powershell
# 1. Ver status dos containers
docker compose -f docker-compose.dev.yml ps

# 2. Testar conexão do banco
docker compose -f docker-compose.dev.yml exec postgres pg_isready -U imobpaga

# Deve mostrar: accepting connections

# 3. Ver tabelas criadas
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "\dt"

# Deve mostrar: 8 tabelas (users, properties, contracts, etc.)

# 4. Ver logs do banco
docker compose -f docker-compose.dev.yml logs postgres --tail 20
```

---

## 3️⃣ Como Testar a Aplicação

### 🌐 Acessar no Navegador

**URL:** http://localhost:5000

**O que você deve ver:**
- ✅ Página inicial do ImobPaga
- ✅ Botões "Entrar" e "Criar Conta"

### 📝 Teste Completo do Fluxo

#### Passo 1: Criar Conta

1. Acesse: http://localhost:5000
2. Clique em **"Criar Conta"**
3. Preencha:
   - Email: `teste@exemplo.com`
   - Senha: `Senha123!` (mínimo 8 caracteres, 1 maiúscula, 1 número)
   - Nome (opcional)
4. Clique em **"Criar Conta"**

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, created_at FROM users ORDER BY created_at DESC LIMIT 1;"
```

#### Passo 2: Completar Onboarding

1. Você será redirecionado para escolher perfil
2. Escolha **"Locador"** ou **"Locatário"**
3. Preencha:
   - CPF: `123.456.789-00`
   - Telefone: `(11) 99999-9999`
4. Clique em **"Continuar"**

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT email, role, cpf, phone FROM users WHERE email = 'teste@exemplo.com';"
```

#### Passo 3: Testar Dashboard

- **Locador** → Dashboard em `/landlord`
- **Locatário** → Dashboard em `/tenant`

**Verificar logs:**
```powershell
docker compose -f docker-compose.dev.yml logs app --tail 20
```

#### Passo 4: Testar Upload de Arquivos

1. Acesse uma página com upload
2. Use o componente `FileUpload` para enviar um arquivo
3. Verifique se aparece em `uploads/`

**Verificar arquivos:**
```powershell
Get-ChildItem uploads\documents
Get-ChildItem uploads\properties
```

**Verificar no banco:**
```powershell
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga -c "SELECT name, type, path FROM documents ORDER BY uploaded_at DESC LIMIT 5;"
```

---

## 4️⃣ Como Colocar em Produção (VPS)

### 🚀 Passo a Passo Completo

#### Pré-requisitos

- ✅ VPS Ubuntu 20.04+ com acesso SSH
- ✅ Docker e Docker Compose instalados
- ✅ Domínio configurado (opcional, mas recomendado)

### Fase 1: Preparar a VPS

#### 1.1 Conectar na VPS

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

# Logout e login novamente
exit
# Reconectar depois

# Verificar instalação
docker --version
docker compose version
```

#### 1.3 Configurar Firewall

```bash
# Instalar UFW
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

#### 1.4 Instalar Nginx

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### Fase 2: Transferir Código

#### Opção 1: Via Git (Recomendado)

```bash
# Na VPS
cd /var/www

# Clonar repositório
sudo git clone https://github.com/seu-usuario/imobpaga.git
# OU repositório privado via SSH

cd imobpaga

# Dar permissões
sudo chown -R $USER:$USER /var/www/imobpaga
```

#### Opção 2: Via SCP (Do Windows)

```powershell
# No PowerShell do Windows
scp -r "D:\Kerson Company Tech\ImobPaga\ImobPaga" usuario@ip-da-vps:/var/www/
```

### Fase 3: Configurar Variáveis de Ambiente

```bash
# Na VPS
cd /var/www/imobpaga

# Copiar arquivo de exemplo
cp env.example.txt .env

# Editar .env
nano .env
```

**Configurar valores de PRODUÇÃO:**

```env
NODE_ENV=production
PORT=5000

# Banco de dados (USE SENHA FORTE!)
POSTGRES_USER=imobpaga
POSTGRES_PASSWORD=GERAR_SENHA_FORTE_AQUI
POSTGRES_DB=imobpaga
DATABASE_URL=postgresql://imobpaga:GERAR_SENHA_FORTE_AQUI@postgres:5432/imobpaga

# SESSION_SECRET (GERE UM NOVO SECRET SEGURO!)
SESSION_SECRET=GERE_NOVO_SECRET_AQUI

# Domínio (se tiver)
ALLOWED_ORIGINS=https://seudominio.com,https://www.seudominio.com

# OpenAI (opcional)
OPENAI_API_KEY=sk-...

# Debug (desabilitar em produção)
DEBUG_AUTH=false
```

**Gerar senhas seguras:**
```bash
# Gerar SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Gerar senha PostgreSQL
openssl rand -base64 32
```

### Fase 4: Build e Iniciar

```bash
# Na VPS
cd /var/www/imobpaga

# Build e iniciar containers
docker compose -f docker-compose.prod.yml up -d --build

# Aguardar alguns segundos para build
sleep 15

# Verificar status
docker compose -f docker-compose.prod.yml ps

# Configurar banco de dados (primeira vez)
docker compose -f docker-compose.prod.yml exec app npm run db:push

# Ver logs para confirmar que iniciou
docker compose -f docker-compose.prod.yml logs app --tail 50
```

**Verificar se está funcionando:**
```bash
# Testar se está respondendo
curl http://localhost:5000

# Verificar banco
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U imobpaga
```

### Fase 5: Configurar Nginx

#### 5.1 Criar Configuração

```bash
sudo nano /etc/nginx/sites-available/imobpaga
```

**Conteúdo:**
```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

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

# Remover configuração padrão
sudo rm /etc/nginx/sites-enabled/default

# Testar configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx
```

### Fase 6: Configurar SSL (HTTPS)

#### 6.1 Instalar Certbot

```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 6.2 Obter Certificado

```bash
# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Siga as instruções:
# - Email: seu-email@exemplo.com
# - Aceite termos
# - Escolha: 2 (Redirect HTTP to HTTPS)
```

**Pronto!** Certificado configurado e renovação automática ativa.

### Fase 7: Verificar Tudo

#### 7.1 Testes Finais

```bash
# Verificar containers
docker compose -f docker-compose.prod.yml ps

# Verificar banco
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U imobpaga

# Verificar logs
docker compose -f docker-compose.prod.yml logs app --tail 20

# Testar HTTP (deve redirecionar para HTTPS)
curl http://seudominio.com

# Testar HTTPS
curl https://seudominio.com
```

#### 7.2 Acessar no Navegador

- **HTTP:** http://seudominio.com (redireciona para HTTPS)
- **HTTPS:** https://seudominio.com ✅

---

## 🔄 Atualizações Futuras

### Deploy de Atualizações

```bash
# Na VPS
cd /var/www/imobpaga

# 1. Atualizar código
git pull origin main

# 2. Rebuild e reiniciar
docker compose -f docker-compose.prod.yml up -d --build

# 3. Atualizar banco (se houver migrations)
docker compose -f docker-compose.prod.yml exec app npm run db:push

# 4. Verificar logs
docker compose -f docker-compose.prod.yml logs -f app
```

---

## 📊 Informações do Banco (Produção)

### Credenciais

**Desenvolvimento:**
- Host: `localhost` (ou `postgres` dentro do Docker)
- Porta: `5432`
- Database: `imobpaga`
- Usuário: `imobpaga`
- Senha: `imobpaga_dev_password`

**Produção:**
- Host: `postgres` (dentro do Docker) ou `localhost` (do host)
- Porta: `5432` (não expor publicamente!)
- Database: `imobpaga`
- Usuário: `imobpaga`
- Senha: `SUA_SENHA_PRODUCAO` (definida no .env)

### Acessar Banco em Produção

```bash
# Via SSH na VPS
ssh usuario@ip-da-vps

# Acessar PostgreSQL
docker compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga

# Ou via ferramenta externa (usando SSH tunnel para segurança)
ssh -L 5432:localhost:5432 usuario@ip-da-vps
# Depois conectar via localhost:5432 na ferramenta
```

---

## 🔍 Troubleshooting

### Banco não conecta

```bash
# Verificar se está rodando
docker compose -f docker-compose.prod.yml ps postgres

# Ver logs
docker compose -f docker-compose.prod.yml logs postgres

# Testar conexão
docker compose -f docker-compose.prod.yml exec postgres pg_isready -U imobpaga
```

### App não inicia

```bash
# Ver logs detalhados
docker compose -f docker-compose.prod.yml logs app

# Verificar variáveis de ambiente
docker compose -f docker-compose.prod.yml exec app env | grep DATABASE_URL

# Reiniciar
docker compose -f docker-compose.prod.yml restart app
```

### Nginx não funciona

```bash
# Ver logs
sudo tail -f /var/log/nginx/error.log

# Testar configuração
sudo nginx -t

# Recarregar
sudo systemctl reload nginx
```

---

## 📚 Documentação Completa

- **Guia Detalhado:** `GUIA-ACESSO-BANCO-E-TESTES.md`
- **Comandos Rápidos:** `COMANDOS-RAPIDOS.md`
- **Resumo Rápido:** `RESUMO-RAPIDO.md`
- **Respostas Deploy:** `RESPOSTAS-DEPLOY-VPS.md`
- **Docker:** `DOCKER.md`

---

## ✅ Resumo dos Comandos Mais Usados

### Desenvolvimento

```powershell
# Acessar banco
docker compose -f docker-compose.dev.yml exec postgres psql -U imobpaga -d imobpaga

# Testar banco (script)
.\scripts\test-db.ps1

# Ver logs
docker compose -f docker-compose.dev.yml logs -f app
```

### Produção

```bash
# Acessar banco
docker compose -f docker-compose.prod.yml exec postgres psql -U imobpaga -d imobpaga

# Atualizar deploy
git pull && docker compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker compose -f docker-compose.prod.yml logs -f app
```

---

**Agora você tem tudo para acessar, testar e colocar em produção! 🚀**






