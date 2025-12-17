# 🖥️ Acessar Banco de Dados via Interface Gráfica (UI)

## 🎯 Opções Disponíveis

1. **pgAdmin** (via Docker) - ✅ Mais fácil, já configurado
2. **DBeaver** (Windows) - Ferramenta desktop
3. **TablePlus** (Windows) - Interface moderna
4. **Postico** (Windows via WSL) - Simples e direto

---

## 1️⃣ pgAdmin via Docker (Recomendado)

### ✅ Vantagens
- ✅ Já está configurado no Docker
- ✅ Não precisa instalar nada no Windows
- ✅ Acessa via navegador
- ✅ Interface completa e profissional

### 📋 Passo a Passo

#### Passo 1: Iniciar pgAdmin

```powershell
# No PowerShell (pasta do projeto)
docker compose -f docker-compose.dev.yml up -d pgadmin
```

**Ou se quiser iniciar tudo junto:**
```powershell
docker compose -f docker-compose.dev.yml up -d
```

#### Passo 2: Aguardar pgAdmin iniciar

Aguarde alguns segundos (10-20 segundos na primeira vez, pois precisa baixar a imagem).

**Verificar se está rodando:**
```powershell
docker compose -f docker-compose.dev.yml ps pgadmin
```

**Ver logs (se necessário):**
```powershell
docker compose -f docker-compose.dev.yml logs pgadmin
```

#### Passo 3: Acessar pgAdmin no Navegador

**URL:** http://localhost:5050

**Credenciais:**
- **Email:** `admin@imobpaga.com`
- **Senha:** `admin123`

#### Passo 4: Adicionar Servidor PostgreSQL

Após fazer login no pgAdmin:

1. **Clique com botão direito** em "Servers" (menu esquerdo)
2. Clique em **"Register"** → **"Server..."**

3. **Na aba "General":**
   - **Name:** `ImobPaga Local` (ou qualquer nome que você quiser)

4. **Na aba "Connection":**
   - **Host name/address:** `postgres` ⚠️ (nome do serviço no docker-compose, NÃO `localhost`)
   - **Port:** `5432`
   - **Maintenance database:** `imobpaga`
   - **Username:** `imobpaga`
   - **Password:** `imobpaga_dev_password`
   - ✅ **Marque:** "Save password" (para não precisar digitar sempre)

5. **Clique em "Save"**

**Pronto!** Agora você pode:
- ✅ Ver todas as tabelas
- ✅ Ver dados
- ✅ Executar queries SQL
- ✅ Editar dados
- ✅ Ver estruturas das tabelas
- ✅ Exportar dados

#### Passo 5: Explorar o Banco

**No menu esquerdo:**
- Expanda **"ImobPaga Local"** → **"Databases"** → **"imobpaga"** → **"Schemas"** → **"public"** → **"Tables"**

**Você verá todas as tabelas:**
- `users`
- `properties`
- `contracts`
- `payments`
- `documents`
- `sessions`
- `tenant_settings`
- `onboarding_data`

**Para ver dados de uma tabela:**
1. Clique com botão direito na tabela (ex: `users`)
2. Clique em **"View/Edit Data"** → **"First 100 Rows"**

**Para executar queries:**
1. Clique com botão direito em **"imobpaga"** → **"Query Tool"**
2. Digite sua query SQL:
   ```sql
   SELECT * FROM users;
   ```
3. Clique em **▶️ Executar** (F5)

---

## 2️⃣ DBeaver (Windows Desktop)

### ✅ Vantagens
- ✅ Interface muito completa
- ✅ Suporta vários bancos de dados
- ✅ Gratuito e open-source
- ✅ Excelente para desenvolvimento

### 📋 Passo a Passo

#### Passo 1: Baixar e Instalar

1. **Baixar:** https://dbeaver.io/download/
2. **Instalar** o DBeaver Community Edition (gratuito)
3. **Abrir** o DBeaver

#### Passo 2: Criar Nova Conexão

1. Clique em **"Nova Conexão"** (ou Database → New Database Connection)
2. Selecione **"PostgreSQL"**
3. Clique em **"Next"**

#### Passo 3: Configurar Conexão

**Na aba "Main":**
- **Host:** `localhost`
- **Port:** `5432`
- **Database:** `imobpaga`
- **Username:** `imobpaga`
- **Password:** `imobpaga_dev_password`
- ✅ **Marque:** "Save password"

#### Passo 4: Testar e Conectar

1. Clique em **"Test Connection"**
2. Se pedir para baixar driver, clique em **"Download"**
3. Após sucesso, clique em **"Finish"**

**Pronto!** Você pode explorar todas as tabelas e executar queries.

---

## 3️⃣ TablePlus (Windows Desktop)

### ✅ Vantagens
- ✅ Interface moderna e bonita
- ✅ Muito fácil de usar
- ✅ Excelente para visualizar dados
- ✅ Tem versão gratuita (limitada a 2 abas)

### 📋 Passo a Passo

#### Passo 1: Baixar e Instalar

1. **Baixar:** https://tableplus.com/
2. **Instalar** o TablePlus
3. **Abrir** o TablePlus

#### Passo 2: Criar Nova Conexão

1. Clique no botão **"+"** ou **"Create a new connection"**
2. Selecione **"PostgreSQL"**

#### Passo 3: Configurar Conexão

**Preencha:**
- **Name:** `ImobPaga Local`
- **Host:** `localhost`
- **Port:** `5432`
- **User:** `imobpaga`
- **Password:** `imobpaga_dev_password`
- **Database:** `imobpaga`

#### Passo 4: Conectar

1. Clique em **"Test"** para verificar
2. Clique em **"Connect"**

**Pronto!** Você pode explorar todas as tabelas de forma visual.

---

## 4️⃣ Azure Data Studio (Windows Desktop)

### ✅ Vantagens
- ✅ Gratuito e open-source
- ✅ Muito leve
- ✅ Boa para queries SQL
- ✅ Extensões disponíveis

### 📋 Passo a Passo

#### Passo 1: Baixar e Instalar

1. **Baixar:** https://aka.ms/azuredatastudio
2. **Instalar** o Azure Data Studio
3. **Abrir** o Azure Data Studio

#### Passo 2: Instalar Extensão PostgreSQL

1. Clique no ícone de **Extensões** (menu lateral)
2. Procure por **"PostgreSQL"**
3. Instale a extensão **"PostgreSQL"**

#### Passo 3: Criar Nova Conexão

1. Clique em **"New Connection"**
2. Selecione **"PostgreSQL"**

#### Passo 4: Configurar Conexão

- **Server name:** `localhost`
- **Port:** `5432`
- **Database:** `imobpaga`
- **Username:** `imobpaga`
- **Password:** `imobpaga_dev_password`

#### Passo 5: Conectar

1. Clique em **"Connect"**

**Pronto!** Você pode executar queries e ver dados.

---

## 🔧 Verificar se PostgreSQL está Acessível

### Testar Conexão

**No PowerShell:**
```powershell
# Verificar se a porta 5432 está aberta
Test-NetConnection -ComputerName localhost -Port 5432

# Deve mostrar: TcpTestSucceeded : True
```

**Se não funcionar, verificar se o container está rodando:**
```powershell
docker compose -f docker-compose.dev.yml ps postgres
```

---

## 📊 Informações de Conexão (Resumo)

### Desenvolvimento (Docker)

**Para ferramentas externas (DBeaver, TablePlus, etc.):**
```
Host: localhost
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

**Para pgAdmin (dentro do Docker):**
```
Host: postgres
Port: 5432
Database: imobpaga
Username: imobpaga
Password: imobpaga_dev_password
```

### Connection String (URL)
```
postgresql://imobpaga:imobpaga_dev_password@localhost:5432/imobpaga
```

---

## 🐛 Troubleshooting

### pgAdmin não abre

**Problema:** http://localhost:5050 não carrega

**Solução:**
```powershell
# Verificar se está rodando
docker compose -f docker-compose.dev.yml ps pgadmin

# Ver logs
docker compose -f docker-compose.dev.yml logs pgadmin

# Reiniciar pgAdmin
docker compose -f docker-compose.dev.yml restart pgadmin

# Se não estiver rodando, iniciar
docker compose -f docker-compose.dev.yml up -d pgadmin
```

### Erro ao conectar no pgAdmin

**Problema:** Não consegue conectar ao servidor PostgreSQL no pgAdmin

**Solução:**
- ✅ Verifique se o host é `postgres` (não `localhost`) no pgAdmin
- ✅ Verifique se a senha está correta: `imobpaga_dev_password`
- ✅ Verifique se o PostgreSQL está rodando:
  ```powershell
  docker compose -f docker-compose.dev.yml ps postgres
  ```

### Erro ao conectar em ferramentas externas

**Problema:** DBeaver/TablePlus não conecta

**Solução:**
- ✅ Verifique se a porta 5432 está exposta (está no docker-compose.dev.yml)
- ✅ Verifique se o container está rodando
- ✅ Tente com host `127.0.0.1` ao invés de `localhost`
- ✅ Verifique firewall do Windows

### Porta 5432 já em uso

**Problema:** Porta 5432 já está ocupada

**Solução:**

**Opção 1:** Parar outro PostgreSQL
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :5432
```

**Opção 2:** Mudar porta no docker-compose.dev.yml
```yaml
ports:
  - "5433:5432"  # Usar 5433 externamente
```

Depois use `localhost:5433` nas ferramentas externas.

---

## ✅ Recomendação

**Para começar rapidamente:** Use **pgAdmin via Docker** (Opção 1)

**Para uso diário:** Use **DBeaver** ou **TablePlus** (Opções 2 e 3)

---

## 🚀 Início Rápido

```powershell
# 1. Iniciar pgAdmin
docker compose -f docker-compose.dev.yml up -d pgadmin

# 2. Aguardar 10-20 segundos

# 3. Acessar no navegador
# http://localhost:5050

# 4. Login:
# Email: admin@imobpaga.com
# Senha: admin123

# 5. Adicionar servidor:
# Host: postgres
# Port: 5432
# Database: imobpaga
# Username: imobpaga
# Password: imobpaga_dev_password
```

---

**Agora você pode acessar o banco via interface gráfica! 🎉**





